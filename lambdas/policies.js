import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/policies') {
        // Handle create policies request
        const newPolicy = JSON.parse(event.body);
        const createdPolicy = await createPolicy(newPolicy);
        return Responses._201({
          id: createdPolicy.policy_id,
          createdAt: createdPolicy.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get policy by ID request
        const policy = await getPolicyById(paramId);
        if (policy) {
          return Responses._200(policy);
        } else {
          return Responses._404({ message: 'Policy not found' });
        }
      } else {
        // Handle get all policies request
        const policies = await getAllPolicies();
        return Responses._200(policies);
      }
    case 'PUT':
      // Handle update policy request
      if (!paramId) {
        return Responses._400({ message: 'Missing Policy ID' });
      }
      const updatedPolicy = JSON.parse(event.body);
      const result = await updatePolicy(paramId, updatedPolicy);
      if (result) {
        return Responses._200({
          id: result.policy_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Policy not found' });
      }
    case 'DELETE':
      // Handle delete Policy request
      if (!paramId) {
        return Responses._400({ message: 'Missing Policy ID' });
      }
      const deletedPolicy = await deletePolicy(paramId);
      if (deletedPolicy) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Policy not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createPolicy(policy) {
  const policy_no = generatePolicyNo();
  const createdPolicy = await prisma.policies.create({
    data: { ...policy, policy_no: policy_no },
  });

  return createdPolicy;
}

async function getPolicyById(policyId) {
  const policy = await prisma.policies.findUnique({
    where: { policy_id: parseInt(policyId) },
  });

  return policy;
}

async function getAllPolicies() {
  const policies = await prisma.policies.findMany();
  return policies;
}

async function updatePolicy(policyId, updatedPolicy) {
  const result = await prisma.policies.update({
    where: { policy_id: parseInt(policyId) },
    data: updatedPolicy,
  });

  return result;
}

async function deletePolicy(policyId) {
  const deletedPolicy = await prisma.policies.delete({
    where: { policy_id: parseInt(policyId) },
  });
  return deletedPolicy;
}

const generatePolicyNo = () => {
  const policyNo = Math.floor(100000 + Math.random() * 900000).toString();
  return policyNo;
};
