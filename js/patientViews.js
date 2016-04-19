import React, {Component} from 'react'
//import {_createPatientUser, _loginPatientUser} from './app'


var PatientLoginView = React.createClass ({
	email: '',
	password: '',
	_updateEmail: function(event) {
		this.email = event.target.value
	},
	_updatePassword: function(event) {
		this.password = event.target.value
	},
	_handleSignUp: function() {
		this.props.patientSignUp(this.email, this.password)
	},
	_handleLogin: function() {
		this.props.patientLogin(this.email, this.password)
	},
	render: function () {
		console.log("patient login page")
    		return (
    			<div className="loginContainer">
    				<h1>Patient Portal</h1>
    				<input placeholder="email" onChange={this._updateEmail} />
    				<input placeholder="password" onChange={this._updatePassword} type="password"/>
	    			<div className="splashButtons">
	    				<button onClick={this._handleSignUp}>SIGN UP</button>
	    				<button onClick={this._handleLogin}>LOGIN</button>
	    			</div>
    			</div>
    			)
    	}
})

export default PatientLoginView