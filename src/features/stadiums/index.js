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

    const openAddNewStadiumModal = () => {
        dispatch(openModal({title : "Add New Team", bodyType : MODAL_BODY_TYPES.STADIUM_ADD_NEW}))
    }

    return(
        <>
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={handleSearchTextChange}/>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewStadiumModal()}>Add New</button>
            </div>

        </>
        
    )
}

function Stadiums(){

    const [STADIUMS, setSTADIUMS] = useState([]); 
    const [stadiums, setStadiums] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [reRender, setReRender] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
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
    }, [isModalOpen]);

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
        axios.get(API.BASE_URL + 'getStadiumList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setStadiums(response.data);
                setSTADIUMS(response.data);
                setTotalItems(response.data.length);
                
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;

                // Slice the players and update the state
                setStadiums(response.data.slice(indexOfFirstItem, indexOfLastItem));
                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [reRender]);

    const dispatch = useDispatch()

    // Update Stadiums
    useEffect(() => {
        let updatedStadiums = [...STADIUMS];

        // Apply filtering if searchText is present
        if (searchText) {
            updatedStadiums = updatedStadiums.filter(stadium =>
                stadium.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }


        updatedStadiums.sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];
    
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortConfig.direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
            }
        });
      
        setTotalItems(updatedStadiums.length);

        // Paginate the results
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setStadiums(updatedStadiums.slice(indexOfFirstItem, indexOfLastItem));
    }, [sortConfig, searchText, currentPage, itemsPerPage, STADIUMS]);

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

    const editCurrentStadium = (index) => {
        dispatch(openModal({title : "Edit Stadium", bodyType : MODAL_BODY_TYPES.STADIUM_EDIT, 
        extraObject : {index, team : stadiums[index]}}))
    }

    const deleteCurrentTeam = (_id) => {
        dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : `Are you sure you want to delete this stadium?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.STADIUM_DELETE, _id}}))
    }

    return(
        <>
            <TitleCard title="Current Stadiums" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr class="text-center">
                        <th onClick={() => handleSort('name')}>Name {renderSortArrow('name')}</th>
                        <th onClick={() => handleSort('cityId')}>City {renderSortArrow('cityId')}</th>
                        <th onClick={() => handleSort('underHeatSoiling')}>Underheat Soiling {renderSortArrow('underHeatSoiling')}</th>                        
                        <th onClick={() => handleSort('capacity')}>Capacity {renderSortArrow('capacity')}</th>
                        <th onClick={() => handleSort('lodgeAmount')}>Lodge Amount {renderSortArrow('lodgeAmount')}</th>
                        
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {

                            
                            stadiums.map((l, k) => {
                                return(
                                    <tr class="text-center" key={k}>
                                    
                                    <td className="overflow-hidden max-w-xs" title={l.name}>
                                        {l.name !== null && (l.name.length > 30 ? `${l.name.substring(0, 30)}...` : l.name)} 
                                    </td>
                                    <td>{l.cityName}</td>
                                    <td>{l.underHeatSoiling ? "Exists": "Does not exist"}</td>
                                    <td>{l.capacity}</td>
                                    <td>{l.lodgeAmount}</td>
                                    <td><button className="btn btn-square btn-ghost" onClick={() => editCurrentStadium(k)}><PencilSquareIcon className="w-5" /></button></td>
                                    <td><button className="btn btn-square btn-ghost" onClick={() => deleteCurrentTeam(l.stadiumId)}><TrashIcon className="w-5"/></button></td>
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


export default Stadiums