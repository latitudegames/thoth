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
  const { activeTab, tabs } = useTabManager();

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

  if (!activeTab) return <LoadingScreen />;

  return (
    <TabLayout data-layout>
      {!empty &&
        tabs.map((tab, i) => (
          <Layout
            json={tab.layoutJson}
            factory={factory(tab)}
            tab={tab}
            key={i}
          />
        ))}
    </TabLayout>
  );
};

export default Thoth;
