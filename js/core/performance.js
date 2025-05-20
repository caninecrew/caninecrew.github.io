// Performance Monitoring Utility
const Performance = {
    marks: new Map(),
    measures: new Map(),
    
    // Start timing a task
    start: function(id) {
        if (!id) return;
        
        const mark = `${id}-start`;
        performance.mark(mark);
        this.marks.set(id, mark);
    },
    
    // End timing a task and record measure
    end: function(id) {
        if (!id || !this.marks.has(id)) return;
        
        const startMark = this.marks.get(id);
        const endMark = `${id}-end`;
        
        performance.mark(endMark);
        
        try {
            performance.measure(id, startMark, endMark);
            const measure = performance.getEntriesByName(id).pop();
            
            if (measure) {
                this.measures.set(id, measure.duration);
                this.log(id, measure.duration);
            }
            
            // Cleanup
            performance.clearMarks(startMark);
            performance.clearMarks(endMark);
            performance.clearMeasures(id);
        } catch (error) {
            console.warn(`[Performance] Failed to measure ${id}:`, error);
        }
        
        this.marks.delete(id);
    },
    
    // Log performance data
    log: function(id, duration) {
        if (duration > 1000) {
            console.warn(`[Performance] Task ${id} took ${duration.toFixed(2)}ms`);
        } else {
            console.debug(`[Performance] ${id}: ${duration.toFixed(2)}ms`);
        }
    },
    
    // Get all performance measures
    getMeasures: function() {
        return Object.fromEntries(this.measures);
    },
    
    // Monitor resource loading
    monitorResources: function() {
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
                        this.log(`API ${entry.name}`, entry.duration);
                    } else if (entry.initiatorType === 'resource') {
                        this.log(`Resource ${entry.name}`, entry.duration);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    },
    
    // Monitor long tasks
    monitorLongTasks: function() {
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    },
    
    // Monitor first paint and first contentful paint
    monitorPaintTimings: function() {
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.log(entry.name, entry.startTime);
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    },
    
    // Initialize performance monitoring
    init: function() {
        // Monitor various performance aspects
        this.monitorResources();
        this.monitorLongTasks();
        this.monitorPaintTimings();
        
        // Monitor navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.getEntriesByType('navigation')[0];
                if (timing) {
                    console.info('[Performance] Navigation Timing:', {
                        'DNS lookup': timing.domainLookupEnd - timing.domainLookupStart,
                        'TCP handshake': timing.connectEnd - timing.connectStart,
                        'Response time': timing.responseEnd - timing.responseStart,
                        'DOM interactive': timing.domInteractive,
                        'DOM complete': timing.domComplete,
                        'Load event': timing.loadEventEnd - timing.loadEventStart,
                        'Total time': timing.loadEventEnd
                    });
                }
            }, 0);
        });
    }
};

// Export Performance
window.Performance = Performance;

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    Performance.init();
});