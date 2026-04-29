import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center text-white bg-black">
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-lg">
            <h2 className="text-xl font-bold text-red-500 mb-2">Une erreur est survenue</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {this.state.error?.message || "Une erreur inattendue s'est produite dans ce composant."}
            </p>
            <button
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-white"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
