import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sensitive_responsesAttributes {
  agent?: string;
  response?: string;
}

export type sensitive_responsesOptionalAttributes = "agent" | "response";
export type sensitive_responsesCreationAttributes = Optional<sensitive_responsesAttributes, sensitive_responsesOptionalAttributes>;

export class sensitive_responses extends Model<sensitive_responsesAttributes, sensitive_responsesCreationAttributes> implements sensitive_responsesAttributes {
  agent?: string;
  response?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof sensitive_responses {
    return sensitive_responses.init({
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
    tableName: 'sensitive_responses',
    schema: 'public',
    timestamps: false
  });
  }
}
