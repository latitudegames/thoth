import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

import type { fewshotTask, fewshotTaskId } from './fewshotTask'

export type fewshotSerializationAttributes = {
  id: number
  fewshotTaskId: number
  name?: string
  isPreferred?: boolean
  introduction: string
  beforeEachInput: string[]
  inBetween: string
  beforeEachOutput: string[]
  atTheEnd: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type fewshotSerializationPk = 'id'
export type fewshotSerializationId =
  fewshotSerialization[fewshotSerializationPk]
export type fewshotSerializationOptionalAttributes =
  | 'id'
  | 'name'
  | 'isPreferred'
  | 'introduction'
  | 'inBetween'
  | 'atTheEnd'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
export type fewshotSerializationCreationAttributes = Optional<
  fewshotSerializationAttributes,
  fewshotSerializationOptionalAttributes
>

export class fewshotSerialization
  extends Model<
    fewshotSerializationAttributes,
    fewshotSerializationCreationAttributes
  >
  implements fewshotSerializationAttributes
{
  id!: number
  fewshotTaskId!: number
  name?: string
  isPreferred?: boolean
  introduction!: string
  beforeEachInput!: string[]
  inBetween!: string
  beforeEachOutput!: string[]
  atTheEnd!: string
  createdAt!: Date
  updatedAt!: Date
  deletedAt?: Date

  // fewshotSerialization belongsTo fewshotTask via fewshotTaskId
  fewshotTask!: fewshotTask
  getFewshotTask!: Sequelize.BelongsToGetAssociationMixin<fewshotTask>
  setFewshotTask!: Sequelize.BelongsToSetAssociationMixin<
    fewshotTask,
    fewshotTaskId
  >
  createFewshotTask!: Sequelize.BelongsToCreateAssociationMixin<fewshotTask>

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof fewshotSerialization {
    fewshotSerialization.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        fewshotTaskId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'fewshot_task',
            key: 'id',
          },
          field: 'fewshot_task_id',
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isPreferred: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: 'is_preferred',
        },
        introduction: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        beforeEachInput: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          field: 'before_each_input',
        },
        inBetween: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
          field: 'in_between',
        },
        beforeEachOutput: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          field: 'before_each_output',
        },
        atTheEnd: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
          field: 'at_the_end',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'fewshot_serialization',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          {
            name: 'fewshot_serialization_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    )
    return fewshotSerialization
  }
}
