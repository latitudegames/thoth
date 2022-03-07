//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { VscNewFile, VscTrash } from 'react-icons/vsc';
import { FaEdit } from 'react-icons/fa';
import SearchCorpusDocument from './SearchCorpusDocument';

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
      documentId: documents[index].id,
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

  const editForm = () => (
    <div>
      <h4>Available Documents</h4>
      {documents.map((document, idx) => {
        return (
          <form id={idx}>
            <div className="form-item">
              <span className="form-item-label">Agent:</span>
              <textarea
                className="form-text-area"
                defaultValue={document.agent}
                onChange={e => (documents[idx].agent = e.target.value)}
              ></textarea>
            </div>
            <div className="form-item">
              <span className="form-item-label">Document:</span>
              <textarea
                className="form-text-area"
                defaultValue={document.document}
                onChange={e => (documents[idx].document = e.target.value)}
              ></textarea>
            </div>
            <div className="form-item">
              <span className="form-item-label">Metadata:</span>
              <textarea
                className="form-text-area"
                defaultValue={document.metadata}
                onChange={e => (documents[idx].metadata = e.target.value)}
              ></textarea>
            </div>
            <br />
            <button type="button" onClick={() => update(idx)}>
              Updated
            </button>
            <br />
            <button type="button" onClick={() => _delete(document.id)}>
              Delete
            </button>
            <br />
          </form>
        )
      })}
    </div>
  )

  useEffect(async () => {
    await getDocuments()
  }, [])

  return (
    <div className="agent-container">
      {!documents ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <span className="search-corpus">
            <select
              name="documents"
              id="documents"
              onChange={event => {
                event.preventDefault()
                // TODO
              }}
            >
              <option value=""></option>
            </select>
          </span>
          <span className="search-corpus-btns">
            <VscNewFile size={20} color="#A0A0A0" />
            <FaEdit size={20} color="#A0A0A0" />
            <VscTrash size={20} color="#A0A0A0" />
          </span>

          <div className="d-flex flex-column search-corpus-documents-list">
            {
              documents.map((document, idx) => (
                <SearchCorpusDocument document={document} key={idx}/>
              ))
            }
            {documents.length === 0 && 'No documents found'}
          </div>

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
      )}
    </div>
  )
}

export default SearchCorpus
