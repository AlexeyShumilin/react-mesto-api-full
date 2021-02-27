function PopupWithForm(props) {

    return (

        <section className={`popup popup_type_${props.name} ${props.isOpen && 'popup_opened'}`}>

            <form action="post" name="popup__container" className="popup__form" noValidate onSubmit={props.onSubmit}>
                <button type="button" className="popup__close" onClick={props.onClose}/>

                <h2 className="popup__title">{props.title}</h2>

                {props.children}

                <button className="popup__button">{props.submitText}</button>

            </form>
        </section>

    )
}

export default PopupWithForm;
