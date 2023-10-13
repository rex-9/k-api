import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/product_categories') {
        try {
          // Handle create category request
          const newCategory = JSON.parse(event.body);
          const createdCategory = await createProductCategory(newCategory);
          return Responses.created({
            id: createdCategory.category_id,
            createdAt: createdCategory.created_at,
          });
        } catch (err) {
          console.error('Error creating category', err);
          return Responses.internalServerError({
            message: 'Error creating category',
          });
        }
      } else {
        return Responses.methodNotAllowed({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        try {
          // Handle get category by ID request
          const category = await getProductCategoryById(paramId);
          if (category) {
            return Responses.success(category);
          } else {
            return Responses.notFound({ message: 'Category not found' });
          }
        } catch (err) {
          console.error('Error getting category', err);
          return Responses.internalServerError({
            message: 'Error getting category',
          });
        }
      } else {
        try {
          // Handle get all categories request
          const categories = await getAllProductCategories();
          return Responses.success(categories);
        } catch (err) {
          console.error('Error getting categories', err);
          return Responses.internalServerError({
            message: 'Error getting categories',
          });
        }
      }
    case 'PUT':
      if (!paramId) {
        return Responses.badRequest({ message: 'Missing Product Category ID' });
      }
      try {
        // Handle update category request
        const updatedCategory = JSON.parse(event.body);
        const result = await updateProductCategory(paramId, updatedCategory);
        if (result) {
          return Responses.success({
            id: result.category_id,
            updatedAt: result.updated_at,
          });
        } else {
          return Responses.notFound({ message: 'Category not found' });
        }
      } catch (err) {
        console.error('Error updating category', err);
        return Responses.internalServerError({
          message: 'Error updating category',
        });
      }
    case 'DELETE':
      if (!paramId) {
        return Responses.badRequest({ message: 'Missing Category ID' });
      }
      try {
        // Handle delete category request
        const deletedCategory = await deleteProductCategory(paramId);
        if (deletedCategory) {
          return Responses.noContent({});
        } else {
          return Responses.notFound({ message: 'Category not found' });
        }
      } catch (err) {
        console.error('Error deleting category', err);
        return Responses.internalServerError({
          message: 'Error deleting category',
        });
      }
    default:
      return Responses.methodNotAllowed({ message: 'Method not allowed' });
  }
};
async function createProductCategory(category) {
  const createdCategory = await prisma.product_categories.create({
    data: category,
  });

  return createdCategory;
}

async function getProductCategoryById(categoryId) {
  const category = await prisma.product_categories.findUnique({
    where: { category_id: parseInt(categoryId) },
  });

  return category;
}

async function getAllProductCategories() {
  const categories = await prisma.product_categories.findMany();
  return categories;
}

async function updateProductCategory(categoryId, updatedCategory) {
  const result = await prisma.product_categories.update({
    where: { category_id: parseInt(categoryId) },
    data: updatedCategory,
  });

  return result;
}

async function deleteProductCategory(categoryId) {
  const deletedCategory = await prisma.product_categories.delete({
    where: { category_id: parseInt(categoryId) },
  });
  return deletedCategory;
}
