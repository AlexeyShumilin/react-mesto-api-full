function ImagePopup(props) {

    const {card, onClose} = props;

    return (

        <section className={`popup popup_type_image ${card.isOpenCard && 'popup_opened'}`}>
            <figure className="popup__image-box">
                <button type="button" className="popup__close" onClick={onClose}/>
                <img className="popup__image" src={card.link} alt={card.name}/>
                <figcaption className="popup__caption">{card.name}</figcaption>
            </figure>
        </section>
    )
}

export default ImagePopup;
