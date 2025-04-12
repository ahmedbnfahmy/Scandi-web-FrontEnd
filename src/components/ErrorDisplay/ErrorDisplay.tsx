import React from 'react';
import './ErrorDisplay.scss';
import { ErrorType, ErrorDetails } from '../../utils/errorHandlers';

interface ErrorDisplayProps {
  errorDetails: ErrorDetails;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errorDetails, 
  onRetry = () => window.location.reload() 
}) => {
  // Choose appropriate UI based on error type
  const getErrorUI = () => {
    switch (errorDetails.type) {
      case ErrorType.CONNECTION:
        return {
          title: 'Connection Error',
          className: 'connection-error',
          description: 'Failed to connect to the server. Please check if it is running.'
        };
        
      case ErrorType.SERVER:
        return {
          title: 'Server Error',
          className: 'server-error',
          description: 'The server encountered an internal error. Please try again later.'
        };
        
      case ErrorType.NOT_FOUND:
        return {
          title: 'Not Found',
          className: 'not-found-error',
          description: 'We couldn\'t find what you were looking for.'
        };
        
      case ErrorType.VALIDATION:
        return {
          title: 'Validation Error',
          className: 'validation-error',
          description: 'Please check your input and try again.'
        };
        
      default:
        return {
          title: 'Error',
          className: 'unknown-error',
          description: 'Something went wrong. Please try again.'
        };
    }
  };
  
  const { title, className, description } = getErrorUI();
  
  return (
    <div className={`error-display ${className}`}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="error-details">
        Error details: {errorDetails.message}
      </p>
      <button onClick={onRetry}>
        Retry
      </button>
    </div>
  );
};

export default ErrorDisplay; 