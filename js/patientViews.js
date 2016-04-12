import React, {Component} from 'react'
//import {_createPatientUser, _loginPatientUser} from './app'


var PatientLoginView = React.createClass ({
	email: '',
	password: '',
	realName: '',
	_updateEmail: function(event) {
		this.email = event.target.value
	},
	_updatePassword: function(event) {
		this.password = event.target.value
	},
	_updateName: function(event) {
		this.realName = event.target.value
	},
	_handleSignUp: function() {
		this.props.patientSignUp(this.email, this.password, this.realName)
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
    				<input onChange={this._updateName} placeholder="username"/>
	    			<div className="splashButtons">
	    				<button onClick={this._handleSignUp}>sign up</button>
	    				<button onClick={this._handleLogin}>log in</button>
	    			</div>
    			</div>
    			)
    	}
})

export default PatientLoginView