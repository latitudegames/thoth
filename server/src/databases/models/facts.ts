import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface factsAttributes {
  agent?: string;
  facts?: string;
}

export type factsOptionalAttributes = "agent" | "facts";
export type factsCreationAttributes = Optional<factsAttributes, factsOptionalAttributes>;

export class facts extends Model<factsAttributes, factsCreationAttributes> implements factsAttributes {
  agent?: string;
  facts?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof facts {
    return facts.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facts: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'facts',
    schema: 'public',
    timestamps: false
  });
  }
}
