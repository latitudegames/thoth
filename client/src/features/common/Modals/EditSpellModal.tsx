import { useState } from 'react'
// import { useModal } from '../../../contexts/ModalProvider'
import { usePatchSpellMutation } from '../../../state/spells'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'

const EditSpellModal = ({ content, spellId, name }) => {
  const [error, setError] = useState('')
  const [patchSpell] = usePatchSpellMutation()

  // const { closeModal } = useModal()
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    const response: any = await patchSpell({ spellId, update: data })

    if (response.error) {
      setError(response.error.message)
    }
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'save',
      onClick: onSubmit,
    },
  ]

  return (
    <Modal title="Edit Spell" options={options} icon="info">
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{error}</span>}
        <form>
          {/* register your input into the hook by invoking the "register" function */}
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Spell name
            </label>
            <input
              type="text"
              className={css['input']}
              defaultValue={name}
              {...register('name')}
            />
          </div>
          {/* errors will return when field validation fails  */}
          {/* {errors.password && <span>This field is required</span>} */}
        </form>
      </div>
    </Modal>
  )
}

export default EditSpellModal
