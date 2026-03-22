import { expect, test, describe } from "vitest";
import { createApp } from "../dist/app.js";
import z, { uuidv4 } from "zod";
import { id } from "zod/locales";
import { METHODS } from "node:http";

//negative outcome tests/invalid input/failed operation?
//test if input id stays unchanged when provided?
//test if message is not exposing?

//scenario 1
//scenario 2: trying to change the objects id (first creating, than putting, trying to recreate an object with the same id)
//scenario 3: invalid inputs/incomplete input commands scenario (incomplete inputs expect status code 400)

const app = await createApp()

describe('Scenario 1: Product lifecycle', () => {
  const productContext = {
    'id': '',
    'content': {}
  }

  test('GET /api/products returns an empty array initially', async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/products"
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })
  
  test('POST /api/products returns a newly created product with a valid id', async () => {
      const payload = {
        name: 'Test Mouse',
        description: 'Gaming mouse',
        price: 25,
        category: 'Hardware',
        inStock: true
      }
  
      const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      payload: payload
    })
  
    const { id } = response.json()
    const idResult = z.string().uuid().safeParse(id)
  
    expect(response.statusCode).toBe(201)
    expect(idResult.success).toBe(true)
    expect(response.json()).toEqual({ id: id, ...payload })

    if (idResult.success){
      productContext.id = id
      productContext.content = payload
    }
  })
  
  test('GET /api/products/:id returns an object just created', async () => {
    const response = await app.inject({
      method: "GET",
      url: `/api/products/${productContext.id}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ id: productContext.id, ...productContext.content })
  })

  test('PUT /api/products/:id returns an object with updated data and unchanged id', async () => {
    const payload = {
      id: uuidv4(),
      name: 'Test Mouse',
      description: 'Lab mouse breed',
      price: 1,
      category: 'Pets',
      inStock: true
    }

    const response = await app.inject({
      method: "PUT",
      url: `/api/products/${productContext.id}`,
      payload: payload
    })

    const { id, ...rest } = payload

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ id: productContext.id, ...rest })
  })

  test('DELETE /api/products/:id responses with 204 status code', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/products/${productContext.id}`
    })
    
    expect(response.statusCode).toBe(204)
  })

  test('GET /api/products/:id returns 404', async () => {
    const response = await app.inject({
      method: "GET",
      url: `/api/products/${productContext.id}`
    })
  
    expect(response.statusCode).toBe(404)
  })
})
  
