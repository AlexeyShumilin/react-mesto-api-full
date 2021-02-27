import React from 'react';

function Login({onSubmitLogin}) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleOnChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleOnChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitLogin(evt) {
        evt.preventDefault();
        onSubmitLogin(email, password);
    }

    return (

        <section className="login">
            <h2 className="login__title">Вход</h2>
            <form className="login__form" onSubmit={handleSubmitLogin}>
                <input className="login__input login__input_type_email" type="email"
                       required placeholder="Email" onChange={handleOnChangeEmail}/>
                <input className="login__input login__input_type_password" type="password"
                       required placeholder="Пароль" onChange={handleOnChangePassword}/>
                <button className="login__submit">Войти</button>
            </form>
        </section>

    )
}

export default Login;
