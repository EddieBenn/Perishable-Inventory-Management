import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface InventoryAttributes {
  id?: string;
  itemName: string;
  quantity: number;
  expiry: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class Inventory extends Model<InventoryAttributes> {}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'inventory',
    timestamps: true,
  },
);
