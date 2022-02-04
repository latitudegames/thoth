import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface speaker_fact_summarizationAttributes {
  agent?: string;
  summarization?: string;
}

export type speaker_fact_summarizationOptionalAttributes = "agent" | "summarization";
export type speaker_fact_summarizationCreationAttributes = Optional<speaker_fact_summarizationAttributes, speaker_fact_summarizationOptionalAttributes>;

export class speaker_fact_summarization extends Model<speaker_fact_summarizationAttributes, speaker_fact_summarizationCreationAttributes> implements speaker_fact_summarizationAttributes {
  agent?: string;
  summarization?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof speaker_fact_summarization {
    return speaker_fact_summarization.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    summarization: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'speaker_fact_summarization',
    schema: 'public',
    timestamps: false
  });
  }
}
