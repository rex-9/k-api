import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/external_data') {
        // Handle create external_data request
        const newData = JSON.parse(event.body);
        const createdData = await createExternalData(newData);
        return Responses._201({
          id: createdData.data_id,
          createdAt: createdData.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get external_data by ID request
        const data = await getExternalDataById(paramId);
        if (data) {
          return Responses._200(data);
        } else {
          return Responses._404({ message: 'External Data not found' });
        }
      } else {
        // Handle get all external_data request
        const data = await getAllExternalData();
        return Responses._200(data);
      }
    case 'PUT':
      // Handle update external_data request
      if (!paramId) {
        return Responses._400({ message: 'Missing External Data ID' });
      }
      const updatedData = JSON.parse(event.body);
      const result = await updateExternalData(paramId, updatedData);
      if (result) {
        return Responses._200({
          id: result.data_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'External Data not found' });
      }
    case 'DELETE':
      // Handle delete External Data request
      if (!paramId) {
        return Responses._400({ message: 'Missing External Data ID' });
      }
      const deletedData = await deleteExternalData(paramId);
      if (deletedData) {
        return Responses._204({ message: 'External Data deleted' });
      } else {
        return Responses._404({ message: 'External Data not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createExternalData(data) {
  const createdData = await prisma.external_data.create({
    data: data,
  });

  return createdData;
}

async function getExternalDataById(dataId) {
  const data = await prisma.external_data.findUnique({
    where: { data_id: parseInt(dataId) },
  });

  return data;
}

async function getAllExternalData() {
  const data = await prisma.external_data.findMany();
  return data;
}

async function updateExternalData(dataId, updatedData) {
  const result = await prisma.external_data.update({
    where: { data_id: parseInt(dataId) },
    data: updatedData,
  });

  return result;
}

async function deleteExternalData(dataId) {
  const deletedData = await prisma.external_data.delete({
    where: { data_id: parseInt(dataId) },
  });
  return deletedData;
}
