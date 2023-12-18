import { useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { showNotification } from "../../common/headerSlice"
import { API } from "../../../utils/globalConstantUtil"
import SelectBox from '../../../components/Input/SelectBox';
import InputText from '../../../components/Input/InputText';
import ToggleInput from '../../../components/Input/ToggleInput';
import ErrorText from '../../../components/Typography/ErrorText';


const INITIAL_PLAYER_OBJ = {
    name : "",
    birthDate: "",
    teamName: "",
    nationality: "",
    isForeign: false,
    height: 0,
    footType: "",
    marketValue: 0.0,
    marketValueUnit: "",
    position: "",
    uniformNumber: 1,
}

function AddPlayerModalBody({closeModal}){

    // Get the teams from the api.
    const [teams, setTeams] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getAllTeamNames', { headers: API.SKIP_BROWSER_WARNING })
        .then(response => {
            setTeams(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);
    
    // Get the positions from the api.
    const [positions, setPositions] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getPositionList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setPositions(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const [feet, setFeet] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getFootList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setFeet(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const [marketValueUnits, setmarketValueUnits] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getUnitList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setmarketValueUnits(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const playerWithThisUniformNumberExists = async (teamName, uniformNumber) => {
        try {
            const response = await axios.get(`${API.BASE_URL}playerWithThisUniformNumberExists?` + 
            'uniformNumber=' + uniformNumber +
            '&teamName=' + teamName, {
                headers: API.SKIP_BROWSER_WARNING,
            });
            
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error checking player with uniform number:', error.response);
            return false;
        }
    }
    



    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [playerObj, setPlayerObj] = useState(INITIAL_PLAYER_OBJ)

    const saveNewPlayer = async () => {

        console.log(playerObj)

        if(playerObj.name.trim() === "")return setErrorMessage("First Name is required!")
        else if(playerObj.birthDate.trim() === "")return setErrorMessage("Birth date is required!")
        else if (playerObj.nationality.trim() === "")return setErrorMessage("Nationality is required!")
        else if (playerObj.height <= 0)return setErrorMessage("Height input is invalid!")
        else if (playerObj.marketValue <= 0 || playerObj.marketValue >= 1000)return setErrorMessage("Market value input is invalid!")
        else if (playerObj.position.trim() === "")return setErrorMessage("Position is required!")
        else if (playerObj.uniformNumber <= 0 || playerObj.uniformNumber > 99)return setErrorMessage("Uniform number input is invalid!")
        else if (playerObj.footType.trim() === "")return setErrorMessage("Foot is required!")
        else if (playerObj.marketValueUnit.trim() === "")return setErrorMessage("Unit is required!")
        else if (playerObj.teamName.trim() !== "" && await playerWithThisUniformNumberExists(playerObj.teamName, playerObj.uniformNumber))return setErrorMessage("A player with this uniform number already exists in the selected team!")
        else{
            let newPlayerObj = {
                "name": playerObj.name,
                "birthDate": playerObj.birthDate,
                "teamName": playerObj.teamName,
                "nationality": playerObj.nationality,
                "isForeign": playerObj.isForeign,
                "footType": playerObj.footType,
                "height": playerObj.height,
                "marketValue": playerObj.marketValue,
                "marketValueUnit": playerObj.marketValueUnit,
                "position": playerObj.position,
                "uniformNumber": playerObj.uniformNumber
            }

            sendCreateNewPlayerRequest(newPlayerObj)
            dispatch(showNotification({message : "New Player Added!", status : 1}))
            closeModal()
        }
    }

    const  sendCreateNewPlayerRequest = async (newPlayerObj) => {
        try {

            console.log('Request Payload:', newPlayerObj);
            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'addNewPlayer',
                headers: API.SKIP_BROWSER_WARNING,
                data: newPlayerObj
              });
        
          } catch (error) {
            console.error('Error creating player:', error.response);
            // Handle errors, show error message, or perform other actions as needed
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setPlayerObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: Number(value) }));    
        } else {
            setPlayerObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: value }));
        }
         
    };

    return(
        <>

            <InputText type="text" defaultValue={playerObj.name} updateType="name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>
            
            <InputText type="date" defaultValue={playerObj.birthDate} updateType="birthDate" containerStyle="mt-4" labelTitle="Birth Date" updateFormValue={updateFormValue}/>
        
            <SelectBox
                labelTitle="Select a Team"
                defaultValue={playerObj.teamName}
                updateType="teamName"
                containerStyle="mt-4 w-full"
                placeholder="No Team"
                options={teams.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />

            <InputText type="text" defaultValue={playerObj.nationality} updateType="nationality" containerStyle="mt-4" labelTitle="Nationality" updateFormValue={updateFormValue}/>

            <InputText type="number" defaultValue={playerObj.height} updateType="height" containerStyle="mt-4" labelTitle="Height (cm)" updateFormValue={updateFormValue}/>

            <SelectBox
                labelTitle="Select Foot"
                defaultValue={playerObj.footType}
                updateType="footType"
                containerStyle="mt-4 w-full"
                placeholder="Select a Foot"
                options={feet.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />
    
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>        
                <InputText
                    type="number"
                    defaultValue={playerObj.marketValue}
                    updateType="marketValue"
                    containerStyle="mt-4 w-60"
                    labelTitle="Market Value"
                    updateFormValue={updateFormValue}
                />
                <SelectBox
                    labelTitle="Unit"
                    defaultValue={playerObj.marketValueUnit}
                    containerStyle="mt-4"
                    placeholder="Select a Unit"
                    updateType="marketValueUnit"
                    options={marketValueUnits.map((value) => ({ value, name: value }))}
                    updateFormValue={updateFormValue}
                    customStyle={{ width: '12.5rem' }}
                />
            </div>
            
            <SelectBox
                labelTitle="Position"
                defaultValue={playerObj.position}
                containerStyle="mt-4 w-full"
                updateType="position"
                placeholder="Select a Position"
                options={positions.map((value) => ({ value, name: value }))}
                updateFormValue={updateFormValue}
            />
    
            <InputText type="number" defaultValue={playerObj.uniformNumber} updateType="uniformNumber" containerStyle="mt-4" labelTitle="Uniform Number" updateFormValue={updateFormValue}/>
                        

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewPlayer()}>Save</button>
            </div>
        </>
    )
}

export default AddPlayerModalBody