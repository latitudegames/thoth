import { createSlice } from '@reduxjs/toolkit'

export interface Preference {
  autoSave: boolean
  doNotShowUnlockWarning: boolean
}

export const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    autoSave: true,
    doNotShowUnlockWarning: false,
  },
})
