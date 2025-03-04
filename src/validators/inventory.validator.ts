import { z } from 'zod';

export const InventorySchema = z.object({
  itemName: z.string().min(2, 'Item Name is required'),
  quantity: z.number().min(1, 'Quantity is required'),
  expiry: z.number().min(1, 'Expiry is required'),
});

export const SellSchema = InventorySchema.omit({ expiry: true });

export type InventoryDTO = z.infer<typeof InventorySchema>;
export type SellDTO = z.infer<typeof SellSchema>;
