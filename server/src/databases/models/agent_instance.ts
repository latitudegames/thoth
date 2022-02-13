import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface agent_instanceAttributes {
  id?: number
  instanceId?: number
  personality?: string
  clients?: string
  enabled?: boolean
  updated_at?: string
  discord_enabled?: boolean
  discord_api_key?: string
  discord_spell_handler?: string

}

export type agent_instancePk = 'id'
export type agent_instanceId = agent_instance[agent_instancePk]
export type agent_instanceOptionalAttributes =
  | 'id'
  | 'personality'
  | 'clients'
  | 'enabled'
  | 'updated_at'
export type agent_instanceCreationAttributes = Optional<
  agent_instanceAttributes,
  agent_instanceOptionalAttributes
>

export class agent_instance
  extends Model<agent_instanceAttributes, agent_instanceCreationAttributes>
  implements agent_instanceAttributes {
  id?: number
  instanceId?: number
  personality?: string
  clients?: string
  enabled?: boolean
  updated_at?: string
  discord_enabled?: boolean
  discord_api_key?: string
  discord_spell_handler?: string
  static initModel(sequelize: Sequelize.Sequelize): typeof agent_instance {
    return agent_instance.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        personality: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        clients: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        discord_api_key: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler: {
          type: DataTypes.TEXT,
          allowNull: true,
        }
      },
      {
        sequelize,
        tableName: 'agent_instance',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}
