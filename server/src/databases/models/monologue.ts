import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface monologueAttributes {
  agent?: string;
  monologue?: string;
}

export type monologueOptionalAttributes = "agent" | "monologue";
export type monologueCreationAttributes = Optional<monologueAttributes, monologueOptionalAttributes>;

export class monologue extends Model<monologueAttributes, monologueCreationAttributes> implements monologueAttributes {
  agent?: string;
  monologue?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof monologue {
    return monologue.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    monologue: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'monologue',
    schema: 'public',
    timestamps: false
  });
  }
}
