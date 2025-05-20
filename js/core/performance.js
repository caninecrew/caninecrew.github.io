// Performance monitoring and optimization
const Performance = {
    metrics: new Map(),
    marks: new Map(),

    // Start timing a performance metric
    start(name) {
        if (!Config.debug.enabled) return;
        
        const start = performance.now();
        this.marks.set(name, start);
        performance.mark(`${name}-start`);
    },

    // End timing and record metric
    end(name) {
        if (!Config.debug.enabled) return;
        
        const start = this.marks.get(name);
        if (!start) return;

        const end = performance.now();
        const duration = end - start;
        
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        this.metrics.set(name, duration);
        this.marks.delete(name);

        Utils.log(`Performance: ${name} took ${duration.toFixed(2)}ms`, 'debug');
    },

    // Get specific metric
    getMetric(name) {
        return this.metrics.get(name);
    },

    // Get all metrics
    getAllMetrics() {
        return Object.fromEntries(this.metrics);
    },

    // Clear all metrics
    clear() {
        this.metrics.clear();
        this.marks.clear();
        performance.clearMarks();
        performance.clearMeasures();
    },

    // Monitor resource loading
    monitorResources() {
        if (!Config.debug.enabled) return;

        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
                    Utils.log(`Resource: ${entry.name} - Duration: ${entry.duration.toFixed(2)}ms`, 'debug');
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    },

    // Monitor long tasks
    monitorLongTasks() {
        if (!Config.debug.enabled) return;

        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                Utils.log(`Long task detected: ${entry.duration.toFixed(2)}ms`, 'warn');
            });
        });

        observer.observe({ entryTypes: ['longtask'] });
    },

    // Initialize performance monitoring
    init() {
        if (!Config.debug.enabled) return;

        this.monitorResources();
        this.monitorLongTasks();
        
        // Monitor navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const pageLoad = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                Utils.log(`Page load time: ${pageLoad}ms`, 'info');
                Utils.log(`DOM ready time: ${domReady}ms`, 'info');
            }, 0);
        });
    }
};

// Initialize performance monitoring
window.Performance = Performance;
document.addEventListener('DOMContentLoaded', () => Performance.init());