import { useHotkeys } from 'react-hotkeys-hook'

import { usePubSub } from '../../contexts/PubSubProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import LoadingScreen from '../common/LoadingScreen/LoadingScreen'
import TabLayout from '../common/TabLayout/TabLayout'
import Workspace from './components/Workspace'

const Thoth = ({ empty }) => {
  const { activeTab, tabs } = useTabManager()
  const pubSub = usePubSub()

  const { events, publish } = pubSub

  useHotkeys(
    'Control+z',
    () => {
      if (!pubSub || !activeTab) return

      publish(events.$UNDO(activeTab.id))
    },
    [pubSub, activeTab]
  )

  useHotkeys(
    'Control+Shift+z',
    () => {
      if (!pubSub || !activeTab) return
      publish(events.$REDO(activeTab.id))
    },
    [pubSub, activeTab]
  )

  if (!activeTab) return <LoadingScreen />

  return (
    <TabLayout>
      {!empty &&
        tabs.map((tab, i) => (
          <Workspace
            tab={tab}
            tabs={tabs}
            key={`${i}-${tab.name}`}
            appPubSub={pubSub}
          />
        ))}
    </TabLayout>
  )
}

export default Thoth
