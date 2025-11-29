import './Popup.css'
import Button from '../../components/Button/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Popup ({width, icon, type, tittle, message, showButton = false, buttonProps = {}, extraButton = false, extraButtonProps = {}, onClose, isVisible, closable = true}) {
    const colorMap = {
        success: "green",
        error: "var(--color-danger)",
        warning: "var(--color-warning)",
        info: "var(--color-primary)",
        action: "var(--light-blue)",
    };

    const messageMap = {
        register: "Tu cuenta ha sido creada correctamente.\n\nAhora puedes iniciar sesión con tus credenciales para acceder al sistema.",
        already_registered: "Ya existe una cuenta asociada a este correo electrónico.\n\nPor favor, intenta iniciar sesión o utiliza la opción de recuperación de contraseña si no recuerdas tus datos.",
        incorrect_password: "La contraseña ingresada es incorrecta.\n\nPor favor, verifique sus datos y vuelva a intentarlo.",
        unregistered_user: "El usuario ingresado no está registrado en el sistema.\n\nPor favor, regístrese para poder acceder a la aplicación.",
        mail_sent: "Te hemos enviado un correo con un enlace para restablecer tu contraseña.\n\nRevisa tu bandeja de entrada o la carpeta de spam y sigue las instrucciones para continuar.",
        password_reset: "Tu contraseña ha sido actualizada correctamente.\n\nAhora puedes iniciar sesión con tus nuevas credenciales.",
        no_history: "Para generar tu historial clínico, primero necesitas completar un prediagnóstico.\n\nUna vez realizado, podrás consultar y visualizar tus resultados aquí.",
        error_reading_file: "El archivo que intentaste subir no pudo ser leído correctamente.\n\nVerifica que el formato sea válido y vuelve a intentarlo, o bien ingresa los datos de forma manual.",
        generating_prediagnosis: "Estamos analizando la información que proporcionaste. Este proceso puede tardar unos momentos.\n\nPor favor, espera mientras generamos tus resultados.",
        prediagnosis_successfully: "Tu prediagnóstico se ha realizado correctamente.\n\nYa puedes consultar los resultados y se ha guardado automáticamente en tu historial clínico.",
        prediagnosis_error: "Los datos ingresados no fueron suficientes para generar el prediagnóstico.\n\nPor favor, revísalos e intenta nuevamente. Lamentamos los inconvenientes.",
        unchanged: "No se realizaron cambios en las recomendaciones. ¿Quieres que aun así el paciente sea notificado de que su caso fue revisado?",
        saved_changes: "Las recomendaciones fueron actualizadas correctamente. El paciente ha sido notificado de los cambios en su evaluación.",
        error_saving_changes: "Ocurrió un error al intentar guardar los cambios en las recomendaciones y no se pudo notificar al paciente. Por favor, intenta nuevamente.\n\nSi el problema persiste, contacta al administrador del sistema.",
        doctor_registration: "El perfil del médico especialista ha sido creado correctamente.\n\nYa puede iniciar sesión y comenzar a visualizar los pacientes en estado crítico.",
        doctor_registration_error: "No fue posible completar el registro.\n\nEs posible que el médico ya se encuentre registrado o que haya ocurrido un error inesperado. Verifica los datos ingresados e intenta nuevamente.",
        delete_user_warning: "Si eliminas este usuario, se perderá todo su historial y registros asociados de forma permanente.\n\nSi no deseas eliminarlo por completo, puedes optar por desactivarlo temporalmente.",
        deleted_user: "El usuario ha sido eliminado del sistema de forma exitosa.",
        unsaved_changes: "Has realizado cambios en la información del paciente.\n\nSi sales ahora, se perderán todos los cambios no guardados. Puedes guardar los cambios antes de continuar o confirmar que deseas salir sin guardarlos.",
        updated_patient_information: "La información del paciente ha sido actualizada y los cambios se han guardado correctamente.",
        updated_patient_information_error: "No se pudieron guardar los cambios realizados. Por favor, revisa los datos modificados e intenta nuevamente.\n\nSi el problema persiste, contacta al desarrollador para revisar el incidente.",
        unsaved_patient_changes: "Has realizado cambios en la información del paciente.\n\nSi sales ahora, se perderán todos los cambios no guardados. Puedes guardar los cambios antes de continuar o confirmar que deseas salir sin guardarlos.",
        uploading_prediagnosis: "Estamos realizando tu prediagnóstico con la información del estudio.\n\nEn unos momentos te mostraremos los resultados y se guardarán automáticamente en tu historial clínico."
    };

    const iconColor = colorMap[type] || "black";
    const widthCard = width || "45rem";
    const finalMessage = messageMap[message] || "";

    if (!isVisible) return null;

    return (
        <>
            <div
                className={`popup-container-background ${isVisible ? "show" : "hide"}`}
                onClick={closable ? onClose : undefined}
            >
                <div
                    className="popup-container"
                    style={{ width: widthCard }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="header-popup">
                    {closable && (
                        <div className="popup-close-icon-container">
                        <button
                            type="button"
                            className="popup-close-icon"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            X
                        </button>
                        </div>
                    )}
                        <div className='popup-body'>
                            <div className='logo-container' style={{ paddingTop: closable ? "0" : "2rem"}}>
                                <FontAwesomeIcon icon={icon} style={{ color: iconColor}}/>
                            </div>
                            <div className='popup-title'>
                                <h2 className='glossary-title'>{tittle}</h2>
                            </div>
                            <div className='popup-content' style={{ whiteSpace: "pre-line" }}>
                                <div className='popup-text'>
                                    {finalMessage}
                                </div>
                                <div className='popup-button-container'>
                                    {showButton && (
                                        <div className="popup-button">
                                            <Button {...buttonProps} />
                                        </div>
                                    )}
                                    {extraButton && (
                                        <div className="popup-button">
                                            <Button {...extraButtonProps} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}