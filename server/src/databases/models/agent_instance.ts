import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface agent_instanceAttributes {
  id?: number
  instanceId?: number
  personality?: string
  enabled?: boolean
  updated_at?: string
  dirty?: boolean
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_spell_handler_incoming?: string
  discord_spell_handler_update?: string
  discord_spell_handler_feed?: string
  xrengine_enabled?: boolean
  xrengine_url?: string
  xrengine_spell_handler_incoming?: string
  xrengine_spell_handler_update?: string
  xrengine_spell_handler_feed?: string
  xrengine_bot_name?: string
  xrengine_bot_name_regex?: string
}

export type agent_instancePk = 'id'
export type agent_instanceId = agent_instance[agent_instancePk]
export type agent_instanceOptionalAttributes =
  | 'discord_enabled'
  | 'discord_api_key'
  | 'discord_starting_words'
  | 'discord_bot_name_regex'
  | 'discord_bot_name'
  | 'discord_spell_handler_incoming'
  | 'discord_spell_handler_update'
  | 'discord_spell_handler_feed'
  | 'xrengine_enabled'
  | 'xrengine_url'
  | 'xrengine_spell_handler_incoming'
  | 'xrengine_spell_handler_update'
  | 'xrengine_spell_handler_feed'
  | 'xrengine_bot_name'
  | 'xrengine_bot_name_regex'
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
  enabled?: boolean
  updated_at?: string
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_spell_handler_incoming?: string
  discord_spell_handler_update?: string
  discord_spell_handler_feed?: string
  xrengine_enabled?: boolean
  xrengine_url?: string
  xrengine_spell_handler_incoming?: string
  xrengine_spell_handler_update?: string
  xrengine_spell_handler_feed?: string
  xrengine_bot_name?: string
  xrengine_bot_name_regex?: string
  static initModel(sequelize: Sequelize.Sequelize): typeof agent_instance {
    return agent_instance.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        dirty: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        personality: {
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
        discord_starting_words: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_update: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_feed: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        xrengine_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_update: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_feed: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
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
