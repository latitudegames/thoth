import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ethicsAttributes {
  agent?: string;
  ethics?: string;
}

export type ethicsOptionalAttributes = "agent" | "ethics";
export type ethicsCreationAttributes = Optional<ethicsAttributes, ethicsOptionalAttributes>;

export class ethics extends Model<ethicsAttributes, ethicsCreationAttributes> implements ethicsAttributes {
  agent?: string;
  ethics?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ethics {
    return ethics.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ethics: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ethics',
    schema: 'public',
    timestamps: false
  });
  }
}
