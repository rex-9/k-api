import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import axios from 'axios';

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_CONFIRMATION_SMTP_USERNAME,
    pass: process.env.EMAIL_CONFIRMATION_SMTP_PASSWORD,
  },
});

export const handler = async (event) => {
  dotenv.config();
  const method = event.httpMethod;
  const path = event.path;

  if (method === 'POST' && path === '/auth/login') {
    return await authenticateUser(event);
  } else if (method === 'DELETE' && path === '/auth/logout') {
    return await logoutUser(event);
  } else if (method === 'POST' && path === '/auth/login/otp') {
    return await sendOTP(event);
  } else if (method === 'POST' && path === '/auth/login/phone') {
    return await authenticateUserByPhone(event);
  } else if (method === 'POST' && path === '/auth/login/oauth') {
    return await loginOAuth(event);
  } else if (method === 'POST' && path === '/auth/refresh-token') {
    return await refreshToken(event);
  } else if (method === 'POST' && path === '/auth/forgot-password') {
    return await forgotPassword(event);
  } else if (method === 'POST' && path === '/auth/change-password') {
    return await changePassword(event);
  } else if (method === 'POST' && path === '/auth/email/confirmation') {
    return await confirmEmail(event);
  } else if (method === 'POST' && path === '/auth/email/confirmation/send') {
    return await sendEmailConfirmationToken(event);
  }
  //else if method=get and path starts with 'auth/sessions' then call getSessionById
  else if (method === 'GET' && path.startsWith('/auth/sessions')) {
    return await getSessionById(event);
  } else if (method === 'POST' && path === '/auth/sessions') {
    return await createSession(event);
  } else if (method === 'PUT' && path.startsWith('/auth/sessions/')) {
    return await updateSessionLastActivity(event);
  } else {
    return Responses._405({
      message: 'Method not allowed',
    });
  }
};

async function authenticateUser(event) {
  try {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    const password = requestBody.password;
    // console.log('email: ' + email + ', password: ' + password);
    const user = await prisma.users.findUnique({
      where: { user_email: email },
    });

    if (!user) {
      return Responses._401({
        message: 'Invalid email or password',
      });
    }

    // console.log('user found: ' + user);
    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    // console.log('isPasswordValid: ' + isPasswordValid);
    if (!isPasswordValid) {
      return Responses._401({
        message: 'Invalid email or password',
      });
    }

    if (!user.email_confirmed) {
      return Responses._401({
        message: 'Email not confirmed',
      });
    }

    const auth = await prisma.authentications.upsert({
      where: { user_id: user.user_id },
      create: {
        user_id: user.user_id,
        created_by: user.user_id,
      },
      update: {
        updated_by: user.user_id,
      },
    });

    return Responses._200({
      message: 'Authentication successful',
      data: auth,
    });
  } catch (error) {
    console.error(error);
    return Responses._500({
      message: 'An error occurred',
    });
  }
}

async function logoutUser(event) {
  // TODO: need to fix getSessionById function
  const sessionId = getSessionById(event);

  const session = await prisma.sessions.findUnique({
    where: { session_id: sessionId },
  });

  if (!session) {
    return Responses._404({ message: 'Session not found' });
  }

  await prisma.sessions.update({
    where: { session_id: sessionId },
    data: {
      status: 'LOGGED_OUT',
    },
  });

  return Responses._204({ message: 'Session logged out' });
}

async function sendOTP(event) {
  const { phoneNo } = JSON.parse(event.body);

  const otp = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const user = await prisma.users.findUnique({
    where: {
      user_phone: phoneNo,
    },
  });

  if (!user) {
    return Responses._401({
      message: 'Invalid phone number',
    });
  }

  // Save the OTP secret key to the database
  const authentication = await prisma.authentications.upsert({
    where: { user_id: user.user_id },
    create: {
      user_id: user.user_id,
      otp_secret_key: otp,
      otp_expiration: new Date(Date.now() + 300000),
      created_by: user.user_id,
    },
    update: {
      otp_secret_key: otp,
      otp_expiration: new Date(Date.now() + 300000),
      updated_by: user.user_id,
    },
  });

  // Send the OTP via MessageBird

  const config = {
    method: 'post',
    url: `${process.env.MESSAGEBIRD_WEBHOOK_BASE_URL}/${process.env.MESSAGEBIRD_OTP_FLOW_ID}/invoke`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      phoneNo: phoneNo,
      otp: otp,
    },
  };

  try {
    const response = await axios(config);

    return Responses._200({
      message: 'SMS sent successfully',
    });
  } catch (error) {
    return Responses._400({
      message: 'Error sending SMS: No data returned',
      error: error,
    });
  }
}

