import { useContext, createContext, useState } from 'react'

import { setAuthHeader } from '../utils/authHelper'
import { login as userLogin } from './../services/game-api/auth'
import { useDB } from './DatabaseProvider'

const Context = createContext({
  login: (email, password) => {},
  user: {} as any,
  checkIn: user => {},
  getUser: () => {},
})

export const useAuth = () => useContext(Context)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) as any
  const { models } = useDB()

  const login = async (email, password) => {
    const response = await userLogin(email, password)

    if (response.accessToken) {
      const authData = window.btoa(email + ':' + password)
      const user = await models.user.getOrCreate(response.id)

      await models.user.setAuthData(user.id, authData)
      const updatedUser = await models.user.updateUser(user.id, response)
      const finalUser = updatedUser.toJSON()

      setUser(finalUser)
      setAuthHeader(finalUser.authData)
    }

    return response
  }

  const getUser = async () => {
    return await models.user.getUser()
  }

  const checkIn = user => {
    setUser(user)
    setAuthHeader(user.authData)
  }

  const publicInterface = {
    login,
    user,
    checkIn,
    getUser,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default AuthProvider
