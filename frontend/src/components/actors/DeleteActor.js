import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class DeleteActor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actors',
            route: 'http://localhost:8080/'
        }

    }

    componentDidMount() {
        this.deleteActor(this.props.match.params.id);
    }

    componentDidUpdate() {
        this.deleteActor(this.props.match.params.id);
    }

    deleteActor(actorId) {
        axios.post(`${this.state.route}${this.state.table}/delete/${actorId}`)
            .catch(err => console.log(err))
    }

    render() {
        return(

            <Redirect from={ `/${this.state.table}/delete/${this.props.match.params.id}` } to={ `/${this.state.table}` } />

        )
    }
}

export default DeleteActor;
