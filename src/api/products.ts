import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { Product, products, productSchema } from '../data/productsData.ts';
import { error } from 'node:console';
import { request } from 'node:http';


export default async function productRoutes(fastify: FastifyInstance) {
  const isDev = process.env.NODE_ENV === 'development'

  //GET api/products
  fastify.get('/api/products', async () => {
    return products;
  })

  //GET product by id
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

  //Delete specified product
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