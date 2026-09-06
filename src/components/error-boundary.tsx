"use client";

import React from "react";

type Props = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

type State = { hasError: boolean };

/**
 * 3D sahnalar (WebGL yo'q, HDR yuklanmadi, drayver xatosi) butun sahifani
 * yiqitmasligi uchun. Xato bo'lsa fallback ko'rsatiladi, qolgan sahifa ishlayveradi.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
