import { useRef, useEffect } from "react";
import { Editor } from "../../contexts/Rete";
import { Layout } from "../../contexts/Layout";
import StateManager from "./windows/StateManager";
import Playtest from "./windows/Playtest";
import Inspector from "./windows/Inspector/Inspector";
import EditorWindow from "./windows/EditorWindow/EditorWindow";

import TextEditor from "./windows/TextEditor";
import WorkspaceProvider from "../../contexts/WorkspaceProvider";
import { useSpell } from "../../contexts/Spell";
import { useRete } from "../../contexts/Rete";

const Workspace = ({ tab, isActive }) => {
  const tabRef = useRef(tab);
  const { saveSpell } = useSpell();
  const { editor } = useRete();

  // Set up autosave for the workspace
  useEffect(() => {
    if (!editor.on || !tabRef.current) return;
    console.log("editor", editor.on);
    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved nodetranslated",
      () => {
        // Use a tab ref here because otherwise the state is stale inside the callback function.
        // Handy pattern to remember when wanting to set things like callbacks, etc.
        saveSpell(tabRef.current.spell, { graph: editor.toJSON() }, false);
      }
    );
  }, [editor, tabRef]);

  const factory = (tab) => {
    return (node) => {
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
        case "editorWindow":
          return <EditorWindow tab={tab} />;
        default:
          return <p></p>;
      }
    };
  };

  return (
    <div style={{ visibility: !tab.active ? "hidden" : null, height: "100%" }}>
      <WorkspaceProvider tab={tab}>
        <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
      </WorkspaceProvider>
    </div>
  );
};

export default Workspace;
