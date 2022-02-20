import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Ent = ({ id, updateCallback }) => {
  const [loaded, setLoaded] = useState(false)

  const [enabled, setEnabled] = useState(false)
  const [agent, setAgent] = useState('')
  const [discordEnabled, setDiscordEnabled] = useState(false)
  const [discord_api_key, setDiscordApiKey] = useState('')
  const [discord_spell_handler, setDiscordSpellHandler] = useState('')

  useEffect(() => {
    if (!loaded) {
      ;(async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/agentInstance?instanceId=` + id
        )
        console.log('res is', res)
        setAgent(res.data.personality)
        setEnabled(res.data.enabled === true)
        setDiscordEnabled(res.data.discordEnabled === true)
        setDiscordApiKey(res.data.discord_api_key)
        setDiscordSpellHandler(res.data.discord_spell_handler)
        setLoaded(true)
      })()
    }
  }, [loaded])

  const _delete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/agentInstance/` + id)
      .then(res => {
        console.log('deleted', res)
        setLoaded(false)
        updateCallback()
      })
  }

  const update = () => {
    console.log('Update called')
    const _data = {
      personality: agent,
      enabled,
      discordEnabled,
      discord_api_key,
      discord_spell_handler,
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, {
        id,
        data: _data,
      })
      .then((res: any) => {
        console.log('response on update', res)
        setEnabled(res.enabled)
        setAgent(res.personality)
        setDiscordEnabled(res.discordEnabled)
        setDiscordApiKey(res.discord_api_key)
        setDiscordSpellHandler(res.discord_spell_handler)
        updateCallback()
      })
  }

  return !loaded ? (
    <>Loading...</>
  ) : (
    <div>
      <div className="form-item">
        <span className="form-item-label">Enabled</span>
        <input
          type="checkbox"
          defaultChecked={enabled}
          onChange={e => {
            setEnabled(e.target.checked)
          }}
        />
      </div>
      {enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">Agent Template</span>
            <input
              type="text"
              defaultValue={agent}
              onChange={e => setAgent(e.target.value)}
            />
          </div>

          <div className="form-item">
            <span className="form-item-label">Discord Enabled</span>
            <input
              type="checkbox"
              value={discordEnabled}
              defaultChecked={discordEnabled || discordEnabled === 'true'}
              onChange={e => {
                setDiscordEnabled(e.target.checked)
              }}
            />
          </div>

          {discordEnabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Discord API Key</span>
                <input
                  type="text"
                  defaultValue={discord_api_key}
                  onChange={e => {
                    setDiscordApiKey(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">SpellHandler</span>
                <input
                  type="text"
                  defaultValue={discord_spell_handler}
                  onChange={e => {
                    setDiscordSpellHandler(e.target.value)
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
      <div className="form-item">
        <button onClick={() => update()}>Update</button>
        <button onClick={() => _delete()}>Delete</button>
      </div>
    </div>
  )
}

export default Ent
