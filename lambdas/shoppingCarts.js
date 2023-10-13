import { Responses } from '../common/API_Responses.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

export const handler = async (event) => {
  dotenv.config();
  const paramId = event.pathParameters ? event.pathParameters.id : null;

  switch (event.httpMethod) {
    case 'POST':
      if (event.path === '/shopping_carts') {
        // Handle create shopping_cart request
        const newCart = JSON.parse(event.body);
        const createdCart = await createShoppingCart(newCart);
        return Responses._201({
          id: createdCart.cart_id,
          createdAt: createdCart.created_at,
        });
      } else {
        return Responses._405({ message: 'Method not allowed' });
      }
    case 'GET':
      if (paramId) {
        // Handle get shopping_cart by ID request
        const cart = await getShoppingCartById(paramId);
        if (cart) {
          return Responses._200(cart);
        } else {
          return Responses._404({ message: 'Shopping Cart not found' });
        }
      } else {
        // Handle get all shopping_carts request
        const carts = await getAllShoppingCarts();
        return Responses._200(carts);
      }
    case 'PUT':
      // Handle update shopping_cart request
      if (!paramId) {
        return Responses._400({ message: 'Missing Shopping Cart ID' });
      }
      const updatedCart = JSON.parse(event.body);
      const result = await updateShoppingCart(paramId, updatedCart);
      if (result) {
        return Responses._200({
          id: result.cart_id,
          updatedAt: result.updated_at,
        });
      } else {
        return Responses._404({ message: 'Shopping Cart not found' });
      }
    case 'DELETE':
      // Handle delete Shopping Cart request
      if (!paramId) {
        return Responses._400({ message: 'Missing Shopping Cart ID' });
      }
      const deletedCart = await deleteShoppingCart(paramId);
      if (deletedCart) {
        return Responses._204();
      } else {
        return Responses._404({ message: 'Shopping Cart not found' });
      }
    default:
      return Responses._405({ message: 'Method not allowed' });
  }
};

async function createShoppingCart(cart) {
  const createdCart = await prisma.shopping_carts.create({
    data: cart,
  });

  return createdCart;
}

async function getShoppingCartById(cartId) {
  const cart = await prisma.shopping_carts.findUnique({
    where: { cart_id: parseInt(cartId) },
  });

  return cart;
}

async function getAllShoppingCarts() {
  const carts = await prisma.shopping_carts.findMany();
  return carts;
}

async function updateShoppingCart(cartId, updatedCart) {
  const result = await prisma.shopping_carts.update({
    where: { cart_id: parseInt(cartId) },
    data: updatedCart,
  });

  return result;
}

async function deleteShoppingCart(cartId) {
  const deletedCart = await prisma.shopping_carts.delete({
    where: { cart_id: parseInt(cartId) },
  });
  return deletedCart;
}
