import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface needs_motivationsAttributes {
  agent?: string;
  needs_motivations?: string;
}

export type needs_motivationsOptionalAttributes = "agent" | "needs_motivations";
export type needs_motivationsCreationAttributes = Optional<needs_motivationsAttributes, needs_motivationsOptionalAttributes>;

export class needs_motivations extends Model<needs_motivationsAttributes, needs_motivationsCreationAttributes> implements needs_motivationsAttributes {
  agent?: string;
  needs_motivations?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof needs_motivations {
    return needs_motivations.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    needs_motivations: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'needs_motivations',
    schema: 'public',
    timestamps: false
  });
  }
}
