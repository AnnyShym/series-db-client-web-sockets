import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ChangeActorsInSeries extends Component {

    constructor(props) {

        super(props);

        this.state = {
            table: 'actorsinseries',
            route: 'http://localhost:8080/',
            columns: ['id', 'id_series', 'id_actors'],
            columnsAlt: ['#', '# Series', '# Actor'],
            seriesInfo: [],
            actorsInfo: [],
            actorsinseries: {
                id_series: 'NULL',
                id_actors: 'NULL'
            },
            changed: false,
            errors: []
        }

        this.statusCodes = {
            BAD_REQUEST: 400,
            INTERNAL_SERVER_ERROR: 500
        };

        this.opInsert = 'insert';
        this.opUpdate = 'update';

        this.onChangeSeriesId= this.onChangeSeriesId.bind(this);
        this.onChangeActorsId = this.onChangeActorsId.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

    }

    componentDidMount() {

        this.getSeriesInfo();
        this.getActorsInfo();

        if (this.props.match.params.operation === this.opUpdate) {
            this.getActorsInSeriesInfo();
        }

    }

    getSeriesInfo() {
        axios.get(`${this.state.route}${this.state.table}/seriesinfo`)
        .then(response => {
            this.setState({
                seriesInfo: response.data.rows,
                errors: []
            })
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status ===
                this.statusCodes.INTERNAL_SERVER_ERROR) {
                this.setState({
                    errors: err.response.data.errors,
                });
            }
        })
    }

    getActorsInfo() {
        axios.get(`${this.state.route}${this.state.table}/actorsinfo`)
        .then(response => {
            this.setState({
                actorsInfo: response.data.rows,
                errors: []
            })
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status ===
                this.statusCodes.INTERNAL_SERVER_ERROR) {
                this.setState({
                    errors: err.response.data.errors,
                });
            }
        })
    }

    getActorsInSeriesInfo() {
        axios.get(`${this.state.route}${this.state.table}/${
            this.props.match.params.id}`)
        .then(response => {
            this.setState({
                actorsinseries: response.data.row[0],
                errors: []
            })
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status ===
                this.statusCodes.INTERNAL_SERVER_ERROR) {
                this.setState({
                    errors: err.response.data.errors,
                });
            }
        })
    }

    onChangeSeriesId(e) {
        this.setState({
            actorsinseries : {
                ...this.state.actorsinseries,
                id_series: e.target[e.target.selectedIndex].value
            }
        });
    }

    onChangeActorsId(e) {
        this.setState({
            actorsinseries: {
                ...this.state.actorsinseries,
                id_actors: e.target[e.target.selectedIndex].value
            }
        });
    }

    onSubmit(e) {

        e.preventDefault();

        const obj = {
            id_series: this.state.actorsinseries.id_series,
            id_actors: this.state.actorsinseries.id_actors,
        };

        let route = null;
        if (this.props.match.params.operation === this.opInsert) {
            route = `${this.state.route}${this.state.table}/${
                this.props.match.params.operation}`
        }
        else {
            route = `${this.state.route}${this.state.table}/${
                this.props.match.params.operation}/${this.props.match.params.id}`;
        }

        axios.post(route, obj)
            .then((response) => {
                this.setState({
                    errors: [],
                    changed: true
                });
            })
            .catch(err => {
                console.log(err);
                if (err.response && (err.response.status ===
                    this.statusCodes.INTERNAL_SERVER_ERROR)) {
                        this.setState({
                            errors: err.response.data.errors,
                            changed: false
                        });
                    }
            })

    }

    render() {

        if (this.props.match.params.operation !== this.opInsert &&
            this.props.match.params.operation !== this.opUpdate) {
            return <div></div>
        }

        let errorBlocks = null;
        if (this.state.changed) {
            return <Redirect from={ `/${this.state.table}/${
                this.props.match.params.operation}/${
                this.props.match.params.id}` } to={ `/${this.state.table}` } />
        }
        else {
            errorBlocks = this.state.errors.map((error) =>
                <div key={ error.msg } className="container">
                    <div className="alert alert-danger">{ error.msg }</div>
                </div>
            );
        }

        const seriesOptions = this.state.seriesInfo.map((series) =>
            <option key={ series.id } value={ series.id }>{ `${series.id} (${series.title})` }</option>
        );

        const actorsOptions = this.state.actorsInfo.map((actor) =>
            <option key={ actor.id } value={ actor.id }>{ `${actor.id} (${actor.name} ${actor.last_name})` }</option>
        );

        const operationAlt = this.props.match.params.operation[0].toUpperCase() +
            this.props.match.params.operation.slice(1);

        return(

            <div>
                <div>
                    { errorBlocks }
                </div>
                <div className="container">
                    <form method="post" onSubmit={ this.onSubmit } align="center">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">{ this.state.columnsAlt[1] }:</label>
                            <select name={ this.state.columns[1] } value={ this.state.actorsinseries.id_series } onChange= { this.onChangeSeriesId } className="form-control" id="exampleFormControlSelect1">
                                <option key={ 'NULL' } value='NULL'></option>
                                { seriesOptions }
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput2">{ this.state.columnsAlt[2] }:</label>
                            <select name={ this.state.columns[2] } value={ this.state.actorsinseries.id_actors } onChange= { this.onChangeActorsId } className="form-control" id="exampleFormControlSelect2">
                                <option key={ 'NULL' } value='NULL'></option>
                                { actorsOptions }
                            </select>
                        </div>
                        <button type="submit" name={ operationAlt } className="btn btn-success" align="center">{ operationAlt }</button>
                    </form>
                </div>
            </div>

        )
    }
}

export default ChangeActorsInSeries;
