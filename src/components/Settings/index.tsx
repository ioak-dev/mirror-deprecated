import React, { Component } from 'react';
import './style.scss';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import ArcText from '../Ux/ArcText';
import { getTenant, updateTenant } from '../Tenant/TenantService';
import { Authorization } from '../Types/GeneralTypes';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import Sidebar from '../Ux/Sidebar';
import { any } from 'prop-types';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization
}

interface State { 
  name: string,
  email: string,
  jwtPassword:string,
  banner: any,
  stage: Array<String>,
  stages: any,
  _id: any,
  errorFields: {
    name: boolean,
    email: boolean,
    jwtPassword:boolean
  },

  section: String,

  sidebarElements: any
}

class Settings extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          name: '',
          email: '',
          jwtPassword:'',
          banner: null,
          stage: [],
          stages: '',
          _id: any,
          errorFields: {
            name: false,
            email: false,
            jwtPassword: false
          },
          section: 'tenantProfile',
          
          sidebarElements: {
            tenant: [
                {
                    label: 'Profile',
                    action: () => this.chooseSection('tenantProfile'),
                    icon: 'info'
                },
                {
                    label:'Stages',
                    action: () => this.chooseSection('stage'),
                    icon:'info'
                }
            ],
            user: [
                {
                    label: 'Profile',
                    action: () => this.chooseSection('userProfile'),
                    icon: 'info'
                },
                {
                    label: 'Password',
                    action: () => this.chooseSection('userPassword'),
                    icon: 'security'
                }
            ]
          }
        }
    }

    componentDidMount() {
      this.props.setProfile({
        ...this.props.profile,
        tenant: this.props.match.params.tenant
      })

        getTenant(this.props.match.params.tenant,  {
            headers: {
                Authorization: this.props.authorization.token
            }
        }).then ((response) => {
            this.setState({
                name: response.data.name,
                email: response.data.ownerEmail,
                jwtPassword: response.data.jwtPassword,
                stage: response.data.stage,
                _id: response.data._id,
            })
        }).catch(() => {
        })
    }

    chooseSection = (section: String) => {
        this.setState({
            section: section
        });
        sendMessage('sidebar', false);
    }

    handleImageChange = (e) => {
      this.setState({
        banner: e.target.files[0]
      })
    }

    handleAddStage= e => {
        e.preventDefault()
        const stage = this.state.stage.concat(this.state.stages)
        this.setState(state =>({
            stage: [...this.state.stage,this.state.stages]
        }))
    }

    handleRemoveStage = idx => () =>{
        this.setState({
            stage: [...this.state.stage.filter((s, sidx) => idx != sidx)]
        })
    }

    levels = () => {
        updateTenant({
            name: this.state.name,
            _id: this.state._id,
            data: this.state.stage,
        },{
        headers: {
            Authorization: this.props.authorization.token
        }
       }
    ) 
    }

    handleChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.currentTarget.name]: event.currentTarget.value,
                errorFields: {
                  ...this.state.errorFields,
                  [event.currentTarget.name]: false
                }
            }
        )
    }

    render() {
        return (
            <div className="settings">
                
                <ViewResolver sideLabel='More options'>
                    <View main>
                        {this.state.section === 'tenantProfile' && 
                        <>
                        <div className="typography-3 space-bottom-2">Tenant Profile</div>
                        <div className="form">
                            <ArcText id="email" data={this.state} label="Administrator Email"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
                            <ArcText id="jwtPassword" type="password" data={this.state} label="JWT Password"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
                            <label className="file-upload space-top-1 space-bottom-4">
                                <input type="file" accept="image/png, image/jpeg" onChange={this.handleImageChange} required/>
                                <i className="material-icons">add_photo_alternate</i>
                                {!this.state.banner && "Choose Banner/Cover Image"}
                                {this.state.banner && this.state.banner.name}
                            </label>
                        </div>
                        </>}

                        {this.state.section === 'stage' &&
                        <>
                        <div className="typography-3 space-bottom-2">Support Levels</div>
                        <div className="form">
                           {this.state.stage && this.state.stage.map((item, idx) => (
                                <>
                                    <ArcText  id="stages" label="" data={item} handleChange ={ (e) =>this.handleChange(e) } />
                                    <button className="primary animate out small" onClick={this.handleRemoveStage(idx)}>-</button>
                                </>
                            ))}
                            <button className="default animate right small" onClick={e => this.handleAddStage(e)}> + </button>
                        </div>
                        <br />
                        <button className="primary block" onClick={this.levels}>Create Support Levels</button>
                        <br /> <br />
                        </>}
                        {this.state.section === 'userProfile' && 
                        <>
                        <div className="typography-3 space-bottom-2">User Profile</div>
                        </>}

                        {this.state.section === 'userPassword' && 
                        <>
                        <div className="typography-3 space-bottom-2">Change Login Password</div>
                        </>}
                    </View>
                    <View side>
                            <div className="filter-container">
                                <div className="section-main">
                                    <Sidebar label="Tenant" elements={this.state.sidebarElements['tenant']} icon="home" animate />
                                    <Sidebar label="User" elements={this.state.sidebarElements['user']} icon="account_circle" animate />
                                </div>
                            </div>
                    </View>
                </ViewResolver>
            </div>
        );
    }
}

export default Settings;