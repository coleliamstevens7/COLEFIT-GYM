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

// Search feature: filters the Services sections as the visitor types
var searchInput = document.getElementById("search-input");

// Only run on pages that have a search box
if (searchInput) {
    var searchMessage = document.getElementById("search-message");
    var searchButtons = document.querySelectorAll(".accordion-button");

    searchInput.addEventListener("input", function () {
        var term = searchInput.value.trim().toLowerCase();
        var matches = 0;

        searchButtons.forEach(function (button) {
            var panel = button.nextElementSibling;
            var text = (button.textContent + " " + panel.textContent).toLowerCase();
            var isMatch = term === "" || text.indexOf(term) !== -1;

            // Hide sections that do not match the search word
            button.style.display = isMatch ? "" : "none";

            // Open the matching sections so the result is visible straight away
            if (term !== "" && isMatch) {
                panel.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            } else {
                panel.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            }

            if (isMatch) {
                matches++;
            }
        });

        // Tell the visitor how many results were found
        if (term === "") {
            searchMessage.textContent = "";
        } else if (matches === 0) {
            searchMessage.textContent = "No results found for \"" + searchInput.value.trim() + "\".";
        } else {
            searchMessage.textContent = matches + " result(s) found.";
        }
    });
}

// Dynamic content: shows whether COLEFIT is open right now, using South African time
var openStatus = document.getElementById("open-status");

// Only run on pages that have the open status message
if (openStatus) {
    // Opening and closing hour for each day, matching the Operating Hours list
    var openingHours = {
        Mon: [6, 20],
        Tue: [6, 20],
        Wed: [6, 20],
        Thu: [6, 20],
        Fri: [6, 20],
        Sat: [7, 17],
        Sun: [8, 14]
    };

    // Get the current day and time in Johannesburg
    var timeParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Johannesburg",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23"
    }).formatToParts(new Date());

    var currentDay = "";
    var currentHour = 0;
    var currentMinute = 0;

    timeParts.forEach(function (part) {
        if (part.type === "weekday") {
            currentDay = part.value;
        }
        if (part.type === "hour") {
            currentHour = parseInt(part.value, 10);
        }
        if (part.type === "minute") {
            currentMinute = parseInt(part.value, 10);
        }
    });

    var todaysHours = openingHours[currentDay];
    var minutesNow = currentHour * 60 + currentMinute;
    var isOpen = minutesNow >= todaysHours[0] * 60 && minutesNow < todaysHours[1] * 60;

    var hoursText = (todaysHours[0] < 10 ? "0" : "") + todaysHours[0] + ":00 - " + todaysHours[1] + ":00";

    if (isOpen) {
        openStatus.textContent = "We are open right now. Today's hours: " + hoursText + ".";
        openStatus.classList.add("is-open");
    } else {
        openStatus.textContent = "We are closed right now. Today's hours: " + hoursText + ".";
        openStatus.classList.add("is-closed");
    }
}