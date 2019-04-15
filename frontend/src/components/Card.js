import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Card extends Component {
    render() {
        return(

            <div className="col">
                <div className="card" align="center">
                    <img src="https://sun9-25.userapi.com/c836121/v836121341/5dbb5/aG6ObXR39jI.jpg?ava=1" height="30" className="card-img-top" alt={ this.props.tableAlt } />
                    <div className="card-body">
                        <h5 className="card-title">{ this.props.tableAlt }</h5>
                        <Link to={ `/${this.props.table}` } rel="noopener" className="btn btn-primary">Go</Link>
                    </div>
                </div>
            </div>

        );
    }
}

export default Card;
