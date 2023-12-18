import { useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import SelectBox from '../../../components/Input/SelectBox'
import { API } from "../../../utils/globalConstantUtil"
import ToggleInput from "../../../components/Input/ToggleInput"

const INITIAL_MATCH_OBJ = {
    leagueName: "",
    matchWeek: 0,
    homeTeamName: "",
    awayTeamName: "",
    isPlayed: false, 
    homeTeamScore: 0,
    awayTeamScore: 0,
    matchDate: new Date().toISOString().slice(0, 10),
}

function AddMatchModalBody({closeModal, extraObject}){

    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [matchObj, setMatchObj] = useState(INITIAL_MATCH_OBJ)
    const [availableHomeTeams, setAvailableHomeTeams] = useState([])
    const [availableAwayTeams, setAvailableAwayTeams] = useState([])

    // Get the league and week from the extraObject.
    useEffect(() => {      
        setMatchObj(prevMatchObj => ({ ...prevMatchObj, leagueName: extraObject.weekLeagueObj.league, matchWeek: extraObject.weekLeagueObj.week }))
        setErrorMessage("");
    }, [extraObject]);

    // Fetch available home teams when the component mounts
    useEffect(() => {

        axios.get(API.BASE_URL + 'getAvailableHomeTeams?' +
            'leagueName=' + extraObject.weekLeagueObj.league + '&' +
            'matchWeek=' + extraObject.weekLeagueObj.week
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                
                setAvailableHomeTeams(response.data);                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [extraObject]);

    // Fetch available away teams when the home team changes
    useEffect(() => {

        axios.get(API.BASE_URL + 'getAvailableAwayTeams?' +
            'leagueName=' + matchObj.leagueName + '&' +
            'matchWeek=' + matchObj.matchWeek + '&' +
            'homeTeamName=' + matchObj.homeTeamName
        , { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setAvailableAwayTeams(response.data);                
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }, [matchObj.homeTeamName]);

    const saveNewMatch = () => {

        console.log(matchObj)

        if(matchObj.matchDate.trim() === "")return setErrorMessage("Match date is required!")
        else if (matchObj.homeTeamName.trim() === "")return setErrorMessage("Home team is required!")
        else if (matchObj.awayTeamName <= 0)return setErrorMessage("Away team is required!")
        else{

            sendCreateNewMatchRequest(matchObj)
            closeModal()
        }
    }

    const  sendCreateNewMatchRequest = async (newMatchObj) => {
        
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'addNewMatch',
                headers: API.SKIP_BROWSER_WARNING,
                data: newMatchObj
              });
        
          } catch (error) {
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");

        if (updateType === 'matchDate' && value === '') {
            setMatchObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: ("") })); 
            return
        }

        if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setMatchObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: Number(value) }));    
        } else {
            setMatchObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: value }));
        }
         
    };

    return(
        <>
            
            <InputText type="date" defaultValue={matchObj.matchDate} updateType="matchDate" containerStyle="mt-4" labelTitle="Match Date" updateFormValue={updateFormValue}/>
        
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>        
                <SelectBox
                    labelTitle="Select Home Team"
                    defaultValue={matchObj.homeTeamName}
                    updateType="homeTeamName"
                    containerStyle="mt-4 w-5/12"
                    placeholder="No Team"
                    options={availableHomeTeams.map((value) => ({ value, name: value }))}
                    updateFormValue={updateFormValue}
                />
                <p className="flex items-end pb-4">v</p>
                <SelectBox
                    isDisabled={availableAwayTeams.length === 0}
                    labelTitle="Select Away Team"
                    defaultValue={matchObj.awayTeamName}
                    updateType="awayTeamName"
                    containerStyle="mt-4 w-5/12"
                    placeholder="No Team"
                    options={availableAwayTeams.map((value) => ({ value, name: value }))}
                    updateFormValue={updateFormValue}
                />
            </div>
            
            <ToggleInput
                labelTitle="Is Match Played?"
                labelStyle="text-green-500"
                containerStyle="mt-4"
                defaultValue={false}
                updateType="isPlayed"
                updateFormValue={updateFormValue}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>        
                <InputText
                    isDisabled={!matchObj.isPlayed}
                    type="number"
                    updateType="homeTeamScore"
                    containerStyle="mt-4 w-5/12"
                    labelTitle="Home Team Score"
                    updateFormValue={updateFormValue}
                />
                <p className="flex items-end pb-4">-</p>
                <InputText
                    isDisabled={!matchObj.isPlayed}
                    type="number"                    
                    updateType="awayTeamScore"
                    containerStyle="mt-4 w-5/12"
                    labelTitle="Away Team Score"
                    updateFormValue={updateFormValue}
                />
            </div>
    

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewMatch()}>Save</button>
            </div>
        </>
    )
}

export default AddMatchModalBody