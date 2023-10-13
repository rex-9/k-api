import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/insured_objects') {
        // Handle create insured_object request
        const newObject = JSON.parse(event.body);
        const createdObject = await createInsuredObject(newObject);
        return Responses._201({
          id: createdObject.object_id,
          createdAt: createdObject.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get insured_object by ID request
        const object = await getInsuredObjectById(paramId);
        if (object) {
          return Responses._200(object);
        } else {
          return Responses._404({ message: 'Insured Object not found' });
        }
      } else {
        // Handle get all insured_objects request
        const objects = await getAllInsuredObjects();
        return Responses._200(objects);
      }
    case 'PUT':
      // Handle update insured_object request
      if (!paramId) {
        return Responses._400({ message: 'Missing Insured Object ID' });
      }
      const updatedObject = JSON.parse(event.body);
      const result = await updateInsuredObject(paramId, updatedObject);
      if (result) {
        return Responses._200({
          id: result.object_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Insured Object not found' });
      }
    case 'DELETE':
      // Handle delete Insured Object request
      if (!paramId) {
        return Responses._400({ message: 'Missing Insured Object ID' });
      }
      const deletedObject = await deleteInsuredObject(paramId);
      if (deletedObject) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Insured Object not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createInsuredObject(object) {
  const createdObject = await prisma.insured_objects.create({
    data: object,
  });

  return createdObject;
}

async function getInsuredObjectById(objectId) {
  const object = await prisma.insured_objects.findUnique({
    where: { object_id: parseInt(objectId) },
  });

  return object;
}

async function getAllInsuredObjects() {
  const objects = await prisma.insured_objects.findMany();
  return objects;
}

async function updateInsuredObject(objectId, updatedObject) {
  const result = await prisma.insured_objects.update({
    where: { object_id: parseInt(objectId) },
    data: updatedObject,
  });

  return result;
}

async function deleteInsuredObject(objectId) {
  const deletedObject = await prisma.insured_objects.delete({
    where: { object_id: parseInt(objectId) },
  });
  return deletedObject;
}
