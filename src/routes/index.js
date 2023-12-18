// All components mapping with path for internal routes

import { lazy } from 'react'


const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Matches = lazy(() => import('../pages/protected/Matches'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Teams = lazy(() => import('../pages/protected/Teams'))
const Stadiums = lazy(() => import('../pages/protected/Stadiums'))
const LeagueStatus = lazy(() => import('../pages/protected/LeagueStatus'))
const Players = lazy(() => import('../pages/protected/Players'))
const Leagues = lazy(() => import('../pages/protected/Leagues'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },

  {
    path: '/players',
    component: Players,
  },

  {
    path: '/leagueStatus',
    component: LeagueStatus,
  },

  {
    path: '/teams',
    component: Teams,
  },

  {
    path: '/matches',
    component: Matches,
  },

  {
    path: '/stadiums',
    component: Stadiums,
  },


  {
    path: '/leagues',
    component: Leagues,
  },

  {
    path: '/404',
    component: Page404,
  },

]

export default routes
