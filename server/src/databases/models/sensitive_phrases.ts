import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sensitive_phrasesAttributes {
  phrase?: string;
}

export type sensitive_phrasesOptionalAttributes = "phrase";
export type sensitive_phrasesCreationAttributes = Optional<sensitive_phrasesAttributes, sensitive_phrasesOptionalAttributes>;

export class sensitive_phrases extends Model<sensitive_phrasesAttributes, sensitive_phrasesCreationAttributes> implements sensitive_phrasesAttributes {
  phrase?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof sensitive_phrases {
    return sensitive_phrases.init({
    phrase: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sensitive_phrases',
    schema: 'public',
    timestamps: false
  });
  }
}
