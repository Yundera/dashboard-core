import { createContext, useContext, ReactNode } from 'react';

interface ErrorReporter {
  captureException: (error: any, options?: { tags?: Record<string, string> }) => void;
  setUser: (user: { email?: string } | null) => void;
}

const defaultReporter: ErrorReporter = {
  captureException: () => {},
  setUser: () => {},
};

const ErrorReportingContext = createContext<ErrorReporter>(defaultReporter);

export const useErrorReporting = () => useContext(ErrorReportingContext);

interface ErrorReportingProviderProps {
  children: ReactNode;
  reporter?: ErrorReporter;
}

export const ErrorReportingProvider = ({ children, reporter }: ErrorReportingProviderProps) => (
  <ErrorReportingContext.Provider value={reporter || defaultReporter}>
    {children}
  </ErrorReportingContext.Provider>
);
