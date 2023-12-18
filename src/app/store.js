import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import playerSlice from '../features/players/playerSlice'
import teamSlice from '../features/teams/teamSlice'
import leagueSlice from '../features/leagues/leagueSlice'
import matchSlice from '../features/matches/matchSlice'
import stadiumSLice from '../features/stadiums/stadiumSlice'


const combinedReducer = {
  header : headerSlice,
  rightDrawer : rightDrawerSlice,
  modal : modalSlice,
  player : playerSlice,
  team : teamSlice,
  league : leagueSlice,
  match : matchSlice,
  stadium: stadiumSLice,
}

export default configureStore({
    reducer: combinedReducer
})