import { React, useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import Select from 'react-select'
import { API } from "../../../utils/globalConstantUtil"
import MultiSelectBox from "../../../components/Input/MultiSelectBox"

const INITIAL_LEAGUE_OBJ = {
    leagueName : "",
    teamNames : [],
}

function AddTeamModalBody({closeModal}){

    // Get the teams from the api.
    const [availableTeams, setAvailableTeams] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getAvailableTeamList', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setAvailableTeams(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [leagueObj, setLeagueObj] = useState(INITIAL_LEAGUE_OBJ)

    const saveNewLeague = () => {

        if(leagueObj.leagueName.trim() === "")return setErrorMessage("League Name is required!")
        else if (leagueObj.teamNames.length === 0)return setErrorMessage("Teams is required!")
        else if (leagueObj.teamNames.length >= 26)return setErrorMessage("Teams should be less than 26!")
        else if (leagueObj.teamNames.length <= 1)return setErrorMessage("Teams should be more than 1!")
        else{

            sendCreateNewLeagueRequest(leagueObj)
            closeModal()
        }
    }

    const  sendCreateNewLeagueRequest = async (newLeagueObj) => {
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'addNewLeague',
                headers: API.SKIP_BROWSER_WARNING,
                data: newLeagueObj
              });
        
          } catch (error) {
            console.error('Error creating player:', error.response);
            // Handle errors, show error message, or perform other actions as needed
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");

        if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setLeagueObj(prevLeagueObj => ({ ...prevLeagueObj, [updateType]: Number(value) }));    
        } else {
            setLeagueObj(prevLeagueObj => ({ ...prevLeagueObj, [updateType]: value }));
        }
         
    };


    return(
        <>

            <InputText type="text" defaultValue={leagueObj.leagueName} updateType="leagueName" containerStyle="mt-4" labelTitle="League Name" updateFormValue={updateFormValue}/>
            
            <MultiSelectBox 
                defaultValue={leagueObj.teamNames} 
                updateType="teamNames" 
                containerStyle="mt-4"
                options={availableTeams.map((value) => ({ value, label: value }))}
                labelTitle="Teams" 
                updateFormValue={updateFormValue}
            />

            
            <ErrorText styleClass="mt-4 text-sm text-end">{'If a league with same name exists the league will not be created.'}</ErrorText>
            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewLeague()}>Save</button>
            </div>
        </>
    )
}

export default AddTeamModalBody