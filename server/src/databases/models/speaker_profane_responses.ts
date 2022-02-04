import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface speaker_profane_responsesAttributes {
  agent?: string;
  response?: string;
}

export type speaker_profane_responsesOptionalAttributes = "agent" | "response";
export type speaker_profane_responsesCreationAttributes = Optional<speaker_profane_responsesAttributes, speaker_profane_responsesOptionalAttributes>;

export class speaker_profane_responses extends Model<speaker_profane_responsesAttributes, speaker_profane_responsesCreationAttributes> implements speaker_profane_responsesAttributes {
  agent?: string;
  response?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof speaker_profane_responses {
    return speaker_profane_responses.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'speaker_profane_responses',
    schema: 'public',
    timestamps: false
  });
  }
}
