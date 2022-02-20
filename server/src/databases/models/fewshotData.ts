import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

import type { fewshotTask, fewshotTaskId } from './fewshotTask'

export type fewshotDataAttributes = {
  id: number
  fewshotTaskId: number
  inputs: string[]
  outputs: string[]
  creator?: number
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type fewshotDataPk = 'id'
export type fewshotDataId = fewshotData[fewshotDataPk]
export type fewshotDataOptionalAttributes =
  | 'id'
  | 'creator'
  | 'tags'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
export type fewshotDataCreationAttributes = Optional<
  fewshotDataAttributes,
  fewshotDataOptionalAttributes
>

export class fewshotData
  extends Model<fewshotDataAttributes, fewshotDataCreationAttributes>
  implements fewshotDataAttributes
{
  id!: number
  fewshotTaskId!: number
  inputs!: string[]
  outputs!: string[]
  creator?: number
  tags?: string[]
  createdAt!: Date
  updatedAt!: Date
  deletedAt?: Date

  // fewshotData belongsTo fewshotTask via fewshotTaskId
  fewshotTask!: fewshotTask
  getFewshotTask!: Sequelize.BelongsToGetAssociationMixin<fewshotTask>
  setFewshotTask!: Sequelize.BelongsToSetAssociationMixin<
    fewshotTask,
    fewshotTaskId
  >
  createFewshotTask!: Sequelize.BelongsToCreateAssociationMixin<fewshotTask>

  static initModel(sequelize: Sequelize.Sequelize): typeof fewshotData {
    fewshotData.init(
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
        inputs: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
        },
        outputs: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
        },
        creator: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
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
        tableName: 'fewshot_data',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          {
            name: 'fewshot_data_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    )
    return fewshotData
  }
}
