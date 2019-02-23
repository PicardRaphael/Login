import React, { useContext} from 'react'
import{ SignupStore}from 'app/contexts/signup-store'
import  inputSignup from 'app/config/form/inputSignup'

export default function Signup() {
    const inputs = inputSignup()
    const inputsJSX = inputs.map(input => (
            <label key={input.name}>
                {input.name} :
                <input
                    key={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    placeholder={input.placeholder}
                    type={input.type}
                    name={input.name}
                    required
                />                
            </label>
        )
    )

    return (
        <form>
            { inputsJSX }
        </form>
    )
}