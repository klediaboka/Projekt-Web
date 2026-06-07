import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { FaBriefcase, FaClipboardList, FaPlusCircle, FaUserTie } from 'react-icons/fa'

const Dashboard = () => {
  const user = useSelector((s) => s.user)

  if (!user) {
    return (
      <div className='hero'>
        <h1>Mirë se vini në <span>TalentAL</span></h1>
        <p>Platforma freelancing për të rinjtë shqiptarë.<br/>Gjej projekte, ofro shërbimet tua dhe rrit karrierën.</p>
        <div className='hero-btns'>
          <Link to='/register' className='btn btn-primary'>Fillo tani</Link>
          <Link to='/login'    className='btn btn-outline'>Hyrje</Link>
        </div>
        <div className='hero-stats'>
          <div className='stat'><strong>100+</strong><span>Freelancerë</span></div>
          <div className='stat'><strong>50+</strong><span>Projekte aktive</span></div>
          <div className='stat'><strong>4</strong><span>Kategori</span></div>
        </div>
      </div>
    )
  }

  const isClient = user.role === 'client'

  return (
    <div className='dashboard'>
      <div className='welcome'>
        <h2>Mirë se vini, {user.name}! 👋</h2>
        <p>{isClient ? 'Posto projekte dhe gjej freelancerë talentë.' : 'Gjej projekte dhe apliko tani.'}</p>
      </div>

      <div className='cards-grid'>
        <Link to='/projects' className='dash-card'>
          <FaBriefcase className='dash-icon blue' />
          <h3>Projektet</h3>
          <p>{isClient ? 'Shiko të gjitha projektet' : 'Gjej projekte dhe apliko'}</p>
        </Link>

        {isClient ? (
          <Link to='/my-projects' className='dash-card'>
            <FaPlusCircle className='dash-icon green' />
            <h3>Projektet e mia</h3>
            <p>Menaxho projektet dhe aplikimet</p>
          </Link>
        ) : (
          <Link to='/applications' className='dash-card'>
            <FaClipboardList className='dash-icon purple' />
            <h3>Aplikimet e mia</h3>
            <p>Shiko statusin e aplikimeve</p>
          </Link>
        )}

        <Link to='/profile' className='dash-card'>
          <FaUserTie className='dash-icon orange' />
          <h3>Profili im</h3>
          <p>{user.email}</p>
          <span className='role-badge lg'>{user.role}</span>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
