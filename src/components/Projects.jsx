import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import Spinner from './Spinner'
import { useGetProjectsQuery, useApplyToProjectMutation } from '../store/apis/projectApi'

const CATS = ['Të gjitha','Web Development','Dizajn','Marketing','Përkthim','Fotografi','Tjetër']
const BADGE = { 'Web Development':'blue','Dizajn':'purple','Marketing':'yellow','Përkthim':'green','Fotografi':'red','Tjetër':'blue' }

const Projects = () => {
  const user = useSelector((s) => s.user)
  const [category, setCategory] = useState('Të gjitha')
  const [search, setSearch]     = useState('')
  const [applyForm, setApplyForm] = useState(null) // projectId
  const [appData, setAppData]   = useState({ message: '', price: '' })

  const params = {}
  if (category !== 'Të gjitha') params.category = category
  if (search) params.search = search

  const { data: projects = [], isLoading } = useGetProjectsQuery(params)
  const [applyToProject, { isLoading: isApplying }] = useApplyToProjectMutation()

  const handleApply = async (e) => {
    e.preventDefault()
    const res = await applyToProject({ projectId: applyForm, ...appData, price: Number(appData.price) })
    if (res.error) {
      toast.error(res.error.data?.message || 'Gabim gjatë aplikimit')
    } else {
      toast.success('Aplikimi u dërgua me sukses!')
      setApplyForm(null)
      setAppData({ message: '', price: '' })
    }
  }

  return (
    <div>
      <div className='page-header'>
        <h2>Projektet e disponueshme</h2>
        <div className='search-box'>
          <FaSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Kërko projekte...' />
        </div>
      </div>

      {/* Kategoritë */}
      <div className='filter-row'>
        {CATS.map(c => (
          <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {isLoading ? <Spinner />  : (
        projects.length === 0 ? <div className='empty'><p>Nuk ka projekte.</p></div> : (
          projects.map(proj => (
            <div className='project-card' key={proj._id}>
              <div className='project-info'>
                <div className='project-title-row'>
                  <h3>{proj.title}</h3>
                  <span className={`badge badge-${BADGE[proj.category]||'blue'}`}>{proj.category}</span>
                </div>
                <p className='project-desc'>{proj.description}</p>
                <div className='meta'>
                  <span>👤 {proj.user?.name}</span>
                  <span>📅 {new Date(proj.createdAt).toLocaleDateString('sq-AL')}</span>
                </div>
              </div>
              <div className='project-actions'>
                <span className='budget'>{proj.budget}€</span>
                {user?.role === 'freelancer' && (
                  <button className='btn btn-primary sm' onClick={() => setApplyForm(proj._id)}>
                    Apliko
                  </button>
                )}
              </div>
            </div>
          ))
        )
      )}

      {/* Modal aplikimi */}
      {applyForm && (
        <div className='modal-overlay' onClick={() => setApplyForm(null)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h3>Dërgo Aplikim</h3>
            <form onSubmit={handleApply}>
              <div className='form-group'>
                <label>Çmimi juaj (€)</label>
                <input className='form-control' type='number' value={appData.price}
                  onChange={e => setAppData(p => ({...p, price: e.target.value}))}
                  placeholder='Oferta juaj' required />
              </div>
              <div className='form-group'>
                <label>Mesazhi</label>
                <textarea className='form-control' rows={4} value={appData.message}
                  onChange={e => setAppData(p => ({...p, message: e.target.value}))}
                  placeholder='Përshkruaj pse jeni kandidati ideal...' required />
              </div>
              <div className='modal-btns'>
                <button type='button' className='btn btn-outline' onClick={() => setApplyForm(null)}>Anulo</button>
                <button type='submit' className='btn btn-primary' disabled={isApplying}>
                  {isApplying ? 'Duke dërguar...' : 'Dërgo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
