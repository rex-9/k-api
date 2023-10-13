import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  //   const userId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'GET':
      if (event.path === '/providers') {
        return Responses._200(await getAllProviders());
      } else if (event.path.match(/^\/providers\/\d+$/)) {
        return Responses._200(await getProviderById(event));
      }
      break;
    case 'POST':
      if (event.path === '/providers') {
        return Responses._200(await createProvider(event));
      }
      break;
    case 'PUT':
      if (event.path.match(/^\/providers\/\d+$/)) {
        return Responses._200(await updateProvider(event));
      }
      break;
    case 'DELETE':
      if (event.path.match(/^\/providers\/\d+$/)) {
        return Responses._204(await deleteProvider(event));
      }
      break;

    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function getAllProviders() {
  const providers = await prisma.providers.findMany();
  return providers;
}

async function createProvider(event) {
  const data = JSON.parse(event.body);
  const encryptedPhone = await bcrypt.hash(data.provider_phone, 10);
  const provider = await prisma.providers.create({
    data: { ...data, provider_phone: encryptedPhone },
  });
  return provider;
}

async function getProviderById(event) {
  const { id } = event.pathParameters;
  const provider = await prisma.providers.findUnique({
    where: { provider_id: parseInt(id) },
  });
  return provider;
}

async function updateProvider(event) {
  const { id } = event.pathParameters;
  const data = JSON.parse(event.body);
  const provider = await prisma.providers.update({
    where: { provider_id: parseInt(id) },
    data,
  });
  return provider;
}

async function deleteProvider(event) {
  const { id } = event.pathParameters;
  await prisma.providers.delete({
    where: { provider_id: parseInt(id) },
  });
  return { message: 'Provider deleted' };
}
