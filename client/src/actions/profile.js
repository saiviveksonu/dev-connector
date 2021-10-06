import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE,PROFILE_ERROR,UPDATE_PROFILE,ACCOUNT_DELETED,PROFILE_CLEAR,GET_PROFILES} from './type'
// function or action to get the current profile of the user
export const getCurrentProfile = () => async (dispatch) => {
    try {
      const res = await axios.get('/api/profile/me');
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  // get all the profiles
  export const getProfiles = () => async (dispatch) => {
    dispatch({ type:PROFILE_CLEAR });
    try {
      const res = await axios.get('http://localhost:4000/api/profile');
  
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err) {
      console.log(err)
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
// getting the profile by id
  export const getProfileById = (userId) => async (dispatch) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/profile/user/${userId}`);
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  // create or update a profile
  export const createProfile=(formData,history,edit=false)=>async (dispatch)=>{
    try {
      const config={
        headers:{
            "content-type":"application/json"
        }
    } 
    const res=await axios.post('http://localhost:4000/api/profile/',formData,config)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    // set alert for profile created or updated
    dispatch(setAlert(edit?'profile Updated':'profile Created','sucess'));
  //  if user creating the profile redirect to dashboard
    if(!edit){
      history.push('/dashboard')
    }
    } catch (err) {
      console.log(err)
      // const errors=err.response.data.errors;
      // if(errors){
      //     errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
      //     console.log('error')
      // }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
      console.log('error2')
    }
  }
  // adding the experience
  export const addExperience = (formData, history) => async (dispatch) => {
    try {
      const res = await axios.put('http://localhost:4000/api/profile/experience', formData);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Experience Added', 'success'));

      history.push('/dashboard');
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  // add education
  export const addEducation = (formData, history) => async (dispatch) => {
    try {
      const res = await axios.put('http://localhost:4000/api/profile/education', formData);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Education Added', 'success'));
  
      history.push('/dashboard');
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  // delete the experience
  export const deleteExperience = (id) => async (dispatch) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/profile/experience/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  // Delete education action
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`http://localhost:4000/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('http://localhost:4000/api/profile/');

      dispatch({ type: PROFILE_CLEAR });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};