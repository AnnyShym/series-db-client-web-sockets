import React, { Component } from 'react';

import '../styles/cards.css';

import Card from './Card';
import EmptyCard from './EmptyCard';

class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {
            tables: ['users', 'series', 'actors', 'actorsinseries'],
            tablesAlt: ['Users', 'Series', 'Actors', 'Actors In Series']
        };

    }

    render() {

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
