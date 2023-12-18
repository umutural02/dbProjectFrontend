import DashboardStats from './components/DashboardStats'
import AmountStats from './components/AmountStats'
import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
import MostValueablePlayers from './components/MostValueablePlayers'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { API } from '../../utils/globalConstantUtil'
import axios from 'axios'
import MostValueableTeams from './components/MostValueableTeams'


function Dashboard(){
        
    const dispatch = useDispatch()
    
    const [allData, setAllData] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [statsData, setStatsData] = useState([])

    useEffect(() => {
        
        console.log("Dashboard")
        axios.get(API.BASE_URL + 'getDashboard', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            console.log(response.data)
            setAllData(response.data);
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    },[refresh])

    useEffect(() => {
        setStatsData([
            {title : "Player Count", value : allData.playerCount, icon : <UserGroupIcon className='w-8 h-8'/>},
            {title : "Team Count", value : allData.teamCount, icon : <CreditCardIcon className='w-8 h-8'/>},
            {title : "League Count", value : allData.leagueCount, icon : <CircleStackIcon className='w-8 h-8'/>},
            {title : "Stadium Count", value : allData.stadiumCount, icon : <UsersIcon className='w-8 h-8'/>},
        ])
    },[allData])

    return(
        <>
            <div className="d-flex">
                <div className="text-right ">
                    <button onClick={() => setRefresh(!refresh)} className="btn btn-ghost btn-sm normal-case"><ArrowPathIcon className="w-4 mr-2"/>Refresh Data</button>
                </div>
            </div>
        
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>

            <div className="grid lg:grid-cols mt-4 grid-cols-1 gap-6">
                <div className="grid lg:grid-cols-2 mt-6 grid-cols-1 gap-6">
                    <div className="stats bg-base-100 shadow">
                        {allData.mostCrowdedLeague && <AmountStats title="Most Crowded League" data={allData.mostCrowdedLeague.playerAmount} name={allData.mostCrowdedLeague.leagueName} />}
                        {allData.mostCrowdedTeam && <AmountStats title="Most Crowded Team" data={allData.mostCrowdedTeam.playerAmount} name={allData.mostCrowdedTeam.teamName}/>}
                    </div>
                    <div className='grid lg:grid-cols-2 gap-6'>
                        <div className="stats bg-base-100 shadow">
                            {allData.mostScoringTeam && <AmountStats title="Most Scoring Team" data={allData.mostScoringTeam.goalsFor} name={allData.mostScoringTeam.teamName}/>}
                        </div>
                        <div className="stats bg-base-100 shadow">
                            {allData.mostCapaciousStadium && <AmountStats title="Most Capacious Stadium" data={allData.mostCapaciousStadium.capacity} name={allData.mostCapaciousStadium.stadiumName}/>}
                        </div>
                    </div>
                    
                </div>
                
            </div>
        
            <div className="grid lg:grid-cols-2 mt-6 grid-cols-1 gap-6">
                {allData.top5ValuablePlayers && <MostValueablePlayers data={allData.top5ValuablePlayers}/>}
                {allData.top5ValuableTeams && <MostValueableTeams data={allData.top5ValuableTeams}/>}
                
            </div>
        
            
        </>
    )
}

export default Dashboard