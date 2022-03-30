import { creatorToolsDatabase } from '../databases/creatorTools';
import { Module } from '../routes/chains/module';
import { buildThothInterface, extractModuleInputKeys } from '../routes/chains/runChain';
import { Graph } from '../routes/chains/types';
import { CustomError } from '../utils/CustomError';

export const CreateSpellHandler = async (props: { spell: any; version: string; }) => {
  let rootSpell;
  const { spell, version = 'latest' } = props;
  rootSpell = await creatorToolsDatabase.chains.findOne({
    where: { name: spell },
  });

  // eslint-disable-next-line functional/no-let
  let activeSpell;

  if (version === 'latest') {
    console.log('latest');
    activeSpell = rootSpell;
  } else {
    console.log('getting active spell');
    activeSpell = await creatorToolsDatabase.deployedSpells.findOne({
      where: { name: spell, version },
    });
  }

  //todo validate spell has an input trigger?
  if (!activeSpell?.chain) {
    throw new CustomError(
      'not-found',
      `Spell with name ${spell} and version ${version} not found`
    );
  }

  // TODO use test spells if body option is given
  // const activeSpell = getTestSpell(spell)
  const chain = activeSpell.chain as Graph;
  const modules = activeSpell.modules as Module[];

  const gameState = {
    ...rootSpell?.gameState
  };

  const thoth = buildThothInterface(null as any, gameState);

  const inputKeys = extractModuleInputKeys(chain) as string[];

  return { spell: activeSpell, chain, thoth, inputKeys, };
};
