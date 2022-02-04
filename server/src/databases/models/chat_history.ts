import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface chat_historyAttributes {
  client_name?: string;
  chat_id?: string;
  message_id?: string;
  global_message_id?: string;
  sender?: string;
  content?: string;
  createdat?: string;
}

export type chat_historyOptionalAttributes = "client_name" | "chat_id" | "message_id" | "global_message_id" | "sender" | "content" | "createdat";
export type chat_historyCreationAttributes = Optional<chat_historyAttributes, chat_historyOptionalAttributes>;

export class chat_history extends Model<chat_historyAttributes, chat_historyCreationAttributes> implements chat_historyAttributes {
  client_name?: string;
  chat_id?: string;
  message_id?: string;
  global_message_id?: string;
  sender?: string;
  content?: string;
  createdat?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof chat_history {
    return chat_history.init({
    client_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chat_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    message_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    global_message_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sender: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdat: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chat_history',
    schema: 'public',
    timestamps: false
  });
  }
}
