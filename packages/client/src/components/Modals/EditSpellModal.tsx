import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { usePatchSpellMutation } from '../../state/api/spells'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'

const EditSpellModal = ({ closeModal, spellId, name, tab }) => {
  const [error, setError] = useState('')
  const [patchSpell, { isLoading }] = usePatchSpellMutation()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    const response: any = await patchSpell({ spellId, update: data })

    if (response.error) {
      setError(response.error.data.error.message)
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', { variant: 'success' })

    if (data.name)
      await updateTab(tab.id, { name: data.name, spell: data.name })

    closeModal()
  })

  // notes
  // after you save the spell, you need to refetch it?a

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'save',
      onClick: onSubmit,
      disabled: isLoading,
    },
  ]

  return (
    <Modal title="Edit Spell" options={options} icon="info">
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{error}</span>}
        <p>
          Warning: Changing the name of your spell currently will break the url
          of your spell deployment. If you rename your spell, please change the
          url for any urls you are using in production.
        </p>
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
function updateTab(id: any, arg1: { name: any; spell: any }) {
  throw new Error('Function not implemented.')
}
