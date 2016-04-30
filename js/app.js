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
//         
//     }).catch(() => {
//         
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
        _handleGuestSignIn: function() {
            this.props.patientLogin('bob@bob.com', 'bob')
        },
    	render: function () {
    		return (
    			<div className="splashContainer">
                <h1>Advantage Recovery</h1>
    			<h2>Pick your journey</h2>
	    			<div className="splashButtons">
	    				<button onClick={this._handlePatientLogin}>Patient</button>
	    				<button onClick={this._handlePTlogin}>Physical Therapist</button>
	    			</div>
                    <div className="guestLoginIn" onClick={this._handleGuestSignIn}>Sign in as guest patient</div>

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
        
        _updateAddPatient: function(boolean) {
            this.setState({
                showingAddPatient: boolean
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

        _viewUpdater: function(view) {
            this.setState({
                view: view
            })
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
                        <input type="checkbox" className="menuIconInput"/>
                        <img className="menuIcon" src={('./Images/menuIcon.svg')}/>
                        <div className="leftCol">
                            <ShowPatientsInput view={this.state.view} _viewUpdater={this._viewUpdater} _changeColor={this._changeColor} patientsArray={this.props.ptMod}  _updateShowPatients={this._updateShowPatients}/>
                            <AddPatientInput view={this.state.view} _viewUpdater={this._viewUpdater} _changeColor={this._changeColor} showingAddPatient={this.state.showingAddPatient} _updateAddPatient={this._updateAddPatient} />
                            <WeekList view={this.state.view} _viewUpdater={this._viewUpdater} _changeColor={this._changeColor} dailyExercisesDayShowing={this.state.dailyExercisesDayShowing} _updatePatientTargetEmail={this._updatePatientTargetEmail} showingPatientTargetEmail={this.state.showingPatientTargetEmail} _updateDailyExercises={this._updateDailyExercises} dailyExercisesDay={this.state.dailyExercisesDay} />
                            <PTprofileInput view={this.state.view} _viewUpdater={this._viewUpdater} _changeColor={this._changeColor} _updateShowPtEditProfile={this._updateShowPtEditProfile} ptUid={this.props.ptUid} ptMod={this.props.ptName} _updateShowPtProfile={this._updateShowPtProfile} />
                        </div>
                        <div className="rightCol">
                            <ShowAllPatients view={this.state.view} patientsArray={this.props.ptMod} />
                            <AddNewPatientView view={this.state.view}  showPatientAdded={this.state.showPatientAdded} _changeShowPatientAdded={this._changeShowPatientAdded} showingAddPatient={this.state.showingAddPatient} ptUid={this.props.ptUid} ptModel={this.props.ptName}/>
                            <ShowAddingWeekExercises view={this.state.view} showingPatientTargetEmail={this.state.showingPatientTargetEmail} />
                            <DailyExercises view={this.state.view} _changeShowSentExercise={this._changeShowSentExercise} showSentExercise={this.state.showSentExercise} dailyExercisesDayShowing={this.state.dailyExercisesDayShowing} dailyExercisesDay={this.state.dailyExercisesDay} />
                            <ShowPtProfile view={this.state.view} ptUid={this.props.ptUid} ptMod={this.props.ptName} />
                        </div>
    				</div>
    			)
    	},
        getInitialState: function() {
            return {
                showingPatients: false,
                showingAddPatient: false,
                showPatientAdded: false,
                showingPatientTargetEmail: false,
                dailyExercisesDay: '',
                dailyExercisesDayShowing: false,
                showSentExercise: false,
                view: null,
            }
        }
    })
    var ShowPatientsInput = React.createClass({
        _togglePatientsShowing: function () {
            this.props._viewUpdater("allPatientsView")
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
            var colorStyleObj = {}
            var divStyleObj = {}
            if (this.props.view === 'allPatientsView') {
                colorStyleObj.color = 'rgba(60,173,180,1)'
                divStyleObj.background = 'rgba(0,0,0,.4)'
            }
            return (
                    <div style={divStyleObj} className="ptsPatientsContainer">
                        <input onChange={this._togglePatientsShowing} type="checkbox" className="showAllPatientsCheckbox"/>
                        <img className="icon" src={('./Images/patientsIcon.svg')}/>
                        <span style={colorStyleObj} className="showAllPatientsTitle">Patients</span>
                    </div>
                    )
        }
    })
    var ShowAllPatients = React.createClass({
        _showPatient: function(mod, i) {
            var patientGhost = {}
            if (!mod.attributes.firstName) {
                patientGhost.display = "none"
            }
            return (
                    <div style={patientGhost} className="ptAllPatients" >
                        <div className="patientImgContainer">
                            <img src={mod.get('patientProfileImg')} />
                        </div>
                        <div className="patientInformationContainer">
                            <div>
                                <p  className="patient" > Name:</p><span> {mod.get('firstName')} {mod.get('lastName')} </span>
                                <p  className="patient"> Injury:</p><span>{mod.get('injury')}</span>
                            </div>
                            <div>
                                <p> Email: </p><span>{mod.get('email')}</span>
                                <p> Phone: </p><span>{mod.get('phone')}</span>
                            </div>
                        </div>
                    </div>
                )
        },
        render: function() {
            var allPatientsContainerStyleObj = {display: 'none'}
            if (this.props.view === "allPatientsView") {
                allPatientsContainerStyleObj.display = "block"
            }
            var patientCollection = new QueryForPTpatientsCollection(ref.getAuth().uid)
          
            return (
                <div style={allPatientsContainerStyleObj} className="allPatientsContainer">
                     {patientCollection.map(this._showPatient)}
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
            this.props._viewUpdater('addPatientView')
        },
        render: function() {
            var colorStyleObj = {}
            var divStyleObj = {}
            if (this.props.view === 'addPatientView') {
                colorStyleObj.color = 'rgba(60,173,180,1)'
                divStyleObj.background = 'rgba(0,0,0,.4)'
            }
            return (
                    <div style={divStyleObj}  className="addPatientContainer">
                        <input type="checkbox" onChange={this._toggleAddPatient} className="addPatientCheckbox"/>
                        <img className="icon" src={('./Images/addIcon.svg')}/>
                        <span style={colorStyleObj}>Add new patient</span>
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
            var physicalTherapistFirstName = this.props.ptModel.get('firstName')
            var physicalTherapistLastName = this.props.ptModel.get('lastName')
            newPatientQuery.fetch()
            newPatientQuery.once('sync', function() {
                var patientMod = newPatientQuery.models[0]
                patientMod.set({
                    pt_uid: ref.getAuth().uid,
                    pt_firstName: physicalTherapistFirstName,
                    pt_lastName: physicalTherapistLastName,
                })
                // var patientName = patientMod.get('firstName')
                // var patientLastName = patientMod.get('lastName')
                // var patientEmail = patientMod.get('email')
                // var patientInjury = patientMod.get('injury')
                // var patientImg = patientMod.get('patientProfileImg')
                // var patientPhone = patientMod.get('phone')
                // 
                // 
                // var patientsCollForPT = new PTpatientsCollection(self.props.ptUid)
                // 
                // patientsCollForPT.on('sync', function() {
                //     
                //     patientsCollForPT.create({
                //         id: patientMod.id, 
                //         name: patientName, 
                //         lastName: patientLastName,
                //         email: patientEmail, 
                //         injury: patientInjury,
                //         patientImg: patientImg,
                //         patientPhone: patientPhone,
                //     })
                // })
                var boolean = true
                self.props._changeShowPatientAdded(boolean)
            })
            this.refs.patientEmailInput.value= ''
        },
        render: function() {
            var addPatientStyleObj = {display: 'none'}
            if (this.props.showingAddPatient) {
                addPatientStyleObj = {display: 'block'}
            }
            var addNewPatientStyleObj = {display: 'none'}
            if (this.props.view === 'addPatientView') {
                addNewPatientStyleObj = {display: 'block'}
            }
            return (
                    <div style={addNewPatientStyleObj} className="patientToBeAddedContainer">
                            <input onChange={this._updatePatientEmail} placeholder="patient email" className="patientEmail" ref="patientEmailInput"/>
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
            this.props._viewUpdater('userProfile')
        },
        _toggleColors: function(divToChange) {
            this.props._changeColor(this.refs.containerToChangeColor)
        },
        render: function () {
            var colorStyleObj = {}
            var divStyleObj = {}
            if (this.props.view === 'userProfile') {
                colorStyleObj.color = 'rgba(60,173,180,1)'
                divStyleObj.background = 'rgba(0,0,0,.4)'
            }
            return (
                    <div style={divStyleObj}  className="patientProfileView">
                        <input  type="checkbox" onChange={this._togglePtProfileShowing} className="showCurrentProfileCheckbox"/>
                        <img className="icon" src={('./Images/profileIcon.svg')}/>
                        <span style={colorStyleObj}className="profileSpan">Profile</span>
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
            if (this.props.view === 'userProfile') {
                ptProfileStylesObj.display = 'block'
            }
            return (
                    <div style={ptProfileStylesObj} >
                        <div className="currentProfileInformation">
                            <div className="profileImgContainer">
                                <img src={this.props.ptMod.get('ptProfileImg')} />
                                <div className="stylingFileUpload">
                                    <button>Update Profile Image</button>
                                    <input  ref="patientProfileImg" type="file" onChange={this._handlePtProfileImg} />
                                                                
                                </div>
                            </div>
                            <div className="profileOption">
                                <p>Last Name</p>
                                    <input  placeholder={this.props.ptMod.get('lastName')} type="textbox" onChange={this._handlePtLastName} className="profileOptionInput" ref="ptLastName" />
                            </div>
                            <div className="profileOption">
                                <p>First Name</p>
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
            var patientToReceiveTreatmentStylesObj = {display: 'none'}
            if (this.props.view === 'addExercisesView') {
                patientToReceiveTreatmentStylesObj.display = 'block'
            }
            var emailInputStylesObj = {display: 'none'}
            if (this.props.showingPatientTargetEmail) {
                emailInputStylesObj = {display: 'block'}
            }
            return (
                    <div style={patientToReceiveTreatmentStylesObj} className="patientToReceiveTreatmentContainer">
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
            this.props._viewUpdater('addExercisesView')
        },
        render: function () {
            var colorStyleObj = {}
            var divStyleObj = {}
            var dropDownWeek = {}
            if (this.props.view === 'addExercisesView') {
                colorStyleObj.color = 'rgba(60,173,180,1)'
                divStyleObj.background = 'rgba(0,0,0,.4)'
                dropDownWeek.display = "block"
            }
            if (this.props.view != 'addExercisesView') {
                dropDownWeek.display = "none"
            }

            return (
                    <div onClick={this._toggleColors} style={divStyleObj} className="weekExercisesContainer">
                        <input onChange={this._togglePatientTargetEmail} type="checkbox" className="addExercise"/>
                        <img className="icon" src={('./Images/ptExercisesIcon.svg')}/>
                        <span style={colorStyleObj} className="addWeeksExerciseSpan">Add Exercises</span>
                        <div className="weeksContainer">
                            <div style={dropDownWeek}  >
                                    <DayList view={this.props.view} dailyExercisesDay={this.props.dailyExercisesDay} dailyExercisesDayShowing={this.props.dailyExercisesDayShowing} _updateDailyExercises={this.props._updateDailyExercises} patientEmail={window.targetEmail} />
                            </div>
                        </div>
                    </div>
                )
        }
    })
    var DayList = React.createClass({
        _toggleDailyExercises: function(e) {
            var day = e.target.textContent
            //
            // if (this.props.dailyExercisesDayShowing) {
            //     var boolean = false
            // } else 
            var boolean = true
            this.props._updateDailyExercises(day,boolean)
        },
        render: function() {
            //
            if (this.props.dailyExercisesDay != null) {
                var currentDay = this.props.dailyExercisesDay
            }
            if (this.props.view === 'addExercisesView') {
                var daysContainerStyle= {display: 'block'}
            }
            var exerciseWeek = function(mod, i) {
                var dayOfWeekStyleObj = {}
                if (mod === currentDay) dayOfWeekStyleObj.color = 'rgba(60,173,180,1)'
                
                return (
                         <div>
                            <span  style={dayOfWeekStyleObj} key={i} className="dayOfWeek">{mod}</span>
                        </div>
                    )
            }
            return (
                    <div onClick={this._toggleDailyExercises} style={daysContainerStyle} className="daysContainer">
                       {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(exerciseWeek)}
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
                            done: false,
                            pain: '',
                            functionality: '',
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
            this.refs.beforeImg.value = ''
            this.refs.afterImg.value = ''
            this._changeShowSentExercise()   
        },

        _changeShowSentExercise: function() {
            
            if (this.props.showSentExercise) {
                var boolean = false
            } else var boolean = true 
            this.props._changeShowSentExercise(boolean)
        },
        render: function() {
            var messengerStylesObj = {display:'none'}
            if (this.props.dailyExercisesDayShowing && this.props.view === 'addExercisesView') {
                messengerStylesObj = {display: 'block'}
            }
            return (
                    <div style={messengerStylesObj} className="messenger">
                        <p className="dailyExerciseDay" >Exercise being sent for: {this.props.dailyExercisesDay} </p>
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
                        
                         <button className="exitPopUp" onClick={this._changeShowSentExercise} >&#10003;</button>
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
        _showDayPicked: function(dayPicked) {
            this.setState({
                dayPicked: dayPicked
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
            console.log(model)
        },
        _showCompletedExercises: function(boolean) {
            this.setState({
                showCompletedExercises: boolean
            })
        },
        _completeButtonShowing: function(boolean) {
            this.setState({
                showCompleteButton: boolean
            })
        },
        _changeColor: function(divToChange) {
            // var targetToChange = e.target
            // 
            // targetToChange.style.background = "black"
            if (divToChange.style.background === "black") {
                 
                 divToChange.style.background = "none" 
             } else {
               divToChange.style.background = "black" 
               
             } 
        },
        _trackProgressPopUpView: function(boolean) {
            this.setState({
                showTrackProgressPopUp: boolean
            })
        },
        _viewUpdater: function(view) {
            this.setState({
                view: view
            })
        },
		render: function() {
			return (
					<div className="patientPortalViewContainer">
                        <div className="header">
                            <div className='profileImg'>
                                <img src={this.props.patientMod.get('patientProfileImg')} />
                            </div>
                            <span className="welcomeMsg" >Hello, {this.props.patientMod.get('firstName')}</span>
                            <span className="logoutLink" onClick={this._handleLogout}>log out<img src={('./Images/logoutIcon.svg')}/></span>
                        </div>
                        <input type="checkbox" className="menuIconInput"/>
                        <img className="menuIcon" src={('./Images/menuIcon.svg')}/>
                        <div className="leftCol">
                            <DashboardInput view={this.state.view}  _viewUpdater={this._viewUpdater}  />
                            <DaysOfTheWeek view={this.state.view} _viewUpdater={this._viewUpdater} _showDayPicked={this._showDayPicked} dayPicked={this.state.dayPicked}  _changeColor={this._changeColor} dayModelShowing={this.state.dayModelShowing} _updateDayModelShowing={this._updateDayModelShowing} daysArray={this.props.msgColl.models} _updateRightCol={this._updateRightCol} />
                            <EditPatientProfile view={this.state.view} _viewUpdater={this._viewUpdater} _changeColor={this._changeColor} patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} patientUid={this.props.patientUid} showPatientProfile={this.state.showPatientProfile} />
                        </div>
                        <div className="rightCol">
                            <Dashboard view={this.state.view} _viewUpdater={this._viewUpdater}/>
                            <Tutorial patientMod={this.props.patientMod} view={this.state.view} _viewUpdater={this._viewUpdater} />
                            <ShowIndividualExercise 
                                view={this.state.view} 
                                dayPicked={this.state.dayPicked} 
                                showTrackProgressPopUp={this.state.showTrackProgressPopUp} 
                                _trackProgressPopUpView={this._trackProgressPopUpView} 
                                showCompleteButton={this.state.showCompleteButton} 
                                _completeButtonShowing={this._completeButtonShowing} 
                                patientMod={this.props.patientMod} 
                                showCompletedExercises={this.state.showCompletedExercises} 
                                _showCompletedExercises={this._showCompletedExercises} 
                                completeExercises={this.state.completeExercises} 
                                _updateStatusOfExercise={this._updateStatusOfExercise} 
                                dayModelShowing={this.state.dayModelShowing} 
                                dayModel={this.state.dayModel}  />
                            <ShowPatientProfile view={this.state.view} patientUid={this.props.patientUid} patientMod={this.props.patientMod} _updateEditPatientProfile={this._updateEditPatientProfile} _updateRightColPatientProfile={this._updateRightColPatientProfile} showPatientProfile={this.state.showPatientProfile}  />
                        </div>
					</div>
				)
		},
        getInitialState: function() {
            return {
                dayModel: this.props.dayModel,
                dayPicked: null,
                incompleteExercises: false,/*<YOUR EXERCISE ARRAY>.filter(function that determines whether exercise is complete)*/
                completeExercises: false,
                showCompletedExercises: false, 
                view: null,
                showCompleteButton: false,
                showTrackProgressPopUp: false,
            }
        }
	})
    var Tutorial = React.createClass({
        _changeToProfileView: function() {
            this.props._viewUpdater('userProfile')
        },
        _changeToWeekView: function() {
            this.props._viewUpdater('showExercises')
        },
        render: function() {
            if (this.props.view === null && !this.props.patientMod.get('firstName')) {
                    var beginJourney = 
                            <div>
                                <p> Let's start your journey to recovery!</p>
                                <p>Please begin by filling out your profile information</p>
                                <button onClick={this._changeToProfileView}>Start journey</button>
                            </div>

            }
            else if (this.props.view === null) {
                    var beginJourney = 
                        <div>
                            <p>Welcome, {this.props.patientMod.get('firstName')}</p>
                            <p>Let's get you healed</p>
                            <button onClick={this._changeToWeekView}>Start today's treatment</button>
                        </div>
                }
                else var beginJourney = ''
            return (
                    <div  className='tutorialContainer'>
                        {beginJourney}
                    </div>
                )
        }
    })
    var DashboardInput = React.createClass({
        _showDashboardView: function() {
            this.props._viewUpdater('dashboard')
        },
        render: function() {
            var colorSpanStyle = {}
            var colorDivStyle = {}
            var iconStyle = {opacity: '.7'}
            if (this.props.view === "dashboard") {
                colorSpanStyle.color = "rgba(60,173,180,1)"
                colorDivStyle.background = 'rgba(0,0,0,.4)'
                iconStyle.opacity = '1'
            }
            return (
                <div style={colorDivStyle} className="dashboardInputContainer" onClick={this._showDashboardView}>
                    <input type="checkbox" className="showCurrentProfileCheckbox"/>
                    <img style={iconStyle}className="icon" src={('./Images/dashboardIcon.svg')}/>
                    <span style={colorSpanStyle} className="dashboardSpan">Dashboard</span>
                </div>
                )
        }
    })
    var Dashboard = React.createClass({
        painArray: [],
        functionalityArray: [],
        averageFunctionality: '',
        averagePain: '',
        _getAverageFunctionality: function() {
                var totalFunctionality = 0 
                for (var i = 0; i <this.functionalityArray.length; i++) {
                    totalFunctionality += this.functionalityArray[i]
                }
                this.averageFunctionality = parseInt(totalFunctionality/this.functionalityArray.length)
               
        },
        _getAveragePain: function () {
                var totalPain = 0
                for (var i = 0; i<this.painArray.length; i++) {
                    totalPain += this.painArray[i]                    
                }
                this.averagePain = parseInt(totalPain/this.painArray.length)
                
        },
        _getPain: function(model,i) {
                if (model.get('currentPain')) {
                    var turnStringToNum = Number(model.get('currentPain'))
                    this.painArray.push(turnStringToNum)
                }                
                this._getAveragePain() 
        },
        _getFunctionality: function(model, i) {
                if (model.get('currentFunctionality')) {
                     var turnStringToNum = Number(model.get('currentFunctionality'))
                     this.functionalityArray.push(turnStringToNum)
                }
                this._getAverageFunctionality()
        },
        render: function() {
            var patientUid = ref.getAuth().uid 
            var averagePain = new PatientProgress(patientUid,"pain")
            var averageFunctionality = new PatientProgress(patientUid, 'functionality')

            var makePainDivs = function(model, i) {
                var painStyle = {
                    width: '.5em',
                    height: (model.get('currentPain') + 'em'),
                    background: 'rgba(60,173,180,1)',
                    margin: '1%',
                    display: 'inline-block',
                }
                return <div key={i} style={painStyle}></div>
            }
            var makeFunctionalityDivs = function(model, i) {
                // if (model.get('currentPain')) {
                    var functionalityStyle = {
                        width: '.5em',
                        height: (model.get('currentFunctionality') + 'em'),
                        background: 'rgba(40,48,64,1)',
                        margin: '1%',
                        display: 'inline-block',
                    }
                    return <div key={i} style={functionalityStyle}></div>
            }
            var dashboardStyle = {display: 'none'}
            if (this.props.view === "dashboard") dashboardStyle.display = "block"
            
            return (
                        <div style={dashboardStyle} className="patientDashboard">
                            <div className="graphContainer">
                                <p className="resultsTitle">Average Pain</p>
                                {averagePain.map(makePainDivs)}
                                {averagePain.map(this._getPain)}
                                <div className='circleGraphContainer'>
                                    <p>Average</p><p>Pain</p>
                                    <p className="averageNumber">{this.averagePain}</p>
                                </div>
                            </div>
                            <div className="graphContainer">
                                <p className="resultsTitle">Average Functionality</p>
                                {averageFunctionality.map(makeFunctionalityDivs)}
                                {averageFunctionality.map(this._getFunctionality)}
                                <div className='circleGraphContainer'>
                                    <p>Average</p><p>Functionality</p>
                                    <p className="averageNumber">{this.averageFunctionality}</p>
                                </div>
                            </div>
                        </div>
                )
        }
    })
    // {averagePain.map(makePainDivs)}
    // {averagePain.map(this._getPain)}

    // {averageFunctionality.map(makeFunctionalityDivs)}
    // {averageFunctionality.map(this._getFunctionality)}

    var EditPatientProfile = React.createClass({
        
        _showPatientProfile: function () {
            this.props._viewUpdater('userProfile')
        },
        render: function () {
            var colorSpanStyle = {}
            var colorDivStyle = {}
             var iconStyle = {opacity: '.7'}
            if (this.props.view === "userProfile") {
                colorSpanStyle.color = "rgba(60,173,180,1)"
                colorDivStyle.background = 'rgba(0,0,0,.4)'
                iconStyle.opacity = '1'
            }
            return (
                    <div style={colorDivStyle} className="patientProfileView">
                        <input type="checkbox" onChange={this._showPatientProfile} className="showCurrentProfileCheckbox"/>
                         <img style={iconStyle} className="icon" src={('./Images/profileIcon.svg')}/>
                        <span style={colorSpanStyle} className="profileSpan">Profile</span>
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
            if (this.props.view === 'userProfile') {
                currentProfileStylesObj.display = 'block'
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
                           
                            
                            <button onClick={this._handleProfileChanges} className="submitProfileChanges">Save</button>


                            
                </div>
                )
        }
    })
    var DaysOfTheWeek = React.createClass({

        _toggleExercises: function() {
            this.props._viewUpdater('showExercises')
        },
        _showChosenDay: function(e) {
            var dayPicked = e.target.textContent
               
            this.props._showDayPicked(dayPicked)
        },
        render: function() {
            if (this.props.dayPicked != null) {
                var currentDay = this.props.dayPicked
            }
            var colorSpanStyle = {}
            var colorDivStyle = {}
            var weekdaysStyle = {}
            var iconStyle = {opacity: '.7'}
            if (this.props.view === "showExercises") {
                colorSpanStyle.color = "rgba(60,173,180,1)"
                colorDivStyle.background = 'rgba(0,0,0,.4)'
                weekdaysStyle.display = "block"
                iconStyle.opacity = '1'
            }
            var renderDay = function (dayString, i) {
                var dayStyle = {color: "white"} 
                if (dayString === currentDay) dayStyle.color = "rgba(60,173,180,1)"
                return <span className="weekdaySpan" style={dayStyle} key={i} >{dayString}</span>
            }
            return (
                    <div style={colorDivStyle} ref="containerToChangeColor" className="daysOfTheWeeK">
                        <input  onChange={this._toggleExercises} className="daysOfTheWeeKCheckbox" type="checkbox"/>
                        <img style={iconStyle} className="icon" src={('./Images/ptExercisesIcon.svg')}/>
                        <span style={colorSpanStyle} className="showWeekSpan">Week Exercises</span>
                            <div onClick={this._showChosenDay} style={weekdaysStyle} className="weekdaysContainer">
                               {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(renderDay)}
                            </div>
                    </div>
                )
        }
    })
    var ShowIndividualExercise = React.createClass({
        _toggleCompletion: function(exerciseModel) {
            var exId = exerciseModel.get('id')
            exerciseModel.set({exId: exerciseModel})
        },
        _showCompletedExercises: function() {
            if (this.props.showCompletedExercises) {
                var boolean = false
            } else { var boolean = true}
            this.props._showCompletedExercises(boolean)
        },
         _showCompleteButton: function(model) {
            
            if (model.get('done')) {
                var boolean = true 
                this.props._completeButtonShowing(boolean) 
            }
        },
        _getEachExercise: function(model, i) {
                return (
                    <IndividualExercise 
                        showTrackProgressPopUp={this.props.showTrackProgressPopUp} 
                        _trackProgressPopUpView={this.props._trackProgressPopUpView} 
                        showCompletedExercises={this.props.showCompletedExercises} 
                        _toggleCompletion={this._toggleCompletion} 
                        completeExercises={this.props.completeExercises} 
                        _updateStatusOfExercise={this.props._updateStatusOfExercise} 
                        model={model} 
                        key={i} />
                )
        },
        render: function () {
            //if (this.props.dayPicked === null) 
            var noExercisesYetStyleObj = {
                                            display: 'none',
                                            marginTop: '5vh'
                                        } 
            var divStylesObj = {display: "none"} 
            var noCompletedExercisesExistStyleObj = {display: "block"}

            if (this.props.dayPicked != null) {
                var uid = this.props.patientMod.get('id')
                var dayPickedCollection = new PatientExercises(uid,this.props.dayPicked)
                var getExercises = dayPickedCollection.map(this._getEachExercise)
                //
                if (dayPickedCollection.length === 1) {
                    noExercisesYetStyleObj.display = "block"
                    noCompletedExercisesExistStyleObj.display = "none"
                } 
            } else {
                    var getExercises = ''
                    noCompletedExercisesExistStyleObj.display = "none"
                }
            if (this.props.view === "showExercises") {
                    divStylesObj.display = "block"
            }
            return (
                    <div style={divStylesObj}>
                        <button style={noCompletedExercisesExistStyleObj} className="showCompletedExercisesButton" onClick={this._showCompletedExercises}>Show Completed Exercises</button>
                         <p style={noExercisesYetStyleObj}>You have no exercises for today</p>
                        {getExercises}
                    </div>
                )
        }
    })

    var IndividualExercise = React.createClass({
        _changeExerciseStatus: function() {
            if (this.props.model.attributes.done === false) {
                this.props.model.set({done: true})
                this.props._trackProgressPopUpView(true)
            }
            // if (this.props.complete) {
            //     var boolean = false
            // } else { var boolean = true}
            //this.props._toggleCompletion(this.props.model)
            //console.log(this.props.model)
            this.props._updateStatusOfExercise(this.props.model)
        },
        render: function () {
            var model = this.props.model
            var completeExerciseStyleObj = {display: "block"}
            var imgShowingStylesObj = {display: 'none'}
            
            if (!this.props.model.attributes.exerciseName) {
                completeExerciseStyleObj.display = "none"
            }
            if (this.props.model.attributes.done === true) {
                completeExerciseStyleObj.display = "none"
            }
            if (this.props.model.attributes.beforeImg && this.props.model.attributes.afterImg) {
                imgShowingStylesObj.display = "block"
            }
            return (
                    <div>
                        <div style={completeExerciseStyleObj} className="individualExercise" >
                            <p>Exercise</p><span> {model.attributes.exerciseName}</span>      
                            <p>Description</p><span> {model.attributes.exerciseDescription}</span>
                            <p>Sets/Reps</p><span> {model.attributes.exerciseSets}/{model.attributes.exerciseReps} </span>
                            <div style={imgShowingStylesObj}>
                            <span className="exerciseImgShowing">Before</span><img className="exerciseImg" src={model.attributes.beforeImg}/>
                            <span className="exerciseImgShowing">After</span><img className="exerciseImg" src={model.attributes.afterImg}/>
                            </div>
                            <button onClick={this._changeExerciseStatus}>Complete</button>
                        </div>
                        <TrackProgress 
                            model={this.props.model} 
                            showTrackProgressPopUp={this.props.showTrackProgressPopUp} 
                            _trackProgressPopUpView={this.props._trackProgressPopUpView}
                            completeExercises={this.props.completeExercises} />
                        <CompletedExercises 
                            showCompletedExercises={this.props.showCompletedExercises} 
                            exerciseModel={this.props.model} />
                    </div>                 
                )
        }
    })
    var CompletedExercises = React.createClass({
        render: function() {
            var model = this.props.exerciseModel 
            var completedExercisesStylesObj = {display: 'none'}
            if (this.props.showCompletedExercises) {
                completedExercisesStylesObj.display = "block"
            }
            if (!this.props.exerciseModel.attributes.exerciseName) {
                completedExercisesStylesObj.display = "none"
            }
            if (!model.get('done')) completedExercisesStylesObj.display = "none"
            var imgShowingStylesObj = {display: 'none'}
            if (this.props.exerciseModel.attributes.beforeImg && this.props.exerciseModel.attributes.afterImg) {
                imgShowingStylesObj.display = "block"
            }
            return (
                        <div style={completedExercisesStylesObj} className="individualExercise">
                            <p>Exercise</p><span> {model.attributes.exerciseName}</span>      
                            <p>Description</p><span> {model.attributes.exerciseDescription}</span>
                            <p>Sets/Reps</p><span> {model.attributes.exerciseSets}/{model.attributes.exerciseReps} </span>
                            <div style={imgShowingStylesObj}>
                                <span className="exerciseImgShowing">Before</span><img className="exerciseImg" src={model.attributes.beforeImg}/>
                                <span className="exerciseImgShowing">After</span><img className="exerciseImg" src={model.attributes.afterImg}/>
                            </div>
                        </div>                
                    )
        }
    })
    var TrackProgress = React.createClass({
        pain: '',
        functionality: '',
        _handlePain: function (e) {
            this.pain = Number(e.target.value)
            var patientUid = ref.getAuth().uid 
            var typeOfProgress = e.target.name
            var painCol = new PatientProgress(patientUid, typeOfProgress)
            painCol.create({currentPain: this.pain})
        },
        _handleFunctionality: function (e) {
            this.functionality = Number(e.target.value)
            var patientUid = ref.getAuth().uid 
            var typeOfProgress = e.target.name
            var functionalityCol = new PatientProgress(patientUid, typeOfProgress)
            functionalityCol.create({currentFunctionality: this.functionality})
        },
        _changePopUpView: function() {
            this.props._trackProgressPopUpView(false)
        },
        render: function() {
            var trackProgressPopUpStyle = {display: 'none'}
            if (this.props.showTrackProgressPopUp) {
                trackProgressPopUpStyle.display = "block"
            }
            var painRadioButtons = function (model, i) {
            return <input type="radio" name="pain" key={i} value={model} />
            }
            var functionalityRadioButtons = function (model, i) {
                return <input type="radio" name="functionality" key={i} value={model}/>
            }
            return (
                        <div style={trackProgressPopUpStyle} className="trackProgressContainer">
                            <p>Log your progess</p>
                            <p>Functionality: 10 being best</p>
                            <p>Pain: 10 being worst</p>
                            <div onChange={this._handlePain} >
                                <p>Choose Pain:</p>
                                    <span>1</span>
                                    {["1","2","3","4","5","6","7","8","9","10"].map(painRadioButtons)}
                                    <span>10</span>
                            </div>
                            <div  onChange={this._handleFunctionality}>
                                <p>Choose Functionality:</p>
                                    <span>1</span>
                                    {["1","2","3","4","5","6","7","8","9","10"].map(functionalityRadioButtons)}
                                    <span>10</span>
                            </div>
                            <button onClick={this._changePopUpView}>&#10003;</button>
                        </div>
                    )
        }
    })
    var PhysicalTherapistUserModel = Backbone.Firebase.Model.extend({
    	initialize: function(uid) {
    		this.url = `http://pt4home.firebaseio.com/pts/${uid}`
    	},
        autoSync: true
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
        autoSync: true
	})
     var QueryForPTpatientsCollection = Backbone.Firebase.Collection.extend({
        initialize: function(uid) {
            this.url = ref.child('patients').orderByChild('pt_uid').equalTo(uid)  
        }        
    })
    var PatientProgress = Backbone.Firebase.Collection.extend({
        initialize: function(uid,progressType) {
            this.url = `http://pt4home.firebaseio.com/patients/${uid}/${progressType}`
        }
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
    var PatientExercises = Backbone.Firebase.Collection.extend({
        initialize: function(uid,dayOfWeek) {
            this.url = `http://pt4home.firebaseio.com/patients/${uid}/exercises/${dayOfWeek}`
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
    	_createPTuser: function(email,password) {
    		// 
    		var self = this
    		this.ref.createUser({
    			email: email,
    			password: password,
    		}, function(error,authData) {
    			if (error) console.log(error)
    				else {
    					
    					var ptMod = new PhysicalTherapistUserModel(authData.uid)
    					ptMod.set({
    	    						email: email,
    	    						id: authData.uid,
                                    patients: [],
                                    patientProfileImg: './Images/profileImgPlaceholder.svg'
	    						})
    				}
    			self._loginPtUser(email, password)
    		})
    	},
    	_createPatientUser: function(email,password) {
    		var self = this
    		this.ref.createUser({
    			email: email,
    			password: password,
    		}, function(error,authData) {
    			if (error) console.log(error)
    				else {
    					
    					var patientMod = new PatientUserModel(authData.uid)
    					patientMod.set({
	    						email: email,
	    						id: authData.uid,
                                patientProfileImg: './Images/profileImgPlaceholder.svg'
	    						})
    				}
    				self._loginPatientUser(email, password)
    		})
    	},
    	_loginPtUser: function(email,password) {
    		//
    		this.ref.authWithPassword({
    			email: email,
    			password: password
    		}, function(error, authData) {
    			if (error) console.log(error)
    				else {
    					
    					location.hash = "showPtPortal"
    				}
    		})
    	},
    	_loginPatientUser: function(email,password) {
    		//
    		this.ref.authWithPassword({
    			email: email,
    			password: password
    		}, function(error, authData) {
    			if (error) console.log(error)
    				else {
    					
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

