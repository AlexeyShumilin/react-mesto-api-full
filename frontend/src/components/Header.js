import logo from '../images/logo-white.svg';
import {NavLink} from 'react-router-dom';

function Header({email, link, textLink, onSignOut}) {
    return (
        <header className="header">
            <NavLink to="/"><img src={logo} alt="Лого" className="logo"/></NavLink>
            <nav className="header__nav">
                {email && <p className="header__login">{email}</p>}
                <NavLink className="header__link" to={link} onClick={onSignOut}>{textLink}</NavLink>
            </nav>

        </header>
    )
}

export default Header;
