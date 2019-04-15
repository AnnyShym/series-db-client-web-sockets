import React, { Component } from 'react';
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

  getActors() {
    axios.get(`${this.state.route}${this.state.table}`)
      .then(response => {
        this.setState({
          rows: response.data.rows
        })
      })
      .catch(err => console.log(err))
  }

  getRowInfo(row) {
    return(
      <div>
        <td>{ row.title }</td>
        <td>{ row.country }</td>
        <td>{ row.description }</td>
        <td>{ row.rating }</td>
      </div>
    )
  }

  render() {

    this.getSeries();

    return(
      <Table table={this.state.table} columns={this.state.columns} rows={this.state.rows} getRowInfo={this.getRowInfo} />
    )

  }

}

export default Series;
