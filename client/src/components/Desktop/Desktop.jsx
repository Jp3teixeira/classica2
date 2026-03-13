import { memo } from 'react';

const Desktop = memo(function Desktop() {
    return (
        <main className="desktop">
            <img
                src="/imagens/Logos/classica2.png"
                alt="Clássica Artes Gráficas"
                className="desktop-logo animate-fadeIn"
                draggable={false}
            />
        </main>
    );
});

export default Desktop;
