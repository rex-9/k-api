import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/payments') {
        // Handle create payment request
        const newPayment = JSON.parse(event.body);
        const createdPayment = await createPayment(newPayment);
        return Responses._201({
          id: createdPayment.payment_id,
          createdAt: createdPayment.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get payment by ID request
        const payment = await getPaymentById(paramId);
        if (payment) {
          return Responses._200(payment);
        } else {
          return Responses._404({ message: 'Payment not found' });
        }
      } else {
        // Handle get all payments request
        const payments = await getAllPayments();
        return Responses._200(payments);
      }
    case 'PUT':
      // Handle update payment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Payment ID' });
      }
      const updatedPayment = JSON.parse(event.body);
      const result = await updatePayment(paramId, updatedPayment);
      if (result) {
        return Responses._200({
          id: result.payment_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Payment not found' });
      }
    case 'DELETE':
      // Handle delete payment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Payment ID' });
      }
      const deletedPayment = await deletePayment(paramId);
      if (deletedPayment) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Payment not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createPayment(payment) {
  const createdPayment = await prisma.payments.create({
    data: payment,
  });

  return createdPayment;
}

async function getPaymentById(paymentId) {
  const payment = await prisma.payments.findUnique({
    where: { payment_id: parseInt(paymentId) },
  });

  return payment;
}

async function getAllPayments() {
  const payments = await prisma.payments.findMany();
  return payments;
}

async function updatePayment(paymentId, updatedPayment) {
  const result = await prisma.payments.update({
    where: { payment_id: parseInt(paymentId) },
    data: updatedPayment,
  });

  return result;
}

async function deletePayment(paymentId) {
  const deletedPayment = await prisma.payments.delete({
    where: { payment_id: parseInt(paymentId) },
  });
  return deletedPayment;
}
