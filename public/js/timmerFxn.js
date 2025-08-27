document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("actionOverlay");
    const forms = document.querySelectorAll("form.show-loader");

    forms.forEach(form => {
        form.addEventListener("submit", () => {
            overlay.style.display = "block";
        });
    });
});