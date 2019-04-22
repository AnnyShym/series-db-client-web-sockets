
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class DeleteActorsInSeries extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actorsinseries',
            route: 'http://localhost:8080/'
        }

    }

    componentDidMount() {
        this.deleteActorsInSeries(this.props.match.params.id);
    }

    deleteActorsInSeries(actorsInSeriesId) {
        axios.post(`${this.state.route}${this.state.table}/delete/${actorsInSeriesId}`)
            .catch(err => console.log(err))
    }

    render() {
        return(

            <Redirect from={ `/${this.state.table}/delete/${this.props.match.params.id}` } to={ `/${this.state.table}` } />

        )
    }
}

export default DeleteActorsInSeries;
