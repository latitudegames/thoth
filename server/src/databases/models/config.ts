import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface configAttributes {
  key?: string;
  value?: string;
}

export type configOptionalAttributes = "key" | "value";
export type configCreationAttributes = Optional<configAttributes, configOptionalAttributes>;

export class config extends Model<configAttributes, configCreationAttributes> implements configAttributes {
  key?: string;
  value?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof config {
    return config.init({
      key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      value: {
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
