import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import SignUp from './components/authorization/SignUp';
import SignIn from './components/authorization/SignIn';
import Home from './components/Home';
import Actors from './components/actors/Actors';
import DeleteActor from './components/actors/DeleteActor';
import ChangeActor from './components/actors/ChangeActor';
import Series from './components/series/Series';
import DeleteSeries from './components/series/DeleteSeries';
import ChangeSeries from './components/series/ChangeSeries';
import Users from './components/users/Users';
import DeleteUser from './components/users/DeleteUser';
import ChangeUser from './components/users/ChangeUser';
import ActorsInSeries from './components/actorsinseries/ActorsInSeries';
import DeleteActorsInSeries from './components/actorsinseries/DeleteActorsInSeries';
import ChangeActorsInSeries from './components/actorsinseries/ChangeActorsInSeries';

class App extends Component {
    render() {
        return(

            <Router>
                <Switch>
                    <Route exact path='/' component={ Home }/>
                    <Route exact path='/signup' component={ SignUp }/>
                    <Route exact path='/signin' component={ SignIn }/>
                    <Route exact path='/actors/delete/:id' component={ DeleteActor } />
                    <Route exact path='/actors/:operation/:id' component={ ChangeActor } />
                    <Route exact path='/actors/:operation' component={ ChangeActor } />
                    <Route exact path='/series/delete/:id' component={ DeleteSeries } />
                    <Route exact path='/series/:operation/:id' component={ ChangeSeries} />
                    <Route exact path='/series/:operation' component={ ChangeSeries } />
                    <Route exact path='/users/delete/:id' component={ DeleteUser } />
                    <Route exact path='/users/:operation/:id' component={ ChangeUser} />
                    <Route exact path='/users/:operation' component={ ChangeUser } />
                    <Route exact path='/actorsinseries/delete/:id' component={ DeleteActorsInSeries} />
                    <Route exact path='/actorsinseries/:operation/:id' component={ ChangeActorsInSeries} />
                    <Route exact path='/actorsinseries/:operation' component={ ChangeActorsInSeries } />
                    <Route exact path='/actors' component={ Actors } />
                    <Route exact path='/series' component={ Series } />
                    <Route exact path='/users' component={ Users } />
                    <Route exact path='/actorsinseries' component={ ActorsInSeries } />
                </Switch>
            </Router>

        );
    }
}

export default App;
