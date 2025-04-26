import React from 'react'
import { Link } from 'react-router-dom'
import'./Navbar.css'
import { Router } from 'react-router-dom'
import ipl_logo from '../assets/ipl_logo.png'
import search_icon_light from '../assets/search-w.png'
import search_icon_dark from '../assets/search-b.png'
import toggle_light from '../assets/night.png'
import toggle_dark from '../assets/day.png'

const Navbar = ({theme, setTheme}) => {

    const toggle_mode = ()=>{
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

  return (
    <div className='navbar'>
      <img src={ipl_logo} alt="Indian Premiere League" className='logo'/>
      <ul>
        <li><Link to="/live-score">Live Score</Link></li>
        <li><Link to="/points-table">Points Table</Link></li>
        <li><Link to="/player-stats">Player Stats</Link></li>
        <li><Link to="/predictions">Predictions</Link></li>
      </ul>

      <img onClick={toggle_mode} src={theme == 'light' ? toggle_light : toggle_dark} alt="" className='toggle-icon'/>
    </div>
  )
}

export default Navbar
