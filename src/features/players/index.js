import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import axios from 'axios'
import SearchBar from "../../components/Input/SearchBar"
import { API, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'


const TopSideButtons = ({applySearch}) => {

    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState("")

    const handleSearchTextChange = (event) => {
        setSearchText(event);
        applySearch(event);
    };

    const openAddNewPlayerModal = () => {
        dispatch(openModal({title : "Add New Player", bodyType : MODAL_BODY_TYPES.PLAYER_ADD_NEW}))
    }

    return(
        <>
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={handleSearchTextChange}/>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewPlayerModal()}>Add New</button>
            </div>

        </>
        
    )
}

function Players(){

    const [PLAYERS, setPLAYERS] = useState([]); 
    const [players, setPlayers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
    const [totalItems, setTotalItems] = useState(null);
    

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

    useEffect(() => {

        // Fetch dummy players when the component mounts
        axios.get(API.BASE_URL + 'getPlayerList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setPlayers(response.data);
                setPLAYERS(response.data);
                setTotalItems(response.data.length);
                
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;

                // Slice the players and update the state
                setPlayers(response.data.slice(indexOfFirstItem, indexOfLastItem));
                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, []);

    const dispatch = useDispatch()

    // Update Players
    useEffect(() => {
        let updatedPlayers = [...PLAYERS];

        // Apply filtering if searchText is present
        if (searchText) {
            updatedPlayers = updatedPlayers.filter(player =>
                player.playerName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.key === 'marketValue') {
            updatedPlayers.sort((a, b) => {
                const unitIdA = a['marketValueUnitId'];
                const unitIdB = b['marketValueUnitId'];
                const valueA = a['marketValue'];
                const valueB = b['marketValue'];
        
                if (unitIdA !== unitIdB) {
                    return sortConfig.direction === 'ascending' ? unitIdA - unitIdB : unitIdB - unitIdA;
                } else {
                    return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
                }
            });
        } else if (sortConfig.key) {
            updatedPlayers.sort((a, b) => {
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];
        
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortConfig.direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else {
                    return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
                }
            });
        }
        

        setTotalItems(updatedPlayers.length);

        // Paginate the results
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setPlayers(updatedPlayers.slice(indexOfFirstItem, indexOfLastItem));
    }, [sortConfig, searchText, currentPage, itemsPerPage, PLAYERS]);

    const applySearch = (params) => {
        setSearchText(params);
        setCurrentPage(1); // Reset currentPage when search changes
    };
    
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset currentPage when sorting changes
    };

    const renderSortArrow = (columnKey) => {
        if (sortConfig.key === columnKey) {
          return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return null;
      };

    const editCurrentPlayer = (index) => {
        dispatch(openModal({title : "Edit Player", bodyType : MODAL_BODY_TYPES.PLAYER_EDIT, 
        extraObject : {index, player : players[index]}}))
    }

    const deleteCurrentPlayer = (_id) => {
        dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : `Are you sure you want to delete this player?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.PLAYER_DELETE, _id}}))
    }

    return(
        <>
            <TitleCard title="Current Players" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr class="text-center">
                        <th onClick={() => handleSort('playerName')}>Name {renderSortArrow('playerName')}</th>
                        <th onClick={() => handleSort('age')}>Age {renderSortArrow('age')}</th>
                        <th onClick={() => handleSort('teamName')}>Team {renderSortArrow('teamName')}</th>
                        <th onClick={() => handleSort('nationality')}>Nationality {renderSortArrow('nationality')}</th>
                        <th onClick={() => handleSort('height')}>Height {renderSortArrow('height')}</th>
                        <th onClick={() => handleSort('footType')}>Foot {renderSortArrow('footType')}</th>
                        <th onClick={() => handleSort('marketValue')}>Market Value {renderSortArrow('marketValue')}</th>
                        <th onClick={() => handleSort('positionName')}>Position {renderSortArrow('positionName')}</th>
                        <th onClick={() => handleSort('uniformNumber')}>Uniform Number {renderSortArrow('uniformNumber')}</th>

                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            players.map((l, k) => {
                                return(
                                    <tr class="text-center" key={k}>
                                    
                                    <td>{l.playerName}</td>
                                    <td>{l.age}</td>
                                    <td>{l.teamName}</td>
                                    <td>{l.nationality}</td>
                                    <td>{l.height}</td>
                                    <td>{l.footType}</td>
                                    <td>{l.marketValue}{l.marketValueUnit}</td>
                                    <td>{l.positionName}</td>
                                    <td>{l.uniformNumber}</td>
                                    <td><button className="btn btn-square btn-ghost" onClick={() => editCurrentPlayer(k)}><PencilSquareIcon className="w-5" /></button></td>
                                    <td><button className="btn btn-square btn-ghost" onClick={() => deleteCurrentPlayer(l.playerId)}><TrashIcon className="w-5"/></button></td>
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


export default Players