import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface relationship_matrixAttributes {
  agent?: string;
  matrix?: string;
  speaker?: string;
}

export type relationship_matrixOptionalAttributes = "agent" | "matrix" | "speaker";
export type relationship_matrixCreationAttributes = Optional<relationship_matrixAttributes, relationship_matrixOptionalAttributes>;

export class relationship_matrix extends Model<relationship_matrixAttributes, relationship_matrixCreationAttributes> implements relationship_matrixAttributes {
  agent?: string;
  matrix?: string;
  speaker?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof relationship_matrix {
    return relationship_matrix.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    matrix: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    speaker: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'relationship_matrix',
    schema: 'public',
    timestamps: false
  });
  }
}
