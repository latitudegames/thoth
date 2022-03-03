import { Outlet, useNavigate } from 'react-router-dom'
import { appRootUrl } from '../../../config'
import { useAuthContext } from '../../../contexts/NewAuthProvider'

const defaultGroups = ['internal', 'thoth']

const RequireAuth = (props: Record<string, any>) => {
  const { user, loginRedirect } = useAuthContext()
  const navigate = useNavigate()
  const groups = props?.access
    ? [...props?.access, ...defaultGroups]
    : defaultGroups

  const auth =
    user &&
    !user.groups.includes('public') &&
    user.groups.some(g => groups.includes(g))

  if (!auth && user?.id) navigate('/')
  else if (!auth) loginRedirect()

  return <Outlet />
}

export default RequireAuth
