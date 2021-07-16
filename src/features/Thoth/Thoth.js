import { navigate } from "hookrouter";
import { useEffect } from "react";

import { Editor } from "../../contexts/Rete";
import { Layout } from "../../contexts/Layout";
import StateManager from "./windows/StateManager";
import Playtest from "./windows/Playtest";
import Inspector from "./windows/Inspector/Inspector";

import TabLayout from "../common/TabLayout/TabLayout";
import TextEditor from "./windows/TextEditor";
import { useTabManager } from "../../contexts/TabManager";
import { useSpell } from "../../contexts/Spell";
import { useRete } from "../../contexts/Rete";

const Thoth = ({ empty, workspace = "default" }) => {
  const { tabs, activeTab } = useTabManager();
  const { loadSpell } = useSpell();
  const { editor } = useRete();

  // reroute to home if no tabs open
  useEffect(() => {
    if (tabs.length === 0 || !activeTab) {
      navigate("/home");
    }
  }, [tabs]);

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
    <TabLayout>
      {!empty && <Layout json={activeTab.layoutJson} factory={factory} />}
    </TabLayout>
  );
};

export default Thoth;
