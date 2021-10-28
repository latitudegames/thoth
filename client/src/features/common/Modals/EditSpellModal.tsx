import { useState } from 'react'
import { useModal } from '../../../contexts/ModalProvider'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'

const EditSpellModal = ({ content }) => {
  const [error, setError] = useState('')

  const { closeModal } = useModal()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    const response: any = await login(data.email, data.password)

    if (response.error) {
      setError(response.error.message)
    }
  })

  const options = [
    { label: 'Oki doki', className: 'primary', onClick: closeModal },
  ]
  return (
    <Modal title="Edit Spell" options={options} icon="info">
      <p> {content} </p>
    </Modal>
  )
}

export default EditSpellModal
