import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './PlayerStats.css'
import search_icon_light from '../assets/search-w.png'
import search_icon_dark from '../assets/search-b.png'

const PlayerStats = ({ theme }) => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://api.cricapi.com/v1/series_squad?apikey=b9e3efc3-0fcc-4d0d-b58a-680e27e8ecfb&id=d5a498c8-7596-4b93-8ab0-e0efc3345312")
        console.log('API Response:', response.data) // Add this to debug
        setTeams(response.data.data || [])
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
      setLoading(false)
    }
    fetchTeams()
  }, [])

  // Filter players based on search term
  const filteredTeams = teams.map(team => ({
    ...team,
    players: team.players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(team => team.players.length > 0)

  return (
    <div className="player-stats-container">
      <h1>IPL Teams & Players</h1>
      
      {loading && <div className="loading">Loading...</div>}

      <div className='search-container'>
        <div className='search-box'>
          <input 
            type="text" 
            placeholder='Search Players'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={theme === 'light' ? search_icon_light : search_icon_dark} alt="" />
        </div>
      </div>
            
      <div className="teams-container">
        {filteredTeams.map((team) => (
          <div key={team.shortname} className="team-section">
            <div className="team-header">
              <img src={team.img} alt={team.teamName} className="team-logo" />
              <h2>{team.teamName}</h2>
            </div>
            
            <div className="players-grid">
              {team.players.map((player) => (
                <div key={player.id} className="player-card">
                  <img src={player.playerImg} alt={player.name} className="player-image" />
                  <div className="player-info">
                    <h3>{player.name}</h3>
                    <p><strong>Role:</strong> {player.role}</p>
                    <p><strong>Country:</strong> {player.country}</p>
                    <p><strong>Batting:</strong> {player.battingStyle}</p>
                    {player.bowlingStyle && (
                      <p><strong>Bowling:</strong> {player.bowlingStyle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerStats
