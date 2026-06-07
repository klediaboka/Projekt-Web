import { FaSignInAlt, FaSignOutAlt, FaUser, FaBriefcase, FaClipboardList, FaHome } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/slices/userSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className='navbar'>
      <div className='nav-inner'>
        <Link to='/' className='nav-logo'>💼 TalentAL</Link>

        <ul className='nav-links'>
          {user ? (
            <>
              <li><Link to='/'><FaHome /> Home</Link></li>
              <li><Link to='/projects'><FaBriefcase /> Projekte</Link></li>

              {user.role === 'client' && (
                <li><Link to='/my-projects'><FaClipboardList /> Projektet e mia</Link></li>
              )}
              {user.role === 'freelancer' && (
                <li><Link to='/applications'><FaClipboardList /> Aplikimet e mia</Link></li>
              )}

              <li>
                <span className='nav-user'>👋 {user.name} <span className='role-badge'>{user.role}</span></span>
              </li>
              <li>
                <button className='btn-logout' onClick={handleLogout}>
                  <FaSignOutAlt /> Dil
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to='/login'><FaSignInAlt /> Hyrje</Link></li>
              <li><Link to='/register' className='btn-register'><FaUser /> Regjistrohu</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Header
