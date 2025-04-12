import React from 'react';
import './ConnectionErrorDisplay.scss';

interface ConnectionErrorProps {
  error: Error | null;
  isServerError: boolean;
}

export const detectErrorType = (err: any) => {
  const isConnectionError = 
    err instanceof Error && 
    (err.message.includes('Failed to fetch') || 
     err.message.includes('Network request failed') ||
     err.message.includes('ERR_CONNECTION_REFUSED'));
  
  const isServerError = 
    err instanceof Error && 
    (err.message.includes('500') || 
     err.message.includes('Internal Server Error'));
     
  return {
    isConnectionError,
    isServerError,
    shouldStopRendering: isConnectionError || isServerError
  };
};

const ConnectionErrorDisplay: React.FC<ConnectionErrorProps> = ({ error, isServerError }) => {
  const errorClassName = isServerError ? 'server-error' : 'connection-error';
  
  return (
    <div className={`connection-error ${errorClassName}`}>
      <h2>
        {isServerError ? 'Server Error' : 'Connection Error'}
      </h2>
      <p>
        {isServerError 
          ? 'The server encountered an internal error. Please try again later.' 
          : 'Failed to connect to the GraphQL server. Please check if the server is running.'}
      </p>
      <p className="error-details">
        Error details: {error?.message}
      </p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
};

export default ConnectionErrorDisplay;