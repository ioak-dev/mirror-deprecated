import React, { Component } from 'react';
import './OakTable.scss';
import OakPagination from './OakPagination';

interface Props {
    header: any,
    data: {
        key: string,
        label: string
    }[],
    dense?: boolean,
    onChangePage?: any,
    totalRows?: number,
    material?: boolean
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
            rowsPerPage: 6
        }
    }

    pageChanged = () => {
        if (this.props.onChangePage) {
            this.props.onChangePage(this.state.pageNo, this.state.rowsPerPage);
        }
    }

    onChangePage = (pageNo: number, rowsPerPage: number) => {
        this.setState({
            pageNo: pageNo,
            rowsPerPage: rowsPerPage
        }, () => this.pageChanged());
    }

    render() {
        let view: any[] = [];
        if (this.props.data && this.props.totalRows) {
            view = this.props.data;
        } else if (this.props.data && !this.props.totalRows) {
            view = this.props.data.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage);
        }
        let key = 0;

        return (
            <div className={this.props.material ? "oak-table material" : "oak-table"}>
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
                        {this.props.data && view.map(row => 
                            <tr key={key=key+1}>
                                {this.props.header && this.props.header.map(column =>
                                    <td key={key=key+1}>{row[column.key]}</td>
                                    )
                                }
                            </tr>
                            )}
                        </tbody>
                    </table>
                    <OakPagination onChangePage={this.onChangePage} totalRows={this.props.totalRows ? this.props.totalRows : this.props.data.length} />
                </div>

                <div className="mobile-view">
                    <div className="card-container">
                        {this.props.data && view.map(row => 
                            <div className="card" key={key=key+1}>
                                {this.props.header && this.props.header.map(column =>
                                    <div key={key=key+1}>
                                        <b>{column.label}</b>: {row[column.key]}
                                    </div>
                                    )
                                }
                            </div>
                            )}
                    </div>
                    <OakPagination onChangePage={this.onChangePage} totalRows={this.props.totalRows ? this.props.totalRows : this.props.data.length} label="Rows"/>
                </div>
            </div>
        )
    }
}

export default OakTable;
