import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface keywordsAttributes {
  word?: string;
  count?: string;
  agent?: string;
}

export type keywordsOptionalAttributes = "word" | "count" | "agent";
export type keywordsCreationAttributes = Optional<keywordsAttributes, keywordsOptionalAttributes>;

export class keywords extends Model<keywordsAttributes, keywordsCreationAttributes> implements keywordsAttributes {
  word?: string;
  count?: string;
  agent?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof keywords {
    return keywords.init({
    word: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    count: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    agent: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'keywords',
    schema: 'public',
    timestamps: false
  });
  }
}
