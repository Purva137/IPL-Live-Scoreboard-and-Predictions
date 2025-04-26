import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './PointsTable.css'

const PointsTable = () => {

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        async function fetchPointsTable() {
            try {
                const res = await axios.get('https://api.cricapi.com/v1/series_points?apikey=b9e3efc3-0fcc-4d0d-b58a-680e27e8ecfb&id=d5a498c8-7596-4b93-8ab0-e0efc3345312');
                
                if (res.data && Array.isArray(res.data.data)) {
                    const sortedTeams = res.data.data.sort((a, b) => {
                        if (b.wins !== a.wins) {
                            return b.wins - a.wins;
                        }
                        if (b.loss !== a.loss) {
                            return a.loss - b.loss;
                        }
                        return a.matches - b.matches;
                    });
                    setTeams(sortedTeams);
                } else {
                    console.error('Invalid data format:', res.data);
                }
            } catch (error) {
                console.error('Error fetching points table:', error);
            }
        }
        fetchPointsTable();
    }, []);
    
  return (
    <div className='points-table-container'>
      <h1>IPL 2025 Points Table</h1>
      <table className='points-table'>
        <thead>
            <tr>
                <th>#</th>
                <th></th>
                <th>Team</th>
                <th>Matches</th>
                <th>Won</th>
                <th>Lost</th>
                <th>NR</th>
            </tr>
        </thead>
        <tbody>
            {teams.map((team, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <img src={team.img} alt={team.shortname} className="team-logo" />
                    </td>
                    <td>{team.teamname}</td>
                    <td>{team.matches}</td>
                    <td>{team.wins}</td>
                    <td>{team.loss}</td>
                    <td>{team.nr}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default PointsTable;
