import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { API, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteLead } from '../../players/playerSlice'
import { showNotification } from '../headerSlice'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()

    const { message, type, _id, index, homeTeamName, awayTeamName, teamName} = extraObject


    const proceedWithYes = async() => {
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.PLAYER_DELETE){
            // positive response, call api or dispatch redux function
            
            try {
                
                const response = await axios.delete(`${API.BASE_URL}deletePlayer?` + 
                'id=' + _id ,
                {
                    headers: API.SKIP_BROWSER_WARNING,
                });
                
            } catch (error) {
                console.error('Error checking player with uniform number:', error.response);
            }
            
            dispatch(showNotification({message : "Player Deleted!", status : 1}))
        }

        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAGUE_DELETE){
            try {
                
                const response = await axios.delete(`${API.BASE_URL}deleteLeague?` + 
                'name=' + _id ,
                {
                    headers: API.SKIP_BROWSER_WARNING,
                });
                
            } catch (error) {
            
            }
            
            dispatch(showNotification({message : "League Deleted!", status : 1}))
        }

        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MATCH_DELETE){
            try {
                
                const response = await axios.delete(`${API.BASE_URL}deleteMatch?` + 
                'homeTeamName=' + homeTeamName  + '&' +
                'awayTeamName=' + awayTeamName
                ,

                {
                    headers: API.SKIP_BROWSER_WARNING,
                });
                
            } catch (error) {
            
            }
            
        }

        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.TEAM_DELETE){
            try {
                const response = await axios.delete(`${API.BASE_URL}deleteTeam?` + 
                'name=' + teamName
                ,
                {
                    headers: API.SKIP_BROWSER_WARNING,
                });
                
            } catch (error) {
            
            }
            
        }

        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.STADIUM_DELETE){
            try {
                const response = await axios.delete(`${API.BASE_URL}deleteStadium?` + 
                'id=' + _id
                ,
                {
                    headers: API.SKIP_BROWSER_WARNING,
                });
                
            } catch (error) {
            
            }
            
        }

        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline   " onClick={() => closeModal()}>Cancel</button>

                <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody