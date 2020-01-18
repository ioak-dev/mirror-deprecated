import React, { Component } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../Ux/OakDialog';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';
import OakSelect from '../Ux/OakSelect';
import { httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import { sendMessage } from '../../events/MessageService';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    request: any,
    stages: any
}

interface State {
    request: any,
    isDialogOpen: boolean,
    nextStage?: string,
    previousStage?: any,
    priorities: any
}

export default class ServiceRequestView extends Component<Props, State> {
    constructor(props){
        super(props);
        this.state = {
            isDialogOpen: false,
            request: {
                title: '',
                description: '',
                priority: '',
                comments:[],
                comment:''
            },
            priorities: ['Low', 'Medium', 'High'],
            
        }
    }

    componentDidMount(){
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.request && this.state.request !== nextProps.request) {
            this.setState({
                request: nextProps.request,
                isDialogOpen: true
            })
        }
        if (nextProps.request || nextProps.stages) {
            this.findNextStage(nextProps);
        }
    }

    findNextStage = (props) => {
        if (props.request && props.request.stage && props.stages && props.stages.length > 0) {
            let index = props.stages.findIndex(x => x.name === props.request.stage);
            if (props.stages.length > index + 1) {
                this.setState({
                    nextStage: props.stages[index + 1].name
                });
            }
        }
    }

    clearRequest = () => {
        this.setState({
            isDialogOpen:false,
            request: {
                title: '',
                description: '',
                priority: '',
                comment: ''
            }
        })
    }


    toggleDialog = () => {
        if (this.state.isDialogOpen) {
            this.clearRequest();
        }
        this.setState({
            isDialogOpen: !this.state.isDialogOpen,
            // editDialogLabel: 'Add'
        })
    }

    handleRequestChange = (event) => {
        this.setState(
            {
                request: {
                    ...this.state.request,
                    [event.target.name]: event.target.value
                }
            }
        )
    }

    nextStage = (stage) => {
        const that = this
        const stageDetails ={
            stageId: this.state.request._id,
            previousStage: this.props.stages[this.props.stages.findIndex(x => x.name === stage)-1].name,
            stage:stage
        }

        httpPut(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/',
        stageDetails,
        {
            headers: {
                Authorization: this.props.authorization.token
            }
        })
        .then(function(response) {
            if (response.status === 200) {
                sendMessage('notification', true, {type: 'success', message: `passed to ${stage}`, duration: 5000});
                that.clearRequest();
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
          
    }

    saveChanges = () =>{
        const that = this
        
        let comment = {
            comment:this.state.request.comment,
            name: this.props.match.params.tenant,
            date: new Date().toLocaleString()
        }
        
        let comments =[{}]
        comments = this.state.request.comments
        if(comment.comment){
            if(comments === undefined){
                comments = [comment]
            }
            else{
                comments.push(comment)
            }    
        }
        else{
            comments = [...this.state.request.comments]
        }
        
        let request ={
            id : this.state.request._id,
            title: this.state.request.title,
            description: this.state.request.description,
            priority: this.state.request.priority,
            updateTime: new Date().toLocaleString(),
            comment: comments,
            assignedTo: this.props.match.params.tenant
        }
        httpPut(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/',
        request,
        {
            headers: {
                Authorization: this.props.authorization.token
            }
        })
        .then(function(response) {
            if (response.status === 200) {
                sendMessage('notification', true, {type: 'success', message: 'Service Request Updated', duration: 5000});
                that.clearRequest();
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
    }

    render() {
        return (
            <div className="view-request">
                <OakDialog fullscreen visible={this.state.isDialogOpen} toggleVisibility={this.toggleDialog} >
                    <div className="dialog-body">
                        <div>
                            <div>Request Number #:  {this.state.request._id}</div>
                            <br></br>
                            <div>
                            <OakText label="Title" data={this.state.request} id="title" handleChange={e => this.handleRequestChange(e)} />
                            </div>
                            <div>
                            <OakText label="Description" data={this.state.request} id="description" handleChange={e => this.handleRequestChange(e)} />
                            </div>
                            <div>
                            <OakSelect label="Priority" data={this.state.request} id="priority" handleChange={e => this.handleRequestChange(e)} elements={this.state.priorities}/>
                            </div>
                            <br></br>
                            <div>
                            <OakText label="Comments" multiline data={this.state.request} id="comment" handleChange={e => this.handleRequestChange(e)} />
                            </div>
                            
                        </div>
                        
                        {this.state.request.comments && this.state.request.comments.map((item)=>(
                            <div>
                                Updated By {item.name} on {item.date}
                            <div>
                            
                            </div>
                            <div>
                            <OakText disabled label="" data={item} id="comment" handleChange={e =>this.handleRequestChange(e)} />
                            </div>
                            </div>
                        ))}
                        
                    </div>
                    <div className="dialog-footer">
                        {this.state.nextStage && <OakButton theme="primary" variant="outline" align="left" icon="person_add" action={() => this.nextStage(this.state.nextStage)}>Assign to {this.state.nextStage}</OakButton>}
                        <OakButton theme="primary" variant="outline" align="right" icon="save" action={this.saveChanges}>Save Changes</OakButton>
                    </div>
                </OakDialog>
            </div>
        )
    }
}