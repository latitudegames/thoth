import { useRete, Editor } from "../../contexts/Rete";
import { Layout, useLayout } from "../../contexts/Layout";
import { useSpell } from "../../contexts/Spell";
import StateManager from "./windows/StateManager";
import Playtest from "./windows/Playtest";
import Inspector from "./windows/Inspector/Inspector";

import defaultJson from "./layout.json";
import TabLayout from "../common/TabLayout/TabLayout";
import TextEditor from "./windows/TextEditor";

const Spell = () => {
  const { serialize } = useRete();
  const { createOrFocus, componentTypes } = useLayout();
  const { saveCurrentSpell } = useSpell();

  const onSave = () => {
    const serialized = serialize();
    saveCurrentSpell({ graph: serialized });
  };

  const onSerialize = () => {
    const serialized = serialize();
    console.log(JSON.stringify(serialized));
  };

  const toolbar = (
    <>
      <button className="option" onClick={onSave}>
        Save
      </button>
      <button className="option">Load</button>
      <button className="option" onClick={onSerialize}>
        Export
      </button>
    </>
  );

  const onStateManager = () => {
    createOrFocus(componentTypes.STATE_MANAGER, "State Manager");
  };

  const onPlaytest = () => {
    createOrFocus(componentTypes.PLAYTEST, "Playtest");
  };

  const onInspector = () => {
    createOrFocus(componentTypes.INSPECTOR, "Inspector");
  };

  const onTextEditor = () => {
    createOrFocus(componentTypes.TEXT_EDITOR, "Text Editor");
  };

  const options = (
    <>
      <button className="option" onClick={onStateManager}>
        State Manager
      </button>
      <button className="option" onClick={onPlaytest}>
        Playtest
      </button>
      <button className="option" onClick={onInspector}>
        Inspector
      </button>
      <button className="option" onClick={onTextEditor}>
        Text Editor
      </button>
    </>
  );

  const factory = (node) => {
    const component = node.getComponent();
    switch (component) {
      case "editor":
        return <Editor />;
      case "stateManager":
        return <StateManager node={node} />;
      case "playtest":
        return <Playtest />;
      case "inspector":
        return <Inspector node={node} />;
      case "textEditor":
        return <TextEditor node={node} />;
      default:
        return <p></p>;
    }
  };

  return (
    <TabLayout options={options} toolbar={toolbar}>
      <Layout json={defaultJson} factory={factory} />
    </TabLayout>
  );
};

export default Spell;
