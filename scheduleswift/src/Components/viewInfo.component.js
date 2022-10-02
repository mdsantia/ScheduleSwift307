import React, { Component } from 'react';
export default class ViewInfo extends Component {
    render() {
        return (
            <div>
	            <h3>Account Information</h3>
                <p>Username: </p>
                <p>Password: </p>
                <p>Email: </p>
                <p>Phone Number: </p>
                <br/>
    
                <h3> Account Statistics </h3>
                <br/><br/><br/><br/>
                <p className='go-to-editInfo'> 
                    <a href='/editInfo'>Edit Account Information</a> 
                </p>
            </div>
        )
    }
}