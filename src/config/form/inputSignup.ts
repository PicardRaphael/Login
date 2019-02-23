import React, {useContext} from 'react'
import { SignupStore } from 'p3demos/contexts/signup-store';

export default function inputSingup() {
    const { state, dispatch } = useContext(SignupStore)
    const setFirstName = (evt) => dispatch({type: 'setFirstName', firstName: evt.target.value})
    const setLastName = (evt) => dispatch({type: 'setLastName', lastName: evt.target.value})
    const setEmail = (evt) => dispatch({type: 'setEmail', email: evt.target.value})
    const setPassword= (evt) => dispatch({type: 'setPassword', password: evt.target.value})
    const setConfirmPassword= (evt) => dispatch({type: 'setConfirmPassword', confirmPassword: evt.target.value})

    const data = [
        {
            name: 'FirstName',
            placeholder: 'First Name',
            type: 'text',
            value: state.firstName,
            onChange: setFirstName
        },
        {
            name: 'LastName',
            placeholder: 'Last Name',
            type: 'text',
            value: state.lastName,
            onChange: setLastName
        },
        {
            name: 'Email',
            placeholder: 'Email',
            type: 'email',
            value: state.email,
            onChange: setEmail
        },
        {
            name: 'Password',
            placeholder: 'Password',
            type: 'password',
            value: state.password,
            onChange: setPassword
        },
        {
            name: 'ConfirmPassword',
            placeholder: 'Confirm Password',
            type: 'password',
            value: state.confirmPassword,
            onChange: setConfirmPassword
        }
    ]
    return data
}
