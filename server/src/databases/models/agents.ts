import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface agentsAttributes {
  agent?: string;
  dialog?: string;
  facts?: string;
  monologue?: string;
  morals?: string;
  profanity_responses?: string;
  sensitive_phrases?: string;
  sensitive_responses?: string;
  sensitive_words?: string;
  bad_words?: string;
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
      },
      dialog: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      facts: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      monologue: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      morals: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      profanity_responses: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sensitive_phrases: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sensitive_responses: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sensitive_words: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bad_words: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'agents',
      schema: 'public',
      timestamps: false
    });
  }
}