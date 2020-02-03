import React, { Component } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../Ux/OakDialog';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';
import OakSelect from '../Ux/OakSelect';
import { httpGet } from '../Lib/RestTemplate';
import { constants } from '../Constants';

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
    editDialogLabel: string
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
            editDialogLabel: 'Add Comments'
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

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]:[event.target.value]
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
                                <div className="role-container">
                                    <div className="label">Email</div>
                                    <div className="value">{this.state.user.email}</div>
                                    <div className="label">Full Name</div>
                                    <div className="value">John Doe</div>
                                </div>
                                <div className="typography-4 space-top-3">Administrative Roles</div>
                                <div className="role-container">
                                    <div className="label">Tenant Administrator</div>
                                    <div className="value">Toggle switch</div>
                                    <div className="label">User Administrator</div>
                                    <div className="value">Toggle switch</div>
                                </div>
                                <div className="typography-4 space-top-3">Support Roles</div>
                                <div className="role-container">
                                    {this.props.stages.map(stage =>
                                        <>
                                            <div className="label">{stage.name}</div>
                                            <div className="value">Toggle switch</div>  
                                        </>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                    <div className="dialog-footer">
                        Buttons
                    </div>
                </OakDialog>
            </div>
        )
    }
}
