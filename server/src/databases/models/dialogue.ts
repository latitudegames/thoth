import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface dialogueAttributes {
  agent?: string;
  dialogue?: string;
}

export type dialogueOptionalAttributes = "agent" | "dialogue";
export type dialogueCreationAttributes = Optional<dialogueAttributes, dialogueOptionalAttributes>;

export class dialogue extends Model<dialogueAttributes, dialogueCreationAttributes> implements dialogueAttributes {
  agent?: string;
  dialogue?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof dialogue {
    return dialogue.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dialogue: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dialogue',
    schema: 'public',
    timestamps: false
  });
  }
}
