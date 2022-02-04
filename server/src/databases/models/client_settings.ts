import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface client_settingsAttributes {
  client?: string;
  _name?: string;
  _type?: string;
  _defaultvalue?: string;
}

export type client_settingsOptionalAttributes = "client" | "_name" | "_type" | "_defaultvalue";
export type client_settingsCreationAttributes = Optional<client_settingsAttributes, client_settingsOptionalAttributes>;

export class client_settings extends Model<client_settingsAttributes, client_settingsCreationAttributes> implements client_settingsAttributes {
  client?: string;
  _name?: string;
  _type?: string;
  _defaultvalue?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof client_settings {
    return client_settings.init({
    client: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _defaultvalue: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'client_settings',
    schema: 'public',
    timestamps: false
  });
  }
}
