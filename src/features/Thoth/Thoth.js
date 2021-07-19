import TabLayout from "../common/TabLayout/TabLayout";
import { useTabManager } from "../../contexts/TabManagerProvider";
import Workspace from "./Workspace";
import LoadingScreen from "../common/LoadingScreen/LoadingScreen";

const Thoth = ({ empty, workspace = "default" }) => {
  const { activeTab, tabs } = useTabManager();
  if (!activeTab) return <LoadingScreen />;

  return (
    <TabLayout>
      {!empty &&
        tabs.map((tab, i) => <Workspace tab={tab} key={`${i}-${tab.name}`} />)}
    </TabLayout>
  );
};

export default Thoth;
