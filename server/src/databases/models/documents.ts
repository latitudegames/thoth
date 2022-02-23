import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface documentsAttributes {
  id: number
  agent: string
  document: string
  metadata: string
  keywords: string
  topic: string
}

export type documentsOptionalAttributes = 'agent'
export type documentsCreationAttributes = Optional<
  documentsAttributes,
  documentsOptionalAttributes
>

export class documents
  extends Model<documentsAttributes, documentsCreationAttributes>
  implements documentsAttributes
{
  id: number
  agent: string
  document: string
  metadata: string
  keywords: string
  topic: string

  static initModel(sequelize: Sequelize.Sequelize): typeof documents {
    return documents.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
        },
        agent: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        document: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        keywords: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        topic: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
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
