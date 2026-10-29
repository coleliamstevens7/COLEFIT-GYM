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

// Form validation: checks the Contact enquiry form before it is sent
var enquiryForm = document.getElementById("enquiry-form");

// Only run on the page that has the enquiry form
if (enquiryForm) {
    var fields = {
        name: document.getElementById("name"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        enquiryType: document.getElementById("enquiry-type"),
        message: document.getElementById("message"),
        consent: document.getElementById("consent")
    };

    var formMessage = document.getElementById("form-message");

    // Shows an error under a field, or clears it when the message is empty.
    // Returns true when the field is valid.
    var setError = function (field, errorId, message) {
        document.getElementById(errorId).textContent = message;

        if (message === "") {
            field.classList.remove("input-error");
            field.setAttribute("aria-invalid", "false");
        } else {
            field.classList.add("input-error");
            field.setAttribute("aria-invalid", "true");
        }

        return message === "";
    };

    // One validation rule per field, each with a clear error message
    var validators = {
        name: function () {
            var value = fields.name.value.trim();
            if (value === "") {
                return setError(fields.name, "name-error", "Please enter your full name.");
            }
            if (value.length < 2) {
                return setError(fields.name, "name-error", "Your name must be at least 2 characters long.");
            }
            if (!/^[A-Za-z\u00C0-\u024F' -]+$/.test(value)) {
                return setError(fields.name, "name-error", "Your name can only contain letters, spaces, hyphens and apostrophes.");
            }
            return setError(fields.name, "name-error", "");
        },

        email: function () {
            var value = fields.email.value.trim();
            if (value === "") {
                return setError(fields.email, "email-error", "Please enter your email address.");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return setError(fields.email, "email-error", "Please enter a valid email address, like name@example.com.");
            }
            return setError(fields.email, "email-error", "");
        },

        phone: function () {
            var value = fields.phone.value.trim();
            // The phone number is optional, so only check it when something is typed
            if (value !== "" && !/^\+?[0-9 ]{9,18}$/.test(value)) {
                return setError(fields.phone, "phone-error", "Please enter a valid phone number using digits only, for example 071 123 4567.");
            }
            return setError(fields.phone, "phone-error", "");
        },

        enquiryType: function () {
            if (fields.enquiryType.value === "") {
                return setError(fields.enquiryType, "enquiry-type-error", "Please choose what your enquiry is about.");
            }
            return setError(fields.enquiryType, "enquiry-type-error", "");
        },

        message: function () {
            var value = fields.message.value.trim();
            if (value === "") {
                return setError(fields.message, "message-error", "Please type your message.");
            }
            if (value.length < 10) {
                return setError(fields.message, "message-error", "Your message must be at least 10 characters long.");
            }
            return setError(fields.message, "message-error", "");
        },

        consent: function () {
            if (!fields.consent.checked) {
                return setError(fields.consent, "consent-error", "Please tick the box so we can contact you about your enquiry.");
            }
            return setError(fields.consent, "consent-error", "");
        }
    };

    // Immediate feedback: check each field when the visitor leaves it,
    // and keep re-checking while they fix a field that has an error
    Object.keys(validators).forEach(function (key) {
        var field = fields[key];
        var leaveEvent = (key === "enquiryType" || key === "consent") ? "change" : "blur";

        field.addEventListener(leaveEvent, validators[key]);
        field.addEventListener("input", function () {
            if (field.classList.contains("input-error")) {
                validators[key]();
            }
        });
    });

    // When the form is submitted, check every field and stop the send if any are invalid
    enquiryForm.addEventListener("submit", function (event) {
        var allValid = true;
        var firstInvalidField = null;

        Object.keys(validators).forEach(function (key) {
            if (!validators[key]()) {
                allValid = false;
                if (firstInvalidField === null) {
                    firstInvalidField = fields[key];
                }
            }
        });

        if (!allValid) {
            event.preventDefault();
            formMessage.textContent = "Please fix the errors above and try again.";
            firstInvalidField.focus();
        } else {
            formMessage.textContent = "";
        }
    });
}