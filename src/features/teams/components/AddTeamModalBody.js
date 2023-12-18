import { useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { showNotification } from "../../common/headerSlice"
import { API } from "../../../utils/globalConstantUtil"
import SelectBox from '../../../components/Input/SelectBox';
import InputText from '../../../components/Input/InputText';
import MultiSelectBox from '../../../components/Input/MultiSelectBox';
import ErrorText from '../../../components/Typography/ErrorText';

const INITIAL_TEAM_OBJ = {
    name : "",
    leagueName : "",
    stadiumName: "",
    playerIds : [],
}

function AddTeamModalBody({closeModal}){


    // Get the leagues from the api.
    const [leagues, setLeagues] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getAllLeagueNames', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    // Get the stadiums from the api.
    const [stadiums, setStadiums] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getStadiumNames', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setStadiums(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    // Get the stadiums from the api.
    const [availablePlayers, setAvailablePlayers] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getAvailablePlayers', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setAvailablePlayers(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    const teamExists = async (teamName) => {
        axios.get(API.BASE_URL + 'teamExists?' +
        'teamName=' + teamName
        , { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            return response.data
        })
        .catch(error => {
            return true
        });
    }
    
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [teamObj, setTeamObj] = useState(INITIAL_TEAM_OBJ)

    const saveNewTeam = async () => {

        if (teamObj.name.trim() === "")return setErrorMessage("Team Name is required!")
        else if(await teamExists(teamObj.name))return setErrorMessage("Team Name already exists!")
        else if(teamObj.leagueName.trim() !== "" && teamObj.playerIds.length < 18)return setErrorMessage("At least 18 players must be selected for a team to be added to the league!")                
        else{

            sendCreateNewTeamRequest(teamObj)
            closeModal()
        }
    }

    const  sendCreateNewTeamRequest = async (newTeamObj) => {
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'addNewTeam',
                headers: API.SKIP_BROWSER_WARNING,
                data: newTeamObj
              });
        
          } catch (error) {
            console.error('Error creating player:', error.response);
            // Handle errors, show error message, or perform other actions as needed
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        
        // Ensure value is always an array for playerIds
        if (updateType === "playerIds") {
            setTeamObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: Array.isArray(value) ? value : [] }));
        } else if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setTeamObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: Number(value) }));
        } else {
            setTeamObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: value }));
        }
    };
    

    return(
        <>

            <InputText type="text" defaultValue={teamObj.name} updateType="name" containerStyle="mt-4" labelTitle="Team Name" updateFormValue={updateFormValue}/>
        
            <SelectBox
                labelTitle="Select a League"
                defaultValue={teamObj.leagueName}
                updateType="leagueName"
                containerStyle="mt-4 w-full"
                placeholder="No League"
                options={leagues.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />

            {teamObj.leagueName !== "" && <ErrorText styleClass="mt-4 text-sm">Warning: Adding a team to the league will reset all league stats.</ErrorText>}

            <SelectBox
                labelTitle="Select Stadium"
                defaultValue={teamObj.stadiumName}
                updateType="stadiumName"
                containerStyle="mt-4 w-full"
                placeholder="Select a Stadium"
                options={stadiums.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />

            <MultiSelectBox 
                defaultValue={teamObj.playerIds} 
                updateType="playerIds"
                containerStyle="mt-4"
                options={availablePlayers.map((player) => ({ value: player.playerId, label: player.playerName }))}
                labelTitle="Players" 
                updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewTeam()}>Save</button>
            </div>
        </>
    )
}

export default AddTeamModalBody