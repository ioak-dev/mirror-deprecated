import React, { Component } from 'react';
import './OakTable.scss';
import OakSelect from './OakSelect';

interface Props {
    header: any,
    data: {
        key: string,
        label: string
    }[]
}

interface State {
    pageNo: number,
    rowsPerPage: number
}

class OakTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            pageNo: 1,
            rowsPerPage: 5
        }
    }

    componentDidMount() {
        console.log(this.props.data);
        console.log(this.props.data.slice(2, 2+2));
        console.log(this.props.data);
        // console.log(this.props.header);
    }

    previousPage = () => {
        if (this.state.pageNo !== 1) {
            this.setState({
                pageNo: this.state.pageNo - 1
            })
        }
    }

    nextPage = () => {
        if (Math.round(this.props.data.length / this.state.rowsPerPage) !== this.state.pageNo) {
            this.setState({
                pageNo: this.state.pageNo + 1
            })
        }
    }

    handleChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.target.name]: event.target.value
            }
        )
    }

    render() {
        return (
            <div className="oak-table">
                <table>
                    <thead>
                        <tr>
                            {this.props.header && this.props.header.map(item =>
                                <th key={item.key}>{item.label}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.data && this.props.data.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage).map(row => 
                        <tr>
                            {this.props.header && this.props.header.map(column =>
                                <td>{row[column.key]}</td>
                                )
                            }
                        </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <div className="space-right-3">Rows per page</div>
                    <div className="space-right-3">
                        <OakSelect maxWidth="max-width-50" data={this.state} id="rowsPerPage" handleChange={e => this.handleChange(e)} elements={["5","10","20","50"]} />
                    </div>
                    <div className="page-number space-right-3">
                        <div>{(this.state.pageNo - 1) * this.state.rowsPerPage + 1} 
                                - {(this.state.pageNo * this.state.rowsPerPage < this.props.data.length) ? this.state.pageNo * this.state.rowsPerPage : this.props.data.length}
                                &nbsp;of&nbsp; {this.props.data.length} </div>
                    </div>
                    <div className="page-nav">
                        <div className="space-right-2"><i className={this.state.pageNo === 1 ? "material-icons disabled" : "material-icons"} onClick={this.previousPage}>keyboard_arrow_left</i></div>
                        <div><i className={Math.round(this.props.data.length / this.state.rowsPerPage) === this.state.pageNo ? "material-icons disabled" : "material-icons"} onClick={this.nextPage}>keyboard_arrow_right</i></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OakTable;
