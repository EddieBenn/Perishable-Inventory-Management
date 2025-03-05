import inventoryService from '../src/services/inventory.service';
import { Inventory } from '../src/models/inventory.model';
import * as database from '../src/config/database';
import { itemData, mockCreatedInventory, mockCurrentTime } from './mockData';

jest.mock('../src/config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock('../src/models/inventory.model', () => ({
  Inventory: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe('InventoryService', () => {
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
    LOCK: { UPDATE: 'UPDATE' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(mockCurrentTime);
    (database.sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
  });

  describe('addInventory', () => {
    it('should add inventory successfully', async () => {
      jest.spyOn(Inventory, 'create').mockResolvedValue(mockCreatedInventory);

      await inventoryService.addInventory(itemData.itemName, itemData.quantity, itemData.expiry);

      expect(Inventory.create).toHaveBeenCalledWith({
        itemName: itemData.itemName,
        quantity: itemData.quantity,
        expiry: mockCurrentTime + itemData.expiry,
      });
    });

    it('should throw error if creation fails', async () => {
      const expectedErrorMessage = 'An error occured while creating inventory';
      jest.spyOn(Inventory, 'create').mockRejectedValue(new Error(expectedErrorMessage));

      expect(inventoryService.addInventory(itemData.itemName, itemData.quantity, itemData.expiry)).rejects.toThrow(
        expectedErrorMessage,
      );
    });
  });
});
