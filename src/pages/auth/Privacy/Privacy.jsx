import './Privacy.css';
import { Link } from 'react-router-dom'

export default function Privacy() {
    return(
        <>
            <div className="privacy-page">
                <div className="privacy-container">
                    <header className="privacy-header">
                    <div className="privacy-eyebrow">
                        Hematec · Aviso de privacidad para usuarios de la plataforma
                    </div>
                    <h1 className="privacy-title">Aviso de Privacidad Integral</h1>
                    <div className="privacy-title-line">
                        <span className="privacy-meta">
                        Última actualización: <span className="privacy-highlight">[29/11/2025]</span>
                        </span>
                    </div>
                    </header>

                    <div className="privacy-note">
                    <strong>Importante:</strong> este Aviso de Privacidad explica cómo Hematec
                    recopila, utiliza, protege y, en su caso, comparte tus datos personales y datos personales
                    sensibles relacionados con tus estudios de biometría hemática.
                    </div>

                    <main className="privacy-content">
                    <section className="privacy-section" id="identidad">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">1.</span>
                        <span>Identidad y domicilio del responsable</span>
                        </h2>
                        <p>
                        Para efectos de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares
                        y demás normativa aplicable (<span className="privacy-chip">LFPDPPP</span>), el responsable del tratamiento
                        de tus datos personales es <span className="privacy-highlight">Hematec</span>, con domicilio de operación
                        en la Ciudad de México.
                        </p>
                        <p>
                        En este documento nos referimos a "Hematec" como <span className="privacy-highlight">la Plataforma</span> o <span className="privacy-highlight">el Responsable</span>.
                        </p>
                    </section>

                    <section className="privacy-section" id="datos">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">2.</span>
                        <span>Datos personales que recabamos</span>
                        </h2>
                        <p>Podemos recabar las siguientes categorías de datos personales:</p>

                        <p className="privacy-highlight">a) Datos de identificación y contacto</p>
                        <ul className="privacy-list">
                        <li>Nombre y apellidos.</li>
                        <li>Correo electrónico.</li>
                        <li>Edad o rango de edad.</li>
                        <li>Sexo.</li>
                        </ul>

                        <p className="privacy-highlight">b) Datos de salud y resultados de estudios</p>
                        <ul className="privacy-list">
                        <li>
                            Resultados de biometría hemática de 25 elementos y otros parámetros que se capturen
                            de forma manual o mediante carga de archivos PDF.
                        </li>
                        <li>
                            Métricas derivadas generadas por la Plataforma para el análisis y prediagnóstico.
                        </li>
                        </ul>

                        <p className="privacy-highlight">c) Metadatos y datos de uso</p>
                        <ul className="privacy-list">
                        <li>Información técnica relativa al uso de la Plataforma (fecha y hora de acceso, dispositivo, navegador).</li>
                        <li>Registros de actividad relacionados con carga de archivos, consultas de historial y uso de funciones.</li>
                        </ul>

                        <p>
                        Cuando se trate de <span className="privacy-highlight">datos personales sensibles</span> (por ejemplo, información específica de salud), estos serán tratados bajo medidas de seguridad reforzadas
                        y con tu consentimiento expreso, de conformidad con la LFPDPPP.
                        </p>
                    </section>

                    <section className="privacy-section" id="finalidades">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">3.</span>
                        <span>Finalidades del tratamiento</span>
                        </h2>
                        <p>
                        Tus datos personales serán utilizados para las siguientes finalidades:
                        </p>

                        <p className="privacy-highlight">3.1 Finalidades primarias (necesarias para el servicio)</p>
                        <ul className="privacy-list">
                        <li>Registrar y administrar tu cuenta de usuario en la Plataforma.</li>
                        <li>Permitir la carga de estudios de laboratorio (PDF) y/o captura manual de parámetros.</li>
                        <li>Procesar los resultados de biometría hemática y generar un prediagnóstico automatizado orientativo.</li>
                        <li>Mostrar tu historial de resultados y gráficos dentro de la Plataforma.</li>
                        <li>Facilitar la visualización de resultados a profesionales de la salud autorizados por ti o por tu clínica.</li>
                        <li>Enviar notificaciones relacionadas con el estado del análisis o hallazgos relevantes.</li>
                        <li>Proporcionar atención y soporte técnico.</li>
                        </ul>

                        <p className="privacy-highlight">3.2 Finalidades secundarias (opcionales)</p>
                        <ul className="privacy-list">
                        <li>Realizar análisis estadísticos y analítica agregada para mejorar la Plataforma y los modelos de análisis.</li>
                        <li>Desarrollar y entrenar algoritmos de apoyo orientativo basados en datos anonimizados o agregados.</li>
                        <li>Enviar comunicaciones informativas o avisos no críticos sobre actualizaciones del servicio.</li>
                        </ul>

                        <p>
                        En caso de que no desees que tus datos se utilicen para finalidades secundarias, podrás
                        manifestarlo en cualquier momento a través de los medios de contacto indicados en este Aviso,
                        sin que ello afecte la prestación de las finalidades primarias.
                        </p>
                    </section>

                    <section className="privacy-section" id="licitud">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">4.</span>
                        <span>Base de licitud y consentimiento</span>
                        </h2>
                        <p>
                        El tratamiento de tus datos personales se realiza con fundamento en las siguientes bases de licitud:
                        </p>
                        <ul className="privacy-list">
                        <li>
                            <span className="privacy-highlight">Consentimiento expreso:</span> cuando aceptas este Aviso de Privacidad y los Términos de Uso de la Plataforma, así como cuando
                            proporcionas datos de salud para su análisis.
                        </li>
                        <li>
                            <span className="privacy-highlight">Tratamiento de datos sensibles:</span> para datos personales sensibles de salud, recabamos tu consentimiento expreso por medios electrónicos
                            o equivalentes, en términos del artículo 9 de la LFPDPPP.
                        </li>
                        <li>
                            <span className="privacy-highlight">Interés vital del Titular:</span> en situaciones de urgencia médica en las que resulte necesaria la gestión de la información para proteger
                            tu salud o integridad, cuando corresponda.
                        </li>
                        <li>
                            <span className="privacy-highlight">Alcance respecto de menores de edad:</span> la Plataforma está dirigida a personas adultas. No se permite el registro directo de menores de edad.
                            En caso excepcional de que un profesional de la salud o tutor cargue información de una persona menor de edad,
                            éste manifiesta contar con las autorizaciones y consentimientos necesarios conforme a la legislación aplicable.
                        </li>
                        </ul>
                    </section>

                    <section className="privacy-section" id="transferencias">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">5.</span>
                        <span>Transferencias de datos personales</span>
                        </h2>
                        <p>
                        Tus datos personales podrán ser compartidos con las siguientes personas físicas o morales, en los siguientes casos:
                        </p>
                        <ul className="privacy-list">
                        <li>
                            <span className="privacy-highlight">Encargados de servicios en la nube y mensajería:</span> proveedores que alojan la infraestructura tecnológica de la Plataforma o que envían correos/notificaciones,
                            bajo contratos de encargo que exigen confidencialidad, medidas de seguridad y tratamiento conforme a la LFPDPPP.
                        </li>
                        <li>
                            <span className="privacy-highlight">Profesionales de la salud y clínicas vinculadas:</span> médicos o instituciones que tú vincules explícitamente a tu cuenta o con las que mantengas una relación clínica,
                            para que puedan consultar tus resultados dentro de la Plataforma.
                        </li>
                        </ul>
                        <p>
                        No realizaremos transferencias que requieran tu consentimiento, salvo aquellas que sean necesarias
                        para mantener la relación jurídica, cumplir con obligaciones legales o las que se encuentren exceptuadas
                        en la LFPDPPP. En caso contrario, te solicitaremos el consentimiento correspondiente.
                        </p>
                    </section>

                    <section className="privacy-section" id="seguridad">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">6.</span>
                        <span>Medidas de seguridad</span>
                        </h2>
                        <p>
                        Implementamos medidas de seguridad <span className="privacy-highlight">administrativas, técnicas y físicas</span> para proteger tus datos personales contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado.
                        </p>
                        <p>Entre otras, incluimos:</p>
                        <ul className="privacy-list">
                        <li>Cifrado de información en tránsito y, cuando aplique, en reposo.</li>
                        <li>Controles de acceso basados en roles y autenticación de usuarios.</li>
                        <li>Segregación de ambientes de desarrollo, pruebas y producción.</li>
                        <li>Bitácoras y registros de actividad relevantes.</li>
                        <li>Pruebas de seguridad y monitoreo de incidentes.</li>
                        </ul>
                        <p>
                        En caso de un incidente de seguridad que afecte de forma significativa tus datos personales, Hematec
                        tomará las medidas correctivas necesarias y, cuando corresponda, te notificará conforme a los lineamientos
                        del INAI y las mejores prácticas aplicables.
                        </p>
                    </section>

                    <section className="privacy-section" id="infraestructura">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">7.</span>
                        <span>Subprocesamiento e infraestructura tecnológica</span>
                        </h2>
                        <p>
                        La Plataforma opera sobre servicios de <span className="privacy-highlight">Amazon Web Services (AWS)</span>,
                        que actúa como encargado del tratamiento de datos personales. Podemos utilizar, entre otros, servicios como:
                        </p>
                        <ul className="privacy-list">
                        <li>Amazon S3 (almacenamiento de archivos).</li>
                        <li>Amazon DynamoDB (base de datos).</li>
                        <li>AWS Lambda (funciones de procesamiento).</li>
                        <li>Amazon Textract (lectura de PDFs).</li>
                        <li>Amazon SageMaker (modelos de análisis y prediagnóstico).</li>
                        </ul>
                        <p>
                        Cualquier cambio material en el uso de subprocesadores será comunicado a través de este Aviso de Privacidad
                        y/o por los medios que Hematec considere razonables.
                        </p>
                    </section>

                    <section className="privacy-section" id="arco">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">8.</span>
                        <span>Derechos ARCO y otros derechos de privacidad</span>
                        </h2>
                        <p>
                        Como Titular de los datos personales, puedes ejercer en cualquier momento tus derechos <span className="privacy-highlight">ARCO</span>:
                        </p>
                        <ul className="privacy-list">
                        <li><span className="privacy-highlight">Acceso:</span> conocer qué datos personales tenemos de ti y cómo los utilizamos.</li>
                        <li><span className="privacy-highlight">Rectificación:</span> solicitar la corrección de tus datos en caso de ser inexactos o incompletos.</li>
                        <li><span className="privacy-highlight">Cancelación:</span> solicitar la eliminación de tus datos cuando sea procedente.</li>
                        <li><span className="privacy-highlight">Oposición:</span> oponerte al tratamiento de tus datos para fines específicos.</li>
                        </ul>
                        <p>
                        Asimismo, podrás revocar tu consentimiento para el tratamiento de tus datos personales, en la medida
                        que no sea indispensable para cumplir obligaciones legales o para la prestación del servicio que tengas activo.
                        </p>
                        <p>
                        Para ejercer tus derechos ARCO o revocar tu consentimiento, podrás presentar una solicitud a través de los
                        medios de contacto indicados en la sección de <span className="privacy-highlight">Contacto</span>.
                        La solicitud deberá contener, al menos: nombre completo, medio de contacto para responderte, descripción clara
                        del derecho que deseas ejercer y, en su caso, documentación que acredite tu identidad o representación.
                        </p>
                    </section>

                    <section className="privacy-section" id="cookies">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">9.</span>
                        <span>Uso de cookies y tecnologías similares</span>
                        </h2>
                        <p>
                        La Plataforma puede utilizar cookies y tecnologías similares para:
                        </p>
                        <ul className="privacy-list">
                        <li>Recordar tu sesión y mantenerte autenticado.</li>
                        <li>Mejorar la experiencia de uso y el rendimiento de la Plataforma.</li>
                        <li>
                            Obtener métricas de uso agregadas que nos ayuden a entender qué secciones se utilizan con mayor frecuencia.
                        </li>
                        </ul>
                        <p>
                        Puedes configurar tu navegador para bloquear o eliminar cookies; sin embargo, algunas funciones de la Plataforma
                        podrían no operar correctamente si las deshabilitas.
                        </p>
                    </section>

                    <section className="privacy-section" id="conservacion">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">10.</span>
                        <span>Plazo de conservación de los datos</span>
                        </h2>
                        <p>
                        Conservaremos tus datos personales durante el tiempo que sea necesario para:
                        </p>
                        <ul className="privacy-list">
                        <li>Cumplir con las finalidades primarias descritas en este Aviso.</li>
                        <li>Atender obligaciones legales, regulatorias o sanitarias aplicables.</li>
                        <li>Atender posibles responsabilidades derivadas de la prestación del servicio.</li>
                        </ul>
                        <p>
                        En el caso de información relacionada con registros clínicos, se aplicarán los plazos establecidos
                        en las Normas Oficiales Mexicanas y demás disposiciones sanitarias vigentes, o el plazo mayor que exija la ley.
                        Al concluir dichos plazos, se llevarán a cabo procesos de supresión o anonimización segura.
                        </p>
                    </section>

                    <section className="privacy-section" id="cambios">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">11.</span>
                        <span>Cambios al Aviso de Privacidad</span>
                        </h2>
                        <p>
                        Hematec podrá modificar o actualizar este Aviso de Privacidad en cualquier momento, para reflejar cambios
                        en la Plataforma, en la normativa aplicable o en las finalidades del tratamiento.
                        </p>
                        <p>
                        Cuando se realicen cambios materiales, se te informará a través de la propia Plataforma y/o por los medios
                        de contacto que hayas proporcionado. La versión vigente se encontrará siempre disponible en <span className="privacy-highlight">[<Link to="/privacy">Aviso de privacidad</Link>]</span>.
                        </p>
                    </section>

                    <section className="privacy-section" id="contacto">
                        <h2 className="privacy-section-title">
                        <span className="privacy-section-number">12.</span>
                        <span>Contacto y dudas sobre privacidad</span>
                        </h2>
                        <p>
                        Si tienes dudas sobre este Aviso de Privacidad, sobre el uso de tus datos personales o deseas ejercer tus derechos ARCO,
                        puedes contactarnos a través de:
                        </p>
                        <div className="privacy-contact-box">
                        <p>
                            <span className="privacy-highlight">Correo electrónico:</span> privacidad@hematec.mx
                        </p>
                        <p>
                            <span className="privacy-highlight">Asunto sugerido:</span> "Ejercicio de derechos ARCO – Hematec".
                        </p>
                        <p>
                            En tu mensaje incluye tu nombre completo, una descripción clara de tu solicitud y un medio de contacto
                            para darte seguimiento.
                        </p>
                        </div>
                    </section>
                    </main>
                </div>
            </div>
        </>
    );
}