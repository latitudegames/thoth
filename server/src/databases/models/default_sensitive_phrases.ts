import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sensitive_phrasesAttributes {
  phrase?: string;
}

export type sensitive_phrasesOptionalAttributes = "phrase";
export type sensitive_phrasesCreationAttributes = Optional<sensitive_phrasesAttributes, sensitive_phrasesOptionalAttributes>;

export class default_sensitive_phrases extends Model<sensitive_phrasesAttributes, sensitive_phrasesCreationAttributes> implements sensitive_phrasesAttributes {
  phrase?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof default_sensitive_phrases {
    return default_sensitive_phrases.init({
      phrase: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'default_sensitive_phrases',
      schema: 'public',
      timestamps: false
    });
  }
}
