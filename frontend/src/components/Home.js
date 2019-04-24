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
            INTERNAL_SERVER_ERROR: 500
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

        let errorBlocks = null;
        if (!this.state.authorized) {
            return <Redirect from='/' to='/signin' />
        }
        else {
            errorBlocks = this.state.errors.map((error) =>
                <div key={ error.msg } className="container">
                    <div className="alert alert-danger">{ error.msg }</div>
                </div>
            );
        }

        let i = 0;

        return(

            <div>
                <div>
                    { errorBlocks }
                </div>
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
            </div>

        );

    }

}

export default Home;
