import React, { Component } from 'react';
import './style.scss';

interface Props {
    editFaq: Function,
    deleteFaq: Function,
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
        this.props.deleteFaq(this.props.id);
    }

    render() {
        const tags: any = [];
        if (this.props.faq.tags) {
            this.props.faq.tags.split(" ").map(item => {
                tags.push(<div className="tag" key={item} onClick={() => this.props.search(item)}>{item}</div>);
            })
        }
        
        return (
            <div>
                <div className="title typography-4">{this.props.faq.category}
                    <div className="action-icon">
                        <i onClick={this.edit} className="material-icons">edit</i>
                        <i onClick={this.delete} className="material-icons">delete</i>
                    </div>
                </div>
                <div className="url typography-6"><a target="_blank" rel="noopener noreferrer" href={this.props.faq.href}>{this.props.faq.question}</a></div>
                <div className="timestamp typography-6 space-bottom-1">{this.props.faq.answer}</div>
                {tags}
            </div>
        )
    }
}

export default Link;
