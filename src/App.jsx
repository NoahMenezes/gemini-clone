import { useState } from 'react'

import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar />
      <Main />
    </>
  )
}

export default App
