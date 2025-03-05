import inventoryService from '../src/services/inventory.service';
import { Inventory } from '../src/models/inventory.model';
import * as database from '../src/config/database';
import { itemData, mockCreatedInventory, mockCurrentTime } from './mockData';
import { Op } from 'sequelize';

jest.mock('../src/config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock('../src/models/inventory.model', () => ({
  Inventory: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
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

  describe('getItemQuantity', () => {
    it('should return quantity and validTill when inventory exists', async () => {
      const mockLots = [
        { ...mockCreatedInventory, quantity: 5, expiry: mockCurrentTime + 1000 },
        { ...mockCreatedInventory, quantity: 3, expiry: mockCurrentTime + 2000 },
      ];
      jest.spyOn(Inventory, 'findAll').mockResolvedValue(mockLots as any);

      const getQuantity = await inventoryService.getItemQuantity(itemData.itemName);

      expect(getQuantity).toEqual({
        quantity: 8,
        validTill: mockCurrentTime + 1000,
      });
      expect(Inventory.findAll).toHaveBeenCalledWith({
        where: {
          itemName: itemData.itemName,
          expiry: { [Op.gt]: mockCurrentTime },
          quantity: { [Op.gt]: 0 },
        },
        order: [['expiry', 'ASC']],
      });
    });

    it('should return zero quantity when no inventory exists', async () => {
      jest.spyOn(Inventory, 'findAll').mockResolvedValue([]);

      const getQuantity = await inventoryService.getItemQuantity(itemData.itemName);

      expect(getQuantity).toEqual({
        quantity: 0,
        validTill: null,
      });
    });
  });

  describe('sellItem', () => {
    it('should sell items from inventory successfully', async () => {
      const mockLots = [
        { ...mockCreatedInventory, quantity: 5, save: jest.fn() },
        { ...mockCreatedInventory, quantity: 5, save: jest.fn() },
      ];
      jest.spyOn(Inventory, 'findAll').mockResolvedValue(mockLots as any);

      await inventoryService.sellItem(itemData.itemName, 7);

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockLots[0].save).toHaveBeenCalled();
      expect(mockLots[1].save).toHaveBeenCalled();
    });

    it('should break loop when remainingToSell becomes zero', async () => {
      const mockLots = [
        { ...mockCreatedInventory, quantity: 10, save: jest.fn() },
        { ...mockCreatedInventory, quantity: 5, save: jest.fn() },
      ];
      jest.spyOn(Inventory, 'findAll').mockResolvedValue(mockLots as any);
      await inventoryService.sellItem(itemData.itemName, 5);

      expect(mockLots[0].save).toHaveBeenCalled();
      expect(mockLots[0].quantity).toBe(5);

      expect(mockLots[1].save).not.toHaveBeenCalled();
      expect(mockLots[1].quantity).toBe(5);
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw error if not enough inventory', async () => {
      const mockLots = [{ ...mockCreatedInventory, quantity: 3 }];
      jest.spyOn(Inventory, 'findAll').mockResolvedValue(mockLots as any);

      await expect(inventoryService.sellItem(itemData.itemName, 5)).rejects.toThrow('Not enough inventory');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('removeExpiredInventory', () => {
    it('should remove expired inventory items', async () => {
      jest.spyOn(Inventory, 'destroy').mockResolvedValue(2);

      const expiredInventory = await inventoryService.removeExpiredInventory();

      expect(expiredInventory).toBe(2);
      expect(Inventory.destroy).toHaveBeenCalledWith({
        where: {
          expiry: { [Op.lte]: mockCurrentTime },
          quantity: { [Op.gt]: 0 },
        },
      });
    });

    it('should handle case when no expired items exist', async () => {
      jest.spyOn(Inventory, 'destroy').mockResolvedValue(0);

      const expiredInventory = await inventoryService.removeExpiredInventory();

      expect(expiredInventory).toBe(0);
    });
  });
});
