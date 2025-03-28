import { z } from 'zod';

export const InventorySchema = z.object({
  itemName: z.string().min(2, 'Item Name is required and must be a string of at least 2 characters'),
  quantity: z.number().min(1, 'Quantity is required and must be a positive number'),
  expiry: z.number()
    .refine((val) => Number.isInteger(val) && val.toString().length === 13, {
      message: 'Expiry must be a valid milliseconds-since-epoch timestamp'
    })
    .refine((val) => val > Date.now(), {
      message: 'Expiry time must be in the future'
    }),
});

export const SellSchema = InventorySchema.omit({ expiry: true });

export type InventoryDTO = z.infer<typeof InventorySchema>;
export type SellDTO = z.infer<typeof SellSchema>;
