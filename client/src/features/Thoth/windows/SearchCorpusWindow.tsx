//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

const SearchCorpus = () => {
  const [documents, setDocuments] = useState([])
  const [newDocument, setNewDocument] = useState({
    agent: '',
    document: '',
    metadata: '',
  })
  const [_update, setUpdate] = useState(false)

  const add = async () => {
    const body = {
      agent: newDocument.agent ?? 'global',
      document: newDocument.document,
      metadata: newDocument.metadata,
    }
    console.log('sending:', body)
    const res = await axios.post(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`,
      body
    )
    newDocument.agent = ''
    newDocument.document = ''
    newDocument.metadata = ''
    console.log('got response:', res.data)

    await getDocuments()
  }

  const _delete = async documentId => {
    const res = await axios.delete(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`,
      {
        params: {
          documentId: documentId,
        },
      }
    )
    console.log('deleted', res)
    await getDocuments()
  }

  const update = async index => {
    const body = {
      documentId: documents[index].documentId,
      agent: documents[index].agent ?? 'global',
      document: documents[index].document,
      metadata: documents[index].metadata,
    }
    const res = await axios.post(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/update_document`,
      body
    )

    await getDocuments()
  }

  const getDocuments = async () => {
    console.log('get documents')
    const res = await axios.get(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/documents`
    )
    console.log('got ', res.data)
    documents.splice(0, documents.length)

    for (let i = 0; i < res.data.length; i++) {
      documents.push(res.data[i])
    }

    const prev = _update
    setUpdate(!_update)
    console.log(
      'update docs: ' + documents.length,
      'first update:',
      prev,
      'new update:',
      _update
    )
  }

  useEffect(async () => {
    await getDocuments()
  }, [])

  return (
    <div className="agent-container">
      <div>
        <span className="create-agent">Create new Document</span>
        <label>
          {' '}
          Agent:
          <input
            type="text"
            defaultValue={newDocument.agent}
            onChange={e => (newDocument.agent = e.target.value)}
          />
        </label>
        <br />
        <label>
          {' '}
          Document:
          <textarea
            defaultValue={newDocument.document}
            onChange={e => (newDocument.document = e.target.value)}
          />
        </label>
        <br />
        <label>
          {' '}
          Metadata:
          <input
            type="text"
            defaultValue={newDocument.metadata}
            onChange={e => (newDocument.metadata = e.target.value)}
          />
        </label>
        <br />
        <button
          className="button"
          type="button"
          onClick={async e => {
            e.preventDefault()
            await add()
          }}
        >
          Create New
        </button>
      </div>
      <div>
        {!documents ? (
          <h1>Loading...</h1>
        ) : (
          <div className="agent-header">
            <h4>Available Documents</h4>
            <br />
            <br />
            {documents.map((document, idx) => {
              return (
                <div id={idx}>
                  <label>
                    Agent:
                    <input
                      type="text"
                      defaultValue={document.agent}
                      onChange={e => (documents[idx].agent = e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Document:
                    <textarea
                      defaultValue={document.document}
                      onChange={e => (documents[idx].document = e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Metadata:
                    <input
                      type="text"
                      defaultValue={document.metadata}
                      onChange={e => (documents[idx].metadata = e.target.value)}
                    />
                  </label>
                  <br />
                  <button type="button" onClick={() => update(idx)}>
                    Updated
                  </button>
                  <br />
                  <button type="button" onClick={() => _delete(document.id)}>
                    Delete
                  </button>
                  <br />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchCorpus
