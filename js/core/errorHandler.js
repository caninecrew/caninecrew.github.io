// Error Handling Utility
const ErrorHandler = {
    errors: [],
    maxErrors: 50,
    
    // Handle and log errors
    handle: function(error, context = '') {
        const errorObj = {
            timestamp: new Date().toISOString(),
            message: error.message || 'Unknown error',
            stack: error.stack,
            context: context,
            type: error.name || 'Error'
        };
        
        // Store error
        this.errors.unshift(errorObj);
        
        // Trim error log if it exceeds max size
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }
        
        // Log to console
        console.error(`[Error] ${context}: ${error.message}`, error);
        
        // Report to monitoring service if available
        this.report(errorObj);
        
        return errorObj;
    },
    
    // Report error to monitoring service
    report: function(errorObj) {
        // Implementation for error reporting service would go here
        // For now, we'll just store in localStorage for debugging
        try {
            const storedErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
            storedErrors.unshift(errorObj);
            
            // Keep only recent errors
            while (storedErrors.length > this.maxErrors) {
                storedErrors.pop();
            }
            
            localStorage.setItem('errorLog', JSON.stringify(storedErrors));
        } catch (e) {
            console.warn('Failed to store error in localStorage:', e);
        }
    },
    
    // Get all logged errors
    getErrors: function() {
        return this.errors;
    },
    
    // Clear error log
    clearErrors: function() {
        this.errors = [];
        try {
            localStorage.removeItem('errorLog');
        } catch (e) {
            console.warn('Failed to clear error log from localStorage:', e);
        }
    },
    
    // Initialize global error handling
    init: function() {
        // Handle uncaught exceptions
        window.addEventListener('error', (event) => {
            this.handle(event.error || new Error(event.message), 'Uncaught Exception');
            return false;
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
            this.handle(error, 'Unhandled Promise Rejection');
            return false;
        });
        
        // Load stored errors from localStorage
        try {
            const storedErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
            this.errors = storedErrors;
        } catch (e) {
            console.warn('Failed to load stored errors:', e);
        }
    }
};

// Export ErrorHandler
window.ErrorHandler = ErrorHandler;

// Initialize error handling
document.addEventListener('DOMContentLoaded', () => {
    ErrorHandler.init();
});