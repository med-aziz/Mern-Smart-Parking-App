// to delete
export const initialState = { user: null }
import { actionTypes } from "../actions"
const reducer = (state, action) => {
  console.log(action)
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      }
    case actionTypes.RESET_USER:
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}
export default reducer
