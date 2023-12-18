import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Stadiums from '../../features/stadiums'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Teams"}))
      }, [])


    return(
        <Stadiums />
    )
}

export default InternalPage