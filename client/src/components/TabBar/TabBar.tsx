import { closeTab } from '@/state/tabs'
import classnames from 'classnames'
import { VscClose } from 'react-icons/vsc'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Icon from '../Icon/Icon'
import MenuBar from '../MenuBar/MenuBar'
import CreateTab from './CreateTab'
import css from './tabBar.module.css'

const Tab = ({ tab, activeTab }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const active = tab.id === activeTab?.id

  const title = `${tab.type}- ${tab.name}`
  const tabClass = classnames({
    [css['tabbar-tab']]: true,
    [css['active']]: active,
    [css['inactive']]: !active,
  })

  const onClick = () => {
    navigate(`/thoth/${tab.spellId}`)
  }

  // Handle selecting the next tab down is none are active.
  const onClose = e => {
    e.stopPropagation()
    navigate('/thoth')
    dispatch(closeTab(tab.id))
  }

  return (
    <div className={tabClass} onClick={onClick}>
      <p>{title}</p>
      <span onClick={onClose}>
        <VscClose />
      </span>
    </div>
  )
}

const TabBar = ({ tabs, activeTab }) => {
  return (
    <div className={css['th-tabbar']}>
      <div className={css['tabbar-section']}>
        <MenuBar />
      </div>
      <div className={css['tabbar-section']}>
        {tabs &&
          tabs.map((tab, i) => <Tab tab={tab} activeTab={activeTab} key={i} />)}
      </div>
      <div className={css['tabbar-section']}>
        <CreateTab />
      </div>

      <div className={css['tabbar-user']}>
        {<Icon name="account" size={24} />}
      </div>
    </div>
  )
}

export default TabBar
