import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_SUCESS,REGISTER_UNSUCESSFUL,USER_SUCESS,AUTH_ERROR,LOGIN_SUCESS,LOGIN_UNSUCESSFUL, LOGOUT,PROFILE_CLEAR} from "../actions/type";
import authtoken from '../utils/authtoken';
import { config } from 'process';

export const loaduser=()=>async dispatch=>{
if(localStorage.token){
    authtoken(localStorage.token)
}
try {
    const res=await axios.get('/api/auth')
    dispatch({
        type: USER_SUCESS,
        payload: res.data
      });
} catch (error) {
    dispatch({
        type: AUTH_ERROR
      });
}
}
export const register=({name,email,password})=>async dispatch=>{
    const config={
        headers:{
            "content-type":"application/json"
        }
    }
    const body=JSON.stringify({name,email,password})
    try {
        const res=await axios.post('/api/users',body,config)
        dispatch({
            type:REGISTER_SUCESS,
            payload: res.data
          });
          dispatch(loaduser())
    } catch (err) {
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type: REGISTER_UNSUCESSFUL,
          });
    }
}
export const login = (email, password) => async dispatch => {
    const body = { email, password };
  
    try {
      const res = await axios.post('api/auth', body,config);
      dispatch({
        type: LOGIN_SUCESS,
        payload: res.data
      });
      dispatch(loaduser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: LOGIN_UNSUCESSFUL
      });
    }
  };
  // logout
  export const logout =()=>dispatch=>{
dispatch({
  type:LOGOUT
})
dispatch({
  type:PROFILE_CLEAR
})
  }