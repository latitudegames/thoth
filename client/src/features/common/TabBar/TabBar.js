import classnames from 'classnames'
import React, { useState, useRef } from 'react'
import { VscClose } from 'react-icons/vsc'

import { useTabManager } from '../../../contexts/TabManagerProvider'
import Icon from '../Icon/Icon'
import MenuBar from '../MenuBar/MenuBar'
import css from './tabBar.module.css'
// import { useAuth } from "../../../contexts/AuthProvider";

const Tab = props => {
  const [editingTitle, setEditingTitle] = useState(false)
  const inputRef = useRef(null)
  const { switchTab, closeTab } = useTabManager()

  const title = `${props.name}`
  const tabClass = classnames({
    [css['tabbar-tab']]: true,
    [css['active']]: props.active,
    [css['inactive']]: !props.active,
  })

  const onClick = () => {
    switchTab(props.id)
  }

  // Handle selecting the next tab down is none are active.
  const onClose = e => {
    e.stopPropagation()
    closeTab(props.id)
  }

  const beginChangeName = () => {
    setEditingTitle(true)
    inputRef.current.focus()
  }

  const completeChangeName = () => {
    setEditingTitle(false)
  }

  return (
    <div
      className={tabClass}
      onClick={onClick}
      onDoubleClick={props.type === 'spell' && beginChangeName}
    >
      <p
        style={{
          position: editingTitle ? 'absolute' : 'relative',
          opacity: editingTitle ? 0 : 1,
          pointerEvents: editingTitle ? 'none' : 'all',
        }}
      >
        {title}
      </p>
      <input
        style={{
          position: !editingTitle ? 'absolute' : 'relative',
          opacity: !editingTitle ? 0 : 1,
          pointerEvents: !editingTitle ? 'none' : 'all',
        }}
        ref={inputRef}
        type="text"
        placeholder={props.name}
        onBlur={props.type === 'spell' && completeChangeName}
      />
      <span onClick={onClose}>{!editingTitle && <VscClose />}</span>
    </div>
  )
}

const TabBar = ({ tabs }) => {
  // const { user } = useAuth();

  return (
    <div className={css['th-tabbar']}>
      <div className={css['tabbar-section']}>
        <MenuBar />
      </div>
      <div className={css['tabbar-section']}>
        {tabs && tabs.map((tab, i) => <Tab {...tab} key={i} />)}
      </div>
      <div className={css['tabbar-user']}>
        {<Icon name="account" size={24} />}
      </div>
    </div>
  )
}

export default TabBar
