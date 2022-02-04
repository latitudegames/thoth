import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface opinion_form_promptAttributes {
  _prompt?: string;
}

export type opinion_form_promptOptionalAttributes = "_prompt";
export type opinion_form_promptCreationAttributes = Optional<opinion_form_promptAttributes, opinion_form_promptOptionalAttributes>;

export class opinion_form_prompt extends Model<opinion_form_promptAttributes, opinion_form_promptCreationAttributes> implements opinion_form_promptAttributes {
  _prompt?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof opinion_form_prompt {
    return opinion_form_prompt.init({
    _prompt: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'opinion_form_prompt',
    schema: 'public',
    timestamps: false
  });
  }
}
