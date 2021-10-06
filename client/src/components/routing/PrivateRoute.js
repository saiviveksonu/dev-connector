import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// reducing the prop types
 const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => {
    return (
        <div>
            <Route
                {...rest}
                render={props =>
                    !isAuthenticated && !loading ? (
                        <Redirect to="/login" />
                    ):(<Component {...props}/>)
                }
            />
        </div>
    )
}
// here we are adding the auth state object to the proptypes
PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}
// here we want the auth state to check the user loged in  
const mapStateToProps = state => dispatch => ({
    auth: state.auth
})
export default connect(mapStateToProps)(PrivateRoute)