# CRUD API

### How to install
- Clone the repository
- Run `npm install` from the root to install dependencies
- Optionally you can create `.env` file and add `PORT=[port_number]` (check `.env.example`). If you forget to do this the code should still work as there's a default port hardcoded

### How to test
- Run `npm run test` for running through test scenarios
- You can use Postman or any other platform to test the endpoints manually
  > For this follow the following steps:
  > 1. Open postman and run the app using `start:dev` or `start:prod` commands in your Terminal
  > 2. Inside Postman or any other client you use, add `/api/products` inside the path field (`/api/products/[product id]` when trying to target a specific item from the database)
  > 3. Simply choose an edpoint to test and provide the required data

Here's a product example (id field is not required as it's created automatically by the server. However, you might want to test if that value doesn't get overwritten manually):\
  {\
    "id": "41fa3f68-a4fc-40c1-8794-fd635eb3f897",\
    "name": "Mechanical Keyboard",\
    "description": "RGB backlit with blue switches",\
    "price": 29.99,\
    "category": "Electronics",\
    "inStock": true\
  }

### External tools used:
- typescript
- tsx
- @types/node
- fastify
- @fastify/env
- cross-env
- uuid
- zod
- vitest