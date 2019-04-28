import React, { Component } from 'react';

import '../styles/cards.css';

import Card from './Card';
import EmptyCard from './EmptyCard';

class Home extends Component {
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
