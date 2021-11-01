import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'

import { usePubSub } from '../../contexts/PubSubProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import LoadingScreen from '../common/LoadingScreen/LoadingScreen'
import TabLayout from '../common/TabLayout/TabLayout'
import Workspace from './components/Workspace'

const Thoth = ({ empty }) => {
  const navigate = useNavigate()
  const { activeTab, tabs } = useTabManager()
  const pubSub = usePubSub()

  const { events, publish } = pubSub

  useEffect(() => {
    if (!tabs) return

    if (tabs.length === 0) navigate('/home')
  }, [tabs])

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
        tabs.map((tab: any, i) => (
          <Workspace
            tab={tab}
            tabs={tabs}
            key={`${i}-${tab.name}`}
            activeTab={activeTab}
            appPubSub={pubSub}
          />
        ))}
    </TabLayout>
  )
}

export default Thoth
