//@ts-nocheck

import Modal from '@/features/common/Modal/Modal'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
const AgentManager = () => {
  const [agents, setAgents] = useState()
  const [currentAgentData, setCurrentAgentData] = useState(null)
  const newAgentRef = useRef('New Agent')

  const [dialog, setDialog] = useState('')
  const [morals, setMorals] = useState('')
  const [facts, setFacts] = useState('')
  const [monologue, setMonologue] = useState('')
  const [personality, setPersonality] = useState('')
  const [greetings, setGreetings] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [versionName, setVersionName] = useState('')
  const [files, setFiles] = useState("");
  let importData = files && JSON.parse(files);

  const {
    register,
    handleSubmit,
  } = useForm()

  const options = [
    {
      label:'Save',
      onClick: () => {
        onSubmit({ versionName })
      },
    }
  ]

  const createNew = async (e) => {
    console.log('newAgentRef.current is,', newAgentRef.current.value)
    const agent = !newAgentRef.current.value ? 'New Agent' : newAgentRef.current.value
    await getAgents()
    await update(agent)
  }

  const deleteAgent = async () => {
    console.log('deleting', currentAgentData)
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/agent/` + currentAgentData.id
    )
    console.log('deleted', res)
    await getAgents()
  }

  const update = async agent => {
    console.log('currentAgentData is', agent ?? currentAgentData)
    const body = {
      agent: agent ?? currentAgentData.agent,
      data: {
        dialog,
        morals,
        facts,
        monologue,
        personality,
        greetings,
      },
    }
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/agent`, body)
    console.log('updated, switching to', agent ?? currentAgentData.agent)
    const newAgents = await getAgents()
    setAgents(newAgents)

    switchAgent(agent ?? currentAgentData.agent)
  }

  const getAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/agents`)
    console.log("Res is", res)
    if (res.data.length == 0) return setAgents([])
    let newAgents = []
    for (let i = 0; i < res.data.length; i++) {
      newAgents.push(res.data[i])
    }
    console.log('newAgents', newAgents)
    setAgents(newAgents)
    setCurrentAgentData(newAgents && newAgents[0])
    if (newAgents && newAgents[0]) {
      switchAgent(newAgents[0])
    }
    return newAgents
  }

  const switchAgent = async agent => {
    console.log('agent is', agent)
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/agent?agent=${agent.agent ?? agent}`
    )
    console.log('res.data is', res.data)

    setCurrentAgentData(res.data)
    setDialog(res.data.dialog)
    setMorals(res.data.morals)
    setFacts(res.data.facts)
    setMonologue(res.data.monologue)
    setPersonality(res.data.personality)
    setGreetings(res.data.greetings)
  }

  useEffect(async () => {
    const newAgents = await getAgents()
    if (newAgents) {
      setAgents(newAgents)
      if (newAgents[0]) setCurrentAgentData(newAgents[0])
    }
  }, [])

  const onSubmit = handleSubmit(async () => {
    await createNew()
    onClose()
  })

  const onClose = () =>{
    setOpenModal(false)
  }

  const updateVersionName = e => {
    setVersionName(e.target.value)
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
  
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      setFiles(e.target.result);
    };
  };

  const onExportData = (e) =>{
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(files),
      fileName: "users.json",
      fileType: "text/json",
    });
  }

  return (
    <div className="agent-container">
      <div style={{ display: 'flex' }}>
        <span className="create-agent" style={{ lineHeight: '32px' }}>
          Create Agent
        </span>
      </div>
      <button
        className="button"
        type="button"
        onClick={async e => {
          e.preventDefault()
          setOpenModal(true)
        }}
      >
        Create New
      </button>
      <div>
        {!agents ? (
          <h1>Loading...</h1>
        ) : (
          <div className="agent-header">
            <span className="agent-select">
              <select
                name="agents"
                id="agents"
                onChange={event => {
                  switchAgent(event.target.value)
                }}
              >
                {agents.length > 0 &&
                  agents.map((agent, idx) => (
                    <option value={agent.agent} key={idx}>
                      {agent.agent}
                    </option>
                  ))}
                {agents.length === 0 && 'No personalities found'}
              </select>
            </span>
            {currentAgentData && <div style={{ display: 'flex', margin: '1em' }}>
              <button
                value="import"
                style={{marginRight: '12px'}}
              >
                <input type="file" accept=".json" onChange={handleChange} />
              </button>
              <button
                value="export"
                onClick={(e) => {
                  onExportData(e)
                }}
              >
                Export
              </button>
            </div>}
          </div>
        )}
        {currentAgentData && (
          <form>
            <div className="form-item">
              <span className="form-item-label">Dialogue:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setDialog(e.target.value)
                }}
                value={importData && importData.Dialogue ? importData.Dialogue : dialog}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Morals:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setMorals(e.target.value)
                }}
                value={importData && importData.Morals ? importData.Morals : morals}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Facts:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setFacts(e.target.value)
                }}
                value={importData && importData.Facts ? importData.Facts : facts}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Monologue:</span>

              <textarea
                className="form-text-area"
                onChange={e => {
                  setMonologue(e.target.value)
                }}
                value={importData && importData.Monologue ? importData.Monologue : monologue}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Personality:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setPersonality(e.target.value)
                }}
                value={importData && importData.Personality ? importData.Personality : personality}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Greetings:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setGreetings(e.target.value)
                }}
                value={importData && importData.Greetings ? importData.Greetings : greetings}
              ></textarea>
            </div>
            <div style={{ display: 'flex' }}>
              <button
                value="Update"
                onClick={e => {
                  e.preventDefault()
                  update()
                }}
              >
                Update
              </button>
              <button
                value="Delete"
                onClick={e => {
                  e.preventDefault()
                  deleteAgent()
                }}
              >
                Delete
              </button>
            </div>
          </form>
        )}
        <div className="agent-createModal">
        {openModal && 
          <Modal title="New Agent" options={options} onClose={onClose} icon="add" className="agent-createModal">
            <h4>CHANGE NOTES</h4>
            <input type="text" style={{ marginLeft: 'auto' }} ref={newAgentRef} />
          </Modal>}
        </div>
      </div>
    </div>
  )
}

export default AgentManager
