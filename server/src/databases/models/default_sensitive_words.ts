import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sensitive_wordsAttributes {
  word?: string;
}

export type sensitive_wordsOptionalAttributes = "word";
export type sensitive_wordsCreationAttributes = Optional<sensitive_wordsAttributes, sensitive_wordsOptionalAttributes>;

export class default_sensitive_words extends Model<sensitive_wordsAttributes, sensitive_wordsCreationAttributes> implements sensitive_wordsAttributes {
  word?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof default_sensitive_words {
    return default_sensitive_words.init({
      word: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'default_sensitive_words',
      schema: 'public',
      timestamps: false
    });
  }
}
