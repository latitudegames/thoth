import { RootState } from '@/state/store'
import { useSelector, useDispatch } from 'react-redux'
import Window from '../../../../components/Window/Window'
import {
  toggleDoNotShowUnlockWarning,
  toggleAutoSave,
} from '@/state/preferences'
import SwitchComponent from '../../../../components/Switch/Switch'

