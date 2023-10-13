import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import { convertToMSISDN } from '../common/utils.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const prisma = new PrismaClient();
export const handler = async (event) => {
  dotenv.config();
  const userId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/users') {
        // Handle create user request
        const newUser = JSON.parse(event.body);
        const result = await createUser(newUser);
        if (!('code' in result)) {
          return Responses._409({
            id: result.user_id,
            createdAt: result.created_at,
          });
        } else if (result.code === 'P2002') {
          return Responses._409({
            message: `Unique constraint failed on the ${result.meta.target[0]}`,
          });
        } else {
          return Response._200({
            result: result,
            message: 'User created successfully',
          });
        }
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (userId) {
        // Handle get user by ID request
        const user = await getUserById(userId);
        if (user) {
          return Responses._200(user);
        } else {
          return Responses._404({ message: 'User not found' });
        }
      } else {
        // console.log('getting all users');
        // Handle get all users request
        const users = await getAllUsers();

        if (!users) {
          users = { msg: 'user not found' };
        }

        // console.log('users: ' + JSON.stringify(users));
        return Responses._200(users);
      }
    case 'PUT':
      // Handle update user request
      if (!userId) {
        return Responses._400({ message: 'Missing user ID' });
      }
      const updatedUser = JSON.parse(event.body);
      const result = await updateUser(userId, updatedUser);
      if (result) {
        return Responses._200({
          id: result.user_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'User not found' });
      }
    case 'DELETE':
      // Handle delete user request
      if (!userId) {
        return Responses._404({ message: 'Missing user ID' });
      }
      const deletedUser = await deleteUser(userId);
      if (deletedUser) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'User not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createUser(user) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.user_password, saltRounds);
  try {
    const createdUser = await prisma.users.create({
      data: {
        ...user,
        user_password: hashedPassword,
        user_phone: await convertToMSISDN(
          user.user_phone,
          process.env.DEFAULT_COUNTRY_CODE
        ),
      },
    });
    return createdUser;
  } catch (err) {
    return err;
  }
}

async function getUserById(userId) {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
  });
  return user;
}

async function getAllUsers() {
  const users = await prisma.users.findMany();
  return users;
}

async function updateUser(userId, updatedUser) {
  // If the updated user has a new password, hash it before updating the user data
  if (updatedUser.user_password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      updatedUser.user_password,
      saltRounds
    );
    updatedUser.user_password = hashedPassword;
    updatedUser.user_phone = await convertToMSISDN(
      updatedUser.user_phone,
      process.env.DEFAULT_COUNTRY_CODE
    );
  }

  const result = await prisma.users.update({
    where: { user_id: parseInt(userId) },
    data: updatedUser,
  });

  return result;
}

async function deleteUser(userId) {
  const deletedUser = await prisma.users.delete({
    where: { user_id: parseInt(userId) },
  });
  return deletedUser;
}
