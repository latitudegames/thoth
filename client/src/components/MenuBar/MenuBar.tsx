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
          hotKey: 'option+n',
        },
        open_spell: {
          onClick: onOpen,
          hotKey: 'option+o',
        },
        edit_spell: {
          onClick: onEdit,
          hotKey: 'option+e',
        },
        save_spell: {
          onClick: onSave,
          hotKey: 'option+s',
        },
        save_spell_as: {
          onClick: onSaveAs,
          hotKey: 'option+shift+s',
        },
        export_spell: {
          onClick: onExport,
          hotKey: 'option+shift+e',
        },
      },
    },
    edit: {
      items: {
        undo: {},
        redo: {},
        // copy: {},
        // paste: {},
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

  const parseStringToUnicode = commandString => {
    let formattedCommand = commandString
    formattedCommand = formattedCommand.replace('option', '\u2325')
    formattedCommand = formattedCommand.replace('shift', '\u21E7')
    formattedCommand = formattedCommand.replace('cmd', '\u2318')
    formattedCommand = formattedCommand.replace(/[`+`]/g, ' ')
    return formattedCommand
  }

  //Menu bar rendering
  const ListItem = ({ item, label, topLevel, onClick, hotKeyLabel }) => {
    label = label ? label.replace(/_/g, ' ') : label
    let children
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css['menu-panel']}>
          {Object.entries(item.items).map(
            ([key, item]: [string, Record<string, any>]) => {
              useHotkeys(
                item.hotKey,
                event => {
                  event.preventDefault()
                  item.onClick()
                },
                { enableOnTags: ['INPUT'] },
                [item.onClick]
              )

              return (
                <ListItem
                  item={item}
                  label={key}
                  topLevel={false}
                  key={key}
                  onClick={item.onClick}
                  hotKeyLabel={item.hotKey}
                />
              )
            }
          )}
        </ul>
      )
    }

    return (
      <li
        className={`${css[topLevel ? 'menu-bar-item' : 'list-item']}`}
        onClick={onClick}
      >
        {label}
        {hotKeyLabel && <span>{parseStringToUnicode(hotKeyLabel)}</span>}
        {children && <div className={css['folder-arrow']}> ❯ </div>}
        {/* {!topLevel && <br />} */}
        {children && children}
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
          hotKeyLabel={menuBarItems[item].hotKeyLabel}
          onClick={() => {
            handleClick(menuBarItems[item].onClick)
          }}
        />
      ))}
    </ul>
  )
}

export default MenuBar