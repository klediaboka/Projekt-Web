import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { setUser, logoutUser } from '../store/slices/userSlice'
import { useUpdateProfileMutation, useDeleteAccountMutation } from '../store/apis/userApi'

const Profile = () => {
  const user     = useSelector(s => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation()

  const [activeTab, setActiveTab] = useState('info')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [infoForm, setInfoForm] = useState({
    name:   user?.name           || '',
    bio:    user?.bio            || '',
    skills: user?.skills?.join(', ') || '',
  })

  const [passForm, setPassForm] = useState({
    password:  '',
    password2: '',
  })

  if (!user) { navigate('/login'); return null }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // ── Përditëso info ──────────────────────────────────────────────────────────
  const handleInfoSubmit = async e => {
    e.preventDefault()
    const res = await updateProfile({
      name:   infoForm.name,
      bio:    infoForm.bio,
      skills: infoForm.skills.split(',').map(s => s.trim()).filter(Boolean),
    })
    if (res.error) {
      toast.error(res.error.data?.message || 'Gabim gjatë përditësimit')
    } else {
      dispatch(setUser(res.data))
      localStorage.setItem('user', JSON.stringify(res.data))
      toast.success('Profili u përditësua!')
    }
  }

  // ── Ndrysho fjalëkalimin ────────────────────────────────────────────────────
  const handlePassSubmit = async e => {
    e.preventDefault()
    if (passForm.password.length < 6) {
      toast.error('Fjalëkalimi duhet të ketë të paktën 6 karaktere'); return
    }
    if (passForm.password !== passForm.password2) {
      toast.error('Fjalëkalimet nuk përputhen'); return
    }
    const res = await updateProfile({ password: passForm.password })
    if (res.error) {
      toast.error(res.error.data?.message || 'Gabim')
    } else {
      dispatch(setUser(res.data))
      localStorage.setItem('user', JSON.stringify(res.data))
      setPassForm({ password: '', password2: '' })
      toast.success('Fjalëkalimi u ndryshua!')
    }
  }

  // ── Fshi llogarinë ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    const res = await deleteAccount()
    if (res.error) {
      toast.error(res.error.data?.message || 'Gabim')
    } else {
      dispatch(logoutUser())
      localStorage.removeItem('user')
      toast.success('Llogaria u fshi.')
      navigate('/register')
    }
  }

  // ── Stile ───────────────────────────────────────────────────────────────────
  const cardStyle = {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 16, padding: '24px 28px',
  }

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#374151', marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '32px 0 60px' }}>

      {/* ── Karta e profilit ── */}
      <div style={{ ...cardStyle, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, color: '#fff',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{user.name}</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>{user.email}</p>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
            background: user.role === 'client' ? '#fef9c3' : '#dbeafe',
            color:      user.role === 'client' ? '#a16207'  : '#1d4ed8',
          }}>
            {user.role === 'client' ? '🏢 Klient' : '👨‍💻 Freelancer'}
          </span>
          {user.bio && <p style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>{user.bio}</p>}
          {user.skills?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {user.skills.map(s => (
                <span key={s} style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px',
                  background: '#dbeafe', color: '#1d4ed8', borderRadius: 100,
                }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 20 }}>
        {[
          { key: 'info', label: '✏️ Edito Profilin' },
          { key: 'pass', label: '🔒 Ndrysho Fjalëkalimin' },
          { key: 'danger', label: '🗑️ Fshi Llogarinë' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 500,
            color: activeTab === tab.key
              ? (tab.key === 'danger' ? '#dc2626' : '#1d4ed8')
              : '#64748b',
            borderBottom: `2px solid ${activeTab === tab.key
              ? (tab.key === 'danger' ? '#dc2626' : '#1d4ed8')
              : 'transparent'}`,
            marginBottom: -2,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Edito Profilin ── */}
      {activeTab === 'info' && (
        <div style={cardStyle}>
          <form onSubmit={handleInfoSubmit}>
            <div className='form-group'>
              <label style={labelStyle}>Emri i plotë</label>
              <input className='form-control' value={infoForm.name}
                onChange={e => setInfoForm(p => ({ ...p, name: e.target.value }))}
                placeholder='Emri Mbiemri' required />
            </div>
            <div className='form-group'>
              <label style={labelStyle}>Bio</label>
              <textarea className='form-control' rows={3}
                value={infoForm.bio}
                onChange={e => setInfoForm(p => ({ ...p, bio: e.target.value }))}
                placeholder='Trego diçka rreth teje...'
                style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            {user.role === 'freelancer' && (
              <div className='form-group'>
                <label style={labelStyle}>Aftësi (të ndara me presje)</label>
                <input className='form-control' value={infoForm.skills}
                  onChange={e => setInfoForm(p => ({ ...p, skills: e.target.value }))}
                  placeholder='React, Node.js, Figma, MongoDB...' />
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Shto aftësitë e tua të ndara me presje
                </p>
              </div>
            )}
            <button type='submit' className='btn btn-primary' disabled={isUpdating}>
              {isUpdating ? 'Duke ruajtur...' : '💾 Ruaj Ndryshimet'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Ndrysho Fjalëkalimin ── */}
      {activeTab === 'pass' && (
        <div style={cardStyle}>
          <form onSubmit={handlePassSubmit}>
            <div className='form-group'>
              <label style={labelStyle}>Fjalëkalimi i ri</label>
              <input className='form-control' type='password'
                value={passForm.password}
                onChange={e => setPassForm(p => ({ ...p, password: e.target.value }))}
                placeholder='Minimum 6 karaktere' required />
            </div>
            <div className='form-group'>
              <label style={labelStyle}>Konfirmo fjalëkalimin e ri</label>
              <input className='form-control' type='password'
                value={passForm.password2}
                onChange={e => setPassForm(p => ({ ...p, password2: e.target.value }))}
                placeholder='Përsërit fjalëkalimin' required />
            </div>
            <button type='submit' className='btn btn-primary' disabled={isUpdating}>
              {isUpdating ? 'Duke ndryshuar...' : '🔒 Ndrysho Fjalëkalimin'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Fshi Llogarinë ── */}
      {activeTab === 'danger' && (
        <div style={{ ...cardStyle, border: '1px solid #fecaca' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>
            ⚠️ Zona e Rrezikshme
          </h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
            Pasi të fshish llogarinë, të gjitha të dhënat (projektet, aplikimet) do të fshihen
            përgjithmonë. Ky veprim <strong>nuk mund të zhbëhet</strong>.
          </p>

          {!showDeleteConfirm ? (
            <button className='btn btn-danger' onClick={() => setShowDeleteConfirm(true)}>
              🗑️ Fshi Llogarinë
            </button>
          ) : (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: 20,
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 16 }}>
                Je i sigurt? Ky veprim nuk mund të zhbëhet!
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className='btn btn-danger' onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? 'Duke fshirë...' : '✓ Po, fshi llogarinë'}
                </button>
                <button className='btn btn-outline' onClick={() => setShowDeleteConfirm(false)}>
                  ✕ Anulo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default Profile
