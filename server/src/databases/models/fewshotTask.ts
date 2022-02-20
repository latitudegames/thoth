import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { fewshotData, fewshotDataId } from './fewshotData';
import type { fewshotSerialization, fewshotSerializationId } from './fewshotSerialization';

export interface fewshotTaskAttributes {
  id: number;
  name: string;
  numInputs: number;
  numOutputs: number;
  unstuffedParentId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type fewshotTaskPk = "id";
export type fewshotTaskId = fewshotTask[fewshotTaskPk];
export type fewshotTaskOptionalAttributes = "id" | "unstuffedParentId" | "createdAt" | "updatedAt" | "deletedAt";
export type fewshotTaskCreationAttributes = Optional<fewshotTaskAttributes, fewshotTaskOptionalAttributes>;

export class fewshotTask extends Model<fewshotTaskAttributes, fewshotTaskCreationAttributes> implements fewshotTaskAttributes {
  id!: number;
  name!: string;
  numInputs!: number;
  numOutputs!: number;
  unstuffedParentId?: number;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  // fewshotTask hasMany fewshotData via fewshotTaskId
  fewshotData!: fewshotData[];
  getFewshotData!: Sequelize.HasManyGetAssociationsMixin<fewshotData>;
  setFewshotData!: Sequelize.HasManySetAssociationsMixin<fewshotData, fewshotDataId>;
  addFewshotDatum!: Sequelize.HasManyAddAssociationMixin<fewshotData, fewshotDataId>;
  addFewshotData!: Sequelize.HasManyAddAssociationsMixin<fewshotData, fewshotDataId>;
  createFewshotDatum!: Sequelize.HasManyCreateAssociationMixin<fewshotData>;
  removeFewshotDatum!: Sequelize.HasManyRemoveAssociationMixin<fewshotData, fewshotDataId>;
  removeFewshotData!: Sequelize.HasManyRemoveAssociationsMixin<fewshotData, fewshotDataId>;
  hasFewshotDatum!: Sequelize.HasManyHasAssociationMixin<fewshotData, fewshotDataId>;
  hasFewshotData!: Sequelize.HasManyHasAssociationsMixin<fewshotData, fewshotDataId>;
  countFewshotData!: Sequelize.HasManyCountAssociationsMixin;
  // fewshotTask hasMany fewshotSerialization via fewshotTaskId
  fewshotSerializations!: fewshotSerialization[];
  getFewshotSerializations!: Sequelize.HasManyGetAssociationsMixin<fewshotSerialization>;
  setFewshotSerializations!: Sequelize.HasManySetAssociationsMixin<fewshotSerialization, fewshotSerializationId>;
  addFewshotSerialization!: Sequelize.HasManyAddAssociationMixin<fewshotSerialization, fewshotSerializationId>;
  addFewshotSerializations!: Sequelize.HasManyAddAssociationsMixin<fewshotSerialization, fewshotSerializationId>;
  createFewshotSerialization!: Sequelize.HasManyCreateAssociationMixin<fewshotSerialization>;
  removeFewshotSerialization!: Sequelize.HasManyRemoveAssociationMixin<fewshotSerialization, fewshotSerializationId>;
  removeFewshotSerializations!: Sequelize.HasManyRemoveAssociationsMixin<fewshotSerialization, fewshotSerializationId>;
  hasFewshotSerialization!: Sequelize.HasManyHasAssociationMixin<fewshotSerialization, fewshotSerializationId>;
  hasFewshotSerializations!: Sequelize.HasManyHasAssociationsMixin<fewshotSerialization, fewshotSerializationId>;
  countFewshotSerializations!: Sequelize.HasManyCountAssociationsMixin;
  // fewshotTask belongsTo fewshotTask via unstuffedParentId
  unstuffedParent!: fewshotTask;
  getUnstuffedParent!: Sequelize.BelongsToGetAssociationMixin<fewshotTask>;
  setUnstuffedParent!: Sequelize.BelongsToSetAssociationMixin<fewshotTask, fewshotTaskId>;
  createUnstuffedParent!: Sequelize.BelongsToCreateAssociationMixin<fewshotTask>;

  static initModel(sequelize: Sequelize.Sequelize): typeof fewshotTask {
    fewshotTask.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "fewshot_task_name_key"
    },
    numInputs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'num_inputs'
    },
    numOutputs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'num_outputs'
    },
    unstuffedParentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'fewshot_task',
        key: 'id'
      },
      field: 'unstuffed_parent_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'fewshot_task',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: "fewshot_task_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "fewshot_task_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return fewshotTask;
  }
}
