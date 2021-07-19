import TabLayout from "../common/TabLayout/TabLayout";
import { useTabManager } from "../../contexts/TabManagerProvider";
import { usePubSub } from "../../contexts/PubSubProvider";
import Workspace from "./Workspace";
import LoadingScreen from "../common/LoadingScreen/LoadingScreen";

const Thoth = ({ empty, workspace = "default" }) => {
  const { activeTab, tabs } = useTabManager();
  const pubSub = usePubSub();

  if (!activeTab) return <LoadingScreen />;

  return (
    <TabLayout>
      {!empty &&
        tabs.map((tab, i) => (
          <Workspace tab={tab} key={`${i}-${tab.name}`} globalPubSub={pubSub} />
        ))}
    </TabLayout>
  );
};

export default Thoth;
