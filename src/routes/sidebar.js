/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import { TbPlayFootball, TbSoccerField } from "react-icons/tb";
import { AiOutlineTeam } from "react-icons/ai";
const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '/app/players', // url
    icon: <TbPlayFootball className={iconClasses}/>, // icon component
    name: 'Players', // name that appear in Sidebar
  },
  {
    path: '/app/leagueStatus', // url
    icon: <AiOutlineTeam className={iconClasses}/>, // icon component
    name: 'League Status', // name that appear in Sidebar
  },
  {
    path: '/app/teams', // url
    icon: <AiOutlineTeam className={iconClasses}/>, // icon component
    name: 'Teams', // name that appear in Sidebar
  },
  {
    path: '/app/leagues', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Leagues', // name that appear in Sidebar
  },
  {
    path: '/app/matches', // url
    icon: <TbSoccerField className={iconClasses}/>, // icon component
    name: 'Matches', // name that appear in Sidebar
  },
  {
    path: '/app/stadiums', // url
    icon: <TbSoccerField className={iconClasses}/>, // icon component
    name: 'Stadiums', // name that appear in Sidebar
  },
  
]

export default routes


