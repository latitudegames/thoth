import React, { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Select from "react-select";
import Icon from '../Icon/Icon'
import Chip from '../Chip/Chip'

import css from './select.module.css'

const BasicSelect = ({ options, onChange, placeholder, searchable, style, focusKey }) => {
  const selectRef = useRef(null)

  const DropdownIndicator = () => {
    return searchable ? <Icon name="search" size={'var(--small)'}/> : <div className={css['dropdown-indicator']}>❯</div>
  }

  const focusSelect = () => {
    selectRef.current.focus()
  }

  useHotkeys(
    focusKey,
    (event) => {
      event.preventDefault();
      focusSelect();
    },
    { enableOnTags: "INPUT" },
    [focusSelect]
  );

  const styles = {
    menu: () => ({
      backgroundColor: "var(--dark-2)",
      borderRadius: 4,
      boxShadow: "0px 5px 5px rgba(0,0,0,0.3)",
      border: "1px solid var(--dark-3)",
    }),
    menuPortal: () => ({
      height: 'var(--c2)'
    }),
    clearIndicator: () => ({
      backgroundColor: "var(--primary)",
    }),
    option: (provided, state) => ({
      padding: "var(--extraSmall)",
      paddingLeft: "var(--small)",
      paddingRight: "var(--small)",
      backgroundColor: state.isFocused ? "var(--primary)" : "transparent",
    }),
    input: () => ({
      color: "#fff",
      backgroundColor: "transparent",
      boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1) !important",
    }),
    control: (provided, state) => ({
      color: "#fff",
      backgroundColor: state.isFocused ? "var(--dark-2)" : "var(--dark-3)",
      borderRadius: 4,
      border: "1px solid var(--dark-4)",
      display: "flex",
      boxShadow: state.isFocused
        ? "inset 0px 5px 5px rgba(0, 0, 0, 0.1)"
        : "0px 2px 0px rgba(0, 0, 0, 0.2);",
      maxHeight: 30,
      minHeight: 30,
      /* Correcting for some element wonkiness, actual height is 32px */
      paddingLeft: "var(--small)",
      paddingRight: "var(--small)",
    }),
    placeholder: () => ({
      color: "#fff",
      position: "absolute",
      fontFamily: '"IBM Plex Mono"',
      textTransform: "uppercase",
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    valueContainer: () => ({
      width: '100%',
      display: 'flex',
      flex: '1',
      alignItems: 'center'
    })
  };

  return (
    <span className={css['select-dropdown-container']} style={style}>
      {options ? <Select
        options={options}
        onChange={onChange}
        styles={styles}
        placeholder={placeholder}
        components={{DropdownIndicator}}
        isSearchable={searchable ? true : false}
        ref={selectRef}
      /> : <Chip noEvents label={"No options available..."} />}
    </span>
  );
};

export default BasicSelect;
