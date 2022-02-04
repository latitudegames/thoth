import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agent_factsAttributes {
  agent?: string;
  facts?: string;
}

export type agent_factsOptionalAttributes = "agent" | "facts";
export type agent_factsCreationAttributes = Optional<agent_factsAttributes, agent_factsOptionalAttributes>;

export class agent_facts extends Model<agent_factsAttributes, agent_factsCreationAttributes> implements agent_factsAttributes {
  agent?: string;
  facts?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof agent_facts {
    return agent_facts.init({
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
    tableName: 'agent_facts',
    schema: 'public',
    timestamps: false
  });
  }
}
