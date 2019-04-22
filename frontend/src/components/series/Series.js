import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Table from '../Table';

class Series extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'series',
            route: 'http://localhost:8080/',
            columns: ['#', 'Title', 'Country', 'Description', 'Rating'],
            rows: []
        };

    }

    componentDidMount() {
        this.getSeries();
    }

    getSeries() {
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

    getSeriesInfo(table, row) {
        return(

            <tr>
                <th scope="row">{ row.id }</th>
                <td>{ row.title }</td>
                <td>{ row.country }</td>
                <td>{ row.description }</td>
                <td>{ row.rating }</td>
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

            <Table table={ this.state.table } columns={ this.state.columns } rows={ this.state.rows } getRowInfo={ this.getSeriesInfo } />

        )

    }

}

export default Series;
