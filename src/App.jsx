import { BrowserRouter, Routes, Route } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header       from './components/Header'
import Dashboard    from './components/Dashboard'
import Login        from './components/Login'
import Register     from './components/Register'
import Projects     from './components/Projects'
import MyProjects   from './components/MyProjects'
import Applications from './components/Applications'
import Profile      from './components/Profile'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className='container'>
        <Routes>
          <Route path='/'             element={<Dashboard />}    />
          <Route path='/login'        element={<Login />}        />
          <Route path='/register'     element={<Register />}     />
          <Route path='/projects'     element={<Projects />}     />
          <Route path='/my-projects'  element={<MyProjects />}   />
          <Route path='/applications' element={<Applications />} />
          <Route path='/profile'      element={<Profile />}      />
        </Routes>
      </div>
      <ToastContainer position='bottom-right' />
    </BrowserRouter>
  )
}

export default App
