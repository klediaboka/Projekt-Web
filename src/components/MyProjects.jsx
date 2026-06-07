import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaPlus, FaTrash, FaUsers, FaCheckCircle } from 'react-icons/fa'
import {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useGetProjectApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from '../store/apis/projectApi'

const CATS = ['Web Development','Dizajn','Marketing','Përkthim','Fotografi','Tjetër']

const STATUS_LABEL = { open: 'I hapur', 'in-progress': 'Në progres', closed: 'I përfunduar' }

// ── Lista e aplikimeve për një projekt ──────────────────────────────────────
const ApplicationsList = ({ projectId }) => {
  const { data: apps = [], isLoading } = useGetProjectApplicationsQuery(projectId)
  const [updateStatus] = useUpdateApplicationStatusMutation()

  const handle = async (id, status) => {
    await updateStatus({ id, status })
    toast.success(status === 'accepted' ? '✓ Aplikimi u pranua!' : 'Aplikimi u refuzua.')
  }

  if (isLoading) return <p className='spinner-sm'>Duke ngarkuar aplikimet...</p>
  if (apps.length === 0) return <p className='no-apps'>Ende nuk ka aplikime.</p>

  return (
    <div className='apps-list'>
      {apps.map(app => (
        <div className='app-item' key={app._id}>
          <div className='app-info'>
            <strong>{app.freelancer?.name}</strong>
            <span className='app-email'>{app.freelancer?.email}</span>
            <p className='app-msg'>"{app.message}"</p>
          </div>
          <div className='app-right'>
            <span className='budget'>{app.price}€</span>
            <span className={`status-badge ${app.status}`}>
              {app.status === 'pending' ? 'Në pritje' : app.status === 'accepted' ? '✓ Pranuar' : '✗ Refuzuar'}
            </span>
            {app.status === 'pending' && (
              <div className='app-btns'>
                <button className='btn btn-success sm' onClick={() => handle(app._id, 'accepted')}>✓ Prano</button>
                <button className='btn btn-danger sm'  onClick={() => handle(app._id, 'rejected')}>✗ Refuzo</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Faqja kryesore MyProjects ───────────────────────────────────────────────
const MyProjects = () => {
  const user = useSelector(s => s.user)
  const { data: projects = [], isLoading } = useGetMyProjectsQuery()
  const [createProject,  { isLoading: isCreating }] = useCreateProjectMutation()
  const [deleteProject]                              = useDeleteProjectMutation()
  const [updateProject]                              = useUpdateProjectMutation()

  const [showForm,  setShowForm]  = useState(false)
  const [openApps,  setOpenApps]  = useState(null)
  const [form, setForm] = useState({ title: '', description: '', budget: '', category: 'Web Development' })

  if (user?.role !== 'client') {
    return <div className='empty'><p>Vetëm klientët mund të postojnë projekte.</p></div>
  }

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleCreate = async e => {
    e.preventDefault()
    const res = await createProject({ ...form, budget: Number(form.budget) })
    if (res.error) { toast.error(res.error.data?.message || 'Gabim') }
    else {
      toast.success('Projekti u postua!')
      setForm({ title: '', description: '', budget: '', category: 'Web Development' })
      setShowForm(false)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('A jeni i sigurt që dëshironi ta fshini këtë projekt?')) return
    await deleteProject(id)
    toast.success('Projekti u fshi.')
    if (openApps === id) setOpenApps(null)
  }

  const handleClose = async (id) => {
    if (!window.confirm('Shënoni projektin si të përfunduar?')) return
    const res = await updateProject({ id, status: 'closed' })
    if (res.error) { toast.error('Gabim gjatë përditësimit') }
    else { toast.success('🎉 Projekti u shënua si i përfunduar!') }
  }

  // Grupim sipas statusit
  const open       = projects.filter(p => p.status === 'open')
  const inProgress = projects.filter(p => p.status === 'in-progress')
  const closed     = projects.filter(p => p.status === 'closed')

  const ProjectCard = ({ proj }) => (
    <div className='card mb-3' key={proj._id}>
      <div className='project-card borderless'>
        <div className='project-info'>
          <div className='project-title-row'>
            <h3>{proj.title}</h3>
            <span className={`status-badge ${proj.status}`}>{STATUS_LABEL[proj.status]}</span>
          </div>
          <p className='project-desc'>{proj.description}</p>
          <div className='meta'>
            <span>📁 {proj.category}</span>
            <span>📅 {new Date(proj.createdAt).toLocaleDateString('sq-AL')}</span>
          </div>
        </div>
        <div className='project-actions'>
          <span className='budget'>{proj.budget}€</span>

          {/* Shiko aplikimet — vetëm nëse jo closed */}
          {proj.status !== 'closed' && (
            <button className='btn btn-secondary sm'
              onClick={() => setOpenApps(openApps === proj._id ? null : proj._id)}>
              <FaUsers /> Aplikimet
            </button>
          )}

          {/* Përfundo — vetëm nëse in-progress */}
          {proj.status === 'in-progress' && (
            <button className='btn btn-success sm' onClick={() => handleClose(proj._id)}>
              <FaCheckCircle /> Përfundo
            </button>
          )}

          {/* Fshi — vetëm nëse open */}
          {proj.status === 'open' && (
            <button className='btn btn-danger sm' onClick={() => handleDelete(proj._id)}>
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* Aplikimet (accordion) */}
      {openApps === proj._id && <ApplicationsList projectId={proj._id} />}

      {/* Mesazh nëse closed */}
      {proj.status === 'closed' && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: '#f0fdf4', borderRadius: 8,
          fontSize: 13, color: '#16a34a', fontWeight: 500,
        }}>
          ✅ Ky projekt është përfunduar me sukses.
        </div>
      )}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className='page-header'>
        <h2>Projektet e mia <span className='count-badge'>{projects.length}</span></h2>
        <button className='btn btn-primary' onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Mbyll' : 'Projekt i ri'}
        </button>
      </div>

      {/* Forma e krijimit */}
      {showForm && (
        <div className='project-form card'>
          <h3>Posto projekt të ri</h3>
          <form onSubmit={handleCreate}>
            <div className='form-group'>
              <input className='form-control' name='title' value={form.title}
                onChange={onChange} placeholder='Titulli' required />
            </div>
            <div className='form-group'>
              <textarea className='form-control' name='description' value={form.description}
                onChange={onChange} placeholder='Përshkruaj projektin...' rows={3}
                style={{ resize: 'vertical', fontFamily: 'inherit' }} required />
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <input className='form-control' type='number' name='budget'
                  value={form.budget} onChange={onChange} placeholder='Buxheti (€)' required />
              </div>
              <div className='form-group'>
                <select className='form-control' name='category' value={form.category} onChange={onChange}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type='submit' className='btn btn-primary' disabled={isCreating}>
              {isCreating ? 'Duke postuar...' : 'Posto'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? <div className='spinner'>Duke ngarkuar...</div> : (
        projects.length === 0 ? (
          <div className='empty'><p>Nuk keni postuar asnjë projekt ende.</p></div>
        ) : (
          <>
            {/* Në progres */}
            {inProgress.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 10, marginTop: 8 }}>
                  🔄 Në Progres ({inProgress.length})
                </div>
                {inProgress.map(p => <ProjectCard key={p._id} proj={p} />)}
              </>
            )}

            {/* Të hapura */}
            {open.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', marginBottom: 10, marginTop: 16 }}>
                  📂 Të hapura ({open.length})
                </div>
                {open.map(p => <ProjectCard key={p._id} proj={p} />)}
              </>
            )}

            {/* Të përfunduara */}
            {closed.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 10, marginTop: 16 }}>
                  ✅ Të përfunduara ({closed.length})
                </div>
                {closed.map(p => <ProjectCard key={p._id} proj={p} />)}
              </>
            )}
          </>
        )
      )}
    </div>
  )
}

export default MyProjects
