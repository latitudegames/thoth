import React, { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Creatable from 'react-select/creatable'

import Chip from '../Chip/Chip'
import Icon, { componentCategories } from '../Icon/Icon'
import css from './select.module.css'

const BasicSelect = ({
  options,
  onChange,
  placeholder,
  style = {},
  focusKey = '',
  nested = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValidNewOption = (inputValue, selectValue, selectOptions, accessors) =>
    true,
  ...props
}) => {
  const selectRef = useRef(null)

  const DropdownIndicator = () => {
    return props.searchable ? (
      <Icon name="search" size={'var(--small)'} />
    ) : (
      <div className={css['dropdown-indicator']}>❯</div>
    )
  }

  const formatGroupLabel = data => (
    <span className={css['group-header']}>
      <Icon
        name={componentCategories[data.label]}
        style={{ marginRight: 'var(--extraSmall)' }}
      />
      {data.label}
    </span>
  )

  const focusSelect = () => {
    selectRef.current.focus()
  }

  const blurSelect = () => {
    selectRef.current.blur()
  }

  useHotkeys(
    focusKey,
    event => {
      event.preventDefault()
      focusSelect()
    },
    { enableOnTags: 'INPUT' },
    [focusSelect]
  )

  useHotkeys(
    'enter, esc',
    event => {
      event.preventDefault()
      blurSelect()
    },
    { enableOnTags: 'INPUT' },
    [blurSelect]
  )

  const styles = {
    menu: () => ({
      backgroundColor: 'var(--dark-2)',
      borderRadius: 4,
      boxShadow: '0px 5px 5px rgba(0,0,0,0.3)',
      border: '1px solid var(--dark-3)',
    }),
    menuPortal: () => ({
      height: 'var(--c2)',
    }),
    clearIndicator: () => ({
      backgroundColor: 'var(--primary)',
    }),
    option: (provided, state) => ({
      padding: 'var(--extraSmall)',
      paddingLeft: nested ? 'var(--large)' : 'var(--small)',
      paddingRight: 'var(--small)',
      backgroundColor: state.isFocused ? 'var(--primary)' : 'transparent',
    }),
    input: () => ({
      color: '#fff',
      backgroundColor: 'transparent',
      boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1) !important',
    }),
    control: (provided, state) => ({
      color: '#fff',
      backgroundColor: state.isFocused ? 'var(--dark-2)' : 'var(--dark-3)',
      borderRadius: 4,
      border:
        state.isFocused && focusKey
          ? '2px solid var(--primary)'
          : '1px solid var(--dark-4)',
      boxSizing: 'border-box',
      display: 'flex',
      boxShadow: state.isFocused
        ? 'inset 0px 5px 5px rgba(0, 0, 0, 0.1)'
        : '0px 2px 0px rgba(0, 0, 0, 0.2);',
      maxHeight: 'var(--c4)',
      minHeight: 'var(--c4)',
      paddingLeft: 'var(--small)',
      paddingRight: 'var(--small)',
    }),
    placeholder: (provided, state) => ({
      color: '#fff',
      position: 'absolute',
      fontFamily: '"IBM Plex Mono"',
      textTransform: 'uppercase',
      display: state.isFocused && focusKey ? 'none' : 'inline-block',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    valueContainer: () => ({
      width: '100%',
      display: 'flex',
      flex: '1',
      alignItems: 'center',
    }),
    singleValue: () => ({
      color: 'rgba(255,255,255,0.5)',
    }),
  }

  const _isValidNewOption = (...args) => {
    if (!props.creatable) return false
    return isValidNewOption(...args)
  }

  return (
    <span className={css['select-dropdown-container']} style={style}>
      {options ? (
        <Creatable
          isValidNewOption={_isValidNewOption}
          options={options}
          onChange={onChange}
          styles={styles}
          placeholder={placeholder}
          components={{ DropdownIndicator }}
          isSearchable={props.searchable}
          ref={selectRef}
          formatGroupLabel={formatGroupLabel}
          {...props}
        />
      ) : (
        <Chip noEvents label={'No options available...'} />
      )}
    </span>
  )
}

export default BasicSelect
