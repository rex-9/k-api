import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/reviews') {
        // Handle create review request
        const newReview = JSON.parse(event.body);
        const createdReview = await createReview(newReview);
        return Responses._201({
          id: createdReview.review_id,
          createdAt: createdReview.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get review by ID request
        const review = await getReviewById(paramId);
        if (review) {
          return Responses._200(review);
        } else {
          return Responses._404({ message: 'Review not found' });
        }
      } else {
        // Handle get all reviews request
        const reviews = await getAllReviews();
        return Responses._200(reviews);
      }
    case 'PUT':
      // Handle update review request
      if (!paramId) {
        return Responses._400({ message: 'Missing Review ID' });
      }
      const updatedReview = JSON.parse(event.body);
      const result = await updateReview(paramId, updatedReview);
      if (result) {
        return Responses._200({
          id: result.review_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Review not found' });
      }
    case 'DELETE':
      // Handle delete review request
      if (!paramId) {
        return Responses._400({ message: 'Missing Review ID' });
      }
      const deletedReview = await deleteReview(paramId);
      if (deletedReview) {
        return Responses._204({});
      } else {
        return Responses._404({ message: 'Review not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};
async function createReview(review) {
  const createdReview = await prisma.reviews.create({
    data: review,
  });

  return createdReview;
}

async function getReviewById(reviewId) {
  const review = await prisma.reviews.findUnique({
    where: { review_id: parseInt(reviewId) },
  });

  return review;
}

async function getAllReviews() {
  const reviews = await prisma.reviews.findMany();
  return reviews;
}

async function updateReview(reviewId, updatedReview) {
  const result = await prisma.reviews.update({
    where: { review_id: parseInt(reviewId) },
    data: updatedReview,
  });

  return result;
}

async function deleteReview(reviewId) {
  const deletedReview = await prisma.reviews.delete({
    where: { review_id: parseInt(reviewId) },
  });
  return deletedReview;
}
