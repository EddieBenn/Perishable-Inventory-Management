import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface InventoryAttributes {
  id?: string;
  itemName: string;
  quantity: number;
  expiry: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Inventory extends Model<InventoryAttributes> {
  public id!: string;
  public itemName!: string;
  public quantity!: number;
  public expiry!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
