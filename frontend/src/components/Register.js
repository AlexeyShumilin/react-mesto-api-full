import React from 'react';
import {NavLink} from "react-router-dom";

function Register({onSubmitRegister}) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleOnChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleOnChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitRegister(evt) {
        evt.preventDefault();
        onSubmitRegister(email, password);
    }

    return (

        <section className="login">
            <h2 className="login__title">Регистрация</h2>
            <form className="login__form" onSubmit={handleSubmitRegister}>
                <input className="login__input login__input_type_email" type="email" required
                       placeholder="Email" onChange={handleOnChangeEmail}/>
                <input className="login__input login__input_type_password" type="password" required
                       placeholder="Пароль" onChange={handleOnChangePassword}/>
                <button className="login__submit">Зарегистрироваться</button>
                <p className="login__text">Уже зарегистрированы? <NavLink className="login__link"
                                                                          to="/sign-in">Войти</NavLink></p>
            </form>
        </section>

    )
}

export default Register;
