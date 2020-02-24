import React, { Component } from 'react'
import './style.scss';
import OakText from '../../oakui/OakText';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { constants } from '../Constants';
import { sendMessage } from '../../events/MessageService';
import OakButton from '../../oakui/OakButton';

interface Props {
    match: any,
    authorization: Authorization
}

interface State { 
    stage: any
}
    
export default class Stages extends Component<Props, State> {
    constructor(props: Props){
        super(props)
        this.state = {
            stage: [{name:''}]
        }
    }

    componentDidMount(){
        if(this.props.authorization.isAuth){
            this.initializeStages(this.props.authorization)
        }
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.authorization){
          this.initializeStages(this.props.authorization)
        }
    }
    
    initializeStages = (Authorization) =>{
        httpGet(constants.API_URL_STAGE + '/' + 
        this.props.match.params.tenant + '/', 
        {headers: {
            Authorization: this.props.authorization.token
        }}
        ).then ((response) => {
            this.setState({
                stage: response.data.stage
                })
            }).catch(() => {})
    }

    handleAddStage = () => {
        this.setState({
            stage: this.state.stage.concat([{name: "" }])
        })
    }

    handleChangeStage = (evt, idx) => {
        const localStage = [...this.state.stage]
        localStage[idx] = {...localStage[idx], name:evt.target.value}
        this.setState({
            stage: localStage
        })
    }

    handleRemoveStage = idx => () => {
        this.setState({
            stage: this.state.stage.filter((s,sidx) => idx !== sidx)
        })
    } 

    saveStages = () => {
        return httpPut(constants.API_URL_STAGE + '/' + this.props.match.params.tenant + '/', 
        this.state.stage ,{
            headers: {
                Authorization: this.props.authorization.token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    sendMessage('notification', true, {message: 'Stages Updated successfully', type: 'success', duration: 3000});
                } else if (response.status === 500) {
                    sendMessage('notification', true, {message: 'Stages Updation failed', type: 'failure', duration: 3000});
                } else {
                    sendMessage('notification', true, {message: 'Unknown response from server. Please try again or at a later time', type: 'failure', duration: 3000});
                }
                })
        }

    resetStages = () => {
        this.initializeStages(this.props.authorization)
    }

    render() {
        return (
            <div>
                <div className="form">
                    <OakButton theme="secondary" variant="animate out" align="left" action={ this.handleAddStage }><i className="material-icons">label_important</i>New Stage</OakButton>
                    <OakButton theme="primary" variant="animate out" align="center" action={this.saveStages}><i className="material-icons">save_alt</i>Save</OakButton>
                    <OakButton theme="default" variant="animate in" align="right" action={this.resetStages}><i className="material-icons">undo</i>Reset</OakButton>
                    <div className="space-bottom-2"></div>
                    {this.state.stage && this.state.stage.map((item, idx) => (
                        <div className="stage-row" key={idx}>
                            <div><OakText  id="name" label={`Level ${idx+1}`} data={item} handleChange ={ (e) =>this.handleChangeStage(e, idx) } /></div>
                            <div className="space-bottom-2"><OakButton theme="secondary" variant="animate in" action={this.handleRemoveStage(idx)}><i className="material-icons">delete</i>Remove</OakButton></div>
                            </div>
                            ))}
                            {(!this.state.stage || this.state.stage.length === 0) && <div>No custom stages defined</div>}
                            </div>    
            </div>
        )
    }
}
