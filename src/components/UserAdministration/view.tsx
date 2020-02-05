import React, { Component } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../Ux/OakDialog';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';
import OakSelect from '../Ux/OakSelect';
import { httpGet } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import OakCheckbox from '../Ux/OakCheckbox';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    user: any,
    stages: any,
    saveRequest: Function,
    addLog: Function
}

interface State {
    user: any,
    isDialogOpen: boolean,
    nextStage?: string,
    previousStage?: any,
    logs: any
    log: any,
    newLog: any,
    editDialogLabel: string,
    support: any,
    roles: any
}

export default class UserAdministrationView extends Component<Props, State> {
    constructor(props){
        super(props);
        this.state = {
            isDialogOpen: false,
            user: {
                title: '',
                description: '',
                priority: ''
            },
            logs: [],
            log: '',
            newLog: false,
            roles: [],
            editDialogLabel: 'Add Comments',
            support: {}
        }
    }

    componentDidMount(){
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })

        this.setState({
            newLog:false
        })
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && this.state.user !== nextProps.user) {
            this.setState({
                user: nextProps.user,
                isDialogOpen: true
            })
        }

        if (nextProps.user) {
            this.initialize(nextProps);
        }

    }

    initialize = (props) => {
        httpGet(constants.API_URL_USER + '/' + 
            this.props.match.params.tenant + '/' + props.user._id,
            {
                headers:{Authorization: this.props.authorization.token}
            })
            .then((response) => {
                this.setState({
                    logs: response.data.data
            })
        })
    }

    clearRequest = () => {
        this.setState({
            user: undefined
        })
    }

    toggleDialog = () => {
        if (this.state.isDialogOpen) {
            this.clearRequest();
        }
        this.setState({
            isDialogOpen: !this.state.isDialogOpen,
            newLog: false,
            editDialogLabel: 'Add Comments'
            // editDialogLabel: 'Add'
        })
    }

    saveRequest = () => {
        if(this.state['tenantAdministrator'] == 'true') {
            this.setState({
                ...this.state,
                roles: this.state.roles.push('Tenant Administrator')
            })
        }
        
        if(this.state['userAdministrator'] == 'true'){
            this.setState({
                ...this.state,
                roles: this.state.roles.push('User Administrator')
            })
        }
        
        if(!(Object.keys(this.state.support).length==0)){
            this.setState({
                ...this.state,
                roles: this.state.roles.push(Object.keys(this.state.support))
            })
        }
        
        this.props.saveRequest({
            id: this.state.user._id,
            roles: this.state.roles
        }, true)
        this.toggleDialog()
        this.initialize(this.props)
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]:event.target.value
        })
    }

    handleSupportRoleChange = (event) => {
        this.setState({
            support: {
                ...this.state.support,
                [event.target.name]:event.target.value
            }
        })
    }
   
    render() {
        return (
            <div className="view-user">
                <OakDialog visible={this.state.isDialogOpen} toggleVisibility={this.toggleDialog} >
                    <div className="dialog-body">
                        {this.state.user && 
                            <>
                                <div className="typography-4">User Data</div>
                                <div className="basic-data">
                                    <div className="label">Email</div>
                                    <div className="value">{this.state.user.email}</div>
                                    <div className="label">Full Name</div>
                                    <div className="value">John Doe</div>
                                </div>
                                <div className="typography-4 space-top-3">Administrative Roles</div>
                                <div className="role-container">
                                    <OakCheckbox data={this.state} id="tenantAdministrator" label="Tenant Administrator" handleChange={this.handleChange} theme="primary" />
                                    <OakCheckbox data={this.state} id="userAdministrator" label="User Administrator" handleChange={this.handleChange} theme="primary" />
                                </div>
                                <div className="typography-4 space-top-3">Support Roles</div>
                                <div className="role-container">
                                    {this.props.stages.map(stage => 
                                            <OakCheckbox data={this.state.support} id={stage.name} label={stage.name} handleChange={this.handleSupportRoleChange} theme="primary" />
                                    )}
                                </div>
                            </>
                        }
                    </div>
                    <div className="dialog-footer">
                        <OakButton theme="primary" variant="outline" align="right" icon="save" action={this.saveRequest}>Save Changes</OakButton>
                    </div>
                </OakDialog>
            </div>
        )
    }
}
