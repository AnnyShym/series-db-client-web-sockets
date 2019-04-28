import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import '../styles/cards.css';

import Card from './Card';
import EmptyCard from './EmptyCard';

class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {
            tables: ['users', 'series', 'actors', 'actorsinseries'],
            tablesAlt: ['Users', 'Series', 'Actors', 'Actors In Series'],
            route: 'http://localhost:8080/',
            authorized: true,
            errors: []
        };

        this.statusCodes = {
            UNAUTHORIZED: 401,
        };

    }

    componentDidMount() {
        this.checkAccess();
    }

    checkAccess() {
        axios.get(`${this.state.route}`, {withCredentials: true})
        .then(response => {
            this.setState({
                authorized: true,
                errors: []
            })
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status ===
                this.statusCodes.UNAUTHORIZED) {
                this.setState({
                    authorized: false,
                    errors: err.response.data.errors
                });
            }
        })
    }

    render() {

        if (!this.state.authorized) {
            return <Redirect from='/' to='/signin' />
        }

        let i = 0;

        return(

            <div>
                <div className="row cards-row" >
                    <Card table={ this.state.tables[i] } tableAlt={ this.state.tablesAlt[i++] } />
                    <Card table={ this.state.tables[i] } tableAlt={ this.state.tablesAlt[i++] } />
                    <Card table={ this.state.tables[i] } tableAlt={ this.state.tablesAlt[i++] } />
                </div>
                <div className="row cards-row">
                    <Card table={ this.state.tables[i] } tableAlt={ this.state.tablesAlt[i++] } />
                    <EmptyCard />
                    <EmptyCard />
                </div>
            </div>

        );

    }

}

export default Home;
