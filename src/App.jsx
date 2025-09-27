// src/App.jsx

import React, { useState, useEffect } from 'react'; // FIX: Imported useState and useEffect
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
    <div className="app-wrapper">
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="theme-toggle-button"
      >
        {/* FIX: Combined the button text into one line */}
        Change Theme
      </button>

      <Sidebar />
      <Main />
    </div>
  );
}

export default App;