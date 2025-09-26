import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <button
        onClick={() => setDarkMode(prev => !prev)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          zIndex: 1000,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          backgroundColor: '#4b90ff',
          color: '#fff',
          fontWeight: 'bold'
        }}
      >
        Toggle Theme
      </button>
      <Sidebar />
      <Main />
    </>
  );
}

export default App;
