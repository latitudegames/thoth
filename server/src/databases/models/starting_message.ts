import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface starting_messageAttributes {
  agent?: string;
  _message?: string;
}

export type starting_messageOptionalAttributes = "agent" | "_message";
export type starting_messageCreationAttributes = Optional<starting_messageAttributes, starting_messageOptionalAttributes>;

export class starting_message extends Model<starting_messageAttributes, starting_messageCreationAttributes> implements starting_messageAttributes {
  agent?: string;
  _message?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof starting_message {
    return starting_message.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'starting_message',
    schema: 'public',
    timestamps: false
  });
  }
}
