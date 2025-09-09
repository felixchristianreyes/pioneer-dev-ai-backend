import { z } from "zod";

const restaurantDetailSchema = z.object({
  action: z.string(),
  parameters: z.object({
    query: z.string(),
    near: z.string(),
    open_now: z.boolean(),
    price_range: z.number().min(1).max(4),
  }),
});

const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown(),
});

const placesResponseSchema = baseResponseSchema.extend({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
      cuisine: z.string(),
      price_level: z.string(),
    })
  ),
});

export { restaurantDetailSchema, baseResponseSchema, placesResponseSchema };
