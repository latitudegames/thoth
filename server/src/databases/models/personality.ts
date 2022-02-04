import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface personalityAttributes {
  agent?: string;
  personality?: string;
}

export type personalityOptionalAttributes = "agent" | "personality";
export type personalityCreationAttributes = Optional<personalityAttributes, personalityOptionalAttributes>;

export class personality extends Model<personalityAttributes, personalityCreationAttributes> implements personalityAttributes {
  agent?: string;
  personality?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof personality {
    return personality.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    personality: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personality',
    schema: 'public',
    timestamps: false
  });
  }
}
