import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface actionsAttributes {
  agent?: string;
  actions?: string;
}

export type actionsOptionalAttributes = "agent" | "actions";
export type actionsCreationAttributes = Optional<actionsAttributes, actionsOptionalAttributes>;

export class actions extends Model<actionsAttributes, actionsCreationAttributes> implements actionsAttributes {
  agent?: string;
  actions?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof actions {
    return actions.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    actions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'actions',
    schema: 'public',
    timestamps: false
  });
  }
}
