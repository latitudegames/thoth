import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface metaAttributes {
  agent?: string;
  speaker?: string;
  meta?: string;
}

export type metaOptionalAttributes = "agent" | "speaker" | "meta";
export type metaCreationAttributes = Optional<metaAttributes, metaOptionalAttributes>;

export class meta extends Model<metaAttributes, metaCreationAttributes> implements metaAttributes {
  agent?: string;
  speaker?: string;
  meta?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof meta {
    return meta.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    speaker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'meta',
    schema: 'public',
    timestamps: false
  });
  }
}
