import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agent_configAttributes {
  agent?: string;
  config?: string;
}

export type agent_configOptionalAttributes = "agent" | "config";
export type agent_configCreationAttributes = Optional<agent_configAttributes, agent_configOptionalAttributes>;

export class agent_config extends Model<agent_configAttributes, agent_configCreationAttributes> implements agent_configAttributes {
  agent?: string;
  config?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof agent_config {
    return agent_config.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    config: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agent_config',
    schema: 'public',
    timestamps: false
  });
  }
}
