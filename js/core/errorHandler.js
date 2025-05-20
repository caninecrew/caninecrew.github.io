// Error handling utility
const ErrorHandler = {
    // Error types
    types: {
        RUNTIME: 'runtime',
        NETWORK: 'network',
        VALIDATION: 'validation',
        RESOURCE: 'resource'
    },

    // Create an error object
    create: function(message, type = this.types.RUNTIME, data = {}) {
        return {
            message,
            type,
            timestamp: new Date(),
            data
        };
    },

    // Handle an error
    handle: function(error) {
        // Log error
        this.log(error);
        
        // Show user-friendly message if needed
        if (this.shouldShowUser(error)) {
            this.showUserMessage(error);
        }
        
        // Track error for analytics
        this.track(error);
        
        return error;
    },

    // Determine if error should be shown to user
    shouldShowUser: function(error) {
        return error.type === this.types.NETWORK || 
               error.type === this.types.RESOURCE;
    },

    // Show user-friendly error message
    showUserMessage: function(error) {
        const container = document.createElement('div');
        container.className = 'error-message';
        container.setAttribute('role', 'alert');
        
        const message = document.createElement('p');
        message.textContent = this.getUserMessage(error);
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'close-error';
        closeBtn.onclick = () => container.remove();
        
        container.appendChild(message);
        container.appendChild(closeBtn);
        
        document.body.appendChild(container);
        
        // Auto-remove after 5 seconds
        setTimeout(() => container.remove(), 5000);
    },

    // Get user-friendly message based on error type
    getUserMessage: function(error) {
        switch (error.type) {
            case this.types.NETWORK:
                return 'Connection error. Please check your internet connection and try again.';
            case this.types.RESOURCE:
                return 'Failed to load required resource. Please refresh the page.';
            default:
                return 'An error occurred. Please try again.';
        }
    },

    // Log error with context
    log: function(error) {
        console.error('[ErrorHandler]', {
            message: error.message,
            type: error.type,
            timestamp: error.timestamp,
            data: error.data
        });
    },

    // Track error for analytics
    track: function(error) {
        if (window.Performance) {
            Performance.end(`error-${error.type}`);
        }
        // Add analytics tracking here if needed
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