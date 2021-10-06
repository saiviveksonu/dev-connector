
import { REGISTER_SUCESS, REGISTER_UNSUCESSFUL, USER_SUCESS, AUTH_ERROR, LOGIN_SUCESS, LOGOUT, ACCOUNT_DELETED } from "../actions/type";
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_SUCESS:
      return { ...state, isAuthenticated: true, loading: false, user: payload };
    case REGISTER_SUCESS:
    case LOGIN_SUCESS:
      localStorage.setItem('token', payload.token)
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_UNSUCESSFUL:
    case AUTH_ERROR:
    // case LOGIN_UNSUCESSFUL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token')
      return { ...state, token: null,user:null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
}