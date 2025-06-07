// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Determine the correct path for the service worker
        const path = window.location.pathname;
        const isInPagesDir = path.includes('/pages/') || path.split('/').slice(-2, -1)[0] === 'pages';
        const swPath = isInPagesDir ? '../js/sw.js' : '/js/sw.js';
        
        navigator.serviceWorker.register(swPath)
            .then(registration => {
                console.log('ServiceWorker registration successful:', registration.scope);
                
                // Track registration success
                Performance.trackResourceLoad('service-worker');
                
                // Subscribe to push notifications if supported
                if ('PushManager' in window) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(Config.get('push.publicKey'))
                    })
                    .then(subscription => {
                        console.log('Push notification subscription:', subscription);
                    })
                    .catch(error => {
                        ErrorHandler.handle(
                            ErrorHandler.create(
                                'Push notification subscription failed',
                                ErrorHandler.types.RUNTIME,
                                { error }
                            )
                        );
                    });
                }
            })
            .catch(error => {
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'ServiceWorker registration failed',
                        ErrorHandler.types.RUNTIME,
                        { error }
                    )
                );
            });
            
        // Handle service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            DOMUtils.showToast('Site updated. Refresh to see changes.', 'info');
        });
    });
}

// Convert VAPID public key to array buffer
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
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