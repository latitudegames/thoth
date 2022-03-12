import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface deployedSpellsAttributes {
  id: string;
  name: string;
  chain?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId: number;
  version: string;
  message?: string;
  modules?: object;
  versionName?: string;
}

export type deployedSpellsPk = "id";
export type deployedSpellsId = deployedSpells[deployedSpellsPk];
export type deployedSpellsOptionalAttributes = "id" | "chain" | "createdAt" | "updatedAt" | "deletedAt" | "version" | "message" | "modules" | "versionName";
export type deployedSpellsCreationAttributes = Optional<deployedSpellsAttributes, deployedSpellsOptionalAttributes>;

export class deployedSpells extends Model<deployedSpellsAttributes, deployedSpellsCreationAttributes> implements deployedSpellsAttributes {
  id!: string;
  name!: string;
  chain?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId!: number;
  version!: string;
  message?: string;
  modules?: object;
  versionName?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof deployedSpells {
    deployedSpells.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
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
      version: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "1"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      modules: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      versionName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'version_name'
      }
    }, {
      sequelize,
      tableName: 'deployed_spells',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: "deployed_spells_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
    return deployedSpells;
  }
}
