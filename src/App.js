import React, { lazy, useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import initializeApp from './app/init';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-dark-blue/theme.css";

// Importing pages
const Layout = lazy(() => import('./containers/Layout'))



// Initializing different libraries
initializeApp()



function App() {

  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false)
  }, [])


  return (
    <>
      <PrimeReactProvider>
        <Router>
          <Routes>
            
            {/* Place new routes over this */}
            <Route path="/app/*" element={<Layout />} />

            <Route path="*" element={<Navigate to={"/app/dashboard"} replace />}/>

          </Routes>
        </Router>
      </PrimeReactProvider>
    </>
  )
}

export default App
