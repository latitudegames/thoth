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

        const props = {
          tabs,
          pubSub,
          tab,
        }

        return (
          <div
            style={{
              visibility: tab.id !== activeTab ? 'hidden' : undefined,
              height: '100%',
            }}
          >
            <Workspace {...props} />
          </div>
        )
      })}
    </TabLayout>
  )
}

export default Workspaces
