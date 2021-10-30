import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAuth } from '../../../contexts/AuthProvider'
import { useModal } from '../../../contexts/ModalProvider'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useNavigate } from 'react-router-dom'

const LoginModal = ({ title, onClose }) => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { login } = useAuth()
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

    if (response.id) {
      closeModal()
      navigate('/home')
    }
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'login',
      onClick: onSubmit,
    },
  ]

  return (
    <Modal title={title} icon="info" onClose={onClose} options={options}>
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{error}</span>}
        <form>
          {/* register your input into the hook by invoking the "register" function */}
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Email
            </label>
            <input
              type="text"
              className={css['input']}
              defaultValue="test"
              {...register('email', { required: true })}
            />
          </div>

          {/* include validation with required or other standard HTML validation rules */}
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Password
            </label>
            <input
              type="text"
              className={css['input']}
              {...register('password', { required: true })}
            />
          </div>
          {/* errors will return when field validation fails  */}
          {errors.password && <span>This field is required</span>}
        </form>
      </div>
    </Modal>
  )
}

export default LoginModal
