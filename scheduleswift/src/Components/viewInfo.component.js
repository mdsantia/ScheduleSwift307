import React, { Component } from 'react';
export default class ViewInfo extends Component {
    render() {
        return (
            <div class="container">
                <h3 class="title">Account Information</h3>
                    <div class="info">
      
                        <p class="information">First Name: </p>
                        <p class="information">Last Name: </p>
                        <p class="information">Username: </p>
                        <p class="information">Password: </p>
                        <p class="information">Email: </p>
                        <p class="information">Phone Number: </p>
                        <br/>
                    </div>
                    
                <div class="stats">
                    <h3 class="title"> Account Statistics </h3>
                    <br/>
                    <p>To be added later...</p>
                    <br/><br/><br/><br/>

                    <p className='go-to-editInfo'> 
                        <a href='/editInfo' class="link">Edit Account Information</a> 
                    </p>
                </div>
            </div>
        )
    }
}