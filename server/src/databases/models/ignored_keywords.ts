import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ignored_keywordsAttributes {
  agent?: string;
  keyword?: string;
}

export type ignored_keywordsOptionalAttributes = "agent" | "keyword";
export type ignored_keywordsCreationAttributes = Optional<ignored_keywordsAttributes, ignored_keywordsOptionalAttributes>;

export class ignored_keywords extends Model<ignored_keywordsAttributes, ignored_keywordsCreationAttributes> implements ignored_keywordsAttributes {
  agent?: string;
  keyword?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ignored_keywords {
    return ignored_keywords.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    keyword: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ignored_keywords',
    schema: 'public',
    timestamps: false
  });
  }
}
