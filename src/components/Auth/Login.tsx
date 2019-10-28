import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import {withCookies} from 'react-cookie';
import './Login.scss';
import { Authorization } from '../Types/GeneralTypes';
import ArcText from '../Ux/ArcText';
import { sendMessage } from '../../events/MessageService';
import {signin, preSignin,sentPasswordChangeEmail, preSignup, signup} from './AuthService';
import {isEmptyOrSpaces} from "../Utils";

const queryString = require('query-string');

interface Props {
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    cookies: any,
    history: any,
    profile:any,
    location:any,
    authorization: Authorization
}

interface State {
    newuser: boolean,
    name: string,
    email: string,
    password: string
}

class Login extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            newuser: false,
            name:'',
            email:'',
            password:''
        }
    }

    componentDidMount(){
        if(this.props.location.search){
            const query = queryString.parse(this.props.location.search)
            if(query&&query.type==='signup'){
                this.setState({
                    newuser : true
                })
            }
        }
    }

    login = (event) => {
        event.preventDefault();
        sendMessage('notification', false);
        sendMessage('spinner');
        if (this.state.email && this.state.password) {
            preSignin({
                name:this.props.profile.tenant,
                email:this.state.email})
                .then((response) => {
                    if (response.status === 200) {
                    signin({
                        name:this.props.profile.tenant,
                        email: this.state.email,
                        password: this.state.password
                        }, response.data)
                        .then((response) => {
                            if (response.status === 200) {
                                sendMessage('notification', true, {message: 'Signed In successfully', type: 'success', duration: 3000});
                                this.success(response.data);
                            } else if (response.status === 401) {
                                sendMessage('notification', true, {message: 'Incorrect passphrase', type: 'failure', duration: 3000});
                            } else {
                                console.log(response);
                                sendMessage('notification', true, {message: 'Unknown response from server. Please try again or at a later time', type: 'failure', duration: 3000});
                            }
                        })
                        .catch((error) => {
                            sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
                        })
                } else if (response.status === 404) {
                    sendMessage('notification', true, {message: 'User name does not exist', type: 'failure', duration: 3000});
                }
            })

            
        } else {
            sendMessage('notification', true, {type: 'failure', message: 'Username/password cannot be empty', duration: 3000});
        }
    }

    
    signup =(event) =>{
        event.preventDefault()
        const that = this
        sendMessage('notification', false)
        sendMessage('spinner')
        if(this.state.name && this.state.password && this.state.email){
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
                sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
                return;
            }
            preSignup({name:that.props.profile.tenant}).then((response) =>{
                if(response.status ===200){
                    signup({
                        tenantName: that.props.profile.tenant,
                        email: that.state.email,
                        password: that.state.password,
                        solution: response.data.solution,
                        salt: response.data.salt
                    })
                    .then(function(status){
                        if(status===200){
                            sendMessage('notification', true, {'type': 'success', message: 'Your account has been created. You can login now', duration: 3000});
                            that.setState({
                                email:'',
                                password:''
                            }); 
                            that.toggle();
                        }
                    })
                    .catch((error) => {
                        sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
                    });
                }
            });
        }  else if (!this.state.name) {
            sendMessage('notification', true, {type: 'failure', message: 'Name cannot be empty', duration: 3000});
        } else if (!this.state.email) {
            sendMessage('notification', true, {type: 'failure', message: 'Email cannot be empty', duration: 3000});
        } else if (!this.state.password) {
            sendMessage('notification', true, {type: 'failure', message: 'Password cannot be empty', duration: 3000});
        }
    }

    logout = () => {
        this.props.removeAuth();
        this.props.cookies.remove('isAuth');
    }

    success = (data) => {
        this.props.addAuth({
            isAuth: true,
            token: data.token,
            secret: data.secret,
            name: data.name

        });
        sendMessage('loggedin', true);
        this.props.cookies.set('isAuth', true);
        this.props.cookies.set('token', data.token);
        this.props.cookies.set('secret', data.secret);
        this.props.cookies.set('name', data.name);
        this.props.cookies.set('email', data.email);
        this.props.history.push("/");    
    }

    toggle = () => {
        this.setState({
            newuser: !this.state.newuser
        });
    }

    handleChange= (event) => {
        this.setState(
            {
                ...this.state,
                [event.currentTarget.name]: event.currentTarget.value
            }
        )
    }

    sentEmailWithCode = () => {
        if (isEmptyOrSpaces(this.state.email)) {
            sendMessage('notification', true, {message: 'Email cannot be empty', type: 'failure', duration: 5000});
            return;
        }

        this.sentPasswordChangeEmail('password');

    }

    sentPasswordChangeEmail = (type) => {
        const min = 1;
        const max = 100;
        const rand = min + Math.random() * (max - min);
        sentPasswordChangeEmail({
            email: this.state.email,
            resetCode: rand
        }, type)
            .then((response: any) => {
                if (response === 200) {
                    if (type === 'password') {
                        sendMessage('notification', true, {message: 'Password sent successfully', type: 'success', duration: 3000});
                    }
                } else {
                    sendMessage('notification', true, {'type': 'failure', message: 'Invalid Email error', duration: 3000});
                }
            })
            .catch((error) => {
                sendMessage('notification', true, {'type': 'failure', message: 'Bad request', duration: 3000});
            })
    }

    render() {
        return (
            <>
                <div className="login">
                {!this.state.newuser && <div className="container">
                    <form method="GET" onSubmit={this.login} noValidate>
                        
                        <div className="form">
                            <ArcText label="E-mail" id="email" data={this.state} handleChange={e => this.handleChange(e)} />
                            <ArcText label="Password" type="password"  id="password"   data={this.state} handleChange={e => this.handleChange(e)} />
                        </div>
                        <br />
                        <button className="primary block"  onClick={this.login}>Sign In</button>
                        <br /> <br />
                        Don't have an account? <button className="secondary block"  onClick={this.toggle}>Sign Up</button>
                    </form>
                    <br />
                    <button className="invert" onClick={this.sentEmailWithCode}>Forgot password ?</button>
                </div>}

                {this.state.newuser && <div className="container">
                    <form method="GET" onSubmit={this.signup} noValidate>
                        <h1>Sign Up</h1>
                        <div className="form">
                        <ArcText label="Name" id="name" data={this.state} handleChange={e => this.handleChange(e)} />
                        <ArcText label="E-mail" id="email" data={this.state} handleChange ={e=> this.handleChange(e)} />
                        <ArcText label="Password" type="password" id="password" data={this.state} handleChange={e => this.handleChange(e)} />
                        <ArcText label="Repeate Password" type="password"  id="repeatpassword" data={this.state} handleChange={e => this.handleChange(e)} />
                        </div>
                        <br />
                        <button className="primary block" onClick={this.signup}>Create Account</button>
                        <br /> <br />
                        Already have an account? <button className="secondary block" onClick={this.toggle}>Sign In</button> 
                    </form>
                </div>
                }

                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(withCookies(Login));