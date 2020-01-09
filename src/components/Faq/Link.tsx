import React, { Component } from 'react';
import './style.scss';

interface Props {
    editFaq: Function,
    confirmDeleteFaq: Function,
    search: Function,
    faq: any,
    id: string
}
interface State {
}

class Link extends Component<Props, State> {

    edit = () => {
        this.props.editFaq(this.props.faq);
    }

    delete = () => {
        this.props.confirmDeleteFaq(this.props.faq._id);
    }

    render() {
        return (
            <div className="faq-record">
                <div className="title typography-4">
                    <div className="tag" key={this.props.faq.category} onClick={() => this.props.search(this.props.faq.category)}>{this.props.faq.category}</div>
                    {this.props.faq.question}
                    <div className="action-icon">
                        <i onClick={this.edit} className="material-icons">edit</i>
                        <i onClick={this.delete} className="material-icons">delete</i>
                    </div>
                </div>
                <div className="typography-6">{this.props.faq.answer}</div>
            </div>
        )
    }
}

export default Link;
