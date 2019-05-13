import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import '../styles/cards.css';

import Card from './Card';
import EmptyCard from './EmptyCard';

class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {
            tables: ['users', 'series', 'actors', 'actorsinseries'],
            tablesAlt: ['Users', 'Series', 'Actors', 'Actors In Series'],
            endpoint: 'http://localhost:8080/',
            authorized: true,
            errors: []
        };

        this.statusCodes = {
            NO_CONTENT: 204,
            UNAUTHORIZED: 401,
        };

        this.socket = socketIOClient(this.state.endpoint);

    }

    componentDidMount() {
        this.checkAccess();
    }

    checkAccess() {

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        this.socket.emit('get index', token);
        this.socket.on('get index', (res) => {
            if (res.statusCode === this.statusCodes.NO_CONTENT) {
                this.setState({
                    authorized: true,
                    errors: []
                })
            }
            else {
                console.log(`${res.statusCode}: ${res.errors}`);
                if (res.statusCode === this.statusCodes.UNAUTHORIZED) {
                    this.setState({
                        authorized: false,
                        errors: res.errors
                    });
                }
            }
        });

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
