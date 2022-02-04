import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface configAttributes {
  _key?: string;
  _value?: string;
}

export type configOptionalAttributes = "_key" | "_value";
export type configCreationAttributes = Optional<configAttributes, configOptionalAttributes>;

export class config extends Model<configAttributes, configCreationAttributes> implements configAttributes {
  _key?: string;
  _value?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof config {
    return config.init({
    _key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _value: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'config',
    schema: 'public',
    timestamps: false
  });
  }
}
