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
                <h1>PT4HOME</h1>
    			<h2>Pick your journey</h2>
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
        _updateShowPatients: function(boolean) {
            this.setState ({
                showingPatients: boolean
            })
        },
        _updateAddPatient: function(boolean) {
            this.setState({
                showingAddPatient: boolean
            })
        },
        _updateShowPtProfile: function(boolean) {
            this.setState({
                showingPtProfile: boolean
            })
        },
        _updateShowPtEditProfile: function(boolean) {
            this.setState({
                showingPtEditProfile: boolean
            })
        },
        _updatePatientTargetEmail: function(boolean) {
            this.setState({
                showingPatientTargetEmail: boolean
            })
        },
        _updateDailyExercises: function(day,boolean) {
            this.setState({
                dailyExercisesDay: day,
                dailyExercisesDayShowing: boolean
            })
        },
         _changeShowSentExercise: function(boolean) {
            this.setState({
                showSentExercise: boolean
            })
        },
        _changeShowPatientAdded: function(boolean) {
            this.setState ({
                showPatientAdded: boolean
            })
        },
        _changeColor: function(divToChange) {
            // var targetToChange = e.target
            // console.log(targetToChange)
            // targetToChange.style.background = "black"
            if (divToChange.style.background === "black") {
                 // console.log('color change')
                 divToChange.style.background = "none" 
             } else {
               divToChange.style.background = "black" 
               // console.log('change to black')
             } 
        },
    	render: function () {  
    		return (
    				<div className="dashboard">
                         <div className="header">
                            <div className='profileImg'>
                                <img src={this.props.ptName.get('ptProfileImg')} />
                            </div>
                            <span className="welcomeMsg" >Hello, {this.props.ptName.get('name')}</span>
                            <span className="logoutLink" onClick={this._handleLogout}>log out<img src={('./Images/logoutIcon.svg')}/></span>
                        </div>
                        <div className="leftCol">
                            <ShowPatientsInput _changeColor={this._changeColor} patientsArray={this.props.ptMod} showingPatients={this.state.showingPatients} _updateShowPatients={this._updateShowPatients}/>
                            <AddPatientInput _changeColor={this._changeColor} showingAddPatient={this.state.showingAddPatient} _updateAddPatient={this._updateAddPatient} />
                            <WeekList _changeColor={this._changeColor} dailyExercisesDayShowing={this.state.dailyExercisesDayShowing} _updatePatientTargetEmail={this._updatePatientTargetEmail} showingPatientTargetEmail={this.state.showingPatientTargetEmail} _updateDailyExercises={this._updateDailyExercises} />
                            <PTprofileInput _changeColor={this._changeColor} _updateShowPtEditProfile={this._updateShowPtEditProfile} showingPtEditProfile={this.state.showingPtEditProfile} ptUid={this.props.ptUid} ptMod={this.props.ptName} showingPtProfile={this.state.showingPtProfile} _updateShowPtProfile={this._updateShowPtProfile} />
                        </div>
                        <div className="rightCol">
                            <ShowAllPatients patientsArray={this.props.ptMod} showingPatients={this.state.showingPatients} />
                            <AddNewPatientView  showPatientAdded={this.state.showPatientAdded} _changeShowPatientAdded={this._changeShowPatientAdded} showingAddPatient={this.state.showingAddPatient} ptUid={this.props.ptUid} />
                            <ShowAddingWeekExercises showingPatientTargetEmail={this.state.showingPatientTargetEmail} />
                            <DailyExercises _changeShowSentExercise={this._changeShowSentExercise} showSentExercise={this.state.showSentExercise} dailyExercisesDayShowing={this.state.dailyExercisesDayShowing} dailyExercisesDay={this.state.dailyExercisesDay} />
                            <ShowPtProfile showingPtEditProfile={this.state.showingPtEditProfile} ptUid={this.props.ptUid} ptMod={this.props.ptName} showingPtProfile={this.state.showingPtProfile} />
                        </div>
    				</div>
    			)
    	},
        getInitialState: function() {
            return {
                showingPatients: false,
                showingAddPatient: false,
                showPatientAdded: false,
                showingPtProfile: false,
                showingPtEditProfile: false,
                showingPatientTargetEmail: false,
                dailyExercisesDay: '',
                dailyExercisesDayShowing: false,
                showSentExercise: false,
            }
        }
    })
    var ShowPatientsInput = React.createClass({
        _togglePatientsShowing: function () {
            if (this.props.showingPatients) {
                var boolean = false 
            } else var boolean = true 
            this.props._updateShowPatients(boolean)
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
            return (
                    <div onClick={this._toggleColors} ref="containerToChangeColor" className="ptsPatientsContainer">
                        <input onChange={this._togglePatientsShowing} type="checkbox" className="showAllPatientsCheckbox"/>
                        <img className="icon" src={('./Images/patientsIcon.svg')}/>
                        <span className="showAllPatientsTitle">Patients</span>
                    </div>
                    )
        }
    })
    var ShowAllPatients = React.createClass({
        _showPatient: function(mod, i) {
            var patientImgStylesObj = {width: "30%"}
            var patientStyleObj = {display: "none"}
            if (this.props.showingPatients) {
                patientStyleObj = {display: "inline-block", margin: "2%", border: "1px solid black", padding: "2%"}
            }
            console.log(mod)
            return (
                    <div style={patientStyleObj}>
                        <img style={patientImgStylesObj} src={mod.get('patientProfileImg')} />
                        <p  className="patient" > Name: {mod.get('name')} </p>
                        <span  className="patient"> Injury: {mod.get('injury')} </span>
                        <p> Email: {mod.get('email')} </p>
                    </div>
                )
        },
        render: function() {
            return (
                <div className="allPatientsContainer">
                     {this.props.patientsArray.map(this._showPatient)}
                </div>
                )
        }
    })

    var AddPatientInput = React.createClass({
        _toggleAddPatient: function() {
            if (this.props.showingAddPatient) {
                var boolean = false
            } else {
                var boolean = true
            }
            this.props._updateAddPatient(boolean)
        },
         _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function() {
            return (
                    <div onClick={this._toggleColors} ref="containerToChangeColor" className="addPatientContainer">
                        <input type="checkbox" onChange={this._toggleAddPatient} className="addPatientCheckbox"/>
                        <img className="icon" src={('./Images/addIcon.svg')}/>
                        <span>Add new patient</span>
                    </div>
                )
        }
    })
    var AddNewPatientView = React.createClass({
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
                var patientInjury = patientMod.get('injury')
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
                    patientsCollForPT.create({id: patientMod.id, name: patientName, email: patientEmail, injury: patientInjury})
                })
                if (this.props.showPatientAdded) {
                    var boolean = false
                } else var boolean = true
                this.props._changeShowPatientAdded(boolean)
            })
        },
        render: function() {
            var addPatientStyleObj = {display: 'none'}
            if (this.props.showingAddPatient) {
                addPatientStyleObj = {display: 'block'}
            }
            return (
                    <div style={addPatientStyleObj} className="patientToBeAddedContainer">
                            <input onChange={this._updatePatientEmail} placeholder="patient email" className="patientEmail"/>
                            <button onClick={this._addPatient}>Add</button>
                            <ConfirmAddedPatient showPatientAdded={this.props.showPatientAdded} _changeShowPatientAdded={this.props._changeShowPatientAdded} />
                    </div>
                )
        }
    })
    var ConfirmAddedPatient = React.createClass ({
        _changeBackShowPatientAdded: function() {
            if (this.props.showPatientAdded) {
                var boolean = false 
            } else var boolean = true 
            this.props._changeShowPatientAdded(boolean)
        },
        render: function() {
            var containerStylesObj = {display: 'none'}
            if (this.props.showPatientAdded) {
                containerStylesObj.display = "block"
            }
            return (
                    <div style={containerStylesObj} className="confirmAddedPatientContainer">
                        <p>New Patient Added!</p>
                        <p className="exitPopUp" onClick={this._changeBackShowPatientAdded}>X</p>
                    </div>
                )
        }
    })
    var PTprofileInput = React.createClass({
        _togglePtProfileShowing: function() {
           
         if (this.props.showingPtProfile) {
                var boolean = false
            } else {
                var boolean = true
            }
            this.props._updateShowPtProfile(boolean)
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
            return (
                    <div ref="containerToChangeColor" className="patientProfileView">
                        <input onClick={this._toggleColors} onChange={this._togglePtProfileShowing} type="checkbox" className="showCurrentProfileCheckbox"/>
                        <img className="icon" src={('./Images/profileIcon.svg')}/>
                        <span className="profileSpan">Profile</span>
                    </div>
                )
        }
    })
    var ShowPtProfile = React.createClass({
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
        _handlePtProfileImg: function (e) {
            var imgElement = e.target
            this.ptProfileImg = imgElement.files[0]
        },
        _handleProfileChanges: function () {
            var ptProfileMod = new PhysicalTherapistUserModel(this.props.ptUid)
            console.log(ptProfileMod)
            
            if (this.ptLastName === '') {
                this.ptLastName = ptProfileMod.get('lastName')
            }
              if (this.ptFirstName === '') {
                this.ptFirstName = ptProfileMod.get('firstName')
            }
              if (this.ptPhone === '') {
                this.ptPhone = ptProfileMod.get('phone')
            }
              if (this.ptSpecialty === '') {
                this.ptSpecialty = ptProfileMod.get('specialty')
            }
              if (this.ptBio === '') {
                this.ptBio = ptProfileMod.get('bio')
            }
              if (this.ptGender === '') {
                this.ptGender = ptProfileMod.get('gender')
            }
            var ptProfile = {
                            lastName: this.ptLastName,
                            firstName: this.ptFirstName,
                            phone: this.ptPhone,
                            specialty: this.ptSpecialty,
                            bio: this.ptBio,
                            gender: this.ptGender,
                            ptProfileImg: ''
                        }

            if (this.ptProfileImg) {
                    var imgReader = new FileReader()
                    imgReader.readAsDataURL(this.ptProfileImg)
                    imgReader.addEventListener('load', function() {
                        var base64string = imgReader.result
                        ptProfile.ptProfileImg = base64string
                        ptProfileMod.set(ptProfile)
                })
            } else {
                 ptProfile.ptProfileImg = './Images/profileImgPlaceholder.svg'
                 ptProfileMod.set(ptProfile)
            }
            
            this.refs.ptLastName.value = ''
            this.refs.ptFirstName.value =''
            this.refs.ptPhone.value = ''
            this.refs.ptSpecialty.value = ''
            this.refs.ptBio.value = ''
        },
        render: function () {
            var ptProfileStylesObj = {display: "none"}
            var ptEditProfileStylesObj = {display: 'none'}
            if (this.props.showingPtProfile) {
                ptProfileStylesObj = {display: "block"}
            }
            if (this.props.showingPtEditProfile) {
                ptEditProfileStylesObj = {display: 'block', margin: "auto"}
            }
            return (
                    <div style={ptProfileStylesObj} >
                        <div className="currentProfileInformation">
                            <div className="profileImgContainer">
                                <img src={this.props.ptMod.get('ptProfileImg')} />
                                <div className="stylingFileUpload">
                                    <button>Update Profile Image</button>
                                    <input  ref="patientProfileImg" type="file" onChange={this._handlePatientProfileImg} />                                    
                                </div>
                            </div>
                            <div className="profileOption">
                                <p>Last Name</p>
                                    <input  placeholder={this.props.ptMod.get('lastName')} type="textbox" onChange={this._handlePtLastName} className="profileOptionInput" ref="ptLastName" />
                            </div>
                            <div className="profileOption">
                                <p>First Name {this.props.ptMod.get('firstName')}</p>
                                    <input placeholder={this.props.ptMod.get('firstName')} type="textbox" onChange={this._handlePtFirstName} className="profileOptionInput" ref="ptFirstName"/>
                            </div>
                            <div className="profileOption">
                                <p>Phone </p>
                                     <input placeholder={this.props.ptMod.get('phone')} type="textbox" onChange={this._handlePtPhone}  className="profileOptionInput" ref="ptPhone"/>
                            </div>
                            <div className="profileOption">
                                <p>Email</p>
                                <input placeholder={this.props.ptMod.get('email')} type="textbox" onChange={this._handlePtPhone}  className="profileOptionInput" ref="ptPhone"/>
                            </div>
                            <div className="profileOption">
                                <p>Specialty</p>
                                     <input placeholder={this.props.ptMod.get('specialty')} type="textbox" onChange={this._handlePtSpeciatly} className="profileOptionInput" ref="ptSpecialty"/>
                            </div>
                            <div className="profileOption">
                            <p>Gender: {this.props.ptMod.get('gender')}</p>
                                <div>
                                    <span >Male</span>
                                    <input type="radio" name="gender" onChange={this._handlePtGender} className="profileOptionRadio" value="Male" ref="male"/>
                                </div>
                                <div>
                                <span >Female</span>
                                    <input type="radio" name="gender" onChange={this._handlePtGender} className="profileOptionRadio" value="Female" ref="female"/>
                                </div>    
                            </div>
                            <div className="profileOptionPtBio">
                                <p>Bio</p>
                                    <input placeholder= {this.props.ptMod.get('bio')} type="textbox" onChange={this._handlePtBio} className="profileOptionInput ptBioInput" ref="ptBio"/>
                            </div>
                            <button onClick={this._handleProfileChanges} className="submitProfileChanges">Save</button>
                    </div>
                </div>
                )
        }
    })

    var ShowAddingWeekExercises = React.createClass({
        targetEmail: '',
         _updateTargetEmail: function(event) {
            this.targetEmail = event.target.value
            window.targetEmail = this.targetEmail
        },
        render: function() {

            var emailInputStylesObj = {display: 'none'}
            if (this.props.showingPatientTargetEmail) {
                emailInputStylesObj = {display: 'block'}
            }
            return (
                    <div style={emailInputStylesObj} className="patientToReceiveTreatmentContainer">
                        <span>Patient to receive regimen: </span>
                        <input onChange={this._updateTargetEmail} placeholder="patient email" className="targetEmail" />
                    </div>
                )
        }
    })
    var WeekList = React.createClass({
        _togglePatientTargetEmail: function() {
            if (this.props.showingPatientTargetEmail) {
                var boolean = false
            } else var boolean = true
            this.props._updatePatientTargetEmail(boolean)
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
            return (
                    <div onClick={this._toggleColors} ref="containerToChangeColor" className="weekExercisesContainer">
                        <input onChange={this._togglePatientTargetEmail} type="checkbox" className="addExercise"/>
                        <img className="icon" src={('./Images/ptExercisesIcon.svg')}/>
                        <span className="addWeeksExerciseSpan">Add Exercises</span>
                        <div className="weeksContainer">
                            <div onClick={this._toggleColors} ref="containerToChangeColor" >
                                <input type="checkbox" className="weekCheckbox"/>
                                <span className="weekTitle">Week:</span>
                                    <DayList dailyExercisesDayShowing={this.props.dailyExercisesDayShowing} _updateDailyExercises={this.props._updateDailyExercises} patientEmail={window.targetEmail} />
                            </div>
                        </div>
                    </div>
                )
        }
    })
    var DayList = React.createClass({
        _toggleDailyExercises: function(e) {
            var day = e.target.value
            
            if (this.props.dailyExercisesDayShowing) {
                var boolean = false
            } else var boolean = true
            this.props._updateDailyExercises(day,boolean)
        },
        render: function() {
            return (
                    <div className="daysContainer">
                        <div>
                            <input onChange={this._toggleDailyExercises} type="checkbox" value="Monday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Monday</span>
                          
                        </div>
                         <div>
                            <input onChange={this._toggleDailyExercises} type="checkbox" value="Tuesday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Tuesday</span>
                         
                        </div>
                         <div>
                            <input onChange={this._toggleDailyExercises} type="checkbox" value="Wednesday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Wednesday</span>
                             
                        </div>
                         <div>
                            <input onChange={this._toggleDailyExercises} type="checkbox" value="Thursday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Thursday</span>
                        
                        </div>
                         <div>
                            <input onChange={this._toggleDailyExercises} type="checkbox" value="Friday" className="dayOfWeekCheckbox"/>
                            <span className="dayOfWeek">Friday</span>
                            
                        </div>
                    </div>
                    )
        }
    })

    var DailyExercises = React.createClass({
        exerciseName: '',
        reps: '',
        sets: '',
        exerciseDescription: '',
        beforeImg: '',
        afterImg: '',
        done: false,
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
        _updateBeforeImg: function(event) {
            var imgElement = event.target
            this.beforeImg = imgElement.files[0]
        },
        _updateAfterImg: function(event) {
            var imgElement = event.target
            this.afterImg = imgElement.files[0]
        },
        _sendExerciseToPatient: function() {
            var day = this.props.dailyExercisesDay
            var email = window.targetEmail
            var newQuery = new QueryByEmail(email)
            var self = this
            var exerciseObject = {
                            exerciseName: self.exerciseName,
                            exerciseDescription: self.exerciseDescription,
                            exerciseReps: self.reps,
                            exerciseSets: self.sets,
                            pt: ref.getAuth().password.email,
                            sender_id: ref.getAuth().uid,
                            beforeImg: '', 
                            afterImg:  '',
                            done: false
                            }
             if (this.beforeImg) {
                    var reader = new FileReader()
                    reader.readAsDataURL(this.beforeImg)
                    reader.addEventListener('load', function() {
                    var base64string = reader.result
                    exerciseObject.beforeImg = base64string
                })
            }
            if (this.afterImg) {
                    var afterRdr = new FileReader()
                    afterRdr.readAsDataURL(this.afterImg)
                    afterRdr.addEventListener('load', function() {
                    var base64stringafter = afterRdr.result
                    exerciseObject.afterImg = base64stringafter
                })
            }
            newQuery.fetch() 
            newQuery.on('sync', function() {
                var userId = newQuery.models[0].get("id")
                var userMsgColl = new UserExercises(userId, day)
                userMsgColl.create(exerciseObject)
                // alert('finally')
            })
            this.refs.exName.value = ''
            this.refs.exDescr.value = ''
            this.refs.exReps.value = ''
            this.refs.exSets.value = ''
            this._changeShowSentExercise()   
        },

        _changeShowSentExercise: function() {
            console.log('sent!')
            if (this.props.showSentExercise) {
                var boolean = false
            } else var boolean = true 
            this.props._changeShowSentExercise(boolean)
        },
        render: function() {
            var messengerStylesObj = {display:'none'}
            if (this.props.dailyExercisesDayShowing) {
                messengerStylesObj = {display: 'block'}
            }

            return (
                    <div style={messengerStylesObj} className="messenger">
                        <textarea ref="exName" onChange={this._updateExerciseName} placeholder="Exercise Name" className="exName"/>
                        <textarea ref="exDescr" onChange={this._updateExerciseDescription} placeholder="Exercise Description" className="exDescription"/>
                        <textarea ref="exReps" onChange={this._updateReps} placeholder="Number of reps" className="exReps" />
                        <textarea ref="exSets" onChange={this._updateSets} placeholder="Number of sets" className="exSets"/>
                        <label>Upload before exercise image</label>
                        <input ref="beforeImg" type="file" onChange={this._updateBeforeImg} className="beforeImg"/>
                        <label>Upload after exercise image</label>
                        <input ref="afterImg" type="file" onChange={this._updateAfterImg} className="afterImg"/>
                        <button onClick={this._sendExerciseToPatient} > Send </button>
                        <ShowSentMessage showSentExercise={this.props.showSentExercise} _changeShowSentExercise={this.props._changeShowSentExercise}/>
                    </div>
                )
        }
    })

    var ShowSentMessage = React.createClass({
        _changeShowSentExercise: function() {
            console.log('sent!')
            if (this.props.showSentExercise) {
                var boolean = false
            } else var boolean = true 
            this.props._changeShowSentExercise(boolean)
        },

        render: function() {
            var popUpStyleObj = {display: "none"}
            if (this.props.showSentExercise) {
                popUpStyleObj.display = "block"
            }
            return (
                     <div style={popUpStyleObj} className="popUp">
                        <p>Exercise Sent To Patient!</p>
                        <p className="exitPopUp" onClick={this._changeShowSentExercise} >X</p>
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
        _updateStatusOfExercise: function(model) {
            this.setState({
                completeExercises: model
            })
        },
        _showCompletedExercises: function(boolean) {
            this.setState({
                showCompletedExercises: boolean
            })
        },
        _changeColor: function(divToChange) {
            // var targetToChange = e.target
            // console.log(targetToChange)
            // targetToChange.style.background = "black"
            if (divToChange.style.background === "black") {
                 console.log('color change')
                 divToChange.style.background = "none" 
             } else {
               divToChange.style.background = "black" 
               console.log('change to black')
             } 
        },
		render: function() {
			return (
					<div className="patientPortalViewContainer">
                        <div className="header">
                            <div className='profileImg'>
                                <img src={this.props.patientMod.get('patientProfileImg')} />
                            </div>
                            <span className="welcomeMsg" >Hello, {this.props.patientMod.get('name')}</span>
                            <span className="logoutLink" onClick={this._handleLogout}>log out<img src={('./Images/logoutIcon.svg')}/></span>
                        </div>
                        <div className="leftCol">
                            <DaysOfTheWeek  _changeColor={this._changeColor} dayModelShowing={this.state.dayModelShowing} _updateDayModelShowing={this._updateDayModelShowing} daysArray={this.props.msgColl.models} _updateRightCol={this._updateRightCol} />
                            <EditPatientProfile  _changeColor={this._changeColor} patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} patientUid={this.props.patientUid} showPatientProfile={this.state.showPatientProfile} />
                        </div>
                        <div className="rightCol">
                            <ShowIndividualExercise showCompletedExercises={this.state.showCompletedExercises} _showCompletedExercises={this._showCompletedExercises} completeExercises={this.state.completeExercises} _updateStatusOfExercise={this._updateStatusOfExercise} dayModelShowing={this.state.dayModelShowing} dayModel={this.state.dayModel}  />
                            <ShowPatientProfile patientUid={this.props.patientUid} patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} showPatientProfile={this.state.showPatientProfile}  />
                        </div>
					</div>
				)
		},
        getInitialState: function() {
            return {
                dayModel: this.props.dayModel,
                dayModelShowing: false,
                showPatientProfile: false, 
                incompleteExercises: false,/*<YOUR EXERCISE ARRAY>.filter(function that determines whether exercise is complete)*/
                completeExercises: false,
                showCompletedExercises: false, 
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
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
        
            return (
                    <div ref="containerToChangeColor" className="patientProfileView">
                        <input onClick={this._toggleColors} type="checkbox" onChange={this._showPatientProfile} className="showCurrentProfileCheckbox"/>
                         <img className="icon" src={('./Images/profileIcon.svg')}/>
                        <span className="profileSpan">Profile</span>
                    </div>
                )
        }
    })
    var ShowPatientProfile = React.createClass({
        patientLastName: '',
        patientFirstName: '',
        patientPhone: '',
        patientInjury: '',
        patientProfileImg: '',
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
        },
        _handlePatientEmail: function (e) {
            this.patientEmail = e.target.value
        },
        _handlePatientProfileImg: function(e) {
            var imgElement = e.target
            this.patientProfileImg = imgElement.files[0]
        },
        _handleProfileChanges: function () {
            var profileChangesMod = new PatientUserModel(this.props.patientUid)
            if (this.patientLastName === '') {
                this.patientLastName = profileChangesMod.get('lastName')
            }
              if (this.patientFirstName === '') {
                this.patientFirstName = profileChangesMod.get('firstName')
            }
              if (this.patientPhone === '') {
                this.patientPhone = profileChangesMod.get('phone')
            }
              if (this.patientInjury === '') {
                this.patientInjury = profileChangesMod.get('injury')
            }
              if (this.patientGender === '') {
                this.patientGender = profileChangesMod.get('gender')
            }
              if (this.patientEmail === '') {
                this.patientEmail = profileChangesMod.get('email')
            }
            var patientProfileChanges = {
                            lastName: this.patientLastName,
                            firstName: this.patientFirstName,
                            phone: this.patientPhone,
                            injury: this.patientInjury,
                            gender: this.patientGender,
                            email: this.patientEmail,
                            patientProfileImg: ''
                        }
            if (this.patientProfileImg) {
                    var imgReader = new FileReader()
                    imgReader.readAsDataURL(this.patientProfileImg)
                    imgReader.addEventListener('load', function() {
                        var base64string = imgReader.result
                        patientProfileChanges.patientProfileImg = base64string
                        profileChangesMod.set(patientProfileChanges)
                    })
            } else { 
                patientProfileChanges.patientProfileImg = './Images/profileImgPlaceholder.svg'
                profileChangesMod.set(patientProfileChanges) 
            }

            this.refs.patientLastName.value = ''
            this.refs.patientFirstName.value = ''
            this.refs.patientPhone.value = ''
            this.refs.male.value = ''
            this.refs.female.value = ''
            this.refs.injury.value = ''
            this.refs.patientEmail.value = ''
        },
        render: function () {
            var currentProfileStylesObj = {display: "none"}
            if (this.props.showPatientProfile === false) {
            }
            else {
                currentProfileStylesObj = {display: "block"}
            }
            return (
                <div style={currentProfileStylesObj} className="currentProfileInformation">
                            <div className="profileImgContainer">
                                <img src={this.props.patientMod.get('patientProfileImg')} />
                                <div className="stylingFileUpload">
                                    <button>Update Profile Image</button>
                                    <input  ref="patientProfileImg" type="file" onChange={this._handlePatientProfileImg} />                                    
                                </div>
                            </div>
                            <div className="profileOption">
                            <p>First Name</p>
                                <input placeholder={this.props.patientMod.get('firstName')} type="textbox" onChange={this._handlePatientFirstName} className="profileOptionInput" ref="patientFirstName"/>
                            </div>
                            <div className="profileOption">
                                <p>Last Name </p>
                                    <input placeholder={this.props.patientMod.get('lastName')} type="textbox" onChange={this._handlePatientLastName} className="profileOptionInput" ref="patientLastName"/>
                            </div>
                            <div className="profileOption">
                                <p>Email</p>
                                <input  placeholder={this.props.patientMod.get('email')} type="textbox" onChange={this._handlePatientEmail} className="profileOptionInput" ref="patientEmail" />
                            </div>
                            <div className="profileOption">
                            <p>Phone </p>
                                <input placeholder={this.props.patientMod.get('phone')} type="textbox" onChange={this._handlePatientPhone} className="profileOptionInput" ref="patientPhone" />
                            </div>
                             <div className="profileOption">
                                <p>Injury</p>
                                <input  placeholder={this.props.patientMod.get('injury')} type="textbox" onChange={this._handlePatientInjury} className="profileOptionInput" ref="injury"/>
                            </div>
                            <div className="profileOption">
                            <p>Gender: {this.props.patientMod.get('gender')}</p>
                                <div>
                                    <span >Male</span>
                                    <input type="radio" name="gender" onChange={this._handlePatientGender} className="profileOptionRadio" value="Male" ref="male"/>
                                </div>
                                <div>
                                <span >Female</span>
                                    <input type="radio" name="gender" onChange={this._handlePatientGender} className="profileOptionRadio" value="Female" ref="female"/>
                                </div>    
                            </div>
                           
                            
                            <button onClick={this._handleProfileChanges} className="submitProfileChanges">Update Profile</button>


                            
                </div>
                )
        }
    })
    var DaysOfTheWeek = React.createClass({
        _showDaysOfTheWeek: function(dayModel,i) {
            return (
                    <ShowDailyExercises dayModel={dayModel} key={i} _updateRightCol={this.props._updateRightCol}/>
                    )
        },
         _toggleExercises: function() {
            if (this.props.dayModelShowing) {
                var boolean = false
            } else { var boolean = true }
            this.props._updateDayModelShowing(boolean)
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function() {
            return (
                    <div  ref="containerToChangeColor" className="daysOfTheWeeK">
                        <input onClick={this._toggleColors} onChange={this._toggleExercises} className="daysOfTheWeeKCheckbox" type="checkbox"/>
                        <img className="icon" src={('./Images/ptExercisesIcon.svg')}/>
                        <span className="showWeekSpan">Show Week</span>
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
                    <div onClick={this._toggleDay} ref="dailyExerciseContainer" className="allDailyExercises">
                        <input type="checkbox" className="weekdayCheckbox"/>
                        <span  className="weekdaySpan">{this.props.dayModel.get('id')}</span>
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

        _toggleCompletion: function(exerciseObj) {
            var exId = exerciseObj.id
            this.props.dayModel.set({exId: exerciseObj})
        },

        _makeExercise: function (exerciseObject) {
                return (
                        <IndividualExercise showCompletedExercises={this.props.showCompletedExercises} _toggleCompletion={this._toggleCompletion} completeExercises={this.props.completeExercises} _updateStatusOfExercise={this.props._updateStatusOfExercise} model={exerciseObject} />
                    )
        },
          _showCompletedExercises: function() {
            if (this.props.showCompletedExercises) {
                var boolean = false
            } else { var boolean = true}
            this.props._showCompletedExercises(boolean)
        },

        render: function () {
            var divStylesObj = {display: "initial"} 
            if (this.props.dayModelShowing === false) 
                divStylesObj = {display: 'none'}
            if (this.props.dayModel === undefined) {
                var showExercises = ''
            } else {
                var showExercises = this._showEachExercise(this.props.dayModel)
            }
            return (
                    <div style={divStylesObj}>
                        <button onClick={this._showCompletedExercises}>Show Completed Exercises</button>
                        {showExercises}
                       
                    </div>
                )
        }
    })
    var IndividualExercise = React.createClass({
        _changeExerciseStatus: function() {
            if (this.props.model.done === false) {
                this.props.model.done =  true
            }
            console.log(this.props.model)
            // if (this.props.complete) {
            //     var boolean = false
            // } else { var boolean = true}
            this.props._toggleCompletion(this.props.model)
            this.props._updateStatusOfExercise(this.props.model)
        },
      
        render: function () {
            var model = this.props.model 
            var completeExerciseStyleObj = {display: "block"}
            var imgShowingStylesObj = {display: 'none'}
            if (this.props.model.done === true) {
                completeExerciseStyleObj.display = "none"
            }
            if (this.props.model.beforeImg && this.props.model.afterImg) {
                imgShowingStylesObj.display = "inline-block"
            }
            return (
                    <div  >
                        <div style={completeExerciseStyleObj} className="individualExercise" >
                            <p>Exercise Name: {model.exerciseName}</p>      
                            <p>Exercise Description: {model.exerciseDescription}</p>
                            <p>Exercise Sets/Reps: {model.exerciseSets}/{model.exerciseReps} </p>
                            <span className="exerciseImgShowing" style={imgShowingStylesObj} >Before</span><img className="exerciseImg" src={model.beforeImg}/>
                            <span className="exerciseImgShowing" style={imgShowingStylesObj}>After</span><img className="exerciseImg" src={model.afterImg}/>
                            <button onClick={this._changeExerciseStatus}>Complete</button>
                        </div>
                        <CompletedExercises showCompletedExercises={this.props.showCompletedExercises} exerciseObj={this.props.model} />
                    </div>                 
                )
            }
    })
    var CompletedExercises = React.createClass({
        render: function() {
            var completedExercisesStylesObj = {display: 'none'}
            if (this.props.showCompletedExercises) {
                completedExercisesStylesObj.display = "block"
            }
            //<input type="checkbox" className="completedExercisesCheckbox"/>
            return (
                        <div style={completedExercisesStylesObj} className="completedExercisesContainer">
                            <p>{this.props.exerciseObj.exerciseName}</p>
                            <p>{this.props.exerciseObj.exerciseDescription}</p>
                        </div>                )
        }
    })

    var PhysicalTherapistUserModel = Backbone.Firebase.Model.extend({
    	initialize: function(uid) {
    		this.url = `http://pt4home.firebaseio.com/pts/${uid}`
    	},
        autosyn: true
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
                                    patients: [],
                                    patientProfileImg: './Images/profileImgPlaceholder.svg'
	    						})
    				}
    			self._loginPtUser(email, password)
    		})
    	},
    	_createPatientUser: function(email,password,realName) {
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
	    						id: authData.uid,
                                patientProfileImg: './Images/profileImgPlaceholder.svg'
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

