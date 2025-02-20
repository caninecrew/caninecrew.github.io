document.addEventListener("DOMContentLoaded", function() {
    fetch("/pages/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector("#footer").innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback content if footer fails to load
            document.querySelector("#footer").innerHTML = `
                <p>&copy; 2025 Samuel Rumbley. All Rights Reserved.</p>`;
        });
});