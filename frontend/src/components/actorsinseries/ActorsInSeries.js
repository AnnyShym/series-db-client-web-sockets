import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Table from '../Table';

class ActorsInSeries extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actorsinseries',
            route: 'http://localhost:8080/',
            columns: ['#', '# Series', '(Title)', '# Actor', '(Name Surname)'],
            rows: []
        };

    }

    componentDidMount() {
        this.getActorsInSeries();
    }

    getActorsInSeries() {
        axios.get(`${this.state.route}${this.state.table}`)
        .then(response => {
            this.setState({
                rows: response.data.rows
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    getActorsInSeriesInfo(table, row) {
        return(

            <tr>
                <th scope="row">{ row.id }</th>
                <td>{ row.id_series }</td>
                <td><Link to="/series" rel="noopener">{`(${ row.title })`}</Link></td>
                <td>{ row.id_actors}</td>
                <td><Link to="/actors" rel="noopener">{`(${ row.name } ${ row.last_name })`}</Link></td>
                <td>
                    <div className="btn-group-vertical">
                        <Link to={ `/${table}/update/${row.id}` } rel="noopener" className="btn btn-sm btn-success">Update</Link>
                        <Link to={ `/${table}/delete/${row.id}` } rel="noopener" className="btn btn-sm btn-danger">Delete</Link>
                    </div>
                </td>
            </tr>

        )
    }

    render() {

        return(

            <Table table={ this.state.table } columns={ this.state.columns } rows={ this.state.rows } getRowInfo={ this.getActorsInSeriesInfo } />

        )

    }

}

export default ActorsInSeries;
