import axios from 'axios'
import { useEffect, useState } from 'react'
import { useModal } from '@/contexts/ModalProvider'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { thothApiRootUrl } from '@/config'

const AgentManager = () => {
  const [agents, setAgents] = useState([] as any[])
  const [currentAgentData, setCurrentAgentData] = useState({ id: 'unitialized', agent: 'unitialized' })
  const [dialog, setDialog] = useState('')
  const [agentName, setAgentName] = useState('')
  const [morals, setMorals] = useState('')
  const [facts, setFacts] = useState('')
  const { openModal, closeModal } = useModal()
  const [monologue, setMonologue] = useState('')
  const [personality, setPersonality] = useState('')
  const [greetings, setGreetings] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [files, setFiles] = useState("");
  
  let importData = files && JSON.parse(files);
  const {
    handleSubmit,
  } = useForm()
  let versionName = localStorage.getItem("agentName")
  const createNew = async () => {
    const agent = !versionName ? 'New Agent' : versionName
    await getAgents()
    await update(agent as any)
  }

  const deleteAgent = async () => {
    const res = await axios.delete(
      `${thothApiRootUrl}/agent/` + currentAgentData.id
    )
    console.log('deleted', res)
    await getAgents()
  }

  const update = async (agent = currentAgentData.agent) => {
    const body = {
      agent: agent,
      data: {
        dialog,
        morals,
        facts,
        monologue,
        personality,
        greetings,
      },
    }
    await axios.post(`${thothApiRootUrl}/agent`, body)
    const newAgents = await getAgents() as any[]
    setAgents(newAgents)

    switchAgent(agent)
  }

  const getAgents = async () => {
    const res = await axios.get(`${thothApiRootUrl}/agents`)
    if (res.data.length == 0) return setAgents([])
    let newAgents = [] as any[]
    for (let i = 0; i < res.data.length; i++) {
      newAgents.push(res.data[i])
    }

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
      `${thothApiRootUrl}/agent?agent=${agent.agent ?? agent}`
    )
    console.log('res.data is', res.data)

    setCurrentAgentData(res.data)
    setAgentName(res.data.agent)
    setDialog(res.data.dialog)
    setMorals(res.data.morals)
    setFacts(res.data.facts)
    setMonologue(res.data.monologue)
    setPersonality(res.data.personality)
    setGreetings(res.data.greetings)
  }

  useEffect(() => {
    (async () => {
      const newAgents = await getAgents()
      if (newAgents) {
        setAgents(newAgents)
        if (newAgents[0]) setCurrentAgentData(newAgents[0])
      }
    })();
  }, [])

  const onSubmit = handleSubmit(async () => {
    await createNew()
  })

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
      setFiles((e.target as any).result);
    };
  };

  const onExportData = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(files),
      fileName: "users.json",
      fileType: "text/json",
    });
  }

  const createAgent = data => {
    onSubmit()
    localStorage.setItem("agentName", data && data.name)
    enqueueSnackbar('Agent Created', { variant: 'success' })
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
        onClick={(e) => {
          e.preventDefault()
          openModal({
            modal: 'agentModal',
            title: 'New Agent',
            options: {
              version: 1,
            },
            onClose: data => {
              closeModal()
              createAgent(data)
            },
          })
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
                {(agents as any)?.length > 0 &&
                  (agents as any)?.map((agent, idx) => (
                    <option value={agent.agent} key={idx}>
                      {agent.agent}
                    </option>
                  ))}
                {(agents as any)?.length === 0 && 'No personalities found'}
              </select>
            </span>
            {currentAgentData && <div style={{ display: 'flex', margin: '1em' }}>
              <button
                value="import"
                style={{ marginRight: '12px' }}
              >
                <label className="btn btn-primary">
                  Import<input type="file" accept=".json" onChange={handleChange} style={{ display: "none" }} name="image" />
                </label>
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

            <div style={{ display: 'flex' }}>
              <div className="form-item agentFields" style={{ width: '100%' }}>
                <span className="form-item-label">Name</span>
                <textarea
                  className="form-text-area"
                  onChange={e => {
                    setAgentName(e.target.value)
                  }}
                  value={importData && importData.Dialogue ? importData.Dialogue : agentName}
                ></textarea>
              </div>
              <div className="agent-select agent-Manager" style={{ width: '100%' }}>
                <span className="form-item-label">Personalities</span>
                <select
                  name="agents"
                  id="agents"
                  onChange={event => {
                    switchAgent(event.target.value)
                  }}
                >
                  {(agents as any)?.length > 0 &&
                    (agents as any)?.map((agent, idx) => (
                      <option value={agent.name} key={idx}>
                        {agent.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-item">
              <span className="form-item-label">Dialog</span>
              <textarea
                className="form-text-area dialogInput"
                onChange={e => {
                  setDialog(e.target.value)
                }}
                value={importData && importData.Dialogue ? importData.Dialogue : dialog}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Personality</span>
              <textarea
                className="form-text-area personalityInput"
                onChange={e => {
                  setPersonality(e.target.value)
                }}
                value={importData && importData.Personality ? importData.Personality : personality}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Morals and Ethics</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setMorals(e.target.value)
                }}
                value={importData && importData.Morals ? importData.Morals : morals}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Monologue</span>

              <textarea
                className="form-text-area MonologueInput"
                onChange={e => {
                  setMonologue(e.target.value)
                }}
                value={importData && importData.Monologue ? importData.Monologue : monologue}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Facts</span>
              <textarea
                className="form-text-area FactsInput"
                onChange={e => {
                  setFacts(e.target.value)
                }}
                value={importData && importData.Facts ? importData.Facts : facts}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Greetings</span>
              <textarea
                className="form-text-area gettingsInput"
                onChange={e => {
                  setGreetings(e.target.value)
                }}
                value={importData && importData.Greetings ? importData.Greetings : greetings}
              ></textarea>
            </div>
            <div className="agentBtns">
              <button
                value="Delete"
                onClick={e => {
                  e.preventDefault()
                  deleteAgent()
                }}
              >
                Delete
              </button>
              <button
                value="Update"
                onClick={e => {
                  e.preventDefault()
                  update()
                }}
                className='updateBtn'
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AgentManager