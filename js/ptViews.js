import React, {Component} from 'react'
//import {_createPTuser, _loginPtUser} from './app'


var PtLoginView = React.createClass ({
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
		this.props.ptSignUp(this.email, this.password, this.realName)
	},
	_handleLogin: function() {
		this.props.ptLogin(this.email,this.password)
	},
	render: function () {
		console.log("pt login page")
    		return (
    			<div className="loginContainer">
    				<h1>PT Portal</h1>
    				<input placeholder="email" onChange={this._updateEmail} />
    				<input placeholder="password" onChange={this._updatePassword} type="password"/>
    				<input onChange={this._updateName} placeholder="username"/>
	    			<div className="splashButtons">
	    				<button onClick={this._handleSignUp}>SIGN UP</button>
	    				<button onClick={this._handleLogin}>LOGIN</button>
	    			</div>
    			</div>
    			)
    	}
})

export default PtLoginView