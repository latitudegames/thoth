import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const AgentManager = () => {
  const [agents, setAgents] = useState()
  const [currentAgentData, setCurrentAgentData] = useState(null) as any
  const newAgentRef = useRef('New Agent')

  const [dialog, setDialog] = useState('')
  const [morals, setMorals] = useState('')
  const [facts, setFacts] = useState('')
  const [monologue, setMonologue] = useState('')
  const [personality, setPersonality] = useState('')
  const [greetings, setGreetings] = useState('')

  const createNew = async () => {
    const agent = newAgentRef.current ?? 'New Agent'
    await getAgents()
    await update(agent)
  }

  const deleteAgent = async () => {
    if (!currentAgentData) return
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/agent/` + currentAgentData.id
    )
    console.log('deleted', res)
    await getAgents()
  }

  const update = async (agent = currentAgentData) => {
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
    await axios.post(`${process.env.REACT_APP_API_URL}/agent`, body)
    const newAgents = await getAgents()
    setAgents(newAgents as any)

    switchAgent(agent ?? currentAgentData.agent)
  }

  const getAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/agents`)

    if (res.data.length == 0) return setAgents([] as any)
    const newAgents = [] as any[]
    for (let i = 0; i < res.data.length; i++) {
      newAgents.push(res.data[i])
    }
    setAgents(newAgents as any)
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

  useEffect(() => {
    ;(async () => {
      const newAgents = await getAgents()
      setAgents(newAgents as any)
      if (newAgents[0]) setCurrentAgentData(newAgents[0])
    })()
  }, [])

  return (
    <div className="agent-container">
      <div>
        <span className="create-agent">Create Agent</span>
        <input type="text" ref={newAgentRef.current} />
        <button
          className="button"
          type="button"
          onClick={async e => {
            e.preventDefault()
            await createNew()
          }}
        >
          Create New
        </button>
      </div>
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
                {(agents as any[]).length > 0 &&
                  (agents as any[]).map((agent, idx) => (
                    <option value={agent.agent} key={idx}>
                      {agent.agent}
                    </option>
                  ))}
                {(agents as any[]).length === 0 && 'No personalities found'}
              </select>
            </span>
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
                value={dialog}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Morals:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setMorals(e.target.value)
                }}
                value={morals}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Facts:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setFacts(e.target.value)
                }}
                value={facts}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Monologue:</span>

              <textarea
                className="form-text-area"
                onChange={e => {
                  setMonologue(e.target.value)
                }}
                value={monologue}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Personality:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setPersonality(e.target.value)
                }}
                value={personality}
              ></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Greetings:</span>
              <textarea
                className="form-text-area"
                onChange={e => {
                  setGreetings(e.target.value)
                }}
                value={greetings}
              ></textarea>
            </div>

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
          </form>
        )}
      </div>
    </div>
  )
}

export default AgentManager
