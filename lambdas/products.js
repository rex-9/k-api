import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/products') {
        // Handle create product request
        const newProduct = JSON.parse(event.body);
        const createdProduct = await createProduct(newProduct);
        return Responses._201({
          id: createdProduct.product_id,
          createdAt: createdProduct.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get product by ID request
        const product = await getProductById(paramId);
        if (product) {
          return Responses._200(product);
        } else {
          return Responses._404({ message: 'Product not found' });
        }
      } else {
        // Handle get all products request
        const products = await getAllProducts();
        return Responses._200(products);
      }
    case 'PUT':
      // Handle update product request
      if (!paramId) {
        return Responses._400({ message: 'Missing Product ID' });
      }
      const updatedProduct = JSON.parse(event.body);
      const result = await updateProduct(paramId, updatedProduct);
      if (result) {
        return Responses._200({
          id: result.product_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Product not found' });
      }
    case 'DELETE':
      // Handle delete product request
      if (!paramId) {
        return Responses._400({ message: 'Missing Product ID' });
      }
      const deletedProduct = await deleteProduct(paramId);
      if (deletedProduct) {
        return Responses._204();
      } else {
        return Responses._404({ message: 'Product not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createProduct(product) {
  const createdProduct = await prisma.products.create({
    data: product,
  });

  return createdProduct;
}

async function getProductById(productId) {
  const product = await prisma.products.findUnique({
    where: { product_id: parseInt(productId) },
  });

  return product;
}

async function getAllProducts() {
  const products = await prisma.products.findMany({
    include: {
      product_attachments: {
        where: {
          is_logo: true,
        }
      },
    },
  });

  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const result = [];
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const query = await prisma.$queryRaw`SELECT * FROM fn_average_rating(${product.product_id});`;
    const obj =  {
      product_id: product.product_id,
      product_name: product.product_name,
      product_desc: product.product_desc,
      product_min_price: product.product_min_price,
      product_max_price: product.product_max_price,
      category_id: product.category_id,
      provider_id: product.provider_id,
      fields_definition: product.fields_definition,
      formula_logic: product.formula_logic,
      policy_count: query[0].policy_count,
      avg_rating: query[0].avg_rating,
      product_attachment: {
        attachment_id: product.product_attachments[0]?.attachment_id,
        product_id: product.product_attachments[0]?.product_id,
        attachment_url: product.product_attachments[0]?.attachment_url,
        attachment_filename: product.product_attachments[0]?.attachment_filename,
        attachment_mime_type: product.product_attachments[0]?.attachment_mime_type,
        is_logo: product.product_attachments[0]?.is_logo,
      },
    };
    result.push(obj);
  }
  
  return result;
}

async function updateProduct(productId, updatedProduct) {
  const result = await prisma.products.update({
    where: { product_id: parseInt(productId) },
    data: updatedProduct,
  });

  return result;
}

async function deleteProduct(productId) {
  const deletedProduct = await prisma.products.delete({
    where: { product_id: parseInt(productId) },
  });
  return deletedProduct;
}
