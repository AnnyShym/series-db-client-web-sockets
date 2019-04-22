import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class DeleteSeries extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'series',
            route: 'http://localhost:8080/'
        }

    }

    componentDidMount() {
        this.deleteSeries(this.props.match.params.id);
    }

    deleteSeries(seriesId) {
        axios.post(`${this.state.route}${this.state.table}/delete/${seriesId}`)
            .catch(err => console.log(err))
    }

    render() {
        return(

            <Redirect from={ `/${this.state.table}/delete/${this.props.match.params.id}` } to={ `/${this.state.table}` } />

        )
    }
}

export default DeleteSeries;
