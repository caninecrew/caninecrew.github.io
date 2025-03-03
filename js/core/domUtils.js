// DOM manipulation utilities
const DOMUtils = {
    // Create an element with attributes
    createElement: function(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Apply attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Append children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Load content into element
    loadContent: function(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
            return true;
        }
        return false;
    },
    
    // Load HTML file into element
    loadHTMLFile: async function(elementId, filePath) {
        try {
            const content = await Utils.fetchTextFile(filePath);
            return this.loadContent(elementId, content);
        } catch (error) {
            Utils.log(`Error loading HTML file ${filePath} into ${elementId}`, 'error');
            return false;
        }
    },
    
    // Create and add script dynamically
    addScript: function(src, defer = true, async = false) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = defer;
        script.async = async;
        document.head.appendChild(script);
        return script;
    }
};

// Export DOMUtils
window.DOMUtils = DOMUtils;