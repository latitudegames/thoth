import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agentsAttributes {
  agent?: string;
}

export type agentsOptionalAttributes = "agent";
export type agentsCreationAttributes = Optional<agentsAttributes, agentsOptionalAttributes>;

export class agents extends Model<agentsAttributes, agentsCreationAttributes> implements agentsAttributes {
  agent?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof agents {
    return agents.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agents',
    schema: 'public',
    timestamps: false
  });
  }
}
