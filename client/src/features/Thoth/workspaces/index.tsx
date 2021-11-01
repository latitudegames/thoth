import WorkspaceProvider from '../contexts/WorkspaceProvider'
import TabLayout from '@common/TabLayout/TabLayout'
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
            key={tab.name}
            style={{
              visibility: tab.id !== activeTab ? 'hidden' : undefined,
              height: '100%',
            }}
          >
            <WorkspaceProvider {...props}>
              <Workspace {...props} />
            </WorkspaceProvider>
          </div>
        )
      })}
    </TabLayout>
  )
}

export default Workspaces
