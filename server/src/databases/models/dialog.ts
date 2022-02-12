import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface dialogueAttributes {
  agent?: string;
  dialog?: string;
}

export type dialogueOptionalAttributes = "agent" | "dialog";
export type dialogueCreationAttributes = Optional<dialogueAttributes, dialogueOptionalAttributes>;

export class dialog extends Model<dialogueAttributes, dialogueCreationAttributes> implements dialogueAttributes {
  agent?: string;
  dialog?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof dialog {
    return dialog.init({
      agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dialog: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'dialog',
      schema: 'public',
      timestamps: false
    });
  }
}
