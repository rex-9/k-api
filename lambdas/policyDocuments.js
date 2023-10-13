import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/policy_documents') {
        // Handle create policy_document request
        const newDocument = JSON.parse(event.body);
        const createdDocument = await createPolicyDocument(newDocument);
        return Responses._201({
          id: createdDocument.document_id,
          createdAt: createdDocument.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get policy_document by ID request
        const document = await getPolicyDocumentById(paramId);
        if (document) {
          return Responses._200(document);
        } else {
          return Responses._404({ message: 'Policy Document not found' });
        }
      } else {
        // Handle get all policy_documents request
        const documents = await getAllPolicyDocuments();
        return Responses._200(documents);
      }
    case 'PUT':
      // Handle update policy_document request
      if (!paramId) {
        return Responses._400({ message: 'Missing Policy Document ID' });
      }
      const updatedDocument = JSON.parse(event.body);
      const result = await updatePolicyDocument(paramId, updatedDocument);
      if (result) {
        return Responses._200({
          id: result.document_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Policy Document not found' });
      }
    case 'DELETE':
      // Handle delete Policy Document request
      if (!paramId) {
        return Responses._400({ message: 'Missing Policy Document ID' });
      }
      const deletedDocument = await deletePolicyDocument(paramId);
      if (deletedDocument) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Policy Document not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};
async function createPolicyDocument(document) {
  const createdDocument = await prisma.policy_documents.create({
    data: document,
  });

  return createdDocument;
}

async function getPolicyDocumentById(documentId) {
  const document = await prisma.policy_documents.findUnique({
    where: { document_id: parseInt(documentId) },
  });

  return document;
}

async function getAllPolicyDocuments() {
  const documents = await prisma.policy_documents.findMany();
  return documents;
}

async function updatePolicyDocument(documentId, updatedDocument) {
  const result = await prisma.policy_documents.update({
    where: { document_id: parseInt(documentId) },
    data: updatedDocument,
  });

  return result;
}

async function deletePolicyDocument(documentId) {
  const deletedDocument = await prisma.policy_documents.delete({
    where: { document_id: parseInt(documentId) },
  });
  return deletedDocument;
}
