import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface chainsAttributes {
  id: string;
  name: string;
  chain?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId: number;
  modules?: object;
  gameState?: object;
}

export type chainsPk = "id";
export type chainsId = chains[chainsPk];
export type chainsOptionalAttributes = "id" | "chain" | "createdAt" | "updatedAt" | "deletedAt" | "modules" | "gameState";
export type chainsCreationAttributes = Optional<chainsAttributes, chainsOptionalAttributes>;

export class chains extends Model<chainsAttributes, chainsCreationAttributes> implements chainsAttributes {
  id!: string;
  name!: string;
  chain?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId!: number;
  modules?: object;
  gameState?: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof chains {
    chains.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: "chains_name_key"
      },
      chain: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn('now'),
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn('now'),
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id'
      },
      modules: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      gameState: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'game_state'
      }
    }, {
      sequelize,
      tableName: 'chains',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: "chains_name_key",
          unique: true,
          fields: [
            { name: "name" },
          ]
        },
        {
          name: "chains_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
    return chains;
  }
}