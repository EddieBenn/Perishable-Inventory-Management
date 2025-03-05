export const itemData = {
  itemName: 'pencil',
  quantity: 10,
  expiry: 3600000,
};

export const mockCurrentTime = 1615525981224;

export const mockCreatedInventory = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  itemName: itemData.itemName,
  quantity: itemData.quantity,
  expiry: mockCurrentTime + itemData.expiry,
  createdAt: new Date(),
  updatedAt: new Date(),
};
