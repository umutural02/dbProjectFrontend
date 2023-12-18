import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import LeagueStatus from '../../features/leagueStatus'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Teams"}))
      }, [])


    return(
        <LeagueStatus />
    )
}

export default InternalPage