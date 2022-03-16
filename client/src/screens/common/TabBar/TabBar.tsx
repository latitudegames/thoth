import classnames from 'classnames'
import { VscClose } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

import { useTabManager } from '../../../contexts/TabManagerProvider'
import Icon from '../Icon/Icon'
import MenuBar from '../MenuBar/MenuBar'
import css from './tabBar.module.css'

const Tab = ({ tab, activeTab }) => {
  const navigate = useNavigate()
  const { closeTab } = useTabManager()
  const active = tab.id === activeTab?.id

  const title = `${tab.type}- ${tab.name}`
  const tabClass = classnames({
    [css['tabbar-tab']]: true,
    [css['active']]: active,
    [css['inactive']]: !active,
  })

  const onClick = () => {
    navigate(`/thoth/${tab.spell}`)
  }

  // Handle selecting the next tab down is none are active.
  const onClose = e => {
    e.stopPropagation()
    closeTab(tab.id)
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
      <div className={css['tabbar-user']}>
        {<Icon name="account" size={24} />}
      </div>
    </div>
  )
}

export default TabBar
