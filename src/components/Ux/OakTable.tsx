import React, { Component } from 'react';
import './OakTable.scss';

interface Props {
    header: any,
    data: any
}

interface State {
}

class OakTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.data);
        console.log(this.props.header);
    }

    render() {
        return (
            <div className="oak-table">
                <table>
                    <tr>
                        {this.props.header && this.props.header.map(item =>
                            <th>{item.label}</th>
                            )
                        }
                    </tr>
                    {this.props.data && this.props.data.map(row => 
                        <tr>
                            {this.props.header && this.props.header.map(column =>
                                <td>{row[column.key]}</td>
                                )
                            }
                        </tr>
                        )}
                </table>
            </div>
        )
    }
}

export default OakTable;
