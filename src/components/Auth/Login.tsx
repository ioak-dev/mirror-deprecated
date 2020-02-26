import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import {withCookies} from 'react-cookie';
import './Login.scss';
import { Authorization } from '../Types/GeneralTypes';
import OakText from '../../oakui/OakText';
import { sendMessage } from '../../events/MessageService';
import {signinWithJwt, signin, preSignin,sentPasswordChangeEmail, preSignup, signup} from './AuthService';
import {isEmptyOrSpaces} from "../Utils";
import OakButton from '../../oakui/OakButton';

const queryString = require('query-string');

interface Props {
    setProfile: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    cookies: any,
    history: any,
    profile:any,
    match: any,
    location:any,
    authorization: Authorization
}

interface State {
    newuser: boolean,
    name: string,
    email: string,
    password: string,
    repeatpassword:string
}

const Login = (props: Props) => {
    const [data, setData] = useState({
      newuser: false,
      name: '',
      email: '',
      password: '',
      repeatpassword:'',
      resetCode: '',
    });

    useEffect(() => {
        if (props.location.search) {
          const query = queryString.parse(props.location.search);
          if (query && query.type === 'signup') {
            setData({ ...data, newuser: true });
          }
          if (query && query.jwt) {
              loginViaJwt(query.jwt);
          }
        }
        props.setProfile({...props.profile, tenant: props.match.params.tenant});
      }, []);

    const loginViaJwt = (jwt: string) => {
        signinWithJwt({
            tenantName: props.match.params.tenant,
            jwt:jwt
        })
        .then((response) => {
            if (response.status === 200) {
                sendMessage('notification', true, {message: 'Signed In successfully', type: 'success', duration: 3000});
                success(response.data);
            } else if (response.status === 500) {
                sendMessage('notification', true, {message: 'Signature verification failed', type: 'failure', duration: 3000});
            } else {
                sendMessage('notification', true, {message: 'Unknown response from server. Please try again or at a later time', type: 'failure', duration: 3000});
            }
        })
        .catch((error) => {
            sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
        });
    }

    const signinAction = (event) => {
        event.preventDefault();
        sendMessage('notification', false);
        sendMessage('spinner');
        if (data.email && data.password) {
            preSignin({
                name:props.profile.tenant,
                email:data.email})
                .then((response) => {
                    if (response.status === 200) {
                    signin({
                        name:props.profile.tenant,
                        email: data.email,
                        password: data.password
                        }, response.data)
                        .then((response) => {
                            if (response.status === 200) {
                                sendMessage('notification', true, {message: 'Signed In successfully', type: 'success', duration: 3000});
                                success(response.data);
                            } else if (response.status === 401) {
                                sendMessage('notification', true, {message: 'Incorrect passphrase', type: 'failure', duration: 3000});
                            } else {
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

    
    const signupAction = event => {
        event.preventDefault();
        sendMessage('notification', false)
        sendMessage('spinner')
        if(data.name && data.password && data.email){
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
                sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
                return;
            }
            preSignup({name:props.profile.tenant}).then((response) =>{
                if(response.status ===200){
                    signup({
                        tenantName: props.profile.tenant,
                        email: data.email,
                        password: data.password,
                        solution: response.data.solution,
                        salt: response.data.salt
                    })
                    .then(function(status){
                        if(status===200){
                            sendMessage('notification', true, {'type': 'success', message: 'Your account has been created. You can login now', duration: 3000});
                            setData({...data,
                                email:'',
                                password:'',
                                name:'',
                                repeatpassword:''
                            }); 
                            toggle();
                        }
                    })
                    .catch((error) => {
                        sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
                    });
                }
            });
        }  else if (!data.name) {
            sendMessage('notification', true, {type: 'failure', message: 'Name cannot be empty', duration: 3000});
        } else if (!data.email) {
            sendMessage('notification', true, {type: 'failure', message: 'Email cannot be empty', duration: 3000});
        } else if (!data.password) {
            sendMessage('notification', true, {type: 'failure', message: 'Password cannot be empty', duration: 3000});
        }
    }

    const sentEmailWithCode = () => {
      if (isEmptyOrSpaces(data.email)) {
        sendMessage('notification', true, {
          message: 'Email cannot be empty',
          type: 'failure',
          duration: 5000,
        });
        return;
      }
  
      sentPasswordChangeEmailAction('password');
    };
  
    const sentPasswordChangeEmailAction = type => {
      const min = 1;
      const max = 100;
      const rand = min + Math.random() * (max - min);
      sentPasswordChangeEmail(
        {
          email: data.email,
          resetCode: rand,
        },
        type
      )
        .then((response: any) => {
          if (response === 200) {
            if (type === 'password') {
              sendMessage('notification', true, {
                message: 'Password sent successfully',
                type: 'success',
                duration: 3000,
              });
            }
          } else {
            sendMessage('notification', true, {
              type: 'failure',
              message: 'Invalid Email error',
              duration: 3000,
            });
          }
        })
        .catch(error => {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Bad request',
            duration: 3000,
          });
        });
    };

    const handleChange = event => {
      setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
    };
  
    const toggle = () => {
      setData({ ...data, newuser: !data.newuser });
    };

    const success = (data) => {
        props.addAuth({
            isAuth: true,
            token: data.token,
            secret: data.secret,
            name: data.name

        });
        sendMessage('loggedin', true);
        props.cookies.set('isAuth', true);
        props.cookies.set('token', data.token);
        props.cookies.set('secret', data.secret);
        props.cookies.set('name', data.name);
        props.cookies.set('email', data.email);
        props.history.push("/");    
    }

    return (
        <>
            <div className="login">
            {!data.newuser && <div className="container">
                <form method="GET" onSubmit={signinAction} noValidate>
                    
                    <div className="form">
                        <OakText label="E-mail" id="email" data={data} handleChange={e => handleChange(e)} />
                        <OakText label="Password" type="password"  id="password"   data={data} handleChange={e => handleChange(e)} />
                    </div>
                    <br />
                    <OakButton variant="animate out" theme="primary" action={signinAction}>Sign In</OakButton>
                    <br /> <br />
                    Don't have an account? <OakButton theme="default" variant="animate in" small action={() => toggle()}>Sign Up</OakButton>
                </form>
                <br />
                <OakButton theme="default" variant="animate in" small action={sentEmailWithCode}>Forgot password ?</OakButton>
            </div>}

            {data.newuser && <div className="container">
                <form method="GET" onSubmit={signupAction} noValidate>
                    <h1>Sign Up</h1>
                    <div className="form">
                    <OakText label="Name" id="name" data={data} handleChange={e => handleChange(e)} />
                    <OakText label="E-mail" id="email" data={data} handleChange ={e=> handleChange(e)} />
                    <OakText label="Password" type="password" id="password" data={data} handleChange={e => handleChange(e)} />
                    <OakText label="Repeat Password" type="password"  id="repeatpassword" data={data} handleChange={e => handleChange(e)} />
                    </div>
                    <br />
                    <OakButton theme="primary" variant="block" action={signupAction}>Create Account</OakButton>
                    <br /> <br />
                    Already have an account? <OakButton theme="secondary" variant="block" action={toggle}>Sign In</OakButton> 
                </form>
            </div>
            }

            </div>
        </>
    );
}

const mapStateToProps = state => ({
    authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(withCookies(Login));
