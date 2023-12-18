import { useEffect, useState } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { showNotification } from "../../common/headerSlice"
import { API } from "../../../utils/globalConstantUtil"
import SelectBox from '../../../components/Input/SelectBox';
import InputText from '../../../components/Input/InputText';
import ToggleInput from '../../../components/Input/ToggleInput';
import ErrorText from '../../../components/Typography/ErrorText';

const INITIAL_STADIUM_OBJ = {
    name : "",
    cityId : 0,
    underheatSoiling: false,
    capacity : 0,
    lodgeAmount: 0,
}

function AddStadiumModalBody({closeModal}){


    // Get the leagues from the api.
    const [cities, setCities] = useState([])
    useEffect(() => {
        // Fetch teams when the component mounts
        axios.get(API.BASE_URL + 'getCityList', { headers: API.SKIP_BROWSER_WARNING })
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [stadiumObj, setStadiumObj] = useState(INITIAL_STADIUM_OBJ)

    const saveNewTeam = async () => {

        console.log(stadiumObj)

        if (stadiumObj.name.trim() === "")return setErrorMessage("Stadium Name is required!")
        else if(stadiumObj.cityId <= 0)return setErrorMessage("City is required!")
        else if(stadiumObj.capacity < 0)return setErrorMessage("Stadium capacity must be positive!")
        else if(stadiumObj.lodgeAmount < 0)return setErrorMessage("Lodge amount must be positive!")
        else if(stadiumObj.lodgeAmount > stadiumObj.capacity)return setErrorMessage("Lodge amount cannot be bigger than capacity!")                               
        else{

            sendCreateNewStadiumRequest(stadiumObj)
            closeModal()
        }
    }

    const  sendCreateNewStadiumRequest = async (newStadiumObj) => {
        try {

            const response = axios({
                method: 'post',
                url: API.BASE_URL + 'addNewStadium',
                headers: API.SKIP_BROWSER_WARNING,
                data: newStadiumObj
              });
        
          } catch (error) {
            console.error('Error creating stadium:', error.response);
            // Handle errors, show error message, or perform other actions as needed
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        
        if (!(typeof value === 'boolean') && !isNaN(Number(value))) {
            setStadiumObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: Number(value) }));
        } else {
            setStadiumObj(prevPlayerObj => ({ ...prevPlayerObj, [updateType]: value }));
        }
    };
    

    return(
        <>

            <InputText type="text" defaultValue={stadiumObj.name} updateType="name" containerStyle="mt-4" labelTitle="Stadium Name" updateFormValue={updateFormValue}/>
        
            <SelectBox
                labelTitle="Select a City"
                defaultValue={stadiumObj.city}
                updateType="cityId"
                containerStyle="mt-4 w-full"
                placeholder="No City Selected"
                options={cities.map(city => ({ value: city.cityId, name: city.cityName }))}
                updateFormValue={updateFormValue}
            />

            <ToggleInput
                labelTitle="Underheat Soiling?"
                labelStyle="text-green-500"
                containerStyle="mt-4"
                defaultValue={stadiumObj.underHeatSoiling}
                updateType="underHeatSoiling"
                updateFormValue={updateFormValue}
            />

            <InputText type="number" defaultValue={stadiumObj.capacity} updateType="capacity" containerStyle="mt-4" labelTitle="Capacity" updateFormValue={updateFormValue}/>
            <InputText type="number" defaultValue={stadiumObj.lodgeAmount} updateType="lodgeAmount" containerStyle="mt-4" labelTitle="Lodge Amount" updateFormValue={updateFormValue}/>


            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewTeam()}>Save</button>
            </div>
        </>
    )
}

export default AddStadiumModalBody