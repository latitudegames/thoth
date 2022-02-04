import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface speakers_factsAttributes {
  agent?: string;
  speaker?: string;
  facts?: string;
}

export type speakers_factsOptionalAttributes = "agent" | "speaker" | "facts";
export type speakers_factsCreationAttributes = Optional<speakers_factsAttributes, speakers_factsOptionalAttributes>;

export class speakers_facts extends Model<speakers_factsAttributes, speakers_factsCreationAttributes> implements speakers_factsAttributes {
  agent?: string;
  speaker?: string;
  facts?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof speakers_facts {
    return speakers_facts.init({
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
    tableName: 'speakers_facts',
    schema: 'public',
    timestamps: false
  });
  }
}
