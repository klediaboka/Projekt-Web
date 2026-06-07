import { useSelector } from 'react-redux'
import { useGetMyApplicationsQuery } from '../store/apis/projectApi'

const STATUS_LABEL = { pending: 'Në pritje', accepted: '✓ U pranua', rejected: '✗ U refuzua' }
const BADGE_CAT = { 'Web Development':'blue','Dizajn':'purple','Marketing':'yellow','Përkthim':'green','Fotografi':'red','Tjetër':'blue' }
const PROJECT_STATUS = { open: 'I hapur', 'in-progress': 'Në progres', closed: '✅ I përfunduar' }

const Applications = () => {
  const user = useSelector(s => s.user)
  const { data: apps = [], isLoading } = useGetMyApplicationsQuery(undefined, { skip: !user })

  if (user?.role !== 'freelancer') return <div className='empty'><p>Vetëm freelancerët kanë aplikime.</p></div>
  if (isLoading) return <div className='spinner'>Duke ngarkuar...</div>

  const accepted = apps.filter(a => a.status === 'accepted')
  const pending  = apps.filter(a => a.status === 'pending')
  const rejected = apps.filter(a => a.status === 'rejected')

  const AppCard = ({ app }) => {
    const isFinished = app.project?.status === 'closed'
    return (
      <div className='card mb-3'>
        <div className='app-full'>
          <div className='app-left'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>{app.project?.title}</h3>
              {isFinished && (
                <span style={{ fontSize: 12, background: '#f0fdf4', color: '#16a34a',
                  padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>
                  ✅ Përfunduar
                </span>
              )}
            </div>
            <div className='meta'>
              <span className={`badge badge-${BADGE_CAT[app.project?.category]||'blue'}`}>
                {app.project?.category}
              </span>
              <span>Buxheti: <strong>{app.project?.budget}€</strong></span>
              <span>Oferta juaj: <strong>{app.price}€</strong></span>
              {app.project?.status && (
                <span style={{ color: app.project.status === 'closed' ? '#16a34a' : '#64748b' }}>
                  {PROJECT_STATUS[app.project.status]}
                </span>
              )}
            </div>
            <p className='app-msg'>"{app.message}"</p>
            <p className='date'>📅 {new Date(app.createdAt).toLocaleDateString('sq-AL')}</p>

            {/* Mesazh urim nëse projekti u përfundua dhe ky ishte accepted */}
            {app.status === 'accepted' && isFinished && (
              <div style={{
                marginTop: 10, padding: '10px 14px', background: '#eff6ff',
                borderRadius: 8, fontSize: 13, color: '#1d4ed8', fontWeight: 500,
              }}>
                🎉 Urime! Ky projekt u përfundua me sukses.
              </div>
            )}
          </div>
          <div className='app-status-col'>
            <span className={`status-badge lg ${app.status}`}>{STATUS_LABEL[app.status]}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='page-header'>
        <h2>Aplikimet e mia</h2>
        <span className='count-badge'>{apps.length} aplikime</span>
      </div>

      {apps.length === 0 ? (
        <div className='empty'>
          <p>Nuk keni aplikuar ende. <a href='/projects'>Shiko projektet →</a></p>
        </div>
      ) : (
        <>
          {accepted.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 10 }}>
                ✓ Të pranuara ({accepted.length})
              </div>
              {accepted.map(a => <AppCard key={a._id} app={a} />)}
            </>
          )}
          {pending.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#a16207', marginBottom: 10, marginTop: 16 }}>
                ⏳ Në pritje ({pending.length})
              </div>
              {pending.map(a => <AppCard key={a._id} app={a} />)}
            </>
          )}
          {rejected.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 10, marginTop: 16 }}>
                ✗ Të refuzuara ({rejected.length})
              </div>
              {rejected.map(a => <AppCard key={a._id} app={a} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Applications
