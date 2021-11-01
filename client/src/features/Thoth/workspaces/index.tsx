import TabLayout from '../../common/TabLayout/TabLayout'
import Composer from './composer'

const workspaceMap = {
  spell: Composer,
  module: Composer,
}

const Workspaces = ({ tabs, pubSub, activeTab }) => {
  return (
    <TabLayout>
      {tabs.map(tab => {
        const Workspace = workspaceMap[tab.type]

        return (
          <div
            style={{
              visibility: tab.id !== activeTab ? 'hidden' : undefined,
              height: '100%',
            }}
          >
            <Workspace
              tabs={tabs}
              appPubSub={pubSub}
              activeTab={activeTab}
              tab={tab}
            />
          </div>
        )
      })}
    </TabLayout>
  )
}

export default Workspaces
