import React, { Fragment } from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from '../../client/src/components/layout/Navbar'
import Landing from "../src/components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/layout/Alert'
import { Provider } from "react-redux";
import store from "./store"
import { useEffect } from "react";
import { loaduser } from "./actions/auth";
import authToken from "./utils/authtoken";
import Dashboard from "./components/dashboard/Dashboard";
import EditProfile from "./components/profile/EditProfile";
import CreateProfile from "./components/profile/CreateProfile";
import PrivateRoute from "./components/routing/PrivateRoute";
import AddExperience from "./components/profile/AddExperience";
import AddEducation from "./components/profile/AddEducation";
import Profiles from "./components/profiles/Profiles";
import profile from "./components/profile2/profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
const App = () => {
  useEffect(() => {
    if(localStorage.token){
      authToken(localStorage.token)
    }
store.dispatch(loaduser())
  },[]);
  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar></Navbar>
        <Route exact path='/' component={Landing} />
        <section className="container">
        <Alert/>
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/profile/:id' component={profile} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/add-education' component={AddEducation} />
            <PrivateRoute exact path='/posts' component={Posts} />
            <PrivateRoute exact path='/posts/:id' component={Post} />
          </Switch>
        </section>
      </Fragment>
    </Router>
    </Provider>
  )
}
export default App;
