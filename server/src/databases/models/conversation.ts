import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface conversationAttributes {
  agent?: string;
  client?: string;
  channel?: string;
  sender?: string;
  text?: string;
  archive?: boolean;
  date?: string;
}

export type conversationOptionalAttributes = "agent" | "client" | "channel" | "sender" | "text" | "archive" | "date";
export type conversationCreationAttributes = Optional<conversationAttributes, conversationOptionalAttributes>;

export class conversation extends Model<conversationAttributes, conversationCreationAttributes> implements conversationAttributes {
  agent?: string;
  client?: string;
  channel?: string;
  sender?: string;
  text?: string;
  archive?: boolean;
  date?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof conversation {
    return conversation.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    channel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sender: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    archive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'conversation',
    schema: 'public',
    timestamps: false
  });
  }
}
