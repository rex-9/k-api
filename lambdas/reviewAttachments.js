import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/review_attachments') {
        // Handle create review_attachment request
        const newAttachment = JSON.parse(event.body);
        const createdAttachment = await createReviewAttachment(newAttachment);
        return Responses._201({
          id: createdAttachment.attachment_id,
          createdAt: createdAttachment.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get review_attachment by ID request
        const attachment = await getReviewAttachmentById(paramId);
        if (attachment) {
          return Responses._200(attachment);
        } else {
          return Responses._404({ message: 'Review Attachment not found' });
        }
      } else {
        // Handle get all review_attachments request
        const attachments = await getAllReviewAttachments();
        return Responses._200(attachments);
      }
    case 'PUT':
      // Handle update review_attachment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Review Attachment ID' });
      }
      const updatedAttachment = JSON.parse(event.body);
      const result = await updateReviewAttachment(paramId, updatedAttachment);
      if (result) {
        return Responses._200({
          id: result.attachment_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Review Attachment not found' });
      }
    case 'DELETE':
      // Handle delete Review Attachment request
      if (!paramId) {
        return Responses._400({ message: 'Missing Review Attachment ID' });
      }
      const deletedAttachment = await deleteReviewAttachment(paramId);
      if (deletedAttachment) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Review Attachment not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createReviewAttachment(attachment) {
  const createdAttachment = await prisma.review_attachments.create({
    data: attachment,
  });

  return createdAttachment;
}

async function getReviewAttachmentById(attachmentId) {
  const attachment = await prisma.review_attachments.findUnique({
    where: { attachment_id: parseInt(attachmentId) },
  });

  return attachment;
}

async function getAllReviewAttachments() {
  const attachments = await prisma.review_attachments.findMany();
  return attachments;
}

async function updateReviewAttachment(attachmentId, updatedAttachment) {
  const result = await prisma.review_attachments.update({
    where: { attachment_id: parseInt(attachmentId) },
    data: updatedAttachment,
  });

  return result;
}

async function deleteReviewAttachment(attachmentId) {
  const deletedAttachment = await prisma.review_attachments.delete({
    where: { attachment_id: parseInt(attachmentId) },
  });
  return deletedAttachment;
}
