//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { VscNewFile, VscTrash } from 'react-icons/vsc';
import { FaEdit } from 'react-icons/fa';
import SearchCorpusDocument from './SearchCorpusDocument';
import { useModal } from '@/contexts/ModalProvider';
import { store } from '@/state/store';

const SearchCorpus = () => {
  const [documentsStores, setDocumentsStores] = useState(null)
  const { openModal } = useModal()
  const storeRef = useRef(null)
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

  const getDocumentsStores = async () => {
    console.log('get documents store');
    const res = await axios.get(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document-store`
    )
    console.log('stores ::: ', res.data);
    setDocumentsStores(res.data)
  }

  const switchDocumentStore = (storeId) => {
    console.log('storeId ::: ', storeId);
  }

  const openAddEditModal = (opType) => {
    let store = null;
    if(opType === 'edit') {
      store = documentsStores.filter(store => store.id === parseInt(storeRef.current.value))[0]
    } else store = ''
    openModal({
      modal: 'documentStoreAddEditModal',
      opType,
      getDocumentsStores,
      store
    })
  }

  const openDeleteStoreModal = () => {
    let store = documentsStores.filter(store => store.id === parseInt(storeRef.current.value))[0]
    openModal({
      modal: 'documentStoreDeleteModal',
      store,
      getDocumentsStores
    })
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
    await getDocumentsStores()
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
              ref={storeRef}
              onChange={event => {
                event.preventDefault()
                switchDocumentStore(event.target.value)
              }}
            >
              {documentsStores && 
                documentsStores.map(store => (
                  <option value={store.id}>{store.name}</option>
                ))
              }
            </select>
          </span>
          <span className="search-corpus-btns">
            <VscNewFile size={20} color="#A0A0A0" onClick={() => openAddEditModal('add')}/>
            <FaEdit size={20} color="#A0A0A0" onClick={() => openAddEditModal('edit')}/>
            <VscTrash size={20} color="#A0A0A0" onClick={() => openDeleteStoreModal()}/>
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
