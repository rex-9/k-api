import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/vouchers') {
        // Handle create voucher request
        const newVoucher = JSON.parse(event.body);
        const createdVoucher = await createVoucher(newVoucher);
        return Responses._201({
          id: createdVoucher.voucher_id,
          createdAt: createdVoucher.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get voucher by ID request
        const voucher = await getVoucherById(paramId);
        if (voucher) {
          return Responses._200(voucher);
        } else {
          return Responses._404({ message: 'Voucher not found' });
        }
      } else {
        // Handle get all vouchers request
        const vouchers = await getAllVouchers();
        return Responses._200(vouchers);
      }
    case 'PUT':
      // Handle update voucher request
      if (!paramId) {
        return Responses._400({ message: 'Missing Voucher ID' });
      }
      const updatedVoucher = JSON.parse(event.body);
      const result = await updateVoucher(paramId, updatedVoucher);
      if (result) {
        return Responses._200({
          id: result.voucher_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Voucher not found' });
      }
    case 'DELETE':
      // Handle delete voucher request
      if (!paramId) {
        return Responses._400({ message: 'Missing Voucher ID' });
      }
      const deletedVoucher = await deleteVoucher(paramId);
      if (deletedVoucher) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Voucher not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createVoucher(voucher) {
  const voucher_code = generateVoucherCode();
  const createdVoucher = await prisma.vouchers.create({
    data: { ...voucher, voucher_code: voucher_code },
  });

  return createdVoucher;
}

async function getVoucherById(voucherId) {
  const voucher = await prisma.vouchers.findUnique({
    where: { voucher_id: parseInt(voucherId) },
  });

  return voucher;
}

async function getAllVouchers() {
  const vouchers = await prisma.vouchers.findMany();
  return vouchers;
}

async function updateVoucher(voucherId, updatedVoucher) {
  const result = await prisma.vouchers.update({
    where: { voucher_id: parseInt(voucherId) },
    data: updatedVoucher,
  });

  return result;
}

async function deleteVoucher(voucherId) {
  const deletedVoucher = await prisma.vouchers.delete({
    where: { voucher_id: parseInt(voucherId) },
  });
  return deletedVoucher;
}

const generateVoucherCode = () => {
  const voucherCode = Math.floor(100000 + Math.random() * 900000).toString();
  return voucherCode;
};
