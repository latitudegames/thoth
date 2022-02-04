import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agent_facts_archiveAttributes {
  agent?: string;
  facts?: string;
}

export type agent_facts_archiveOptionalAttributes = "agent" | "facts";
export type agent_facts_archiveCreationAttributes = Optional<agent_facts_archiveAttributes, agent_facts_archiveOptionalAttributes>;

export class agent_facts_archive extends Model<agent_facts_archiveAttributes, agent_facts_archiveCreationAttributes> implements agent_facts_archiveAttributes {
  agent?: string;
  facts?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof agent_facts_archive {
    return agent_facts_archive.init({
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
    tableName: 'agent_facts_archive',
    schema: 'public',
    timestamps: false
  });
  }
}
