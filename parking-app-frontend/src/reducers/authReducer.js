import {actionTypes} from '../actions'
export const initialState = {user : null, acess_token : false}

const reducer = (state, action) => {
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                user : action.user
            }
        case actionTypes.CONNEXION_FAIL:
            return {
                ...state,
                user : false
            }
        default:
            return state
    }
}
export default reducer