import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface speakers_modelAttributes {
  agent?: string;
  speaker?: string;
  model?: string;
}

export type speakers_modelOptionalAttributes = "agent" | "speaker" | "model";
export type speakers_modelCreationAttributes = Optional<speakers_modelAttributes, speakers_modelOptionalAttributes>;

export class speakers_model extends Model<speakers_modelAttributes, speakers_modelCreationAttributes> implements speakers_modelAttributes {
  agent?: string;
  speaker?: string;
  model?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof speakers_model {
    return speakers_model.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    speaker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    model: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'speakers_model',
    schema: 'public',
    timestamps: false
  });
  }
}
