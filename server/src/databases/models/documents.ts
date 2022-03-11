import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface documentsAttributes {
  id: number
  description: string
  keywords: string
  is_included: boolean
  storeId: number
}

export type documentsOptionalAttributes = 'description' | 'keywords'
export type documentsCreationAttributes = Optional<
  documentsAttributes,
  documentsOptionalAttributes
>

export class documents
  extends Model<documentsAttributes, documentsCreationAttributes>
  implements documentsAttributes {
  id: number
  description: string
  keywords: string
  is_included: boolean
  storeId: number

  static initModel(sequelize: Sequelize.Sequelize): typeof documents {
    return documents.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        keywords: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_included: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        storeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'documents_store',
            key: 'id'
          },
          field: 'store_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      {
        sequelize,
        tableName: 'documents',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}
