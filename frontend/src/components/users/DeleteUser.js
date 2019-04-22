import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class DeleteUser extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'users',
            route: 'http://localhost:8080/'
        }

    }

    componentDidMount() {
        this.deleteUser(this.props.match.params.id);
    }

    deleteUser(userId) {
        axios.post(`${this.state.route}${this.state.table}/delete/${userId}`)
            .catch(err => console.log(err))
    }

    render() {
        return(

            <Redirect from={ `/${this.state.table}/delete/${this.props.match.params.id}` } to={ `/${this.state.table}` } />

        )
    }
}

export default DeleteUser;
