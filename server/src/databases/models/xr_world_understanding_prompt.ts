import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface xr_world_understanding_promptAttributes {
  _prompt?: string;
}

export type xr_world_understanding_promptOptionalAttributes = "_prompt";
export type xr_world_understanding_promptCreationAttributes = Optional<xr_world_understanding_promptAttributes, xr_world_understanding_promptOptionalAttributes>;

export class xr_world_understanding_prompt extends Model<xr_world_understanding_promptAttributes, xr_world_understanding_promptCreationAttributes> implements xr_world_understanding_promptAttributes {
  _prompt?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof xr_world_understanding_prompt {
    return xr_world_understanding_prompt.init({
      _prompt: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'xr_world_understanding_prompt',
      schema: 'public',
      timestamps: false
    });
  }
}
