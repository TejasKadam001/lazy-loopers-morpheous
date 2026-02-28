import React from 'react';
import { Html } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';

class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Failed to load 3D model:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center zIndexRange={[100, 0]}>
                    <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-red-500/50 shadow-2xl flex flex-col items-center text-center w-80">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 mb-2">Model Not Found</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Please place your <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-400">male.glb</code> and <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-400">female.glb</code> files inside the <code className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-sky-400">public/models/</code> directory of your project.
                        </p>
                        <p className="text-xs text-slate-500 mb-6">
                            (You may need to create the 'models' folder inside 'public')
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                if (this.props.onRetry) {
                                    this.props.onRetry();
                                }
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Back to Stylized Block
                        </button>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}

export default ModelErrorBoundary;
