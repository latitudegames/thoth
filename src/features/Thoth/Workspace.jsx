import { Editor } from "../../contexts/Rete";
import { Layout } from "../../contexts/Layout";
import StateManager from "./windows/StateManager";
import Playtest from "./windows/Playtest";
import Inspector from "./windows/Inspector/Inspector";
import EditorWindow from "./windows/EditorWindow/EditorWindow";

import TextEditor from "./windows/TextEditor";
import WorkspaceProvider from "../../contexts/WorkspaceProvider";

const Workspace = ({ tab }) => {
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
    <WorkspaceProvider tab={tab}>
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </WorkspaceProvider>
  );
};

export default Workspace;
