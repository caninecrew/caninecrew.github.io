// Error handling service
const ErrorHandler = {
    // Error types
    types: {
        NETWORK: 'network',
        API: 'api',
        VALIDATION: 'validation',
        RUNTIME: 'runtime'
    },

    // Store for error handlers
    handlers: new Map(),

    // Default error handler
    defaultHandler(error) {
        Utils.log(error.message, 'error');
        
        if (error.type === this.types.NETWORK) {
            A11yUtils.announceError('Network connection issue. Please check your connection and try again.');
        } else {
            A11yUtils.announceError('Something went wrong. Please try again.');
        }
    },

    // Register an error handler for a specific type
    register(type, handler) {
        this.handlers.set(type, handler);
    },

    // Handle an error
    handle(error) {
        const handler = this.handlers.get(error.type) || this.defaultHandler.bind(this);
        
        // Track error in performance monitoring
        Performance.start('error-handling');
        
        try {
            handler(error);
        } catch (e) {
            Utils.log('Error in error handler: ' + e.message, 'error');
        }
        
        Performance.end('error-handling');
    },

    // Create a new error with additional context
    create(message, type = 'runtime', details = {}) {
        const error = new Error(message);
        error.type = type;
        error.details = details;
        error.timestamp = new Date().toISOString();
        return error;
    },

    // Initialize error handlers
    init() {
        // Network errors
        this.register(this.types.NETWORK, (error) => {
            Utils.log('Network Error: ' + error.message, 'error');
            A11yUtils.announceError('Network connection issue. Please check your connection and try again.');
        });

        // API errors
        this.register(this.types.API, (error) => {
            Utils.log('API Error: ' + error.message, 'error');
            A11yUtils.announceError('Server communication error. Please try again later.');
        });

        // Validation errors
        this.register(this.types.VALIDATION, (error) => {
            Utils.log('Validation Error: ' + error.message, 'error');
            A11yUtils.announceError(error.message);
        });

        // Global error handling
        window.addEventListener('error', (event) => {
            this.handle(this.create(event.error?.message || 'Unknown error', this.types.RUNTIME));
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handle(this.create(event.reason?.message || 'Promise rejection', this.types.RUNTIME));
        });
    }
};

// Initialize error handler
window.ErrorHandler = ErrorHandler;
document.addEventListener('DOMContentLoaded', () => ErrorHandler.init());