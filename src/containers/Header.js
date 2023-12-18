import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'



function Header(){

    const {pageTitle} = useSelector(state => state.header)

    return(
        <>
            <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">


                {/* Menu toogle for mobile view or small screen */}
                <div className="">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5"/></label>
                    <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
                </div>

            
            </div>

        </>
    )
}

export default Header