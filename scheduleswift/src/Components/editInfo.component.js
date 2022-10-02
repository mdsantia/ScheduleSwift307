import React, { Component } from 'react';
export default class EditInfo extends Component {
    render() {
        return (
            <form>
                <div className=''>
                    <h3>Username</h3>
                    <input
                        type="text"
                        className='edit-form'
                        placeholder='Change Username'
                    />
                </div>
                <div className=''>
                    <h3>Password</h3>
                    <input
                        type="text"
                        className='edit-form'
                        placeholder='Change Password'
                    />
                </div>
                <div className=''>
                    <h3>Email Address</h3>
                    <input
                        type="text"
                        className='edit-form'
                        placeholder='Change email'
                    />
                </div>
                <div className=''>
                    <h3>Phone Number</h3>
                    <input
                        type="text"
                        className='edit-form'
                        placeholder='Change Phone Number'
                    />
                </div>

            </form>
        )
    }
}