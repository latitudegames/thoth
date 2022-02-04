import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface speakers_facts_archiveAttributes {
  agent?: string;
  speaker?: string;
  facts?: string;
}

export type speakers_facts_archiveOptionalAttributes = "agent" | "speaker" | "facts";
export type speakers_facts_archiveCreationAttributes = Optional<speakers_facts_archiveAttributes, speakers_facts_archiveOptionalAttributes>;

export class speakers_facts_archive extends Model<speakers_facts_archiveAttributes, speakers_facts_archiveCreationAttributes> implements speakers_facts_archiveAttributes {
  agent?: string;
  speaker?: string;
  facts?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof speakers_facts_archive {
    return speakers_facts_archive.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    speaker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facts: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'speakers_facts_archive',
    schema: 'public',
    timestamps: false
  });
  }
}
