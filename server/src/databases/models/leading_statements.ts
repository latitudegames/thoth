import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface leading_statementsAttributes {
  _statement?: string;
}

export type leading_statementsOptionalAttributes = "_statement";
export type leading_statementsCreationAttributes = Optional<leading_statementsAttributes, leading_statementsOptionalAttributes>;

export class leading_statements extends Model<leading_statementsAttributes, leading_statementsCreationAttributes> implements leading_statementsAttributes {
  _statement?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof leading_statements {
    return leading_statements.init({
    _statement: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'leading_statements',
    schema: 'public',
    timestamps: false
  });
  }
}
