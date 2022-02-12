import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface starting_messageAttributes {
  agent?: string;
  message?: string;
}

export type starting_messageOptionalAttributes = "agent" | "message";
export type starting_messageCreationAttributes = Optional<starting_messageAttributes, starting_messageOptionalAttributes>;

export class default_starting_message extends Model<starting_messageAttributes, starting_messageCreationAttributes> implements starting_messageAttributes {
  agent?: string;
  message?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof default_starting_message {
    return default_starting_message.init({
      agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'default_starting_message',
      schema: 'public',
      timestamps: false
    });
  }
}
