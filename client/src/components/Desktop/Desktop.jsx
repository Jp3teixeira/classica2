import { memo } from 'react';
import logo from '../../assets/classica2.png';

const Desktop = memo(function Desktop() {
    return (
        <main className="desktop">
            <img
                src={logo}
                alt="Clássica Artes Gráficas"
                className="desktop-logo animate-fadeIn"
                draggable={false}
            />
        </main>
    );
});

export default Desktop;
