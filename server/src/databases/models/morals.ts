import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface moralsAttributes {
  agent?: string;
  morals?: string;
}

export type moralsOptionalAttributes = "agent" | "morals";
export type moralsCreationAttributes = Optional<moralsAttributes, moralsOptionalAttributes>;

export class morals extends Model<moralsAttributes, moralsCreationAttributes> implements moralsAttributes {
  agent?: string;
  morals?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof morals {
    return morals.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    morals: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'morals',
    schema: 'public',
    timestamps: false
  });
  }
}
