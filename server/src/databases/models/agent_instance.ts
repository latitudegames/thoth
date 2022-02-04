import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agent_instanceAttributes {
  id?: number;
  personality?: string;
  clients?: string;
  enabled?: boolean;
}

export type agent_instancePk = "id";
export type agent_instanceId = agent_instance[agent_instancePk];
export type agent_instanceOptionalAttributes = "id" | "personality" | "clients" | "enabled";
export type agent_instanceCreationAttributes = Optional<agent_instanceAttributes, agent_instanceOptionalAttributes>;

export class agent_instance extends Model<agent_instanceAttributes, agent_instanceCreationAttributes> implements agent_instanceAttributes {
  id?: number;
  personality?: string;
  clients?: string;
  enabled?: boolean;


  static initModel(sequelize: Sequelize.Sequelize): typeof agent_instance {
    return agent_instance.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    personality: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clients: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agent_instance',
    schema: 'public',
    timestamps: false
  });
  }
}
