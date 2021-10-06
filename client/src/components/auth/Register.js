import React, {Fragment, useState } from 'react'
import { connect } from "react-redux"
import { setAlert } from '../../actions/alert'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { register } from '../../actions/auth'
const Register = ({ setAlert, register,isAuthenticated }) => {
    const [registerdata, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })
    const { name, email, password, password2 } = registerdata;
    const onChange = (e) => {
        setRegisterData({ ...registerdata, [e.target.name]: e.target.value })
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        if (password !== password2) {
            setAlert("password not matching", 'danger')
        }
        else {
            try {
                register({ name, email, password })
            } catch (err) {
                console.log(err)
            }
        }
    }
    if(isAuthenticated) {
        return <Redirect to='/login' />
    }
    return (
        <Fragment>
            <h1 Name="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"

                        value={password} onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"

                        value={password2} onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>)
};
Register.propTypes = ({
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
});
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, { setAlert, register })(Register);