import type { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { type Product, products, productSchema } from '../data/productsData.js';


export default async function productRoutes(fastify: FastifyInstance) {
  const isDev = process.env.NODE_ENV === 'development'

  fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({
      status: "error",
      message: isDev ? error : "Oops! Something went wrong on our end..."
    });
  });

  //use this route to test internal server error
  fastify.get('/api/products/error', async () => {
    throw new Error ("WASTED")
  })

  //GET api/products
  fastify.get('/api/products', async () => {
    return products;
  })

  //GET api/products/:id
  fastify.get('/api/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const product = products.find(p => p.id === id)
    const result = z.string().uuid().safeParse(id)
    
    if (!result.success) {
      console.log(id)
      return reply.status(400).send({
        errors: isDev ? result.error.flatten().fieldErrors : "Invalid input, check your fields"
      })
    }
    
    if (!product) {
      return reply.status(404).send({ 
      message: `Product with ID ${id} not found` 
      })
    }
    
    return reply.status(200).send(product)
  })

  //PUT api/products/:id
  fastify.put('/api/products/:id', async (request,reply) => {
    const { id } = request.params as { id: string }
    const product = products.find(p => p.id === id)
    const idResult = z.string().uuid().safeParse(id)
    
    if (!idResult.success) {
      console.log(id)
      return reply.status(400).send({
        errors: isDev ? idResult.error.flatten().fieldErrors : "Invalid input, check your fields"
      })
    }
    
    if (!product) {
      return reply.status(404).send({ 
      message: `Product with ID ${id} not found` 
      })
    }

    const productResult = productSchema.safeParse(request.body)
    const index = products.indexOf(product)
    
    if (!productResult.success) {
      return reply.status(400).send({
        errors: isDev ? productResult.error.flatten().fieldErrors : "Invalid input, check your fields"
      })
    }

    const updatedProduct: Product = {
      id: id,
      ...productResult.data
    };

  products[index] = updatedProduct;

  return reply.status(200).send(updatedProduct);
  })

  // POST api/products
  fastify.post('/api/products', async (request, reply) => {
    const result = productSchema.safeParse(request.body)

    if (!result.success) {
      return reply.status(400).send({
        errors: isDev ? result.error.flatten().fieldErrors : "Invalid input, check your fields"
      })
    }

    const newProduct: Product = {
      id: uuidv4(),
      ...result.data
    }

    products.push(newProduct)

    return reply.status(201).send(newProduct)
  })

  //DELETE api/products/:id
  fastify.delete('/api/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const product = products.find(p => p.id === id)
    const result = z.string().uuid().safeParse(id)

    if (!result.success) {
    return reply.status(400).send({
      errors: isDev ? result.error.flatten().fieldErrors : "Invalid input, check your fields"
      })
    }
    
    if (!product) {
      return reply.status(404).send({ 
        message: `Product with ID ${id} not found` 
      })
    }
    
    const index = products.indexOf(product)
    products.splice(index, 1)

    return reply.status(204).send()
  })
}