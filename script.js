// Accordion: opens and closes the panel under each accordion button
document.addEventListener("DOMContentLoaded", function () {

    // Find every accordion button on the page
    var buttons = document.querySelectorAll(".accordion-button");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {

            // The panel is the element directly after the clicked button
            var panel = button.nextElementSibling;
            var isOpen = button.getAttribute("aria-expanded") === "true";

            // Close every panel first so only one is open at a time
            buttons.forEach(function (otherButton) {
                otherButton.setAttribute("aria-expanded", "false");
                otherButton.nextElementSibling.classList.remove("open");
            });

            // If the clicked panel was closed, open it
            if (!isOpen) {
                button.setAttribute("aria-expanded", "true");
                panel.classList.add("open");
            }
        });
    });
});