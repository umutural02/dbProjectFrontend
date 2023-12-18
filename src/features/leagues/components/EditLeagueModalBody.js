import { React, useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import Select from 'react-select'
import { API } from "../../../utils/globalConstantUtil"
import MultiSelectBox from "../../../components/Input/MultiSelectBox"

function AddTeamModalBody({closeModal, extraObject}){

    // Get the teams from the api.
    const [availableTeams, setAvailableTeams] = useState([])
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [leagueObj, setLeagueObj] = useState({ ...extraObject.league });
    
    const [originalTeams, setOriginalTeams] = useState([]);
    const [originalName, setOriginalName] = useState(extraObject.league.leagueName);
    const [selectedTeams, setSelectedTeams] = useState([]);


    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getTeamListByLeagueName?' + 
        'leagueName='+ extraObject.league.leagueName,
         { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setAvailableTeams(prevTeams => [...prevTeams, ...response.data]);
            setOriginalTeams(response.data);
            setSelectedTeams(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [extraObject.league]);

    // Available teams
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getAvailableTeamList', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setAvailableTeams(prevTeams => [...prevTeams, ...response.data]);
            console.log("Available teams: ", response.data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);



    useEffect(() => {
        // Reset the form values when extraObject.player changes
        setLeagueObj({ ...extraObject.league });
        setErrorMessage("");
      }, [extraObject.league]);

    const saveEditedLeague = () => {

        if(leagueObj.leagueName.trim() === "")return setErrorMessage("League Name is required!")
        else if (selectedTeams.length === 0)return setErrorMessage("Teams is required!")
        else if (selectedTeams.length >= 26)return setErrorMessage("Teams should be less than 26!")
        else if (selectedTeams.length <= 1)return setErrorMessage("Teams should be more than 1!")
        else{
            
            sendEditLeagueNameRequest(originalName, leagueObj.leagueName).then(() => {
                if(originalTeams !== selectedTeams){
                    //console.log("Ligdeki takimlar ayni degil.")
                    sendUpdateTeamListOfLeagueRequest(leagueObj, selectedTeams)
                }
                
                closeModal()
            })
            
        }
    }

    const sendEditLeagueNameRequest = async (originalName, newName) => {
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'updateLeagueName',
                headers: API.SKIP_BROWSER_WARNING,
                data: {
                    "oldName": originalName,
                    "newName": newName
                }
              });
        
          } catch (error) {
            console.error('Error editing league:', error.response);
        }
    }

    const  sendUpdateTeamListOfLeagueRequest = async (editedLeagueObj, selectedTeams) => {
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'updateTeamListOfLeague',
                headers: API.SKIP_BROWSER_WARNING,
                data: {
                    "leagueName": editedLeagueObj.leagueName,
                    "teamNames": selectedTeams
                }
              });
        
          } catch (error) {
            console.error('Error editing league:', error.response);
            // Handle errors, show error message, or perform other actions as needed
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        if (updateType === "teams") {
            setSelectedTeams(value);
        } else if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setLeagueObj(prevLeagueObj => ({ ...prevLeagueObj, [updateType]: Number(value) }));    
        } else {
            setLeagueObj(prevLeagueObj => ({ ...prevLeagueObj, [updateType]: value }));
        }
    };


    return(
        <>

            <InputText type="text" defaultValue={leagueObj.leagueName} updateType="leagueName" containerStyle="mt-4" labelTitle="League Name" updateFormValue={updateFormValue}/>
            
            <MultiSelectBox 
                defaultValue={selectedTeams} 
                updateType="teams" 
                containerStyle="mt-4"
                options={availableTeams.map((value) => ({ value, label: value }))}
                labelTitle="Teams" 
                updateFormValue={updateFormValue}
            />
            
    
            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveEditedLeague()}>Save</button>
            </div>
        </>
    )
}

export default AddTeamModalBody