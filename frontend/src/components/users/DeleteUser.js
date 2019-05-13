import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

class DeleteUser extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'users',
            endpoint: 'http://localhost:8080/',
            authorized: true,
            deleted: false,
            errors: []
        }

        this.statusCodes = {
            NO_CONTENT: 204,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            INTERNAL_SERVER_ERROR: 500
        };

        this.socket = socketIOClient(this.state.endpoint);

    }

    componentDidMount() {
        this.deleteUser(this.props.match.params.id);
    }

    deleteUser(userId) {

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        this.socket.emit('delete user', userId, token);
        this.socket.on('delete user', (res) => {
            if (res.statusCode === this.statusCodes.NO_CONTENT) {
                this.setState({
                    authorized: true,
                    deleted: true,
                    errors: []
                })
            }
            else {
                console.log(`${res.statusCode}: ${res.errors}`);
                if (res.statusCode === this.statusCodes.UNAUTHORIZED) {
                    this.setState({
                        authorized: false,
                        deleted: false,
                        errors: res.errors
                    });
                }
                if (res.statusCode === this.statusCodes.INTERNAL_SERVER_ERROR ||
                    res.statusCode === this.statusCodes.BAD_REQUEST) {
                    this.setState({
                        rows: [],
                        errors: res.errors
                    });
                }
            }
        });

    }

    render() {
        if (!this.state.authorized) {
            return <Redirect from={ `/${this.state.table}/delete/${
                this.props.match.params.id}` } to='/signin' />
        }
        else {
            if (this.state.deleted) {
                return <Redirect from={ `/${this.state.table}/delete/${
                    this.props.match.params.id}` } to={ `/${this.state.table}` } />
            }
            else {
                let errorBlocks = this.state.errors.map((error) =>
                    <div key={ error.msg } className="container">
                        <div className="alert alert-danger">{ error.msg }</div>
                    </div>
                );
                return(

                    <div>
                        { errorBlocks }
                    </div>

                )
            }
        }
    }
}

export default DeleteUser;