async function authenticateUserByPhone(event) {
  const requestBody = JSON.parse(event.body);
  const phoneNo = requestBody.phoneNo;
  const otp = requestBody.otp;

  const authentication = await prisma.authentications.findFirst({
    where: {
      user: {
        user_phone: phoneNo,
      },
      otp_secret_key: otp,
      otp_expiration: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!authentication) {
    return Responses._401({
      message: 'Invalid phone number or invalid OTP or expired OTP',
    });
  }

  // return user data without generating token
  const user = authentication.user;
  return Responses._200({
    message: 'Phone number verified successfully',
    user: {
      userId: user.user_id,
      firstName: user.user_first_name,
      lastName: user.user_last_name,
    },
  });
}

async function refreshToken(event) {
  // TODO: implement refresh token functionality
  return Responses._200({
    message: 'Token refreshed',
  });
}

async function forgotPassword(event) {
  try {
    const { email } = JSON.parse(event.body);

    const user = await prisma.users.findUnique({
      where: { user_email: email },
    });

    if (!user) {
      return Responses._404({
        message: 'User not found',
      });
    }

    // Generate reset token
    const resetToken = await generateResetToken(user.user_id);

    // Send reset email
    const resetUrl = `${process.env.APP_BASE_URL}/reset-password/${resetToken}`;

    await sendResetEmail(user.user_email, resetUrl);

    return Responses._204({ message: 'Password reset email sent' });
  } catch (error) {
    // console.log(error);
    return Responses._500({
      message: 'Internal server error',
    });
  }
}

async function sendResetEmail(email, resetUrl) {
  const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

  const mailOptions = {
    from: process.env.EMAIL_FROM, // TODO: EMAIL_FROM not in .env yet
    to: email,
    subject: 'Password Reset Request',
    text: message,
    html: message,
  };

  await transporter.sendMail(mailOptions);
}

async function changePassword(event) {
  try {
    const { resetToken, password } = JSON.parse(event.body);

    if (!resetToken) {
      return Responses._400({
        message: 'No reset token',
      });
    }

    const resetPasswordToken = await prisma.reset_password_token.findUnique({
      where: { reset_password_token: resetToken },
    });

    if (!resetPasswordToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid reset token',
        }),
      };
    }

    const user = await prisma.users.findUnique({
      where: { user_id: resetPasswordToken.user_id },
    });

    if (!user) {
      return Responses._404({
        message: 'User not found',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the password
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { user_password: hashedPassword },
    });

    // Delete the reset token
    await prisma.reset_password_token.delete({
      where: { reset_password_token: resetToken },
    });

    return Responses._204({ message: 'Password updated' });
  } catch (error) {
    console.log(error);
    return Responses._500({
      message: 'Internal server error',
    });
  }
}

async function sendEmailConfirmationToken(event) {
  const { email } = JSON.parse(event.body);

  const user = await prisma.users.findUnique({
    where: { user_email: email },
  });

  if (user) {
    try {
      const confirmationToken = generateConfirmationToken();
      // const hashedEmail = await bcrypt.hash(email, 10);
      const base64Email = Buffer.from(email).toString('base64');
      //url encoded base64email
      const urlEncodedEmail = encodeURIComponent(base64Email);

      //send email for the confirmation token and a link for them to confirm back to user

      const message = `Dear Valued Customer,

    Thank you for registering on Kunang Insurance Marketplace. We need you to confirm your email address in order to ensure the security of your account.

    To confirm your email, please click on the confirmation link provided below:

    ${process.env.APP_BASE_URL}/confirm-email/${urlEncodedEmail}/${confirmationToken}

    If you are unable to click on the link, please copy and paste it into your browser's address bar.

    By confirming your email address, you will be able to access all the features of Kunang Insurance Marketplace, including browsing and purchasing insurance products.

    If you have any questions or concerns, please do not hesitate to contact our customer support team at support@kunang.id.

    Thank you for choosing Kunang Insurance Marketplace.

    Best regards,
    Kunang Insurance Marketplace`;

      // const message = `Click on the link to confirm your email address: ${process.env.APP_BASE_URL}/confirm-email/${urlEncodedEmail}/${confirmationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_CONFIRMATION_FROM, //process.env.EMAIL_FROM, //TODO: not in .env yet
        to: email,
        subject: process.env.EMAIL_CONFIRMATION_SUBJECT,
        text: message,
      };

      const auth = await prisma.authentications.update({
        where: { user_id: user.user_id },
        data: {
          email_confirmation_token: confirmationToken,
          email_confirmation_token_expiration: new Date(Date.now() + 3600000),
        },
      });

      if (auth) {
        await transporter.sendMail(mailOptions);
        return Responses._200({
          message: 'Email successfully sent',
        });
      } else {
        return Responses._400({
          message: 'Authentication for the user not found',
        });
      }

      // send email confirmation token
    } catch (error) {
      console.log(error);
      return Responses._500({
        message:
          'Internal server error: Email not sent. Error description: ' + error,
      });
    }
  } else {
    return Responses._404({
      message: 'Email not found',
    });
  }
}

