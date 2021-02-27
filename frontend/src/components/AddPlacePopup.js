import React from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup(props) {

    const {submitText, isOpen, onClose, onAddPlace} = props;
    const nameRef = React.useRef();
    const linkRef = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();
        onAddPlace(
            {
                name: nameRef.current.value,
                link: linkRef.current.value,
            }
        );
        nameRef.current.value = '';
        linkRef.current.value = '';
    }

    return (
        <PopupWithForm
            name="card"
            title="Новое место"
            submitText={submitText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <label className="popup__field">
                <input className="popup__input popup__input_type_place" id="place-input" type="text"
                       name="place" placeholder="Название" required minLength="1" maxLength="30"
                       ref={nameRef}
                />
                <span className="popup__error" id="place-input-error"/>
            </label>
            <label className="popup__field">
                <input className="popup__input popup__input_type_link" id="link-input" type="url"
                       name="link" placeholder="Ссылка на картинку" required
                       ref={linkRef}
                />
                <span className="popup__error" id="link-input-error"/>
            </label>
        </PopupWithForm>
    )
}

export default AddPlacePopup;
