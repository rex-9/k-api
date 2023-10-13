import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/quotations') {
        // Handle create quotation request
        const newQuotation = JSON.parse(event.body);
        const createdQuotation = await createQuotation(newQuotation);
        return Responses._201({
          id: createdQuotation.quotation_id,
          createdAt: createdQuotation.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get quotation by ID request
        const quotation = await getQuotationById(paramId);
        if (quotation) {
          return Responses._200(quotation);
        } else {
          return Responses._404({ message: 'Quotation not found' });
        }
      } else {
        // Handle get all quotations request
        const quotations = await getAllQuotations();
        return Responses._200(quotations);
      }
    case 'PUT':
      // Handle update quotation request
      if (!paramId) {
        return Responses._400({ message: 'Missing Quotation ID' });
      }
      const updatedQuotation = JSON.parse(event.body);
      const result = await updateQuotation(paramId, updatedQuotation);
      if (result) {
        return Responses._200({
          id: result.quotation_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Quotation not found' });
      }
    case 'DELETE':
      // Handle delete quotation request
      if (!paramId) {
        return Responses._400({ message: 'Missing Quotation ID' });
      }
      const deletedQuotation = await deleteQuotation(paramId);
      if (deletedQuotation) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Quotation not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createQuotation(quotation) {
  const quotation_no = generateQuotationNo();
  const createdQuotation = await prisma.quotations.create({
    data: { ...quotation, quotation_no: quotation_no },
  });

  return createdQuotation;
}

async function getQuotationById(quotationId) {
  const quotation = await prisma.quotations.findUnique({
    where: { quotation_id: parseInt(quotationId) },
  });

  return quotation;
}

async function getAllQuotations() {
  const quotations = await prisma.quotations.findMany();
  return quotations;
}

async function updateQuotation(quotationId, updatedQuotation) {
  const result = await prisma.quotations.update({
    where: { quotation_id: parseInt(quotationId) },
    data: updatedQuotation,
  });

  return result;
}

async function deleteQuotation(quotationId) {
  const deletedQuotation = await prisma.quotations.delete({
    where: { quotation_id: parseInt(quotationId) },
  });
  return deletedQuotation;
}

const generateQuotationNo = () => {
  const quotationNo = Math.floor(100000 + Math.random() * 900000).toString();
  return quotationNo;
};
