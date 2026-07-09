import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (<div className="min-h-screen flex items-center justify-center" style={{ background: '#050816' }}>
          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md max-w-md mx-4">
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">{this.state.error?.message ?? 'An unexpected error occurred.'}</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, #4F8BFF, #00E5FF)' }}>
              Reload App
            </button>
          </div>
        </div>);
        }
        return this.props.children;
    }
}
