import { useState, useEffect } from "react"
import TitleCard from "../../components/Cards/TitleCard"
import axios from 'axios'
import { API } from '../../utils/globalConstantUtil'
import SelectBox from "../../components/Input/SelectBox"



const TopSideButtons = ({setCurrentLeague}) => {

    const [leagues, setLeagues] = useState([]);
    // Fetch league names when the component mounts
    useEffect(() => {

        axios.get(API.BASE_URL + 'getAllLeagueNames'
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setLeagues(response.data);                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, []);

    const updateFormValue = (value) => {
        setCurrentLeague(value.value);
    };

    return(
        <>
            
            <SelectBox
                
                defaultValue={"Süper Lig"}
                /* containerStyle="mx-2" */
                placeholder="Select League"
                options={leagues.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />
        </>
        
    )
}

function LeagueStatus(){

    const [leagueStatus, setLeagueStatus] = useState([]);
    const [currentLeague, setCurrentLeague] = useState("Süper Lig");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    
    useEffect(() => {

        axios.get(API.BASE_URL + 'getLeagueStatusListByLeagueName?' +
            'leagueName=' + currentLeague
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setLeagueStatus(response.data);
                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [currentLeague]);

    // Sort table
    useEffect(() => {
        let updatedLeagueStatus = [...leagueStatus];
        // Apply sorting
        if (sortConfig.key) {
            updatedLeagueStatus.sort((a, b) => {
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortConfig.direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else {
                    return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
                }
            });
        }

        setLeagueStatus(updatedLeagueStatus);

    }, [sortConfig]);

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    const renderSortArrow = (columnKey) => {
        if (sortConfig.key === columnKey) {
          return sortConfig.direction === 'ascending' ? '↓' : '↑';
        }
        return null;
    };


    return(
        <>
            
            <TitleCard title="League Status" topMargin="mt-2" TopSideButtons={<TopSideButtons setCurrentLeague={setCurrentLeague} />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr class="text-center">
                        <th onClick={() => handleSort('ranking')}>ranking {renderSortArrow('ranking')}</th>
                        <th onClick={() => handleSort('teamName')}>teamName {renderSortArrow('teamName')}</th>
                        <th onClick={() => handleSort('matchesPlayed')}>matchesPlayed {renderSortArrow('matchesPlayed')}</th>
                        <th onClick={() => handleSort('wins')}>wins {renderSortArrow('wins')}</th>
                        <th onClick={() => handleSort('draws')}>draws {renderSortArrow('draws')}</th>
                        <th onClick={() => handleSort('losses')}>losses {renderSortArrow('losses')}</th>
                        <th onClick={() => handleSort('goalsFor')}>goalsFor {renderSortArrow('goalsFor')}</th>
                        <th onClick={() => handleSort('goalsAgainst')}>goalsAgainst {renderSortArrow('goalsAgainst')}</th>
                        <th onClick={() => handleSort('points')}>points {renderSortArrow('points')}</th>


                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            leagueStatus.map((l, k) => {
                                return(
                                    <tr class="text-center" key={k}>
                                    
                                    <td>{l.ranking}</td>
                                    <td>{l.teamName}</td>
                                    <td>{l.matchesPlayed}</td>
                                    <td>{l.wins}</td>
                                    <td>{l.draws}</td>
                                    <td>{l.losses}</td>
                                    <td>{l.goalsFor}</td>
                                    <td>{l.goalsAgainst}</td>
                                    <td>{l.points}</td>
                                    
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            
            </TitleCard>
        </>
    )
}


export default LeagueStatus