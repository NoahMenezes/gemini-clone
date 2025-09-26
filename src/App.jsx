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
    // The .app-wrapper is necessary for positioning the button
    <div className="app-wrapper">
      {/* The inline style has been removed.
        The className now correctly applies the centering styles from App.css.
      */}
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="theme-toggle-button"
      >
        Change theme
      </button>

      <Sidebar />
      <Main />
    </div>
  );
}

export default App;