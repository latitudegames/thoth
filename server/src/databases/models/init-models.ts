import type { Sequelize } from "sequelize";
import type { chainsAttributes, chainsCreationAttributes } from "./chains";
import chains from "./chains";
import type { deployedSpellsAttributes, deployedSpellsCreationAttributes } from "./deployedSpells";
import deployedSpells from "./deployedSpells";

export {
  chains,
  deployedSpells,
};
export type {
  chainsAttributes,
  chainsCreationAttributes,
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
};


export function initModels(sequelize: Sequelize) {
  chains.initModel(sequelize);
  deployedSpells.initModel(sequelize);

  return {
    chains: chains,
    deployedSpells: deployedSpells,
  };
}
