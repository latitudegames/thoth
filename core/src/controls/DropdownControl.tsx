// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { Control } from 'rete'

const ReactDropdownControl = props => {
    const [list, setList] = useState([])

    useEffect(() => {
        const { data } = props;
        if(data){
            getList(data)
        }
    }, [props])


    getList = (data) =>{
        if (data.length == 0) return setList([])
        let newListItems = [] 
        for (let i = 0; i < data.length; i++) {
            newListItems.push(data[i])
        }
        setList(newListItems)
        return newListItems
    }

    const onChange = e => {
        setValue(e.target.value)
    }

    return (
        <>
        {props.label && <label htmlFor="">{props.label}</label>}
            <select 
                name="dropdown"
                id="dropdown"
                onChange={event => {
                    onChange(event.target.value)
                }}
            >
                {(list as any)?.length > 0 &&
                  (list as any)?.map((item, idx) => (
                    <option value={item.agent} key={idx}>
                      {item.agent}
                    </option>
                ))}
            </select>
        </>
    )
}

export class DropdownControl extends Control {
  constructor({ editor, key, value, ...rest }) {
    super(key)
    this.render = 'react'
    this.component = ReactDropdownControl

    const label = rest.label || null

    // we define the props that are passed into the rendered react component here
    this.props = {
      editor,
      name: key,
      label,
      value,
      putData: (...args) => this.putData.apply(this, args),
    }
  }
}
