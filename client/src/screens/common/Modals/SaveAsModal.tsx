import { useState } from 'react'
import { useSnackbar } from 'notistack'
import {
  useGetSpellQuery,
  useSaveSpellMutation,
} from '../../../state/api/spells'
import { useTabManager } from '../../../contexts/TabManagerProvider'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'

const EditSpellModal = ({ tab, closeModal }) => {
  const [error, setError] = useState('')
  const [saveSpell, { isLoading }] = useSaveSpellMutation()
  const { data: spell } = useGetSpellQuery(tab.spell, {
    skip: !tab.spell,
  })
  const { openTab } = useTabManager()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    const saveResponse: any = await saveSpell({
      ...spell,
      name: data.name,
    })

    if (saveResponse.error) {
      // show snackbar
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      setError(saveResponse.error.message)
      return
    }

    enqueueSnackbar('Spell saved', { variant: 'success' })

    // show snackbar
    // open a new tab to the new spell
    await openTab({
      name: data.name,
      spellId: data.name,
      type: 'spell',
    })

    closeModal()
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'Save spell as',
      onClick: onSubmit,
      disabled: isLoading,
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
              defaultValue={tab.spell}
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
