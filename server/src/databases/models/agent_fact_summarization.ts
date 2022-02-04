import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agent_fact_summarizationAttributes {
  agent?: string;
  _sum?: string;
}

export type agent_fact_summarizationOptionalAttributes = "agent" | "_sum";
export type agent_fact_summarizationCreationAttributes = Optional<agent_fact_summarizationAttributes, agent_fact_summarizationOptionalAttributes>;

export class agent_fact_summarization extends Model<agent_fact_summarizationAttributes, agent_fact_summarizationCreationAttributes> implements agent_fact_summarizationAttributes {
  agent?: string;
  _sum?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof agent_fact_summarization {
    return agent_fact_summarization.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _sum: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agent_fact_summarization',
    schema: 'public',
    timestamps: false
  });
  }
}
