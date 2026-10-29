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

// Gallery lightbox: opens a clicked gallery picture in a large overlay
var galleryImages = document.querySelectorAll(".gallery-image");
var lightbox = document.getElementById("lightbox");

// Only run on pages that have a gallery and a lightbox
if (galleryImages.length > 0 && lightbox) {
    var lightboxImage = document.getElementById("lightbox-image");
    var currentIndex = 0;

    // Shows the picture at the given position, wrapping around at the first and last picture
    var showImage = function (index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        lightboxImage.src = galleryImages[currentIndex].src;
        lightboxImage.alt = galleryImages[currentIndex].alt;
    };

    var openLightbox = function (index) {
        showImage(index);
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
    };

    var closeLightbox = function () {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
    };

    // Open the lightbox when a gallery picture is clicked, or Enter is pressed on it
    galleryImages.forEach(function (image, index) {
        image.addEventListener("click", function () {
            openLightbox(index);
        });
        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                openLightbox(index);
            }
        });
    });

    // Close, previous and next buttons
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", function () {
        showImage(currentIndex - 1);
    });
    document.getElementById("lightbox-next").addEventListener("click", function () {
        showImage(currentIndex + 1);
    });

    // Clicking the dark background closes the lightbox
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls: Escape closes, arrow keys change picture
    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("open")) {
            return;
        }
        if (event.key === "Escape") {
            closeLightbox();
        }
        if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        }
        if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }
    });
}