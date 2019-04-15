import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Actors from './components/actors/Actors';
import DeleteActor from './components/actors/DeleteActor';
import ChangeActor from './components/actors/ChangeActor';

class App extends Component {
    render() {
        return(

            <Router>
                <Switch>
                    <Route exact path='/' component={ Home }/>
                    <Route exact path='/actors/delete/:id' component={ DeleteActor } />
                    <Route exact path='/actors/:operation/:id' component={ ChangeActor } />
                    <Route exact path='/actors/:operation' component={ ChangeActor } />
                    <Route exact path='/actors' component={ Actors } />
                </Switch>
            </Router>

        );
    }
}

export default App;
