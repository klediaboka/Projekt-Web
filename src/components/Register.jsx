import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setUser } from '../store/slices/userSlice'
import { useRegisterMutation } from '../store/apis/userApi'

const Register = () => {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password2: '', role: 'freelancer',
  })
  const { name, email, password, password2, role } = formData

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Fjalëkalimet nuk përputhen')
      return
    }

    const response = await register({ name, email, password, role })

    if (response.error) {
      toast.error(
        response.error.data?.message ||
        response.error.error ||
        'Regjistrimi dështoi'
      )
    } else {
      dispatch(setUser(response.data))
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/')
      toast.success('Regjistrimi u krye me sukses!')
    }
  }

  return (
    <>
      <section className='heading'>
        <h1><FaUser /> Regjistrohu në TalentAL</h1>
        <p>Krijo llogarinë tënde si Freelancer ose Klient</p>
      </section>

      <section className='form'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input type='text' className='form-control' name='name'
              value={name} onChange={onChange} placeholder='Emri juaj' required />
          </div>
          <div className='form-group'>
            <input type='email' className='form-control' name='email'
              value={email} onChange={onChange} placeholder='Email' required />
          </div>
          <div className='form-group'>
            <input type='password' className='form-control' name='password'
              value={password} onChange={onChange} placeholder='Fjalëkalimi' required />
          </div>
          <div className='form-group'>
            <input type='password' className='form-control' name='password2'
              value={password2} onChange={onChange} placeholder='Konfirmo fjalëkalimin' required />
          </div>
          <div className='form-group'>
            <select className='form-control' name='role' value={role} onChange={onChange}>
              <option value='freelancer'>Freelancer</option>
              <option value='client'>Klient</option>
            </select>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-primary btn-block' disabled={isLoading}>
              {isLoading ? 'Ju lutem prisni...' : 'Regjistrohu'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register
