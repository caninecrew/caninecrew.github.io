// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        Performance.start('sw-registration');
        
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                Utils.log('ServiceWorker registration successful', 'info');
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            if (confirm('New content is available! Would you like to reload?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
                
                Performance.end('sw-registration');
            })
            .catch(error => {
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'ServiceWorker registration failed: ' + error.message,
                        ErrorHandler.types.RUNTIME
                    )
                );
                Performance.end('sw-registration');
            });
    });
}