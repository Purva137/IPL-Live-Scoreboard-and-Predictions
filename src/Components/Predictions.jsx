import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Predictions.css'

const Predictions = ({ theme }) => {
    const [liveMatches, setLiveMatches] = useState([])
    const [teamsData, setTeamsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch live matches
                const liveRes = await axios.get('https://api.cricapi.com/v1/currentMatches?apikey=b9e3efc3-0fcc-4d0d-b58a-680e27e8ecfb&offset=0')
                
                // Validate live matches data
                if (!liveRes.data || !Array.isArray(liveRes.data.data)) {
                    throw new Error('Invalid live matches data format')
                }

                // Filter IPL matches
                const iplMatches = liveRes.data.data.filter(match => 
                    match && match.series_id === "d5a498c8-7596-4b93-8ab0-e0efc3345312"
                    && match.teams && Array.isArray(match.teams) && match.teams.length >= 2
                )
                setLiveMatches(iplMatches)

                // Fetch teams data
                const teamsRes = await axios.get('https://api.cricapi.com/v1/series_points?apikey=b9e3efc3-0fcc-4d0d-b58a-680e27e8ecfb&id=d5a498c8-7596-4b93-8ab0-e0efc3345312')
                
                // Validate teams data
                if (!teamsRes.data || !Array.isArray(teamsRes.data.data)) {
                    throw new Error('Invalid teams data format')
                }
                
                setTeamsData(teamsRes.data.data)
            } catch (error) {
                setError(error.message || 'Failed to fetch data')
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const calculateWinProbability = (team1, team2) => {
        if (!team1 || !team2) return { team1Prob: 50, team2Prob: 50 }

        const team1Data = teamsData.find(t => t?.teamName === team1)
        const team2Data = teamsData.find(t => t?.teamName === team2)

        if (!team1Data?.matches || !team2Data?.matches) {
            return { team1Prob: 50, team2Prob: 50 }
        }

        const team1WinRate = (team1Data.wins / team1Data.matches) * 100 || 0
        const team2WinRate = (team2Data.wins / team2Data.matches) * 100 || 0

        const total = team1WinRate + team2WinRate || 100
        const team1Prob = Math.round((team1WinRate / total) * 100)
        
        return { team1Prob, team2Prob: 100 - team1Prob }
    }

    return (
        <div className={`predictions-container ${theme}`}>
            <h1>Match Predictions</h1>
            
            {loading && <div className="loading">Loading predictions...</div>}
            
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && liveMatches.length === 0 && (
                <div className="no-matches">No live IPL matches currently</div>
            )}

            {!loading && !error && liveMatches.length > 0 && (
                <div className="matches-grid">
                    {liveMatches.map((match, index) => {
                        if (!match?.teams?.[0] || !match?.teams?.[1]) return null

                        const { team1Prob, team2Prob } = calculateWinProbability(
                            match.teams[0],
                            match.teams[1]
                        )

                        return (
                            <div key={index} className="prediction-card">
                                <div className="match-teams">
                                    <div className="team">
                                        <h3>{match.teams[0]}</h3>
                                        <div className="probability">{team1Prob}%</div>
                                    </div>
                                    <div className="vs">VS</div>
                                    <div className="team">
                                        <h3>{match.teams[1]}</h3>
                                        <div className="probability">{team2Prob}%</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Predictions