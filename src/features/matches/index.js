import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import axios from 'axios'
import { API, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import SelectBox from "../../components/Input/SelectBox"
import { current } from "daisyui/src/colors"

const INITIAL_WEEK_LEAGUE_OBJ = {
    week: 1,
    league: "Süper Lig"
}



const TopSideButtons = ({weekLeagueObj, setWeekLeagueObj, reRender, setReRender}) => {

    const dispatch = useDispatch()
    const [leagues , setLeagues] = useState([]);
    const [weeks , setWeeks] = useState([]);
    const [isAddDisabled, setIsAddDisabled] = useState(true);

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

    // Fetch week names when the component mounts
    useEffect(() => {
    
        axios.get(API.BASE_URL + 'getWeeks?' +
        'leagueName=' + weekLeagueObj.league
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                let allWeeks = [];
                for (let i = 1; i <= response.data; i++) {
                    allWeeks.push(i);
                }
                setWeeks(allWeeks);                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [weekLeagueObj]);

    // Disable Add New button when all matches of that week has been played
    useEffect(() => {
        axios.get(API.BASE_URL + 'canMatchBeAddedTo?' +
        'week=' + weekLeagueObj.week + '&' +
        'leagueName=' + weekLeagueObj.league
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setIsAddDisabled(!response.data);                
            })
            .catch(error => {
                setIsAddDisabled(true)                
            });    
    })

    const openAddNewPlayerModal = () => {
        dispatch(openModal({title : "Add New Match", bodyType : MODAL_BODY_TYPES.MATCH_ADD_NEW, extraObject : {weekLeagueObj}}))
    }

    const updateFormValue = ({ updateType, value }) => {

        if(updateType === "league"){ 
            setWeekLeagueObj(prevWeekLeagueObj => ({ ...prevWeekLeagueObj, ['week']: Number(1) }));     
        }
        
        if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setWeekLeagueObj(prevWeekLeagueObj => ({ ...prevWeekLeagueObj, [updateType]: Number(value) }));    
        } else {
            setWeekLeagueObj(prevWeekLeagueObj => ({ ...prevWeekLeagueObj, [updateType]: value }));
        }
         
    };

    return(
        <>
            <SelectBox
                
                defaultValue={weekLeagueObj.league}
                updateType="league"
                containerStyle="mx-2"
                placeholder="Select League"
                options={leagues.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />
            <SelectBox
                explicitValue={weekLeagueObj.week}
                defaultValue={weekLeagueObj.week}
                updateType="week"
                containerStyle="mx-2"
                placeholder="Select Week"
                options={weeks.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />
            {/* <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={handleSearchTextChange}/> */}
            <div className="inline-block float-right h-full">
                <button disabled={isAddDisabled} className="btn px-6 btn normal-case btn-primary" onClick={() => openAddNewPlayerModal()}>Add New</button>
            </div>

        </>
        
    )
}

function Matches(){

    const dispatch = useDispatch()
    const [MATCHES, setMATCHES] = useState([]); 
    const [matches, setMatches] = useState([]);

    const [weekLeagueObj, setWeekLeagueObj] = useState(INITIAL_WEEK_LEAGUE_OBJ)

    const [reRender, setReRender] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(null);
    const isModalOpen = useSelector((state) => state.modal.isOpen);
    

    // useEffect to detect when the modal is closed
    useEffect(() => {
        const delay = 500; // 1000 milliseconds (1 second) - Adjust as needed
    
        const timeoutId = setTimeout(() => {
            if (!isModalOpen) {
                // Do something when the modal is closed
                setReRender(!reRender);
            }
        }, delay);
    
        // Clear the timeout if the component unmounts or if isModalOpen becomes true
        return () => clearTimeout(timeoutId);
    }, [isModalOpen, dispatch]);

    const renderPagination = () => {

        let pageNumbers = [];
        let minPage = currentPage - 2;
        if (minPage < 1) {
            minPage = 1;
        }
        let maxPage = minPage + 4;
        if (maxPage > Math.ceil(totalItems / itemsPerPage)) {
            maxPage = Math.ceil(totalItems / itemsPerPage);
        }

        for (let i= 0; i <= maxPage - minPage; i++) {
            pageNumbers.push(minPage + i);
        }
        

        return (
            <nav aria-label="Page navigation example">
                <ul className="inline-flex -space-x-px text-base h-10">
                <li>
                    <a href="#" onClick={() => currentPage == 1 ? null : setCurrentPage(currentPage - 1) } className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>

                {!pageNumbers.includes(1) && (
                    <li key={1}>
                        <a href="#" onClick={() => setCurrentPage(1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{1}</a>
                    </li>
                )}
            
                {pageNumbers.map(page => (
                    <li key={page}>
                        <a href="#" onClick={() => setCurrentPage(page)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}>{page}</a>
                    </li>
                ))}

                {!pageNumbers.includes(Math.ceil(totalItems / itemsPerPage)) && (
                    <li key={Math.ceil(totalItems / itemsPerPage)}>
                        <a href="#" onClick={() => setCurrentPage(Math.ceil(totalItems / itemsPerPage))} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{Math.ceil(totalItems / itemsPerPage)}</a>
                    </li>
                )}
            
                <li>
                    <a href="#" onClick={() => currentPage == Math.ceil(totalItems / itemsPerPage) ? null : setCurrentPage(currentPage + 1) } className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
                </ul>
            </nav>
        );
    };

    // Fetch matches when the component mounts
    useEffect(() => {
        
        axios.get(API.BASE_URL + 'getAllMatchesFromLeagueAndWeekInfo?' +
        'week=' + weekLeagueObj.week + '&' +
        'leagueName=' + weekLeagueObj.league
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setMatches(response.data);
                setMATCHES(response.data);
                setTotalItems(response.data.length);
                
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;

                // Slice the players and update the state
                setMatches(response.data.slice(indexOfFirstItem, indexOfLastItem));
                
            })
            .catch(error => {
                // Handle errors
                setMatches([]);
                setMATCHES([]);
            });
    }, [weekLeagueObj, reRender]);

    // Update Pagination when the matches change
    useEffect(() => {

        setTotalItems(MATCHES.length);

        // Paginate the results
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setMatches(MATCHES.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, itemsPerPage, MATCHES]);


    const editCurrentMatch = (index) => {
        dispatch(openModal({title : "Edit Match", bodyType : MODAL_BODY_TYPES.MATCH_EDIT, 
        extraObject : {index, match : matches[index]}}))
    }

    const deleteCurrentMatch = (homeTeamName, awayTeamName) => {
        dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : `Are you sure you want to delete this match?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.MATCH_DELETE, homeTeamName, awayTeamName}}))
    }

    return(
        <>
            
            <TitleCard title="Current Matches" topMargin="mt-2" TopSideButtons={<TopSideButtons reRender={reRender} setReRender={setReRender} setWeekLeagueObj={setWeekLeagueObj} weekLeagueObj={weekLeagueObj} />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr class="text-center">
                        <th>Date</th>
                        <th>Home Team</th>
                        <th>Score</th>
                        <th>Away Team</th>

                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            matches.map((l, k) => {
                                return(
                                    <tr class="text-center" key={k}>
                                    
                                    <td>{l.matchDate}</td>
                                    <td className="font-bold">{l.homeTeamName}</td>                                    
                                    <td className="italic">{l.score}</td>
                                    <td className="font-bold">{l.awayTeamName}</td>
                                    
                                    <td>{l.score==='Not Played' && <button className="btn btn-square btn-ghost" onClick={() => editCurrentMatch(k)}><PencilSquareIcon className="w-5" /></button>}</td>
                                    <td><button className="btn btn-square btn-ghost" onClick={() => deleteCurrentMatch(l.homeTeamName, l.awayTeamName )}><TrashIcon className="w-5"/></button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-center">{(totalItems && Math.ceil(totalItems / itemsPerPage) > 1 && currentPage) ? renderPagination() : null}</div>
            
            </TitleCard>
        </>
    )
}


export default Matches