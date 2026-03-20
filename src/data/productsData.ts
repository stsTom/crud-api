import z from "zod";

export const productSchema = z.object({
  "name": z.string().min(1, "Product name cannot be empty" ),
  "description": z.string().min(1, "Product description cannot be empty" ),
  "price": z.number().positive("Product price must be a positive number"),
  "category": z.string().min(1, "Product category cannot be empty" ),
  "inStock": z.boolean()
})

export type Product = z.infer<typeof productSchema> & { id: string }

export const products: Product[] = []