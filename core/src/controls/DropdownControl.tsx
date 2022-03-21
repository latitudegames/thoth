// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { Control } from 'rete'
import axios from 'axios'

const data = [
    {
        "agent": "name"
    },
    {
        "agent": 'personality name'
    }
]

const ReactDropdownControl = props => {
    console.log(process.env.REACT_APP_API_ROOT_URL, '111111')
    const [list, setList] = useState([])

    useEffect(() => {
        // const { data } = props;
        if (data) {
            console.log(data, 'datadatadatadata')
            getList(data)
        }
    }, [])


    const getList = (data) => {
        if (data.length == 0) return setList([])
        let newListItems = []
        for (let i = 0; i < data.length; i++) {
            newListItems.push(data[i])
        }
        setList(newListItems)
        return newListItems
    }

    const onChange = async (e) => {
        console.log(e, 'event')
        // setList(e)
        const res = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agent_data`, {
            params: { agent: e },
        })
        // if(res.data){
        //     setList(res.data.agent)
        // }else{
        //   setList([])  
        // }

    }

    console.log(list, '000000000000')

    return (
        <div style={{ width: '150px', position: 'absolute', top: '55px' }}>
            {props.label && <label htmlFor="">{props.label}</label>}
            <select
                name="dropdown"
                id="dropdown"
                placeholder={'Select...'}
                onChange={event => {
                    onChange(event.target.value)
                }}
                style={{ width: '150px', background: '#fff', color: '#000', marginTop: '5px' }}
            >
                {(list as any)?.length > 0 ?
                    (list as any).map((item, idx) => (
                        <option value={item.agent} key={idx}>
                            {item.agent}
                        </option>
                    )) : []}
            </select>
        </div>
    )
}

export class DropdownControl extends Control {
    constructor({ editor, key, value, ...rest }) {
        console.log(editor, 'editor')
        console.log(key, 'key')
        console.log(value, 'value')
        super(key)
        this.render = 'react'
        this.component = ReactDropdownControl

        const label = rest.label || null

        // we define the props that are passed into the rendered react component here
        this.props = {
            editor,
            name: key,
            label: key,
            value,
            putData: (...args) => this.putData.apply(this, args),
        }
    }
}
