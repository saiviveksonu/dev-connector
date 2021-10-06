import React, { useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios"
import { Link, Redirect } from 'react-router-dom'
import { login } from '../../actions/auth';
const Login = ({login,isAuthenticated}) => {
    const [registerdata, setRegisterData] = useState({

        email: "",
        password: "",

    })
    const { email, password } = registerdata;
    const onChange = (e) => {
        setRegisterData({ ...registerdata, [e.target.name]: e.target.value })
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        login(email,password)
    }
    // redirect if loged in
    if(isAuthenticated){
        return <Redirect to='/dashboard'/>
    }
    return (
        <>
            <h1 Name="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password} onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </>)
}
Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };
const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login)