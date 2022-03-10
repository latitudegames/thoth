//@ts-nocheck
import { useState } from 'react'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import axios from 'axios'
import ContentObject from '@/features/Thoth/windows/ContentObject'

const ContentObjEditModal = ({ contents, getContentObjects }) => {
  
  return (
    <Modal title='Edit Content Objects' icon='add'>
      <form>
        {contents.length > 0 ?
          contents.map(content => (
            <ContentObject content={content} getContentObjects={getContentObjects} key={content.id}/>
          )
        ) : (
          <p>No content objects exists</p>
        )}
      </form>
    </Modal>
  );
}

export default ContentObjEditModal;