import picFail from '../images/fail.svg';
import picSuccess from '../images/success.svg';

function InfoTooltip(props) {
    return (
        <section className={`popup popup_type_${props.name} ${props.isOpen && 'popup_opened'}`}>

            <div className="popup__form">
                <button type="button" className="popup__close" onClick={props.onClose}/>

                {props.name === 'fail' && <img className="popup__pic" src={picFail} alt={props.name}/>}
                {props.name === 'success' && <img className="popup__pic" src={picSuccess} alt={props.name}/>}

                <h2 className="popup__title">{props.title}</h2>

            </div>
        </section>
    )
}

export default InfoTooltip;
