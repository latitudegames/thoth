//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

function capitalizeFirstLetter(word) {
  if (!word || word === undefined) word = ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const EntityWindow = ({ id, updateCallback }) => {
  const [loaded, setLoaded] = useState(false)

  const [enabled, setEnabled] = useState(false)
  const [discord_enabled, setDiscordEnabled] = useState(false)
  const [discord_api_key, setDiscordApiKey] = useState('')

  const [use_voice, setUseVoice] = useState(false)
  const [voice_provider, setVoiceProvider] = useState(false)
  const [voice_character, setVoiceCharacter] = useState('')
  const [voice_language_code, setVoiceLanguageCode] = useState('')

  const [discord_starting_words, setDiscordStartingWords] = useState('')
  const [discord_bot_name_regex, setDiscordBotNameRegex] = useState('')
  const [discord_bot_name, setDiscordBotName] = useState('')
  const [discord_empty_responses, setDiscordEmptyResponses] = useState('')

  const [discord_spell_handler_incoming, setDiscordSpellHandlerIncoming] =
    useState('')
  const [discord_spell_handler_update, setDiscordSpellHandlerUpdate] =
    useState('')
  const [discord_spell_handler_feed, setDiscordSpellHandlerFeed] = useState('')

  const [xrengine_spell_handler_incoming, setXREngineSpellHandlerIncoming] =
    useState('')
  const [xrengine_spell_handler_update, setXREngineSpellHandlerUpdate] =
    useState('')
  const [xrengine_spell_handler_feed, setXREngineSpellHandlerFeed] =
    useState('')
  const [xrengine_enabled, setxrengine_enabled] = useState(false)
  const [xrengine_url, setXREngineUrl] = useState('')
  const [xrengine_bot_name, setXREngineBotName] = useState('')
  const [xrengine_bot_name_regex, setXREngineBotNameRegex] = useState('')
  const [xrengine_starting_words, setXREngineStartingWords] = useState('')
  const [xrengine_empty_responses, setXREngineEmptyResponses] = useState('')

  const [twitter_client_enable, setTwitterClientEnable] = useState(false)
  const [twitter_token, setTwitterToken] = useState('')
  const [twitter_id, setTwitterId] = useState('')
  const [twitter_app_token, setTwitterAppToken] = useState('')
  const [twitter_app_token_secret, setTwitterAppTokenSecret] = useState('')
  const [twitter_access_token, setTwitterAccessToken] = useState('')
  const [twitter_access_token_secret, setTwitterAccessTokenSecret] =
    useState('')
  const [twitter_bot_name, setTwitterBotName] = useState('')
  const [twitter_bot_name_regex, setTwitterBotNameRegex] = useState('')

  // const [twilio_client_enable, setTwilioClientEnable] = useState(false)
  // const [twilio_sid, setTwilioSid] = useState('')
  // const [twilio_auth_token, setTwilioAuthToken] = useState('')
  // const [twilio_phone_number, setTwilioPhoneNumber] = useState('')

  const [spellList, setSpellList] = useState('')
  useEffect(() => {
    if (!loaded) {
      ;(async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_ROOT_URL}/entity?instanceId=` + id
        )
        console.log('res is', res.data)
        setEnabled(res.data.enabled === true)
        setDiscordEnabled(res.data.discord_enabled === true)
        setUseVoice(res.data.use_voice === true)
        setVoiceProvider(res.data.voice_provider)
        setVoiceCharacter(res.data.voice_character)
        setVoiceLanguageCode(res.data.voice_language_code)
        setDiscordApiKey(res.data.discord_api_key)
        setDiscordStartingWords(res.data.discord_starting_words)
        setDiscordBotNameRegex(res.data.discord_bot_name_regex)
        setDiscordBotName(res.data.discord_bot_name)
        setDiscordEmptyResponses(res.data.discord_empty_responses)
        setDiscordSpellHandlerIncoming(res.data.discord_spell_handler_incoming)
        setDiscordSpellHandlerUpdate(res.data.discord_spell_handler_update)
        setDiscordSpellHandlerFeed(res.data.discord_spell_handler_feed)

        setxrengine_enabled(res.data.xrengine_enabled === true)
        setXREngineUrl(res.data.xrengine_url)
        setXREngineSpellHandlerIncoming(
          res.data.xrengine_spell_handler_incoming
        )
        setXREngineSpellHandlerUpdate(res.data.xrengine_spell_handler_update)
        setXREngineSpellHandlerFeed(res.data.xrengine_spell_handler_feed)
        setXREngineBotName(res.data.xrengine_bot_name)
        setXREngineBotNameRegex(res.data.xrengine_bot_name_regex)
        setXREngineStartingWords(res.data.xrengine_starting_words)
        setXREngineEmptyResponses(res.data.xrengine_empty_responses)

        setTwitterClientEnable(res.data.twitter_client_enable === true)
        setTwitterToken(res.data.twitter_token)
        setTwitterId(res.data.twitter_id)
        setTwitterAppToken(res.data.twitter_app_token)
        setTwitterAppTokenSecret(res.data.twitter_app_token_secret)
        setTwitterAccessToken(res.data.twitter_access_token)
        setTwitterAccessTokenSecret(res.data.twitter_access_token_secret)
        setTwitterBotName(res.data.twitter_bot_name)
        setTwitterBotNameRegex(res.data.twitter_bot_name_regex)

        // setTwilioClientEnable(res.data.twilio_client_enable === true)
        // setTwilioSid(res.data.twilio_sid)
        // setTwilioAuthToken(res.data.twilio_auth_token)
        // setTwilioPhoneNumber(res.data.twilio_phone_number)

        setLoaded(true)
      })()
    }
  }, [loaded])

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ROOT_URL}/game/spells`
      )
      setSpellList(res.data)
    })()
  }, [])

  const _delete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_ROOT_URL}/entity/` + id)
      .then(res => {
        console.log('deleted', res)
        if (res.data === 'internal error') {
          alert('Server Error deleting entity with id: ' + id)
        } else {
          alert('Entity with id: ' + id + ' deleted successfully')
        }
        setLoaded(false)
        updateCallback()
      })
  }

  const update = () => {
    console.log('Update called')
    const _data = {
      enabled,
      discord_enabled,
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      discord_empty_responses,
      discord_spell_handler_incoming,
      discord_spell_handler_update,
      discord_spell_handler_feed,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      xrengine_enabled,
      xrengine_url,
      xrengine_spell_handler_incoming,
      xrengine_spell_handler_update,
      xrengine_spell_handler_feed,
      xrengine_bot_name,
      xrengine_bot_name_regex,
      xrengine_starting_words,
      xrengine_empty_responses,
      twitter_client_enable,
      twitter_token,
      twitter_id,
      twitter_app_token,
      twitter_app_token_secret,
      twitter_access_token,
      twitter_access_token_secret,
      twitter_bot_name,
      twitter_bot_name_regex,
      // twilio_client_enable,
      // twilio_sid,
      // twilio_auth_token,
      // twilio_phone_number
    }
    axios
      .post(`${process.env.REACT_APP_API_ROOT_URL}/entity`, {
        id,
        data: _data,
      })
      .then(res => {
        if (res.data === 'internal error') {
          alert('internal error updating entity')
        } else {
          alert('updated entity')
          console.log('response on update', JSON.parse(res.config.data).data)
          let responseData = res && JSON.parse(res?.config?.data).data
          console.log(responseData, 'responseDataresponseData')
          setEnabled(responseData.enabled)
          setDiscordEnabled(responseData.discord_enabled)
          setDiscordApiKey(responseData.discord_api_key)
          setDiscordStartingWords(responseData.discord_starting_words)
          setDiscordBotNameRegex(responseData.discord_bot_name_regex)
          setDiscordBotName(responseData.discord_bot_name)
          setDiscordEmptyResponses(responseData.discord_empty_responses)
          setDiscordSpellHandlerIncoming(
            responseData.discord_spell_handler_incoming
          )
          setDiscordSpellHandlerUpdate(
            responseData.discord_spell_handler_update
          )
          setDiscordSpellHandlerFeed(responseData.discord_spell_handler_feed)
          setXREngineSpellHandlerIncoming(
            responseData.xrengine_spell_handler_incoming
          )
          setXREngineSpellHandlerUpdate(
            responseData.xrengine_spell_handler_update
          )
          setXREngineSpellHandlerFeed(responseData.xrengine_spell_handler_feed)
          setXREngineBotName(responseData.xrengine_bot_name)
          setXREngineBotNameRegex(responseData.xrengine_bot_name_regex)
          setXREngineStartingWords(responseData.xrengine_starting_words)
          setXREngineEmptyResponses(responseData.xrengine_empty_responses)

          setTwitterClientEnable(responseData.twitter_client_enable)
          setTwitterToken(responseData.twitter_token)
          setTwitterId(responseData.twitter_id)
          setTwitterAppToken(responseData.twitter_app_token)
          setTwitterAppTokenSecret(responseData.twitter_app_token_secret)
          setTwitterAccessToken(responseData.twitter_access_token)
          setTwitterAccessTokenSecret(responseData.twitter_access_token_secret)
          setTwitterBotName(responseData.twitter_bot_name)
          setTwitterBotNameRegex(responseData.twitter_bot_name_regex)

          // setTwilioClientEnable(responseData.twilio_client_enable)
          // setTwilioSid(responseData.twilio_sid)
          // setTwilioAuthToken(responseData.twilio_auth_token)
          // setTwilioPhoneNumber(responseData.twilio_phone_number)

          updateCallback()
        }
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
      <div className="form-item">
        <span className="form-item-label">Voice Enabled</span>
        <input
          type="checkbox"
          value={use_voice}
          defaultChecked={use_voice || use_voice === 'true'}
          onChange={e => {
            setUseVoice(e.target.checked)
          }}
        />
      </div>

      {use_voice && (
        <React.Fragment>
          <div className="form-item agent-select">
            <span className="form-item-label">Voice Provider</span>
            <select
              name="voice_provider"
              id="voice_provider"
              value={voice_provider}
              onChange={event => {
                setVoiceProvider(event.target.value)
              }}
            >
              <option value={'google'}>Google</option>
              <option value={'uberduck'}>Uberduck</option>
            </select>
          </div>

          <div className="form-item">
            <span className="form-item-label">Character</span>
            <input
              type="text"
              defaultValue={voice_character}
              onChange={e => {
                setVoiceCharacter(e.target.value)
              }}
            />
          </div>

          <div className="form-item">
            <span className="form-item-label">Language Code</span>
            <input
              type="text"
              defaultValue={voice_language_code}
              onChange={e => {
                setVoiceLanguageCode(e.target.value)
              }}
            />
          </div>
        </React.Fragment>
      )}

      {enabled && (
        <>
          <div className="form-item">
            <span className="form-item-label">Discord Enabled</span>
            <input
              type="checkbox"
              value={discord_enabled}
              defaultChecked={discord_enabled || discord_enabled === 'true'}
              onChange={e => {
                setDiscordEnabled(e.target.checked)
              }}
            />
          </div>

          {discord_enabled && (
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
                <span className="form-item-label">Discord Starting Words</span>
                <input
                  type="text"
                  defaultValue={discord_starting_words}
                  onChange={e => {
                    setDiscordStartingWords(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name_regex}
                  onChange={e => {
                    setDiscordBotNameRegex(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name}
                  onChange={e => {
                    setDiscordBotName(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Empty Responses</span>
                <input
                  type="text"
                  defaultValue={discord_empty_responses}
                  onChange={e => {
                    setDiscordEmptyResponses(e.target.value)
                  }}
                />
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">
                  Spell Handler (Incoming Message Handler)
                </span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={discord_spell_handler_incoming}
                  onChange={event => {
                    setDiscordSpellHandlerIncoming(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Interval Update Handler</span>
                <select
                  name="spellHandlerUpdate"
                  id="spellHandlerUpdate"
                  value={discord_spell_handler_update}
                  onChange={event => {
                    setDiscordSpellHandlerUpdate(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Event Feed Handler</span>
                <select
                  name="spellHandlerFeed"
                  id="spellHandlerFeed"
                  value={discord_spell_handler_feed}
                  onChange={event => {
                    setDiscordSpellHandlerFeed(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          <div className="form-item">
            <span className="form-item-label">XREngine Enabled</span>
            <input
              type="checkbox"
              value={xrengine_enabled}
              defaultChecked={xrengine_enabled || xrengine_enabled === 'true'}
              onChange={e => {
                setxrengine_enabled(e.target.checked)
              }}
            />
          </div>

          {xrengine_enabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Room URL</span>
                <input
                  type="text"
                  defaultValue={xrengine_url}
                  onChange={e => {
                    setXREngineUrl(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Starting Words</span>
                <input
                  type="text"
                  defaultValue={xrengine_starting_words}
                  onChange={e => {
                    setXREngineStartingWords(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={xrengine_bot_name_regex}
                  onChange={e => {
                    setXREngineBotNameRegex(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Bot Name</span>
                <input
                  type="text"
                  defaultValue={xrengine_bot_name}
                  onChange={e => {
                    setXREngineBotName(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Empty Responses</span>
                <input
                  type="text"
                  defaultValue={xrengine_empty_responses}
                  onChange={e => {
                    setXREngineEmptyResponses(e.target.value)
                  }}
                />
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">
                  Spell Handler (Incoming Message Handler)
                </span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={xrengine_spell_handler_incoming}
                  onChange={event => {
                    setXREngineSpellHandlerIncoming(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Interval Update Handler</span>
                <select
                  name="spellHandlerUpdate"
                  id="spellHandlerUpdate"
                  value={xrengine_spell_handler_update}
                  onChange={event => {
                    setXREngineSpellHandlerUpdate(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Event Feed Handler</span>
                <select
                  name="spellHandlerFeed"
                  id="spellHandlerFeed"
                  value={xrengine_spell_handler_feed}
                  onChange={event => {
                    setXREngineSpellHandlerFeed(event.target.value)
                  }}
                >
                  {spellList.length > 0 &&
                    spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          <div className="form-item">
            <span className="form-item-label">Twitter Client Enabled</span>
            <input
              type="checkbox"
              value={twitter_client_enable}
              defaultChecked={
                twitter_client_enable || twitter_client_enable === 'true'
              }
              onChange={e => {
                setTwitterClientEnable(e.target.checked)
              }}
            />
          </div>

          {twitter_client_enable && (
            <>
              <div className="form-item">
                <span className="form-item-label">Bearer Token</span>
                <input
                  type="text"
                  defaultValue={twitter_token}
                  onChange={e => {
                    setTwitterToken(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Twitter ID</span>
                <input
                  type="text"
                  defaultValue={twitter_id}
                  onChange={e => {
                    setTwitterId(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Twitter App Token</span>
                <input
                  type="text"
                  defaultValue={twitter_app_token}
                  onChange={e => {
                    setTwitterAppToken(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">
                  Twitter App Token Secret
                </span>
                <input
                  type="text"
                  defaultValue={twitter_app_token_secret}
                  onChange={e => {
                    setTwitterAppTokenSecret(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Twitter Access Token</span>
                <input
                  type="text"
                  defaultValue={twitter_access_token}
                  onChange={e => {
                    setTwitterAccessToken(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">
                  Twitter Access Token Secret
                </span>
                <input
                  type="text"
                  defaultValue={twitter_access_token_secret}
                  onChange={e => {
                    setTwitterAccessTokenSecret(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Bot Name</span>
                <input
                  type="text"
                  defaultValue={twitter_bot_name}
                  onChange={e => {
                    setTwitterBotName(e.target.value)
                  }}
                />
              </div>
              <div className="form-item">
                <span className="form-item-label">Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={twitter_bot_name_regex}
                  onChange={e => {
                    setTwitterBotNameRegex(e.target.value)
                  }}
                />
              </div>
            </>
          )}
          {/* <div className="form-item">
            <span className="form-item-label">Twilio Client Enabled</span>
            <input
              type="checkbox"
              value={twilio_client_enable}
              defaultChecked={twilio_client_enable || twilio_client_enable === 'true'}
              onChange={e => {
                setTwilioClientEnable(e.target.checked)
              }}
            />
          </div> */}

          {/* {twilio_client_enable &&
            (
              <>
                <div className="form-item">
                  <span className="form-item-label">Twilio Account SID</span>
                  <input
                    type="text"
                    defaultValue={twilio_sid}
                    onChange={e => {
                      setTwilioSid(e.target.value)
                    }}
                  />
                </div>
                <div className="form-item">
                  <span className="form-item-label">Twilio Auth Token</span>
                  <input
                    type="text"
                    defaultValue={twilio_auth_token}
                    onChange={e => {
                      setTwilioAuthToken(e.target.value)
                    }}
                  />
                </div>
                <div className="form-item">
                  <span className="form-item-label">Twilio Phone Number</span>
                  <input
                    type="text"
                    defaultValue={twilio_phone_number}
                    onChange={e => {
                      setTwilioPhoneNumber(e.target.value)
                    }}
                  />
                </div>
              </>
            )
          } */}
        </>
      )}
      <div className="form-item entBtns">
        <button onClick={() => update()} style={{ marginRight: '10px' }}>
          Update
        </button>
        <button onClick={() => _delete()}>Delete</button>
      </div>
    </div>
  )
}

export default EntityWindow
