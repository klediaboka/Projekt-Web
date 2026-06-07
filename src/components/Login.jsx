import { useState } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setUser } from '../store/slices/userSlice'
import { useLoginMutation } from '../store/apis/userApi'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await login({ email, password })

    if (response.error) {
      toast.error(
        response.error.data?.message ||
        response.error.error ||
        'Hyrja dështoi'
      )
    } else {
      dispatch(setUser(response.data))
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/')
      toast.success('Mirë se vini!')
    }
  }

  return (
    <>
      <section className='heading'>
        <h1><FaSignInAlt /> Hyrje në TalentAL</h1>
        <p>Hyni dhe filloni të gjeni projekte ose freelancerë</p>
      </section>

      <section className='form'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input type='email' className='form-control' name='email'
              value={email} onChange={onChange} placeholder='Email' required />
          </div>
          <div className='form-group'>
            <input type='password' className='form-control' name='password'
              value={password} onChange={onChange} placeholder='Fjalëkalimi' required />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-primary btn-block' disabled={isLoading}>
              {isLoading ? 'Ju lutem prisni...' : 'Hyr'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login
