import { Component } from 'react';

/**
 * ErrorBoundary global — apanha erros de runtime em qualquer componente filho
 * e mostra uma mensagem em vez de uma página branca.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                    background: '#f5f5f7',
                    color: '#1d1d1f',
                    textAlign: 'center',
                    padding: '32px'
                }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
                        Ocorreu um erro inesperado
                    </h1>
                    <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.5)', marginBottom: '24px' }}>
                        Por favor, recarregue a página.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            background: 'white',
                            fontSize: '15px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
