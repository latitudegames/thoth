import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface xr_engine_room_promptAttributes {
  _prompt?: string;
}

export type xr_engine_room_promptOptionalAttributes = "_prompt";
export type xr_engine_room_promptCreationAttributes = Optional<xr_engine_room_promptAttributes, xr_engine_room_promptOptionalAttributes>;

export class xr_engine_room_prompt extends Model<xr_engine_room_promptAttributes, xr_engine_room_promptCreationAttributes> implements xr_engine_room_promptAttributes {
  _prompt?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof xr_engine_room_prompt {
    return xr_engine_room_prompt.init({
    _prompt: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'xr_engine_room_prompt',
    schema: 'public',
    timestamps: false
  });
  }
}
