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

  static readonly GETITEMBYID: ZodType = z.number().positive();
  static readonly GETITEMWITHPAGINATION: ZodType = z.object({
    page: z.number().positive(),
    pageSize: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(20).max(1000).optional(),
    stock: z.number().nonnegative().optional(),
    price: z.string().optional(),
    variant: z.string().min(1).max(50).optional(),
    subvariant: z.string().min(1).max(50).optional(),
    variation: z
      .array(
        z.object({
          id: z.number().positive(),
          name: z.string().min(1).max(50).optional(),
          stock: z.number().nonnegative().optional(),
          price: z.string().optional(),
          subvariation: z
            .array(
              z.object({
                id: z.number().positive(),
                name: z.string().min(1).max(50).optional(),
                stock: z.number().nonnegative().optional(),
                price: z.string().optional(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
  });
}
