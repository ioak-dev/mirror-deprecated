import React, { Component } from 'react';
import './OakTable.scss';
import OakSelect from './OakSelect';

interface Props {
    header: any,
    data: {
        key: string,
        label: string
    }[],
    dense?: boolean,
    onChangePage?: any,
    totalRows?: number
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
            rowsPerPage: 10
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
            }, () => this.pageChanged());
        }
    }

    pageChanged = () => {
        if (this.props.onChangePage) {
            this.props.onChangePage(this.state.pageNo, this.state.rowsPerPage);
        }
    }

    nextPage = () => {
        if (Math.round(this.props.totalRows ? this.props.totalRows : this.props.data.length / this.state.rowsPerPage) !== this.state.pageNo) {
            this.setState({
                pageNo: this.state.pageNo + 1
            }, () => this.pageChanged());
        }
    }

    handleRowCountChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.target.name]: event.target.value,
                pageNo: 1
            }
            , () => this.pageChanged()
        );
    }

    getPagination(elements: string[], perPageLabel: string) {
        return (
        <div className="pagination">
            <div className="space-right-3">{perPageLabel}</div>
            <div className="space-right-3">
                <OakSelect maxWidth="max-width-50" data={this.state} id="rowsPerPage" handleChange={e => this.handleRowCountChange(e)} elements={elements} />
            </div>
            <div className="page-number space-right-3">
                <div>{(this.state.pageNo - 1) * this.state.rowsPerPage + 1} 
                        - {(this.state.pageNo * this.state.rowsPerPage < (this.props.totalRows ? this.props.totalRows : this.props.data.length)) ? this.state.pageNo * this.state.rowsPerPage : (this.props.totalRows ? this.props.totalRows : this.props.data.length)}
                        &nbsp;of&nbsp; {this.props.totalRows ? this.props.totalRows : this.props.data.length} </div>
            </div>
            <div className="page-nav">
                <div className="space-right-2"><i className={this.state.pageNo === 1 ? "material-icons disabled" : "material-icons"} onClick={this.previousPage}>keyboard_arrow_left</i></div>
                <div><i className={Math.round((this.props.totalRows ? this.props.totalRows : this.props.data.length) / this.state.rowsPerPage) === this.state.pageNo ? "material-icons disabled" : "material-icons"} onClick={this.nextPage}>keyboard_arrow_right</i></div>
            </div>
        </div>);
    }

    render() {
        return (
            <div className="oak-table">
                <div className="desktop-view">
                    <table className = {this.props.dense ? "dense" : ""}>
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
                            <tr key={row[this.props.header[0].key]}>
                                {this.props.header && this.props.header.map(column =>
                                    <td key={column.key}>{row[column.key]}</td>
                                    )
                                }
                            </tr>
                            )}
                        </tbody>
                    </table>
                    {this.getPagination(["5","10","20","50"], "Rows per page")}
                </div>

                <div className="mobile-view">
                    <div className="card-container">
                        {this.props.data && this.props.data.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage).map(row => 
                            <div className="card" key={row[this.props.header[0].key]}>
                                {this.props.header && this.props.header.map(column =>
                                    <div key={column.key}>
                                        <b>{column.label}</b>: {row[column.key]}
                                    </div>
                                    )
                                }
                            </div>
                            )}
                    </div>
                    {this.getPagination(["6","10","20","50"], "Rows")}
                </div>
            </div>
        )
    }
}

export default OakTable;
