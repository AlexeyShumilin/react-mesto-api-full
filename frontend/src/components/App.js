import React from 'react';
import '../App.css';
import api from '../utils/api.js';
import auth from '../utils/auth.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import {Route, Switch, useHistory} from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {

    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({name: '', link: '', isOpenCard: false});

    const [submitTextSave, setSubmitTextSave] = React.useState('Сохранить');

    // авторизация
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isSuccessPopupOpen, setSuccessPopupOpen] = React.useState(false);
    const [isFailPopupOpen, setFailPopupOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const history = useHistory();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            auth.checkToken(token)
                .then((res) => {
                    if (res) {
                        setLoggedIn(true);
                        setEmail(res.email);
                        history.push('/');
                        getData();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    localStorage.removeItem('token')
                });
        }

    }, [])

    // попапы
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard({...card, isOpenCard: true});
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setFailPopupOpen(false);
        setSuccessPopupOpen(false);
        setSelectedCard({name: '', link: '', isOpenCard: false});
    }

    // данные пользователя
    function handleUpdateUser(data) {
        setSubmitTextSave("Сохранение...");
        api.saveProfile(data)
            .then((profile) => {
                setCurrentUser(profile);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSubmitTextSave("Сохранить");
            });
    }

    function handleUpdateAvatar(data) {
        setSubmitTextSave("Сохранение...");
        api.changePhoto(data)
            .then((profile) => {
                setCurrentUser(profile);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSubmitTextSave("Сохранить");
            });
    }

    //карточки

    /* лайк карточки */
    function handleCardLike(card) {
        const isLiked = card.likes.some(like => like === currentUser._id);

        api.changeLikeCardStatus(card, !isLiked)
            .then((newCard) => {
                const newCards = cards.map((c) => c._id === card._id ? newCard : c);
                setCards(newCards);
            })
            .catch((err) => console.log(err));
    }

    /* удаление карточки */
    function handleCardDelete(card) {
        api.deleteCard(card)
            .then(() => {
                const newCards = cards.filter((item) => {
                    return item._id !== card._id;
                });
                setCards(newCards);
            })
            .catch((err) => console.log(err));
    }

    /* добавление карточки */
    function handleAddPlaceSubmit(card) {
        setSubmitTextSave("Сохранение...");
        api.addCard(card)
            .then((data) => {
                setCards([data, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSubmitTextSave("Сохранить");
            });
    }

    //авторизация
    function onSubmitRegister(email, password) {
        if (!email || !password) {
            return;
        }
        auth.register(email, password)
            .then((res) => {
                if (res) {
                    setSuccessPopupOpen(true);
                }
            })
            .catch(err => {
                console.log(err);
                setFailPopupOpen(true);
            })
    }

    function onSubmitLogin(email, password) {
        if (!email || !password) {
            return;
        }
        auth.login(email, password)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    setLoggedIn(true);
                    setEmail(email)
                    getData();
                    history.push('/');
                }
            })
            .catch((err) => {
                console.log('err: ', err);
                setFailPopupOpen(true);
            })
    }

    // получение начальных данных
    function getData() {
        api.getAllData()
            .then(([profile, initialCards]) => {
                setCurrentUser(profile);
                setCards(initialCards);
            })
            .catch((err) => console.log(err));
    }

    function handleSignOut() {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setEmail('');
        history.push('/sign-in');
    }

    return (

        <CurrentUserContext.Provider value={currentUser}>
            {/* <body className="page"> */}

            {
                loggedIn && <Header link="/sign-in" textLink="Выйти" email={email} onSignOut={handleSignOut}/>
            }

            <Switch>

                <ProtectedRoute exact path="/"
                                loggedIn={loggedIn}
                                component={Main}
                                onSignOut={handleSignOut}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditAvatar={handleEditAvatarClick}
                                onCardClick={handleCardClick}
                                cards={cards}
                                email={email}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                />

                <Route path="/sign-in">

                    <Header link="/sign-up" textLink="Регистрация"/>
                    <Login onSubmitLogin={onSubmitLogin}/>

                </Route>
                <Route path="/sign-up">

                    <Header link="/sign-in" textLink="Войти"/>
                    <Register onSubmitRegister={onSubmitRegister}/>

                </Route>
            </Switch>

            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                submitText={submitTextSave}
            />

            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                submitText={submitTextSave}
            />

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
                submitText={submitTextSave}
            />

            <PopupWithForm
                name="confirm"
                title="Вы уверены?"
                submitText="Да"
            />

            <InfoTooltip
                name="success"
                isOpen={isSuccessPopupOpen}
                onClose={closeAllPopups}
                title="Вы успешно зарегистрировались!"
            />

            <InfoTooltip
                name="fail"
                isOpen={isFailPopupOpen}
                onClose={closeAllPopups}
                title="Что-то пошло не так! Попробуйте еще раз."
            />

            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
            />

            <Footer/>

            {/* </body> */}
        </CurrentUserContext.Provider>
    );
}

export default App;
