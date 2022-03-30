import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface entitiesAttributes {
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
  discord_empty_responses?: string
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
  xrengine_starting_words?: string
  xrengine_empty_responses?: string
  twitter_client_enable?: boolean
  twitter_token?: string
  twitter_id?: string
  twitter_app_token?: string
  twitter_app_token_secret?: string
  twitter_access_token?: string
  twitter_access_token_secret?: string
  twitter_bot_name?: string
  twitter_bot_name_regex?: string
}

export type entitiesPk = 'id'
export type entitiesId = entities[entitiesPk]
export type entitiesOptionalAttributes =
  | 'discord_enabled'
  | 'discord_api_key'
  | 'discord_starting_words'
  | 'discord_bot_name_regex'
  | 'discord_bot_name'
  | 'discord_empty_responses'
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
  | 'twitter_client_enable'
  | 'twitter_token'
  | 'twitter_id'
  | 'twitter_app_token'
  | 'twitter_app_token_secret'
  | 'twitter_access_token'
  | 'twitter_access_token_secret'
  | 'twitter_bot_name'
  | 'twitter_bot_name_regex'
  | 'enabled'
  | 'updated_at'
export type entitiesCreationAttributes = Optional<
  entitiesAttributes,
  entitiesOptionalAttributes
>

export class entities
  extends Model<entitiesAttributes, entitiesCreationAttributes>
  implements entitiesAttributes {
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
  discord_empty_responses?: string
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
  xrengine_starting_words?: string
  xrengine_empty_responses?: string
  twitter_client_enable?: boolean
  twitter_token?: string
  twitter_id?: string
  twitter_app_token?: string
  twitter_app_token_secret?: string
  twitter_access_token?: string
  twitter_access_token_secret?: string
  twitter_bot_name?: string
  twitter_bot_name_regex?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof entities {
    return entities.init(
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
        discord_empty_responses: {
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
        xrengine_starting_words: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_empty_responses: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_client_enable: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        twitter_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_id: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_app_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_app_token_secret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_access_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_access_token_secret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'entities',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}
