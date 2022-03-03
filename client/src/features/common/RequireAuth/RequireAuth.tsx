import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/NewAuthProvider'

const defaultGroups = ['internal', 'thoth']

const RequireAuth = (props: Record<string, any>) => {
  const { user, loginRedirect } = useAuthContext()
  const navigate = useNavigate()
  const groups = props?.access
    ? [...props?.access, ...defaultGroups]
    : defaultGroups

  const authorized =
    user &&
    !user.groups.includes('public') &&
    user.groups.some(g => groups.includes(g))

  if (!authorized && user?.id) navigate('/')
  else if (!authorized) loginRedirect()

  return <Outlet />
}

export default RequireAuth
