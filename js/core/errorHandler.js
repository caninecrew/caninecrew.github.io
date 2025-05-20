// Error Handler Utility
const ErrorHandler = {
    // Error types for categorization
    types: {
        NETWORK: 'network',
        RESOURCE: 'resource',
        RUNTIME: 'runtime',
        VALIDATION: 'validation',
        AUTH: 'auth'
    },
    
    // Create structured error object
    create: function(message, type, details = {}) {
        return {
            message,
            type,
            timestamp: new Date().toISOString(),
            details
        };
    },
    
    // Handle error with appropriate response
    handle: function(error) {
        // Log error
        console.error('[ErrorHandler]', error);
        
        // Track error for analytics
        if (Performance) {
            Performance.trackError(error);
        }
        
        // Show user-friendly message based on error type
        let userMessage = 'An unexpected error occurred. Please try again.';
        
        switch (error.type) {
            case this.types.NETWORK:
                userMessage = 'Network connection error. Please check your connection and try again.';
                break;
            case this.types.RESOURCE:
                userMessage = 'Failed to load resource. Please refresh the page or try again later.';
                break;
            case this.types.VALIDATION:
                userMessage = error.message || 'Please check your input and try again.';
                break;
            case this.types.AUTH:
                userMessage = 'Authentication error. Please log in again.';
                break;
        }
        
        // Show error message to user
        if (DOMUtils) {
            DOMUtils.showToast(userMessage, 'error');
        }
        
        // Return error for chaining
        return error;
    },
    
    // Handle specific error scenarios
    handleNetworkError: function(error) {
        return this.handle(
            this.create(
                'Network request failed',
                this.types.NETWORK,
                { originalError: error }
            )
        );
    },
    
    handleResourceError: function(error, resourceUrl) {
        return this.handle(
            this.create(
                'Failed to load resource',
                this.types.RESOURCE,
                { 
                    originalError: error,
                    resourceUrl 
                }
            )
        );
    },
    
    handleValidationError: function(message, details) {
        return this.handle(
            this.create(
                message,
                this.types.VALIDATION,
                details
            )
        );
    },
    
    // Format error for logging
    formatError: function(error) {
        return {
            message: error.message,
            type: error.type,
            timestamp: error.timestamp,
            stack: error.details?.originalError?.stack,
            details: JSON.stringify(error.details)
        };
    },
    
    // Check if error is recoverable
    isRecoverable: function(error) {
        return error.type === this.types.NETWORK || 
               error.type === this.types.RESOURCE;
    },
    
    // Clear error state from an element
    clearError: function(element) {
        if (!element) return;
        
        // Remove error classes
        element.classList.remove('error');
        
        // Remove error messages
        const errorMessages = element.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
};

// Export ErrorHandler
window.ErrorHandler = ErrorHandler;

// Add global error handling
window.addEventListener('error', (event) => {
    ErrorHandler.handle(
        ErrorHandler.create(event.message, ErrorHandler.types.RUNTIME, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        })
    );
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(
        ErrorHandler.create(
            event.reason?.message || 'Unhandled Promise rejection',
            ErrorHandler.types.RUNTIME,
            { reason: event.reason }
        )
    );
});