import { RootState } from '@/state/store'
import { useSelector, useDispatch } from 'react-redux'
import Window from '../../../../components/Window/Window'
import {
  toggleDoNotShowUnlockWarning,
  toggleAutoSave,
} from '@/state/preferences'
import SwitchComponent from '../../../../components/Switch/Switch'

const SettingsWindow = ({ tab }) => {
  const preferences = useSelector((state: RootState) => state.preferences)

  const dispatch = useDispatch()

  const settingControls = {
    doNotShowUnlock: () => dispatch(toggleDoNotShowUnlockWarning()),
    autoSave: () => dispatch(toggleAutoSave()),
  }

  const toolbar = (
    <div style={{ flex: 1, marginTop: 'var(--c1)' }}>User Preferences</div>
  )

  type PreferenceType = {
    onClick: () => {}
    label: string
    checked: boolean
  }

  return (
  )
}

export default SettingsWindow
