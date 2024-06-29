import { z, ZodType } from 'zod';

export class InventoryValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(20).max(1000),
    stock: z.number().nonnegative().optional(),
    price: z.string().optional(),
    variant: z.string().min(1).max(50).optional(),
    subvariant: z.string().min(1).max(50).optional(),
    variation: z
      .array(
        z.object({
          name: z.string().min(1).max(50),
          stock: z.number().nonnegative().optional(),
          price: z.string().optional(),
          subvariation: z
            .array(
              z.object({
                name: z.string().min(1).max(50),
                stock: z.number().nonnegative(),
                price: z.string(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
  });
}
