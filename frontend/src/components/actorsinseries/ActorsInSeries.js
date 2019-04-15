import React, { Component } from 'react';
import axios from 'axios';

import Table from '../Table';

class ActorsInSeries extends Component {

  constructor(props) {

    super(props);

    this.state = {
      table: 'actorsinseries',
      route: 'http://localhost:8080/',
      columns: ['#', '# Series', '# Actors'],
      rows: []
    };

  }

  getActorsInSeries() {
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
        <td>{ row.id_series }</td>
        <td>{ row.id_actors }</td>
      </div>
    )
  }

  render() {

    this.getActorsInSeries();

    return(
      <Table table={this.state.table} columns={this.state.columns} rows={this.state.rows} getRowInfo={this.getRowInfo} />
    )

  }

}

export default ActorsInSeries;
