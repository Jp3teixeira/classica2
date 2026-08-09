import { Component } from 'react';

/**
 * ErrorBoundary global — apanha erros de runtime em qualquer componente filho
 * e mostra uma mensagem em vez de uma página branca.
 *
 * Os estilos são inline de propósito: um error boundary não pode depender do
 * CSS da aplicação, que pode ser exactamente o que falhou a carregar.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Sem serviço de monitorização: pelo menos deixa rasto na consola para
        // quem estiver a diagnosticar um problema relatado pelo cliente.
        console.error('[Clássica] erro não tratado:', error, info?.componentStack);
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
                    padding: '32px',
                    gap: '12px',
                }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600 }}>
                        Ocorreu um erro inesperado
                    </h1>
                    <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.6)', marginBottom: '12px' }}>
                        Por favor, recarregue a página. Se o problema persistir, contacte-nos
                        através de <a href="mailto:geral@classicaag.pt" style={{ textDecoration: 'underline' }}>geral@classicaag.pt</a>.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.assign('/')}
                        style={{
                            padding: '14px 28px',
                            minHeight: '44px',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            background: 'white',
                            fontSize: '15px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Voltar ao início
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
