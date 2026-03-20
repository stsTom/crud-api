import z from "zod";

const productSchema = z.object({
  "name": z.string().min(1),
  "description": z.string(),
  "price": z.number().positive(),
  "category": z.string(),
  "inStock": z.boolean()
})

type Product = z.infer<typeof productSchema> & { id: string }

export const products: Product[] = []