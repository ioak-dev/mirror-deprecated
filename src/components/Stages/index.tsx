import React, { Component } from 'react'
import './style.scss';
import ArcText from '../Ux/ArcText';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { constants } from '../Constants';

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
        httpGet(constants.API_URL_STAGE + '/' + 
        this.props.match.params.tenant + '/', 
        {headers: {
            Authorization: this.props.authorization.token
        }}
        ).then ((response) => {
            this.setState({
                stage: response.data
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
                .then(function(response){
                    return Promise.resolve(response)
                    })
        }

    resetStages = () => {
        httpGet(constants.API_URL_STAGE + '/' + 
        this.props.match.params.tenant + '/', 
        {headers: {
            Authorization: this.props.authorization.token
        }}
        ).then ((response) => {
            this.setState({
                stage: response.data
                })
                }).catch(() => {})
    }

    render() {
        return (
            <div>
                <div className="form">
                    <button className="secondary animate out right align-left" onClick={ this.handleAddStage }><i className="material-icons">label_important</i>New Stage</button>
                    <button className="primary animate out right align-center" onClick={this.saveStages}><i className="material-icons">save_alt</i>Save</button>
                    <button className="default animate in right align-right" onClick={this.resetStages}><i className="material-icons">undo</i>Reset</button>
                    <div className="space-bottom-2"></div>
                    {this.state.stage && this.state.stage.map((item, idx) => (
                        <div className="stage-row" key={idx}>
                            <div><ArcText  id="name" label={`Level ${idx+1}`} data={item} handleChange ={ (e) =>this.handleChangeStage(e, idx) } /></div>
                            <div><button className="secondary animate in right space-bottom-2" onClick={this.handleRemoveStage(idx)}><i className="material-icons">delete</i>Remove</button></div>
                            </div>
                            ))}
                            {(!this.state.stage || this.state.stage.length === 0) && <div>No custom stages defined</div>}
                            </div>    
            </div>
        )
    }
}
