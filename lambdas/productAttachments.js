import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/product_attachments') {
        // Handle create product_attachment request
        const newAttachment = JSON.parse(event.body);
        const createdAttachment = await createProductAttachment(newAttachment);
        return Responses._201({
          id: createdAttachment.attachment_id,
          createdAt: createdAttachment.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get product_attachment by ID request
        const attachment = await getProductAttachmentById(paramId);
        if (attachment) {
          return Responses._200(attachment);
        } else {
          return Responses._404({ message: 'Product Attachment not found' });
        }
      } else {
        // Handle get all product_attachments request
        const attachments = await getAllProductAttachments();
        return Responses._200(attachments);
      }
    case 'PUT':
      // Handle update product_attachment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Product Attachment ID' });
      }
      const updatedAttachment = JSON.parse(event.body);
      const result = await updateProductAttachment(paramId, updatedAttachment);
      if (result) {
        return Responses._200({
          id: result.attachment_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Product Attachment not found' });
      }
    case 'DELETE':
      // Handle delete Product Attachment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Product Attachment ID' });
      }
      const deletedAttachment = await deleteProductAttachment(paramId);
      if (deletedAttachment) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Product Attachment not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createProductAttachment(attachment) {
  const createdAttachment = await prisma.product_attachments.create({
    data: attachment,
  });

  return createdAttachment;
}

async function getProductAttachmentById(attachmentId) {
  const attachment = await prisma.product_attachments.findUnique({
    where: { attachment_id: parseInt(attachmentId) },
  });

  return attachment;
}

async function getAllProductAttachments() {
  const attachments = await prisma.product_attachments.findMany();
  return attachments;
}

async function updateProductAttachment(attachmentId, updatedAttachment) {
  const result = await prisma.product_attachments.update({
    where: { attachment_id: parseInt(attachmentId) },
    data: updatedAttachment,
  });

  return result;
}

async function deleteProductAttachment(attachmentId) {
  const deletedAttachment = await prisma.product_attachments.delete({
    where: { attachment_id: parseInt(attachmentId) },
  });
  return deletedAttachment;
}
