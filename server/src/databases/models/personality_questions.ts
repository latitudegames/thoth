import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface personality_questionsAttributes {
  _index?: number;
  questions?: string;
}

export type personality_questionsOptionalAttributes = "_index" | "questions";
export type personality_questionsCreationAttributes = Optional<personality_questionsAttributes, personality_questionsOptionalAttributes>;

export class personality_questions extends Model<personality_questionsAttributes, personality_questionsCreationAttributes> implements personality_questionsAttributes {
  _index?: number;
  questions?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof personality_questions {
    return personality_questions.init({
    _index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personality_questions',
    schema: 'public',
    timestamps: false
  });
  }
}
