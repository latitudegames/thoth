import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ratingAttributes {
  agent?: string;
  rating?: string;
}

export type ratingOptionalAttributes = "agent" | "rating";
export type ratingCreationAttributes = Optional<ratingAttributes, ratingOptionalAttributes>;

export class rating extends Model<ratingAttributes, ratingCreationAttributes> implements ratingAttributes {
  agent?: string;
  rating?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof rating {
    return rating.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rating',
    schema: 'public',
    timestamps: false
  });
  }
}
