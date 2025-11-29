import './Terms.css';
import { Link } from 'react-router-dom'

export default function Terms() {
    return(
        <>
            <div className="terms-page">
                <div className="terms-container">
                    <header className="terms-header">
                    <div className="terms-eyebrow">Hematec · Apoyo orientativo de resultados de biometría hemática de 25 elementos</div>
                    <h1 className="terms-title">Términos y Condiciones de Uso</h1>
                    <div className="terms-title-line">
                        <span className="terms-meta">
                        Última actualización: <span className="terms-highlight">[29/11/2025]</span>
                        </span>
                    </div>
                    </header>

                    <div className="terms-note">
                    <strong>Nota importante:</strong> al utilizar la Plataforma "Hematec" aceptas íntegramente estos Términos y Condiciones. 
                    Los prediagnósticos generados son <span className="terms-highlight">orientativos</span> y no sustituyen una valoración médica profesional.
                    </div>

                    <main className="terms-content">
                    <section className="terms-section" id="objeto">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">1.</span>
                        <span>Objeto</span>
                        </h2>
                        <p>
                        Estos Términos y Condiciones regulan el acceso y uso de la plataforma <span className="terms-highlight">"Hematec"</span>, con domicilio de operación en la Ciudad de México
                        (en lo sucesivo, la <span className="terms-highlight">"Plataforma"</span>).
                        </p>
                        <p>
                        La Plataforma permite a pacientes y profesionales de la salud cargar y analizar resultados
                        de biometría hemática de 25 elementos para generar <span className="terms-highlight">prediagnósticos automatizados
                        de carácter orientativo</span>. Los resultados pueden consultarse posteriormente y formar parte
                        de un historial asociado a cada paciente.
                        </p>
                        <p>
                        <strong>Aviso importante:</strong> los resultados y prediagnósticos generados no sustituyen una consulta
                        médica ni constituyen un diagnóstico definitivo. El usuario reconoce que cualquier decisión clínica
                        corresponde exclusivamente a un profesional de la salud.
                        </p>
                    </section>
                    <section className="terms-section" id="definiciones">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">2.</span>
                        <span>Definiciones</span>
                        </h2>
                        <ul className="terms-list">
                        <li>
                            <span className="terms-highlight">Datos Personales Sensibles:</span> datos de salud, biométricos y aquellos cuya utilización indebida pueda dar origen a discriminación,
                            conforme al artículo 3, fracción VI de la Ley Federal de Protección de Datos Personales en Posesión
                            de los Particulares (<span className="terms-chip">LFPDPPP</span>).
                        </li>
                        <li>
                            <span className="terms-highlight">Titular:</span> persona física a quien corresponden los datos personales.
                        </li>
                        <li>
                            <span className="terms-highlight">Aviso de Privacidad:</span> documento disponible en <span className="terms-highlight">[<Link to="/privacy">Aviso de privacidad</Link>]</span>, que describe a detalle el tratamiento de los datos personales.
                        </li>
                        <li>
                            <span className="terms-highlight">Profesional de la salud/Doctor:</span> usuario con perfil verificado que utiliza la Plataforma con fines de consulta clínica.
                        </li>
                        </ul>
                    </section>

                    <section className="terms-section" id="elegibilidad">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">3.</span>
                        <span>Elegibilidad y cuentas</span>
                        </h2>
                        <p>Para utilizar la Plataforma, el usuario deberá:</p>
                        <ul className="terms-list">
                        <li>Ser mayor de edad y encontrarse dentro del rango de 25 a 44 años.</li>
                        <li>Registrar una cuenta proporcionando datos veraces, completos y actualizados.</li>
                        <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                        </ul>
                        <p>
                        Hematec se reserva el derecho de verificar la identidad de los usuarios y, en el caso de perfiles
                        de profesionales de la salud, la <span className="terms-highlight">cédula profesional</span> y demás documentos que resulten pertinentes.
                        </p>
                    </section>

                    <section className="terms-section" id="servicios">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">4.</span>
                        <span>Servicios</span>
                        </h2>
                        <p>La Plataforma puede ofrecer, entre otros, los siguientes servicios:</p>
                        <ul className="terms-list">
                        <li>Carga de archivos PDF de laboratorio y/o captura manual de parámetros de biometría hemática.</li>
                        <li>Procesamiento mediante OCR y estandarización de valores.</li>
                        <li>Generación de un prediagnóstico automático orientativo.</li>
                        <li>Historial personal para pacientes y tablero de visualización para médicos.</li>
                        <li>Notificaciones sobre el estado del análisis.</li>
                        </ul>
                    </section>

                    <section className="terms-section" id="uso">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">5.</span>
                        <span>Uso permitido y contenido prohibido</span>
                        </h2>
                        <p>
                        El usuario se compromete a utilizar la Plataforma únicamente para los fines descritos en estos Términos.
                        Queda estrictamente prohibido:
                        </p>
                        <ul className="terms-list">
                        <li>Cargar información falsa, inexacta o que no corresponda al Titular.</li>
                        <li>Subir información de terceros sin contar con su autorización.</li>
                        <li>Introducir malware, código malicioso o contenido ilegal.</li>
                        <li>Utilizar la Plataforma con fines distintos a los permitidos o contrarios a la ley.</li>
                        </ul>
                        <p>
                        Hematec podrá suspender o cancelar cuentas cuando detecte uso indebido, violaciones a estos Términos
                        o riesgos de seguridad.
                        </p>
                    </section>

                    <section className="terms-section" id="prediagnostico">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">6.</span>
                        <span>Carácter informativo del prediagnóstico</span>
                        </h2>
                        <p>
                        El algoritmo de la Plataforma entrega un prediagnóstico orientativo con base en parámetros y rangos
                        de referencia. Dicho prediagnóstico:
                        </p>
                        <ul className="terms-list">
                        <li>No evalúa comorbilidades, antecedentes clínicos ni contexto completo del paciente.</li>
                        <li>No sustituye criterios clínicos, lineamientos ni guías de práctica clínica vigentes.</li>
                        </ul>
                        <p>
                        El usuario entiende y acepta que siempre debe consultar a su médico o profesional de la salud
                        antes de tomar decisiones relacionadas con su salud.
                        </p>
                    </section>

                    <section className="terms-section" id="datos">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">7.</span>
                        <span>Tratamiento de datos personales (LFPDPPP)</span>
                        </h2>
                        <p>
                        El tratamiento de los datos personales se rige por nuestro Aviso de Privacidad
                        disponible en <span className="terms-highlight">[URL]</span>. A continuación se presenta un resumen:
                        </p>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.1</span>
                        <span>Responsable y datos que tratamos</span>
                        </h3>
                        <p>
                        Hematec es el responsable del tratamiento de los datos personales. Tratamos, de manera enunciativa
                        mas no limitativa:
                        </p>
                        <ul className="terms-list">
                        <li>Datos de identificación (nombre, correo electrónico).</li>
                        <li>
                            Datos de salud (resultados de laboratorio, sexo, edad, métricas derivadas de la biometría hemática).
                        </li>
                        <li>Metadatos técnicos asociados al uso de la Plataforma.</li>
                        </ul>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.2</span>
                        <span>Finalidades</span>
                        </h3>
                        <p className="terms-highlight">Finalidades primarias (necesarias):</p>
                        <ul className="terms-list">
                        <li>Registro y autenticación de usuarios.</li>
                        <li>Procesamiento de estudios y generación de prediagnósticos.</li>
                        <li>Visualización de historial clínico dentro de la Plataforma.</li>
                        <li>Comunicación de hallazgos y resultados relacionados con los análisis.</li>
                        <li>Atención y soporte técnico.</li>
                        </ul>
                        <p className="terms-highlight">Finalidades secundarias (opcionales):</p>
                        <ul className="terms-list">
                        <li>Analítica agregada y mejora de modelos y algoritmos.</li>
                        <li>Envío de avisos no críticos y comunicaciones informativas.</li>
                        </ul>
                        <p>
                        El Titular podrá optar por no participar en finalidades secundarias conforme a lo indicado en el Aviso de Privacidad.
                        </p>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.3</span>
                        <span>Base de licitud y consentimiento</span>
                        </h3>
                        <ul className="terms-list">
                        <li>Consentimiento expreso del Titular para el tratamiento de datos personales sensibles (art. 9 LFPDPPP).</li>
                        <li>Interés vital del Titular en situaciones de urgencia médica, cuando resulte aplicable.</li>
                        <li>Para menores de edad, será necesario el consentimiento del tutor o representante legal.</li>
                        </ul>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.4</span>
                        <span>Transferencias y encargados</span>
                        </h3>
                        <p>Podemos transferir datos personales a:</p>
                        <ul className="terms-list">
                        <li>
                            Encargados que prestan servicios de cómputo en la nube y mensajería, bajo contratos que exigen
                            confidencialidad, medidas de seguridad y tratamiento conforme a la LFPDPPP.
                        </li>
                        <li>
                            Profesionales de la salud asignados por el propio usuario o por la entidad clínica con la que
                            el usuario tenga relación.
                        </li>
                        </ul>
                        <p>
                        No se realizarán transferencias que requieran consentimiento del Titular sin recabarlo previamente.
                        </p>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.5</span>
                        <span>Conservación</span>
                        </h3>
                        <p>
                        Conservamos los datos personales durante el tiempo necesario para cumplir con las finalidades señaladas,
                        las obligaciones legales aplicables y la defensa de derechos. Para registros de carácter clínico,
                        se aplicarán los plazos establecidos en las NOM y disposiciones sanitarias vigentes, o el plazo mayor
                        que exija la ley. Al concluir dichos plazos, se aplicarán procesos de supresión o anonimización segura.
                        </p>

                        <h3 className="terms-section-title">
                        <span className="terms-section-number">7.6</span>
                        <span>Seguridad</span>
                        </h3>
                        <p>
                        Implementamos medidas administrativas, técnicas y físicas proporcionales al riesgo, conforme al
                        artículo 19 de la LFPDPPP y su Reglamento, incluyendo: cifrado en tránsito y en reposo, controles de acceso,
                        segregación de ambientes, bitácoras, pruebas de seguridad y gestión de incidentes.
                        </p>
                        <p>
                        Cualquier incidente de seguridad relevante será notificado conforme a los lineamientos del INAI y a
                        las mejores prácticas aplicables.
                        </p>
                    </section>

                    <section className="terms-section" id="infra">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">8.</span>
                        <span>Subprocesamiento y ubicación de infraestructura</span>
                        </h2>
                        <p>
                        La Plataforma opera sobre servicios de <span className="terms-highlight">Amazon Web Services (AWS)</span>, que funge como encargado
                        del tratamiento de datos personales. Entre otros, podemos utilizar servicios como S3, DynamoDB, Lambda,
                        Textract y SageMaker para el cumplimiento de las finalidades primarias.
                        </p>
                        <p>
                        Los detalles específicos y cambios materiales en el uso de subprocesadores serán comunicados a través
                        del Aviso de Privacidad o por los medios que Hematec considere razonables.
                        </p>
                    </section>

                    <section className="terms-section" id="interoperabilidad">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">9.</span>
                        <span>Interoperabilidad con profesionales y clínicas</span>
                        </h2>
                        <p>
                        Si el Titular decide vincular su cuenta con un médico o entidad clínica, autoriza a Hematec a compartir
                        sus resultados y estudios con dicho profesional o institución.
                        </p>
                        <p>
                        El profesional de la salud se obliga a guardar confidencialidad y a cumplir con las Normas Oficiales
                        Mexicanas y demás normativa sanitaria aplicable en el manejo de la información.
                        </p>
                    </section>

                    <section className="terms-section" id="propiedad">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">10.</span>
                        <span>Propiedad intelectual</span>
                        </h2>
                        <p>
                        El software, interfaces, diseño, modelos de análisis y demás contenidos de la Plataforma son propiedad
                        de Hematec o de sus respectivos licenciantes y se encuentran protegidos por la legislación aplicable.
                        </p>
                        <p>
                        El usuario conserva la titularidad de sus documentos y datos personales, pero otorga a Hematec
                        una licencia limitada para procesarlos con el fin de prestar los servicios descritos en estos Términos
                        y en el Aviso de Privacidad.
                        </p>
                    </section>

                    <section className="terms-section" id="disponibilidad">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">11.</span>
                        <span>Disponibilidad y cambios del servicio</span>
                        </h2>
                        <p>
                        La Plataforma se ofrece "tal cual" y "según disponibilidad". Hematec podrá actualizar funcionalidades,
                        realizar labores de mantenimiento, suspender temporalmente el servicio o modificar estos Términos
                        cuando resulte necesario.
                        </p>
                        <p>
                        En caso de cambios materiales, se notificará a los usuarios por medios razonables, incluyendo avisos
                        dentro de la propia Plataforma o por correo electrónico.
                        </p>
                    </section>

                    <section className="terms-section" id="responsabilidad">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">12.</span>
                        <span>Responsabilidad</span>
                        </h2>
                        <p>
                        En la medida permitida por la ley, Hematec no será responsable por:
                        </p>
                        <ul className="terms-list">
                        <li>Decisiones clínicas tomadas sin una valoración médica profesional.</li>
                        <li>Daños indirectos, consecuenciales o lucro cesante.</li>
                        <li>Fallas atribuibles a terceros, proveedores externos o casos fortuitos y de fuerza mayor.</li>
                        </ul>
                        <p>
                        En su caso, la responsabilidad total de Hematec frente al usuario quedará limitada al monto
                        efectivamente pagado por el usuario por el uso de la Plataforma en los <span className="terms-highlight">[x]</span> meses
                        previos al evento que dé origen a la reclamación.
                        </p>
                    </section>

                    <section className="terms-section" id="terminacion">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">13.</span>
                        <span>Terminación</span>
                        </h2>
                        <p>
                        El usuario podrá cancelar su cuenta en cualquier momento mediante los mecanismos habilitados
                        en la Plataforma o a través de los medios de contacto indicados en el Aviso de Privacidad.
                        </p>
                        <p>
                        Hematec podrá suspender o terminar el acceso del usuario en caso de incumplimiento a estos Términos
                        o cuando identifique riesgos de seguridad. A la terminación, se procederá conforme a lo indicado
                        en la sección de Conservación y en el Aviso de Privacidad.
                        </p>
                    </section>

                    <section className="terms-section" id="ley">
                        <h2 className="terms-section-title">
                        <span className="terms-section-number">14.</span>
                        <span>Ley aplicable y jurisdicción</span>
                        </h2>
                        <p>
                        Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para la interpretación
                        y cumplimiento de los mismos, las partes se someten a la jurisdicción de los tribunales competentes
                        de la Ciudad de México, renunciando expresamente a cualquier otro fuero que pudiera corresponderles
                        por razón de su domicilio presente o futuro.
                        </p>
                    </section>
                    </main>
                </div>
                </div>
        </>
    );
}