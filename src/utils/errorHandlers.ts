// Define error types enum for better type checking
export enum ErrorType {
    CONNECTION = 'connection',
    SERVER = 'server',
    NOT_FOUND = 'not_found',
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    DATA_FORMAT = 'data_format',
    TIMEOUT = 'timeout',
    UNKNOWN = 'unknown'
  }
  
  // Error details interface with standardized structure
  export interface ErrorDetails {
    type: ErrorType;
    message: string;
    shouldStopRendering: boolean;
    originalError?: any;
    statusCode?: number;
    retryable?: boolean;
  }
  
  /**
   * Analyzes any caught error and returns standardized error details
   * @param err The caught error to analyze
   * @returns Structured error details with consistent properties
   */
  export const analyzeError = (err: any): ErrorDetails => {
    // Connection errors
    if (isConnectionError(err)) {
      return {
        type: ErrorType.CONNECTION,
        message: 'Failed to connect to the GraphQL server. Please check if the server is running.',
        shouldStopRendering: true,
        originalError: err,
        retryable: true
      };
    }
    
    // Server errors (5xx)
    if (isServerError(err)) {
      return {
        type: ErrorType.SERVER,
        message: 'The server encountered an internal error. Please try again later.',
        shouldStopRendering: true,
        originalError: err,
        statusCode: extractStatusCode(err),
        retryable: true
      };
    }
    
    // Not found errors (404)
    if (isNotFoundError(err)) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'The requested resource was not found.',
        shouldStopRendering: false,
        originalError: err,
        statusCode: 404,
        retryable: false
      };
    }
    
    // Authentication errors (401)
    if (isAuthenticationError(err)) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Authentication required. Please log in to continue.',
        shouldStopRendering: true,
        originalError: err,
        statusCode: 401,
        retryable: false
      };
    }
    
    // Authorization errors (403)
    if (isAuthorizationError(err)) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'You don\'t have permission to access this resource.',
        shouldStopRendering: false,
        originalError: err,
        statusCode: 403,
        retryable: false
      };
    }
    
    // Validation errors
    if (isValidationError(err)) {
      return {
        type: ErrorType.VALIDATION,
        message: getErrorMessage(err, 'Invalid input data.'),
        shouldStopRendering: false,
        originalError: err,
        retryable: false
      };
    }
    
    // Data format errors
    if (isDataFormatError(err)) {
      return {
        type: ErrorType.DATA_FORMAT,
        message: 'The data received was in an invalid format.',
        shouldStopRendering: false,
        originalError: err,
        retryable: false
      };
    }
    
    // Timeout errors
    if (isTimeoutError(err)) {
      return {
        type: ErrorType.TIMEOUT,
        message: 'The request timed out. Please try again.',
        shouldStopRendering: false,
        originalError: err,
        retryable: true
      };
    }
    
    // Unknown/unhandled errors
    return {
      type: ErrorType.UNKNOWN,
      message: getErrorMessage(err, 'An unknown error occurred'),
      shouldStopRendering: false,
      originalError: err,
      retryable: true
    };
  };
  
  // Helper functions for error type detection
  function isConnectionError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('Failed to fetch') || 
       err.message.includes('Network request failed') ||
       err.message.includes('ERR_CONNECTION_REFUSED') ||
       err.message.includes('network error'));
  }
  
  function isServerError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('500') || 
       err.message.includes('502') ||
       err.message.includes('503') ||
       err.message.includes('504') ||
       err.message.includes('Internal Server Error'));
  }
  
  function isNotFoundError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('404') || 
       err.message.includes('Not Found') ||
       err.message.toLowerCase().includes('not found'));
  }
  
  function isAuthenticationError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('401') ||
       err.message.includes('Unauthorized') ||
       err.message.includes('Authentication required'));
  }
  
  function isAuthorizationError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('403') ||
       err.message.includes('Forbidden') ||
       err.message.includes('not authorized'));
  }
  
  function isValidationError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('validation') || 
       err.message.includes('required') ||
       err.message.includes('invalid input'));
  }
  
  function isDataFormatError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('parse') ||
       err.message.includes('syntax') ||
       err.message.includes('unexpected token'));
  }
  
  function isTimeoutError(err: any): boolean {
    return err instanceof Error && 
      (err.message.includes('timeout') ||
       err.message.includes('timed out'));
  }
  
  function getErrorMessage(err: any, fallback: string): string {
    return err instanceof Error ? err.message : fallback;
  }
  
  function extractStatusCode(err: any): number | undefined {
    if (!err) return undefined;
    
    // Try to extract from error message
    const statusMatch = err.message?.match(/(\d{3})/);
    if (statusMatch && statusMatch[1]) {
      return parseInt(statusMatch[1], 10);
    }
    
    // Try to extract from response property if available
    if (err.response && err.response.status) {
      return err.response.status;
    }
    
    return undefined;
  }