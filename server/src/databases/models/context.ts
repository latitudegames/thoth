import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface contextAttributes {
  agent?: string;
  context?: string;
}

export type contextOptionalAttributes = "agent" | "context";
export type contextCreationAttributes = Optional<contextAttributes, contextOptionalAttributes>;

export class context extends Model<contextAttributes, contextCreationAttributes> implements contextAttributes {
  agent?: string;
  context?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof context {
    return context.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'context',
    schema: 'public',
    timestamps: false
  });
  }
}
