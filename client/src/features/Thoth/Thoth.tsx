import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate, useParams } from 'react-router-dom'

import { usePubSub } from '../../contexts/PubSubProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import LoadingScreen from '../common/LoadingScreen/LoadingScreen'
import TabLayout from '../common/TabLayout/TabLayout'
import Workspaces from './workspaces'

const Thoth = ({ empty = false }) => {
  const navigate = useNavigate()
  const { activeTab, tabs, openTab } = useTabManager()
  const pubSub = usePubSub()
  const { spellName } = useParams()

  const { events, publish } = pubSub

  useEffect(() => {
    if (!tabs) return

    if (!activeTab && !spellName) navigate('/home')
  }, [tabs])

  useEffect(() => {
    if (!spellName) return

    openTab({
      spellId: spellName,
      name: spellName,
      openNew: false,
      type: 'spell',
    })
  }, [spellName])

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
      {!empty && (
        <Workspaces tabs={tabs} pubSub={pubSub} activeTab={activeTab} />
      )}
    </TabLayout>
  )
}

export default Thoth
