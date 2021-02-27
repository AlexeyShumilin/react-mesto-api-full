import React from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup(props) {

    const {isOpen, onClose, submitText, onUpdateAvatar} = props;

    const avatarRef = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();

        onUpdateAvatar({
            avatar: avatarRef.current.value,
        });
        avatarRef.current.value = '';
    }

    return (
        <PopupWithForm
            name="avatar"
            title="Обновить аватар"
            submitText={submitText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <label className="popup__field">
                <input className="popup__input popup__input_type_place" id="avatar-input" type="url"
                       name="avatar" placeholder="Ссылка" required minLength="1" maxLength="300"
                       ref={avatarRef}
                />
                <span className="popup__error" id="avatar-input-error"/>
            </label>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;
