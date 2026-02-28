import { Component, type ReactNode } from 'react';

/**
 * ErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * This helps us surface rendering problems that might be silently swallowing UI.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // You can also log the error to an external service here.
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
                    <p className="text-lg font-bold">
                        😱 땡칠이가 페이지 로드 중 오류를 발견했어요! 콘솔을 확인해 주세요.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
