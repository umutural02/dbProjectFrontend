import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import AddPlayerModalBody from '../features/players/components/AddPlayerModalBody'
import EditPlayerModalBody from '../features/players/components/EditPlayerModalBody'
import AddTeamModalBody from '../features/teams/components/AddTeamModalBody'
import EditTeamModalBody from '../features/teams/components/EditTeamModalBody'
import AddLeagueModalBody from '../features/leagues/components/AddLeagueModalBody'
import EditLeagueModalBody from '../features/leagues/components/EditLeagueModalBody'
import AddMatchModalBody from '../features/matches/components/AddMatchModalBody'
import EditMatchModalBody from '../features/matches/components/EditMatchModalBody'
import AddStadiumModalBody from '../features/stadiums/components/AddStadiumModalBody'
import EditStadiumModalBody from '../features/stadiums/components/EditStadiumModalBody'


function ModalLayout(){


    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }

    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             [MODAL_BODY_TYPES.PLAYER_ADD_NEW] : <AddPlayerModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.PLAYER_EDIT] : <EditPlayerModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.MATCH_ADD_NEW] : <AddMatchModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.MATCH_EDIT] : <EditMatchModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.TEAM_ADD_NEW] : <AddTeamModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.TEAM_EDIT] : <EditTeamModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.LEAGUE_ADD_NEW] : <AddLeagueModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.LEAGUE_EDIT] : <EditLeagueModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.STADIUM_ADD_NEW] : <AddStadiumModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.STADIUM_EDIT] : <EditStadiumModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>
                    }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout