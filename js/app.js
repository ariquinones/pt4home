// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'bbfire'
import Firebase from 'firebase'
import PatientLoginView from './patientViews'
import PtLoginView from './ptViews'

function app() {
    // start app
    // new Router()
    var ref = new Firebase('https://pt4home.firebaseio.com')

    var SplashPage = React.createClass ({
    	_handlePatientLogin: function() {
    		DOM.render(<PatientLoginView patientSignUp={this.props.patientSignUp} patientLogin={this.props.patientLogin} />, document.querySelector('.container'))
    	},
    	_handlePTlogin: function() {
    		DOM.render(<PtLoginView ptSignUp={this.props.ptSignUp} ptLogin={this.props.ptLogin}/>, document.querySelector('.container'))
    	},
    	render: function () {
    		return (
    			<div className="splashContainer">
    			<h1>Pick your journey</h1>
	    			<div className="splashButtons">
	    				<button onClick={this._handlePatientLogin}>Patient</button>
	    				<button onClick={this._handlePTlogin}>Physical Therapist</button>
	    			</div>
    			</div>
    			)
    	}
    })

    var PTportal = React.createClass({
        componentWillMount: function() {
            var self = this
            this.props.ptMod.on('sync',function() {self.forceUpdate()})
            this.props.ptName.on('sync', function() {self.forceUpdate})
        },
    	_handleLogout: function() {
    		this.props.logout()
    	},
    	render: function () {  
            console.log(this.props.ptName.get('name'))
    		return (
    				<div className="dashboard">
                         <div className="header">
                            <span className="welcomeMsg" >Hello, {this.props.ptName.get('name')}</span>
                            <a className="logoutLink" onClick={this._handleLogout} href="logout">log out</a>
                        </div>
                        <ShowPatients patientsArray={this.props.ptMod} />
                        <AddPatient ptUid={this.props.ptUid} />
                        <WeekList />
                        <PTprofile ptUid={this.props.ptUid} ptMod={this.props.ptName} />
    				</div>
    			)
    	},
    })
    var ShowPatients = React.createClass({
        _showPatient: function(mod, i) {
            return (
                    <p className="patient" key={i}> {mod.get('name')} </p>
                )
        },
        render: function () {
            console.log(this.props.patientsArray)
            return (
                    <div className="ptsPatientsContainer">
                        <input type="checkbox" className="showAllPatientsCheckbox"/>
                        <span className="showAllPatientsTitle">Patients</span>
                        {this.props.patientsArray.map(this._showPatient)}
                    </div>
                    )
        }
    })
    var WeekList = React.createClass({
        targetEmail: '',
         _updateTargetEmail: function(event) {
            this.targetEmail = event.target.value
            window.targetEmail = this.targetEmail
        },
        render: function () {
            return (
                    <div className="weekExercisesContainer">
                        <input type="checkbox" className="addExercise"/>
                        <span className="addWeeksExerciseSpan">Add Week's Exercises</span>
                        <div className="patientToReceiveTreatmentContainer">
                            <span>Patient to receive regimen: </span>
                            <input onChange={this._updateTargetEmail} placeholder="Patient's Email" className="targetEmail" />
                        </div>
                        <div className="weeksContainer">
                            <div>
                                <input type="checkbox" className="weekCheckbox"/>
                                <span className="weekTitle">Week 1</span>
                                    <DayList patientEmail={this.targetEmail} />
                            </div>
                             <div>
                                <input type="checkbox" className="weekCheckbox"/>
                                <span className="weekTitle">Week 2</span>
                                    <DayList patientEmail={this.targetEmail} />
                            </div>
                             <div>
                                <input type="checkbox" className="weekCheckbox"/>
                                <span className="weekTitle">Week 3</span>
                                    <DayList patientEmail={this.targetEmail} />
                            </div>
                             <div>
                                <input type="checkbox" className="weekCheckbox"/>
                                <span className="weekTitle">Week 4</span>
                                    <DayList patientEmail={this.targetEmail} />
                            </div>
                         
                        </div>
                    </div>
                )
        }
    })
    var DayList = React.createClass({
        render: function() {
            return (
                    <div className="daysContainer">
                        <div>
                            <input type="checkbox" value="Monday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Monday</span>
                            <div className="dailyExercises">
                                <DailyExercises  day={"Monday"} patientEmail={this.props.patientEmail}/>
                            </div>
                        </div>
                         <div>
                            <input type="checkbox" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Tuesday</span>
                             <div className="dailyExercises">
                                <DailyExercises day={"Tuesday"} patientEmail={this.props.patientEmail} />
                            </div>
                        </div>
                         <div>
                            <input type="checkbox" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Wednesday</span>
                             <div className="dailyExercises">
                                <DailyExercises day={"Wednesday"} patientEmail={this.props.patientEmail} />
                            </div>
                        </div>
                         <div>
                            <input type="checkbox" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Thursday</span>
                             <div className="dailyExercises">
                                <DailyExercises day={"Thursday"} patientEmail={this.props.patientEmail} />
                            </div>
                        </div>
                         <div>
                            <input type="checkbox" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Friday</span>
                             <div className="dailyExercises">
                                <DailyExercises day={"Friday"} patientEmail={this.props.patientEmail} />
                            </div>
                        </div>
                    </div>
                    )
        }
    })
    var DailyExercises = React.createClass({
        exerciseName: '',
        reps: '',
        sets: '',
        beforeImg: '',
        afterImg: '',
        exerciseDescription: '',
        _updateExerciseName: function(event) {
            this.exerciseName = event.target.value
        },
        _updateExerciseDescription: function(event) {
            this.exerciseDescription = event.target.value
        },
        _updateReps: function(event) {
            this.reps = event.target.value
        },
        _updateSets: function(event) {
            this.sets = event.target.value
        },
        _sendExerciseToPatient: function() {
            var day = this.props.day 
            var email = window.targetEmail
            var newQuery = new QueryByEmail(email)
            var self = this
            newQuery.fetch() 
            newQuery.on('sync', function() {
                var userId = newQuery.models[0].get("id")
                var userMsgColl = new UserExercises(userId, day)
                userMsgColl.create({
                            exerciseName: self.exerciseName,
                            exerciseDescription: self.exerciseDescription,
                            exerciseReps: self.reps,
                            exerciseSets: self.sets,
                            pt: ref.getAuth().password.email,
                            sender_id: ref.getAuth().uid
                            })

            })
            this.refs.exName.value = ''
            this.refs.exDescr.value = ''
            this.refs.exReps.value = ''
            this.refs.exSets.value = ''
        },
        render: function() {
            return (
                    <div className="messenger">
                        <textarea ref="exName" onChange={this._updateExerciseName} placeholder="Exercise Name" className="exName"/>
                        <textarea ref="exDescr" onChange={this._updateExerciseDescription} placeholder="Exercise Description" className="exDescription"/>
                        <textarea ref="exReps" onChange={this._updateReps} placeholder="Number of reps" className="exReps" />
                        <textarea ref="exSets" onChange={this._updateSets} placeholder="Number of sets" className="exSets"/>
                        <button onClick={this._sendExerciseToPatient}> Send </button>
                    </div>
                )
        }
    })

    var AddPatient = React.createClass({
        patientEmail: '',
        _updatePatientEmail: function(event) {
            this.patientEmail = event.target.value
        },
        _addPatient: function () {
            var newPatientQuery = new QueryByEmail(this.patientEmail)
            var self = this 
            newPatientQuery.fetch()
            newPatientQuery.once('sync', function() {
                var patientMod = newPatientQuery.models[0]
                var patientName = patientMod.get('name')
                var patientEmail = patientMod.get('email')
                console.log(self.props.ptUid)
                console.log(ref.getAuth().uid)
                // var ptMod = new PhysicalTherapistUserModel(self.props.ptUid)
                // ptMod.fetch()
                // window.ptMod = ptMod
                // ptMod.once('sync', function() {
                //     console.log('here comes ptmod', ptMod)
                //     var oldPatients = ptMod.get('patients') 
                //     if (oldPatients instanceof Array) {
                //         console.log('array detected')
                //         oldPatients.push({id: patientMod.id, name: patientName})
                //         console.log(oldPatients)
                //         ptMod.save("patients",oldPatients)
                //     }
                //     else {
                //         console.log('not an array')
                //         ptMod.save("patients",[patientName])
                //     }
                // })
                var patientsCollForPT = new PTpatientsCollection(self.props.ptUid)
                console.log(patientsCollForPT)
                patientsCollForPT.on('sync', function() {
                    console.log('sinked!')
                    patientsCollForPT.create({id: patientMod.id, name: patientName, email: patientEmail})
                })
                        
            })
        },
        render: function() {
            return (
                    <div className="addPatientContainer">
                        <input type="checkbox" className="addPatientCheckbox"/><span>Add new patient by email</span>
                        <div className="patientToBeAddedContainer">
                            <input onChange={this._updatePatientEmail} placeholder="patient email" className="patientEmail"/>
                            <button onClick={this._addPatient}>Add</button>
                        </div>
                    </div>
                )
        }
    })
    var PTprofile = React.createClass({
        ptLastName: '',
        ptFirstName: '',
        ptPhone: '',
        ptSpecialty: '',
        ptEmail: '',
        ptBio: '',
        ptGender: '',
        ptProfileImg: '',
        _handlePtLastName: function (e) {
            this.ptLastName = e.target.value
        },
        _handlePtFirstName: function (e) {
            this.ptFirstName = e.target.value
        },
        _handlePtPhone: function (e) {
            this.ptPhone = e.target.value
        },
        _handlePtSpeciatly: function (e) {
            this.ptSpecialty = e.target.value
        },
        _handlePtEmail: function (e) {
            this.ptEmail = e.target.value
        },
        _handlePtBio: function (e) {
            this.ptBio = e.target.value
        },
        _handlePtGender: function (e) {
            this.ptGender = e.target.value
        },
        _handleProfileChanges: function () {
            var ptProfileMod = new PhysicalTherapistUserModel(this.props.ptUid)
            ptProfileMod.set({
                lastName: this.ptLastName,
                firstName: this.ptFirstName,
                phone: this.ptPhone,
                specialty: this.ptSpecialty,
                bio: this.ptBio,
                gender: this.ptGender
            })
            this.refs.ptLastName.value = ''
            this.refs.ptFirstName.value =''
            this.refs.ptPhone.value = ''
            this.refs.ptSpecialty.value = ''
            this.refs.ptBio.value = ''
        },
        render: function () {
            return (
                    <div className="patientProfileView">
                        <input type="checkbox" className="showCurrentProfileCheckbox"/>
                        <span className="profileSpan">Profile</span>
                        <div className="currentProfileInformation">
                            <p>Last Name: {this.props.ptMod.get('lastName')}</p>
                            <p>First Name: {this.props.ptMod.get('firstName')}</p>
                            <p>Phone: {this.props.ptMod.get('phone')}</p>
                            <p>Email: {this.props.ptMod.get('email')}</p>
                            <p>Gender: {this.props.ptMod.get('gender')}</p>
                            <p>Specialty: {this.props.ptMod.get('specialty')}</p>
                            <p>Bio: {this.props.ptMod.get('bio')}</p>
                        </div>
                        <input type="checkbox" className="editProfileCheckbox"/>
                        <span className="editProfileSpan" >Edit Profile</span>
                        <div className="profileInformationContainer">
                            <p>Last Name:</p>
                            <input type="textbox" onChange={this._handlePtLastName}  ref="ptLastName" />
                            <p>First Name:</p>
                            <input type="textbox" onChange={this._handlePtFirstName}  ref="ptFirstName"/>
                            <p>Phone:</p>
                            <input type="textbox" onChange={this._handlePtPhone} ref="ptPhone"/>
                            <p>Specialty:</p>
                            <input type="textbox" onChange={this._handlePtSpeciatly}  ref="ptSpecialty"/>
                            <p>Bio:</p>
                            <input type="textbox" onChange={this._handlePtBio} ref="ptBio"/>
                            <p>Gender:</p>
                            <input type="radio" name="gender" onChange={this._handlePatientGender} value="male"/><span> Male</span>
                            <input type="radio" name="gender" onChange={this._handlePatientGender} value="female"/><span> Female</span>
                            <button onClick={this._handleProfileChanges} className="submitProfileChanges">Save</button>
                        </div>
                    </div>
                )
        }

    })


	var PatientPortal = React.createClass({
		componentWillMount: function() {
  			var self = this
    		this.props.msgColl.on('sync',function() {self.forceUpdate()})
            this.props.patientMod.on('sync', function() {self.forceUpdate()})
		},
        _handleLogout: function() {
            this.props.logout()
        },

        _updateRightCol: function(dayModel) {
            this.setState({
                dayModel: dayModel
            })
        },
        _updateDayModelShowing: function (boolean) {
            this.setState({
                dayModelShowing: boolean
            })
        },
        _updateRightColPatientProfile: function (boolean) {
            this.setState({
                showPatientProfile: boolean
            })
        },
        _updateEditPatientProfile: function (boolean) {
            this.setState({
                editPatientProfile: boolean
            })
        },

		render: function() {
			return (
					<div className="patientPortalViewContainer">
                        <div className="header">
                            <span className="welcomeMsg" >Hello, {this.props.patientMod.get('name')}</span>
                            <a className="logoutLink" onClick={this._handleLogout} href="logout">log out</a>
                        </div>
                        <div className="leftCol">
                            <DaysOfTheWeek dayModelShowing={this.state.dayModelShowing} _updateDayModelShowing={this._updateDayModelShowing} daysArray={this.props.msgColl.models} _updateRightCol={this._updateRightCol} />
                            <EditPatientProfile patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} patientUid={this.props.patientUid} showPatientProfile={this.state.showPatientProfile} editPatientProfile={this.state.editPatientProfile} />
                        </div>
                        <div className="rightCol">
                            <ShowIndividualExercise dayModelShowing={this.state.dayModelShowing} dayModel={this.state.dayModel}  />
                            <ShowPatientProfile patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} showPatientProfile={this.state.showPatientProfile} editPatientProfile={this.state.editPatientProfile} />
                        </div>
					</div>
				)
		},
        getInitialState: function() {
            return {
                dayModel: this.props.dayModel,
                dayModelShowing: false,
                showPatientProfile: false,
                editPatientProfile: false          
            }
        }
	})
    var EditPatientProfile = React.createClass({
        
        _showPatientProfile: function () {
            if (this.props.showPatientProfile) {
                var boolean = false
            } 
            else {
                var boolean = true
            }
            this.props._updateRightColPatientProfile(boolean)
        },
        _showEditPatientProfile: function() {
            if (this.props.editPatientProfile) {
                var boolean = false
            }
            else { var boolean = true }
            this.props._updateEditPatientProfile(boolean)
        },
        render: function () {
        
            return (
                    <div className="patientProfileView">
                        <input type="checkbox" onChange={this._showPatientProfile} className="showCurrentProfileCheckbox"/>
                        <span className="profileSpan">Profile</span>
                        <input type="checkbox" onChange={this._showEditPatientProfile} className="editProfileCheckbox"/>
                        <span className="editProfileSpan" >Edit Profile</span>
                    </div>
                )
        }
    })
    var ShowPatientProfile = React.createClass({
        patientLastName: '',
        patientFirstName: '',
        patientPhone: '',
        patientInjury: '',
        patientProfilePic: null,
        patientGender: '',
        patientEmail: '',
        _handlePatientLastName: function(e) {
            this.patientLastName = e.target.value
        },
        _handlePatientFirstName: function(e) {
            this.patientFirstName = e.target.value
        },
        _handlePatientPhone: function(e) {
            this.patientPhone = e.target.value
        },
        _handlePatientInjury: function(e) {
            this.patientInjury = e.target.value
        },
        _handlePatientGender: function (e) {
            this.patientGender = e.target.value
            console.log(this.patientGender)
        },
        _handlePatientEmail: function (e) {
            this.patientEmail = e.target.value
        },
        _handleProfileChanges: function () {
            var profileChangesMod = new PatientUserModel(this.props.patientUid)
            profileChangesMod.set({
                lastName: this.patientLastName,
                firstName: this.patientFirstName,
                phone: this.patientPhone,
                injury: this.patientInjury,
                gender: this.patientGender
            })
        },
        render: function () {
            var currentProfileStylesObj = {display: "none"}
            var editProfileInformationContainerStylesObj = {display: "none"}
            if (this.props.editPatientProfile === false) {
            }
            else {
                editProfileInformationContainerStylesObj = {display: "block", margin: "auto"}
            }

            if (this.props.showPatientProfile === false) {
            }
            else {
                currentProfileStylesObj = {display: "block"}
            }
            return (
                <div style={currentProfileStylesObj} className="currentProfileInformation">
                            <p>Last Name: {this.props.patientMod.get('lastName')}</p>
                                <input style={editProfileInformationContainerStylesObj} type="textbox" onChange={this._handlePatientLastName} className="patientLastName"/>
                            <p>First Name: {this.props.patientMod.get('firstName')}</p>
                                <input style={editProfileInformationContainerStylesObj} type="textbox" onChange={this._handlePatientFirstName} className="patientFirstName"/>
                            <p>Phone: {this.props.patientMod.get('phone')}</p>
                                <input style={editProfileInformationContainerStylesObj} type="textbox" onChange={this._handlePatientPhone} className="patientPhone"/>
                            <p>Email: {this.props.patientMod.get('email')}</p>
                                 <input style={editProfileInformationContainerStylesObj} type="textbox" onChange={this._handlePatientEmail} className="patientEmail"/>
                            <p>Gender: {this.props.patientMod.get('gender')}</p>
                                <input style={editProfileInformationContainerStylesObj} type="radio" name="gender" onChange={this._handlePatientGender} value="male"/><span style={editProfileInformationContainerStylesObj}> Male</span>
                                <input style={editProfileInformationContainerStylesObj} type="radio" name="gender" onChange={this._handlePatientGender} value="female"/>
                                <span style={editProfileInformationContainerStylesObj}> Female</span>
                            <p>Injury: {this.props.patientMod.get('injury')}</p>
                                 <input style={editProfileInformationContainerStylesObj} type="textbox" onChange={this._handlePatientInjury} className="patientInjury"/>
                            <button style={editProfileInformationContainerStylesObj} onClick={this._handleProfileChanges} className="submitProfileChanges">Save</button>


                            
                </div>
                )
        }
    })
    var DaysOfTheWeek = React.createClass({


        _showDaysOfTheWeek: function(dayModel,i) {
            return (
                    <div className="weekday">
                        <input type="checkbox" className="weekdayCheckbox"/>
                        <ShowDailyExercises dayModel={dayModel} key={i} _updateRightCol={this.props._updateRightCol}/>
                    </div>
                    )
        },
         _toggleExercises: function() {
            if (this.props.dayModelShowing) {
                var boolean = false
            }
            else { var boolean = true }
            this.props._updateDayModelShowing(boolean)
        },
        render: function() {
            console.log(this.props.dayModelShowing)
            return (
                    <div className="daysOfTheWeeK">
                        <input onChange={this._toggleExercises} className="daysOfTheWeeKCheckbox" type="checkbox"/><span className="showWeekSpan">Show Week</span>
                        {this.props.daysArray.map(this._showDaysOfTheWeek)}
                    </div>
                )
        }
    })
    var ShowDailyExercises = React.createClass({
        _toggleDay: function() {
            this.props._updateRightCol(this.props.dayModel)
        },
        render: function() {
            return (
                    <div className="allDailyExercises">
                      <span onClick={this._toggleDay} className="weekdaySpan">{this.props.dayModel.get('id')}</span>
                      {/* this._showEachExercise(this.props.dayModel) */}
                    </div>
                )
        }
    })
    var ShowIndividualExercise = React.createClass({
        _showEachExercise: function(model) {
            var arr = []
            for (var key in this.props.dayModel.attributes) {
                if (key !== 'id') {
                    var exerciseObject = this.props.dayModel.get(key);
                    arr.push(exerciseObject)
                }
            }
            return arr.map(this._makeExercise)
        },
        _makeExercise: function (model) {
                return (
                    <div className="individualExercise" >
                        <p>Exercise Name: {model.exerciseName}</p>      
                        <p>Exercise Description: {model.exerciseDescription}</p>
                        <p>Exercise Sets: {model.exerciseSets} </p>
                        <p>Exercise Reps: {model.exerciseReps} </p>
                    </div>                 
                    )
        },
        render: function () {
            var divStylesObj = {display: "initial"} 
            if (this.props.dayModelShowing === false) 
                divStylesObj = {display: 'none'}
            //console.log(this.props.dayModelShowing)
            if (this.props.dayModel === undefined) {
                var showExercises = ''
            } else {
                var showExercises = this._showEachExercise(this.props.dayModel)
            }
            return (
                    <div style={divStylesObj}>
                        {showExercises}
                    </div>
                )
        }
    })


    var PhysicalTherapistUserModel = Backbone.Firebase.Model.extend({
    	initialize: function(uid) {
    		this.url = `http://pt4home.firebaseio.com/pts/${uid}`
    	},
    })
    var PTpatientsCollection = Backbone.Firebase.Collection.extend({
        initialize: function(uid) {
            this.url = `http://pt4home.firebaseio.com/pts/${uid}/patients`    
        }
    })

    var PatientUserModel = Backbone.Firebase.Model.extend({
    	initialize: function(uid) {
    		this.url = `http://pt4home.firebaseio.com/patients/${uid}`
    	},
    })
 	var QueryByEmail = Backbone.Firebase.Collection.extend({
        initialize: function(targetEmail) {
            this.url = ref.child('patients').orderByChild('email').equalTo(targetEmail)
        },
        autoSync: false
	})

	var UserExercises = Backbone.Firebase.Collection.extend({
      
        initialize: function(uid,dayOfWeek) {
            this.url = `http://pt4home.firebaseio.com/patients/${uid}/exercises/${dayOfWeek}`
        	}
	})
    var UserMessages = Backbone.Firebase.Collection.extend({
    initialize: function(uid,dayOfWeek) {
        this.url = `http://pt4home.firebaseio.com/patients/${uid}/exercises`
        }
    })

    var AppRouter = Backbone.Router.extend({
    	routes: {
    		'splash': "showSplashPage",
    		'showPtPortal': "showPtPortal",
    		'showPatientPortal': "showPatientPortal",
    		'logout': "_logoutUser",
            '*default': "showSplashPage"
    	},
    	initialize: function() {
    		this.ref = new Firebase('https://pt4home.firebaseio.com')
    		this.on('route', function() {
    			if (!this.ref.getAuth())
    				location.hash = "splash"
    		})
    	},
    	_createPTuser: function(email,password,realName) {
    		// console.log(email, password)
    		var self = this
    		this.ref.createUser({
    			email: email,
    			password: password,
    		}, function(error,authData) {
    			if (error) console.log(error)
    				else {
    					console.log(authData)
    					var ptMod = new PhysicalTherapistUserModel(authData.uid)
    					ptMod.set({
    	    						name: realName,
    	    						email: email,
    	    						id: authData.uid,
                                    patients: []
	    						})
    				}
    			self._loginPtUser(email, password)
    		})
    	},
    	_createPatientUser: function(email,password,realName) {
    		//console.log(email, password)
    		var self = this
    		this.ref.createUser({
    			email: email,
    			password: password,
    		}, function(error,authData) {
    			if (error) console.log(error)
    				else {
    					console.log(authData)
    					var patientMod = new PatientUserModel(authData.uid)
    					patientMod.set({
	    						name: realName,
	    						email: email,
	    						id: authData.uid
	    						})
    				}
    				self._loginPatientUser(email, password)
    		})
    	},
    	_loginPtUser: function(email,password) {
    		//console.log(email,password)
    		this.ref.authWithPassword({
    			email: email,
    			password: password
    		}, function(error, authData) {
    			if (error) console.log(error) 
    				else {
    					console.log(authData)
    					location.hash = "showPtPortal"
    				}
    		})
    	},
    	_loginPatientUser: function(email,password) {
    		//console.log(email,password)
    		this.ref.authWithPassword({
    			email: email,
    			password: password
    		}, function(error, authData) {
    			if (error) console.log(error) 
    				else {
    					console.log(authData)
    					location.hash = "showPatientPortal"
    				}
    		})
    	},
    	_logoutUser: function() {
    		this.ref.unauth() 
    		location.hash = "splash"
    	},
    	showSplashPage: function() {
            location.hash = "splash"
    		DOM.render(<SplashPage ptSignUp={this._createPTuser.bind(this)} patientSignUp={this._createPatientUser.bind(this)} ptLogin={this._loginPtUser.bind(this)} patientLogin={this._loginPatientUser.bind(this)}/>, document.querySelector('.container'))
    	},
    	showPtPortal: function() {
            var ptUid = ref.getAuth().uid 
            var ptMod = new PTpatientsCollection(ptUid)
            var ptName = new PhysicalTherapistUserModel(ptUid)
            ptMod.fetch()
            ptName.fetch()         
       		DOM.render(<PTportal logout={this._logoutUser.bind(this)} ptUid={ptUid} ptMod={ptMod} ptName={ptName} />, document.querySelector('.container'))
    	},
    	showPatientPortal: function () {
    		var uid = ref.getAuth().uid
    		var msgColl = new UserMessages(uid)
            var patientMod = new PatientUserModel(uid)
    		DOM.render(<PatientPortal msgColl={msgColl} patientMod={patientMod}  logout={this._logoutUser.bind(this)} patientUid={uid} />, document.querySelector('.container'))
    	}
    })

    var newRouter = new AppRouter()
    Backbone.history.start()
}


app()

//export { _createPTuser, _createPatientUser, _loginPtUser, _loginPatientUser}

