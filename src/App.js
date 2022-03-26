import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css'

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { currentUserSelector } from './redux/user/user.selector'
import { gettingHospitalStart } from './redux/data/data.actions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashbaord/Dashboard'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'

function App() {
  const user = useSelector(currentUserSelector)
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(gettingHospitalStart())
    // dispatch(gettingAppointmentsStart())
    // gettingAppointmentsFromDb().then((res) =>
    //   setEvents(
    //     res.map((event) => ({
    //       start: event.dateAndTime,
    //       end: moment(event.dateAndTime).add('1h'),
    //       title: event.reason,
    //       ...event,
    //       color: '#7bde83',
    //     }))
    //   )
    // )
  }, [])
  return (
    <div>
      <MuiThemeProvider>
        <HashRouter>
          <Routes>
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" replace />}
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
            />
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />
          </Routes>
        </HashRouter>
        <ToastContainer />
      </MuiThemeProvider>
    </div>
  )
}

export default App
