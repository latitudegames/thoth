<<<<<<< HEAD
=======
import { useLatitude } from '@/config'
>>>>>>> Downstream merge with main branch, fix some things
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthProvider'

const defaultGroups = ['internal', 'thoth']

const RequireAuth = (props: Record<string, any>) => {
<<<<<<< HEAD
=======
  if (!useLatitude) return <Outlet />
>>>>>>> Downstream merge with main branch, fix some things
  const { user, loginRedirect } = useAuth()
  const groups = props?.access
    ? [...props?.access, ...defaultGroups]
    : defaultGroups

  const authorized =
    user &&
    !user.groups.includes('public') &&
    user.groups.some(g => groups.includes(g))

  if (!authorized && user?.id)
    window.location.href = 'https://voyage.latitude.io'
  else if (!authorized) loginRedirect()

  return <Outlet />
}

export default RequireAuth
