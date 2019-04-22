import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Table from '../Table';

class Users extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'users',
            route: 'http://localhost:8080/',
            columns: ['#', 'Login', 'Password'],
            rows: []
        };

    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
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

    getUserInfo(table, row) {
        return(

            <tr>
                <th scope="row">{ row.id }</th>
                <td>{ row.login }</td>
                <td>{ row.password }</td>
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

            <Table table={ this.state.table } columns={ this.state.columns } rows={ this.state.rows } getRowInfo={ this.getUserInfo } />

        )

    }

}

export default Users;
