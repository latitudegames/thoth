import { Editor } from "../../contexts/Rete";
import { Layout } from "../../contexts/Layout";
import StateManager from "./windows/StateManager";
import Playtest from "./windows/Playtest";
import Inspector from "./windows/Inspector/Inspector";
import EditorWindow from "./windows/EditorWindow/EditorWindow";

import TabLayout from "../common/TabLayout/TabLayout";
import TextEditor from "./windows/TextEditor";

import { useTabManager } from "../../contexts/TabManager";
import LoadingScreen from "../common/LoadingScreen/LoadingScreen";

const Thoth = ({ empty, workspace = "default" }) => {
  const { activeTab } = useTabManager();

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
      case "editorWindow":
        return <EditorWindow />;
      default:
        return <p></p>;
    }
  };

  if (!activeTab) return <LoadingScreen />;

  return (
    <TabLayout>
      {!empty && <Layout json={activeTab.layoutJson} factory={factory} />}
    </TabLayout>
  );
};

export default Thoth;
