// Performance tracking utility
const Performance = {
    marks: new Map(),
    
    // Start timing a performance mark
    start: function(name) {
        if (!name) {
            console.error('Performance mark name is required');
            return;
        }
        
        const mark = {
            startTime: performance.now(),
            name: name
        };
        
        this.marks.set(name, mark);
        
        // Create performance mark
        performance.mark(`${name}-start`);
    },
    
    // End timing and log the duration
    end: function(name) {
        if (!this.marks.has(name)) {
            console.error(`No performance mark found for: ${name}`);
            return;
        }
        
        const mark = this.marks.get(name);
        const endTime = performance.now();
        const duration = endTime - mark.startTime;
        
        // Create performance marks and measure
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        // Log performance data
        console.info(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        
        // Remove the mark
        this.marks.delete(name);
        
        return duration;
    },
    
    // Get all current performance metrics
    getMetrics: function() {
        const metrics = {
            timing: performance.timing,
            navigation: performance.getEntriesByType('navigation'),
            resource: performance.getEntriesByType('resource'),
            marks: performance.getEntriesByType('mark'),
            measures: performance.getEntriesByType('measure')
        };
        
        return metrics;
    },
    
    // Clear all performance data
    clear: function() {
        this.marks.clear();
        performance.clearMarks();
        performance.clearMeasures();
    }
};

// Export Performance
window.Performance = Performance;
document.addEventListener('DOMContentLoaded', () => Performance.init());