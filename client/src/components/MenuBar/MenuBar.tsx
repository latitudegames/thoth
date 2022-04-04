import React, { useState, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import css from './menuBar.module.css'
import thothlogo from './thoth.png'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { activeTabSelector, Tab } from '@/state/tabs'

const MenuBar = () => {
  const navigate = useNavigate()
  const { publish, events } = usePubSub()
  const activeTab = useSelector(activeTabSelector)

  const { openModal } = useModal()

  const activeTabRef = useRef<Tab | null>(null)

  useEffect(() => {
    if (!activeTab) return
    activeTabRef.current = activeTab
  }, [activeTab])

  // grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $CREATE_CONSOLE,
    $SERIALIZE,
    $EXPORT,
  } = events

  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue)
    const toggle = React.useCallback(() => {
      setValue(v => !v)
    }, [])
    return [value, toggle as () => void]
  }
  const [menuVisibility, togglemenuVisibility] = useToggle()

  const onSave = () => {
    if (!activeTabRef.current) return
    publish($SAVE_SPELL(activeTabRef.current.id))
  }

  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    })
  }

  const onEdit = () => {
    if (!activeTabRef.current) return
    openModal({
      modal: 'editSpellModal',
      content: 'This is an example modal',
      tab: activeTabRef.current,
      spellId: activeTabRef.current.spell,
      name: activeTabRef.current.spell,
    })
  }

  const onNew = () => {
    navigate('/home/create-new')
  }
  const onOpen = () => {
    navigate('/home/all-projects')
  }

  const onSerialize = () => {
    if (!activeTabRef.current) return
    publish($SERIALIZE(activeTabRef.current.id))
  }

  const onStateManagerCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_STATE_MANAGER(activeTabRef.current.id))
  }

  const onPlaytestCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_PLAYTEST(activeTabRef.current.id))
  }

  const onInspectorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_INSPECTOR(activeTabRef.current.id))
  }

  const onTextEditorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id))
  }

  const onExport = () => {
    if (!activeTabRef.current) return
    publish($EXPORT(activeTabRef.current.id))
  }

  const onConsole = () => {
    if (!activeTabRef.current) return
    publish($CREATE_CONSOLE(activeTabRef.current.id))
  }

  //Menu bar hotkeys
  useHotkeys(
    'cmd+s, crtl+s',
    event => {
      event.preventDefault()
      onSave()
    },
    { enableOnTags: ['INPUT'] },
    [onSave]
  )

  useHotkeys(
    'option+n, crtl+n',
    event => {
      event.preventDefault()
      onNew()
    },
    { enableOnTags: ['INPUT'] },
    [onNew]
  )

  //Menu bar entries
  const menuBarItems = {
    file: {
      items: {
        new_spell: {
          onClick: onNew,
        },
        open_spell: {
          onClick: onOpen,
        },
        edit_spell: {
          onClick: onEdit,
        },
        save_spell: {
          onClick: onSave,
        },
        save_spell_as: {
          onClick: onSaveAs,
        },
        export_spell: {
          onClick: onExport,
        },
      },
    },
    edit: {
      items: {
        undo: {},
        redo: {},
        copy: {},
        paste: {},
      },
    },
    dev: {
      items: {
        serialize: {
          onClick: onSerialize,
        },
      },
    },
    windows: {
      items: {
        text_editor: {
          onClick: onTextEditorCreate,
        },
        inspector: {
          onClick: onInspectorCreate,
        },
        state_manager: {
          onClick: onStateManagerCreate,
        },
        playtest: {
          onClick: onPlaytestCreate,
        },
        console: {
          onClick: onConsole,
        },
      },
    },
  }

  //Menu bar rendering
  const ListItem = ({ item, label, topLevel, onClick }) => {
    label = label ? label.replace(/_/g, ' ') : label
    let children
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css['menu-panel']}>
          {Object.keys(item.items).map((i, x) => {
            return (
              <ListItem
                item={item?.items[i]}
                label={Object.keys(item.items)[x]}
                topLevel={false}
                key={x}
                onClick={item?.items[i].onClick}
              />
            )
          })}
        </ul>
      )
    }

    return (
      <li
        className={`${css[topLevel ? 'menu-bar-item' : 'list-item']}`}
        onClick={onClick}
      >
        {label}
        {children && <div className={css['folder-arrow']}> ❯ </div>}
        {!topLevel && <br />}
        {children || null}
      </li>
    )
  }

  const handleClick = func => {
    //Initially intended to control the visibility with a state, but this triggers a re-render and hides the menu anyway! :D
    //Keeping this intact just in case.
    ;(togglemenuVisibility as Function)(menuVisibility)
    // eslint-disable-next-line no-eval
    eval(func)
  }

  return (
    <ul className={css['menu-bar']}>
      <img className={css['thoth-logo']} alt="Thoth logo" src={thothlogo} />
      {Object.keys(menuBarItems).map((item, index) => (
        <ListItem
          item={menuBarItems[item]}
          label={Object.keys(menuBarItems)[index]}
          topLevel={true}
          key={index}
          onClick={() => {
            handleClick(menuBarItems[item].onClick)
          }}
        />
      ))}
    </ul>
  )
}

export default MenuBar
