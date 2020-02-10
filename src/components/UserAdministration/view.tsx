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
    isDialogOpen: boolean,
    toggleDialog: any
}

interface State {
    administrativeRoles: any,
    supportRoles: any,
}

export default class UserAdministrationView extends Component<Props, State> {
    administrativeRoles = ['tenantAdministrator', 'userAdministrator'];

    constructor(props){
        super(props);
        this.state = {
            administrativeRoles: {},
            supportRoles: {}
        }
    }

    componentDidMount() {
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })
    }

    componentWillReceiveProps(nextProps) {
        
        if (nextProps && nextProps.user && nextProps.stages) {
            let administrativeRoles = {};
            let supportRoles = {};
            this.administrativeRoles.forEach((item) => {
                administrativeRoles[item] = nextProps.user.roles && nextProps.user.roles.indexOf(item) >= 0 ? true : false;
            });
            this.props.stages.forEach((item) => {
                supportRoles[item] = nextProps.user.roles && nextProps.user.roles.indexOf(item) >= 0 ? true : false;
            });
            this.setState({
                administrativeRoles: administrativeRoles,
                supportRoles: supportRoles
            });
        }
    }

    saveRequest = () => {
        // if(this.state['tenantAdministrator'] == 'true') {
        //     this.setState({
        //         ...this.state,
        //         roles: this.state.roles.push('Tenant Administrator')
        //     })
        // }
        
        // if(this.state['userAdministrator'] == 'true'){
        //     this.setState({
        //         ...this.state,
        //         roles: this.state.roles.push('User Administrator')
        //     })
        // }
        
        // if(!(Object.keys(this.state.support).length==0)){
        //     this.setState({
        //         ...this.state,
        //         roles: this.state.roles.push(Object.keys(this.state.support))
        //     })
        // }
        
        // this.props.saveRequest({
        //     id: this.state.user._id,
        //     roles: this.state.roles
        // }, true)
        let roles: string[] = [];
        Object.keys(this.state.administrativeRoles).forEach(item => {
            if(this.state.administrativeRoles[item]) {
                roles.push(item);
            }
        });
        Object.keys(this.state.supportRoles).forEach(item => {
            if(this.state.supportRoles[item]) {
                roles.push(item);
            }
        });
        
        this.props.saveRequest({
            id: this.props.user._id,
            roles: roles
        }, true);
        this.props.toggleDialog();
    }

    handleSupportRoleChange = (event) => {
        this.setState({
            supportRoles: {
                ...this.state.supportRoles,
                [event.target.name]: event.target.value
            }
        })
    }

    handleAdministrativeRoleChange = (event) => {
        this.setState({
            administrativeRoles: {
                ...this.state.administrativeRoles,
                [event.target.name]: event.target.value
            }
        })
    }
   
    render() {
        return (
            <div className="view-user">
                <OakDialog visible={this.props.isDialogOpen} toggleVisibility={this.props.toggleDialog} >
                    <div className="dialog-body">
                        {this.props.user && 
                            <>
                                <div className="typography-4">User Data</div>
                                <div className="basic-data">
                                    <div className="label">Email</div>
                                    <div className="value">{this.props.user.email}</div>
                                    <div className="label">Full Name</div>
                                    <div className="value">John Doe</div>
                                </div>
                                <div className="typography-4 space-top-3">Administrative Roles</div>
                                <div className="role-container">
                                    <OakCheckbox data={this.state.administrativeRoles} id="tenantAdministrator" label="Tenant Administrator" handleChange={this.handleAdministrativeRoleChange} theme="primary" />
                                    <OakCheckbox data={this.state.administrativeRoles} id="userAdministrator" label="User Administrator" handleChange={this.handleAdministrativeRoleChange} theme="primary" />
                                </div>
                                <div className="typography-4 space-top-3">Support Roles</div>
                                <div className="role-container">
                                    {this.props.stages.map(stage => 
                                            <OakCheckbox key={stage.name} data={this.state.supportRoles} id={stage.name} label={stage.name} handleChange={this.handleSupportRoleChange} theme="primary" />
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
