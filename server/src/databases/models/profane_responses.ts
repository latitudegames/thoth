import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface profane_responsesAttributes {
  agent?: string;
  response?: string;
}

export type profane_responsesOptionalAttributes = "agent" | "response";
export type profane_responsesCreationAttributes = Optional<profane_responsesAttributes, profane_responsesOptionalAttributes>;

export class profane_responses extends Model<profane_responsesAttributes, profane_responsesCreationAttributes> implements profane_responsesAttributes {
  agent?: string;
  response?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof profane_responses {
    return profane_responses.init({
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
    tableName: 'profane_responses',
    schema: 'public',
    timestamps: false
  });
  }
}
