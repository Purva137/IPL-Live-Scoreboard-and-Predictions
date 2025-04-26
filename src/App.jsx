import React, {useEffect, useState} from 'react'
import Navbar from './Components/Navbar'
import Live_score from './Components/Live_score';
import { Routes, Route } from 'react-router-dom';
import PointsTable from './Components/PointsTable';
import PlayerStats from './Components/PlayerStats';
import Predictions from './Components/Predictions';

const App = () => {

  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme}/>
      <Routes>
      <Route path="/" element={<h1>Welcome to IPL Live Scoreboard</h1>} />
        <Route path="/live-score" element={<Live_score />} />
        <Route path="/points-table" element={<PointsTable theme={theme}/>} />
        <Route path="/player-stats" element={<PlayerStats theme={theme} />} />
        <Route path="/predictions" element={<Predictions theme={theme}/>} />
      </Routes>
    </div>
  )
}

export default App
