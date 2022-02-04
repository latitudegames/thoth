import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface roomAttributes {
  agent?: string;
  room?: string;
}

export type roomOptionalAttributes = "agent" | "room";
export type roomCreationAttributes = Optional<roomAttributes, roomOptionalAttributes>;

export class room extends Model<roomAttributes, roomCreationAttributes> implements roomAttributes {
  agent?: string;
  room?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof room {
    return room.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    room: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'room',
    schema: 'public',
    timestamps: false
  });
  }
}