async function confirmEmail(event) {
  const { email, confirmationToken } = JSON.parse(event.body);
  const user = await prisma.users.findFirst({
    where: {
      user_email: email,
      authentication: {
        email_confirmation_token: confirmationToken,
        email_confirmation_token_expiration: {
          gt: new Date(),
        },
      },
    },
  });

  if (user) {
    await prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        email_confirmed: true,
      },
    });
    return Responses._200({
      message: 'Email confirmed',
    });
  } else {
    return Responses._400({
      message: 'Email/confirmation token not found/expired',
    });
  }
}

function generateConfirmationToken() {
  // generate random confirmation token
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// GET /auth/sessions/{sessionId}
async function getSessionById(event) {
  const sessionToken = event.pathParameters.sessionToken;

  try {
    const session = await prisma.sessions.findUnique({
      where: {
        session_token: sessionToken,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return Responses._404({
        message: 'Session not found',
      });
    }

    return Responses._200({
      session: {
        sessionId: session.session_id,
        userId: session.user_id,
        sessionToken: session.session_token,
        status: session.status,
        //   ipAddress: session.ip_address,
        //   userAgent: session.user_agent,
        //   lastActivity: session.last_activity,
        //   createdAt: session.created_at,
        //   updatedAt: session.updated_at,
        //   createdBy: session.created_by,
        //   updatedBy: session.updated_by,
        //   user: {
        //     userId: session.user.user_id,
        //     // email: session.user.user_email,
        //     // firstName: session.user.user_first_name,
        //     // lastName: session.user.user_last_name,
        //     // dob: session.user.user_dob,
        //     // address: session.user.user_address,
        //   },
      },
    });
  } catch (error) {
    return Responses._400({
      message: 'Error retrieving session',
      error: error,
    });
  }
}

// POST /auth/sessions
async function createSession(event) {
  const requestBody = JSON.parse(event.body);

  // Extract user information from the request body
  const { userId, sessionToken } = requestBody;

  // Check if the user exists in the database
  const user = await prisma.users.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!user) {
    return Responses._404({
      message: 'User not found',
    });
  }

  // Check if the user is already logged in
  const activeSession = await prisma.sessions.findFirst({
    where: {
      user_id: user.user_id,
      status: 'ACTIVE',
    },
  });

  if (activeSession) {
    return Responses._400({
      message: 'User is already logged in',
    });
  }

  // Extract IP address and user agent from the event
  const ipAddress = event.requestContext?.identity?.sourceIp || '';
  const userAgent = event.requestContext?.identity?.userAgent || '';

  // Create a new session record in the database
  const session = await prisma.sessions.create({
    data: {
      user_id: user.user_id,
      session_token: sessionToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      last_activity: new Date(),
      created_by: user.user_id,
      updated_by: user.user_id,
    },
  });

  // Return the created session record
  return Responses._200(session);
}

async function updateLastActivity(event) {
  const sessionToken = event.pathParameters.sessionToken;
  const ipAddress = event.requestContext.identity.sourceIp;
  const userAgent = event.requestContext.identity.userAgent;

  // check if session exists in database
  const session = await prisma.sessions.findUnique({
    where: {
      session_token: sessionToken,
    },
  });

  if (!session) {
    return Responses._404({
      message: 'Session not found',
    });
  }

  // update last activity
  const updatedSession = await prisma.sessions.update({
    where: {
      session_id: session.session_id,
    },
    data: {
      last_activity: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
    },
  });

  return Responses._200({
    message: 'Last activity updated successfully',
    session: updatedSession,
  });
}

async function loginOAuth(event) {
  try {
    const requestBody = JSON.parse(event.body);
    const user_id = requestBody.user_id;
    const auth_provider = requestBody.auth_provider;
    const auth_provider_id = requestBody.auth_provider_id;
    const auth_provider_payload = requestBody.auth_provider_payload;
    // console.log(
    //   'auth_provider: ' +
    //     auth_provider +
    //     ', auth_provider_id: ' +
    //     auth_provider_id +
    //     ', auth_provider_payload: ' +
    //     auth_provider_payload
    // );

    const user = await prisma.users.findUnique({
      where: { user_id: user_id },
    });

    if (!user) {
      return Responses._401({
        message: 'Invalid Attempt',
      });
    }
    // console.log('user found: ' + user);
    const auth = await prisma.authentications.upsert({
      where: { user_id: user.user_id },
      create: {
        user_id: user.user_id,
        auth_provider: auth_provider,
        auth_provider_id: auth_provider_id,
        auth_provider_payload: auth_provider_payload,
        created_by: user.user_id,
      },
      update: {
        updated_by: user.user_id,
      },
    });

    return Responses._200({
      message: 'Authentication successful',
      data: auth,
    });
  } catch (error) {
    console.error(error);
    return Responses._500({
      message: 'An error occurred',
    });
  }
}
