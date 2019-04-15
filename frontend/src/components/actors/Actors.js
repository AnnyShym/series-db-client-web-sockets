import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Table from '../Table';

class Actors extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actors',
            route: 'http://localhost:8080/',
            columns: ['#', 'Name', 'Middle Name', 'Last Name', 'Citizenship'],
            rows: []
        };

    }

    componentDidMount() {
        this.getActors();
    }

    getActors() {
        axios.get(`${this.state.route}${this.state.table}`)
        .then(response => {
            this.setState({
                rows: response.data.rows
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    getActorInfo(table, row) {
        return(

            <tr>
                <th scope="row">{ row.id }</th>
                <td>{ row.name }</td>
                <td>{ row.middle_name }</td>
                <td>{ row.last_name }</td>
                <td>{ row.citizenship }</td>
                <td>
                    <div className="btn-group-vertical">
                        <Link to={ `/${table}/update/${row.id}` } rel="noopener" className="btn btn-sm btn-success">Update</Link>
                        <Link to={ `/${table}/delete/${row.id}` } rel="noopener" className="btn btn-sm btn-danger">Delete</Link>
                    </div>
                </td>
            </tr>

        )
    }

    render() {

        return(

            <Table table={ this.state.table } columns={ this.state.columns } rows={ this.state.rows } getRowInfo={ this.getActorInfo } />

        )

    }

}

export default Actors;
