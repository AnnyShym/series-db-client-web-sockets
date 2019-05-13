import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Table from '../Table';

class Users extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'users',
            endpoint: 'http://localhost:8080/',
            columns: ['#', 'Login', 'Password'],
            rows: [],
            authorized: true,
            errors: []
        };

        this.statusCodes = {
            OK: 200,
            UNAUTHORIZED: 401,
            INTERNAL_SERVER_ERROR: 500
        };

        this.socket = socketIOClient(this.state.endpoint);

    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        this.socket.emit('get users', token);
        this.socket.on('get users', (res) => {
            if (res.statusCode === this.statusCodes.OK) {
                this.setState({
                    rows: res.rows,
                    authorized: true,
                    errors: []
                })
            }
            else {
                console.log(`${res.statusCode}: ${res.errors}`);
                if (res.statusCode === this.statusCodes.UNAUTHORIZED) {
                    this.setState({
                        rows: [],
                        authorized: false,
                        errors: res.errors
                    });
                }
                if (res.statusCode === this.statusCodes.INTERNAL_SERVER_ERROR) {
                    this.setState({
                        rows: [],
                        errors: res.errors
                    });
                }
            }
        });

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

        let errorBlocks = null;
        if (!this.state.authorized) {
            return <Redirect from={ `/${this.state.table}` } to='/signin' />
        }
        else {
            errorBlocks = this.state.errors.map((error) =>
                <div key={ error.msg } className="container">
                    <div className="alert alert-danger">{ error.msg }</div>
                </div>
            );
        }

        return(

            <Table table={ this.state.table } columns={ this.state.columns } rows={ this.state.rows } getRowInfo={ this.getUserInfo } errorBlocks={ errorBlocks } />

        )

    }

}

export default Users;
