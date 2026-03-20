import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { Product, products, productSchema } from '../data/productsData.ts';
import { error } from 'node:console';


export default async function productRoutes(fastify: FastifyInstance) {
  const isDev = process.env.NODE_ENV === 'development'

  //GET api/products
  fastify.get('/', async () => {
    return products;
  });

  // POST api/products
  fastify.post('/', async (request, reply) => {
    const result = productSchema.safeParse(request.body);

    if (!result.success) {
      console.log('failed')
      return reply.status(400).send({
        errors: isDev ? result.error.flatten().fieldErrors : "Invalid input, check your fields"
      });
    }

    const newProduct: Product = {
      id: uuidv4(),
      ...result.data
    };

    products.push(newProduct);

    return reply.status(201).send(newProduct);
  });
  
}