import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Home.css';

export default function Home () {
    return (
        <>
            <div className="home-container">
                <div className="left-home-container">
                    <h1>HEMATEC</h1>
                    <div className='responsive-title'>
                        <div className='responsive-home-rectangle'></div>
                        <div className='responsive-home-circle'>
                            <h1>HEMATEC</h1>
                            <hr className='line-title'></hr>
                            <img src='./Logo/lightBlueLogo.png'></img>
                        </div>
                    </div>
                    <p className='home-text-container'>
                        Somos una plataforma diseñada para cuidar tu bienestar de manera personalizada. Aquí podrás consultar y llevar el historial de tu examen de biometría hemática de 25 elementos, recibir recomendaciones específicas y estar al tanto de alertas importantes. Todo en un solo lugar, con la seguridad de que tanto usuarios como administradores gestionan la información de forma eficiente y confiable.
                    </p>
                    <div className='home-line'></div>
                    <div className='home-button-container'>
                        <Button
                            as={Link}
                            to="/login"
                            typeButton={'button-primary'}
                            content={'Empezar'}
                            borderRadius={"var(--default-radius)"}
                        />
                        <Button
                            as={Link}
                            to="/specialists"
                            typeButton={'button-primary'}
                            content={'Nuestros especialistas'}
                            borderRadius={"var(--default-radius)"}
                        />
                    </div>
                </div>
                <div className="right-home-container"></div>
            </div>
            <div className='home-rectangle'></div>
            <div className='home-circle'>
                <img src='./Logo/lightBlueLogo.png'></img>
            </div>
        </>
    )
}