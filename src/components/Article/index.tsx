import React, { Component } from 'react'
import './style.scss';
import ArcText from '../Ux/ArcText';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { constants } from '../Constants';
import { sendMessage } from '../../events/MessageService';
import ArcDialog from '../Ux/ArcDialog';

interface Props {
    match: any,
    authorization: Authorization
}

interface State { 
    category: any,
    categoryFlag: any,
    status: any,
}
    
export default class Article extends Component<Props, State> {
    constructor(props: Props){
        super(props)
        this.state = {
            category: [{name:''}],
            categoryFlag: [{status:false, name:''}],
            status:false
        }
    }

    componentDidMount(){
        httpGet(constants.API_URL_ARTICLE + '/' + 
        this.props.match.params.tenant + constants.API_URL_CATEGORY, 
        {headers: {
            Authorization: this.props.authorization.token
        }}
        ).then ((response) => {
            this.setState({
                category: response.data.data
                })
            }).catch(() => {})
            
    }

    handleAddStage = () => {
       
    }

    handleChangeCategory = (evt, idx) => {
        const localCategory = [...this.state.category]
        localCategory[idx] = {name:evt.target.value}
        this.setState({
            category:localCategory
        })
    }

    handleUpdate = (event, idx) =>{
        let localFlag = [...this.state.categoryFlag]
        const localCategory = this.state.category[idx]
        localFlag[idx] = {...localFlag[idx], status:!this.state.status, name:localCategory.name}
        this.setState({
            categoryFlag:localFlag
        })
    }
    
    handleSave = () => {
        this.setState({
            categoryFlag: [{state:!this.state.status, name:''}]
        })
        
        return httpPut(constants.API_URL_ARTICLE + '/' + this.props.match.params.tenant + constants.API_URL_CATEGORY, 
        this.state.category ,{
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

    handleChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.currentTarget.name]: event.currentTarget.value,
            }
        )
    }
    
    handleAddCategory = () =>{
        this.setState({
            categoryFlag: this.state.categoryFlag.concat([{status:!this.state.status,name: "" }])
        })
    }

    render() {
        return (
            <div>
                <div className="form">
                    <button className="secondary animate out right align-left" onClick={ this.handleAddCategory }><i className="material-icons">label_important</i>New Stage</button>
                    <div className="space-bottom-2"></div>
                    {this.state.category && this.state.category.map((item, idx) => (
                        <div className="stage-row" key={idx}>
                            <div><ArcText  id="name"  label=" Category" data={item} handleChange ={ (e) => this.handleChange } /></div>
                            <button className="primary animate out right align-center" onClick={ (events) => this.handleUpdate(events, idx) }><i className="material-icons">update_alt</i>Update</button>
                            </div>
                            ))}
                            {(!this.state.category || this.state.category.length === 0) && <div>No Article category specified</div>}
                            </div> 
                    {this.state.categoryFlag && this.state.categoryFlag.map((item,idx) => (
                        <div>
                            <ArcDialog title="Add/Update Category" visible ={item.status} toggleVisibility={this.state.status}>
                                <div>
                                <ArcText  id="name"  label=" Category" data={item} handleChange ={ (e) =>this.handleChangeCategory(e, idx) } ></ArcText>
                                </div>
                                <div><button className="primary animate out right align-center" onClick={ this.handleSave }><i className="material-icons">save_alt</i>Save</button></div>
                            </ArcDialog>
                        </div>
                    ))}
                    {(!this.state.categoryFlag || this.state.categoryFlag.length === 0)}
                
            </div>
        )
    }
}
