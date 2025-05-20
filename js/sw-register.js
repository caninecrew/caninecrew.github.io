// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.info('ServiceWorker registered: ', registration.scope);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    // Track state changes
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('ServiceWorker registration failed: ', error);
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'Failed to register service worker',
                        ErrorHandler.types.RESOURCE,
                        { error }
                    )
                );
            });
    });
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <p>A new version of this site is available!</p>
        <div class="button-container">
            <button onclick="window.location.reload()" class="button button-primary">
                <i class="fas fa-sync"></i> Update Now
            </button>
            <button onclick="this.parentElement.parentElement.remove()" class="button">
                Later
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
}