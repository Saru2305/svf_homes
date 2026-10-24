
const hero = document.querySelector(".hero");

const slides = [
    {
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90",
        number: "01 / 03"
    },
    {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90",
        number: "02 / 03"
    },
    {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90",
        number: "03 / 03"
    }
];

let currentSlide = 0;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    hero.style.backgroundImage = `url("${slides[currentSlide].image}")`;

    document.getElementById("slideNumber").textContent =
        slides[currentSlide].number;
}

document.getElementById("prevSlide").addEventListener("click", () => {
    showSlide(currentSlide - 1);
});

document.getElementById("nextSlide").addEventListener("click", () => {
    showSlide(currentSlide + 1);
});

showSlide(0);

let slideTimer = setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuToggle.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.textContent = "☰";
    });
});

// Property search
const searchForm = document.getElementById("searchForm");
const propertyCards = document.querySelectorAll(".property-card");
const noResults = document.getElementById("noResults");

searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const location = document.getElementById("locationFilter").value;
    const type = document.getElementById("typeFilter").value;
    const budget = document.getElementById("budgetFilter").value;

    let visibleCount = 0;

    propertyCards.forEach(card => {
        const matchesLocation =
            !location || card.dataset.location === location;

        const matchesType =
            !type || card.dataset.type === type;

        const price = Number(card.dataset.price);

        let matchesBudget = true;

        if (budget === "50") {
            matchesBudget = price < 50;
        } else if (budget === "100") {
            matchesBudget = price >= 50 && price <= 100;
        } else if (budget === "101") {
            matchesBudget = price > 100;
        }

        const visible =
            matchesLocation && matchesType && matchesBudget;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    noResults.hidden = visibleCount > 0;

    document.getElementById("properties").scrollIntoView({
        behavior: "smooth"
    });
});

// View details: select the property in the booking form
document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("bookingProperty").value =
            button.dataset.property;

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Prevent selecting past dates
const visitDate = document.getElementById("visitDate");

const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

visitDate.min = localToday;

// BUSINESS SETTINGS: replace these with your actual details.
const BUSINESS = {
    whatsapp: "", // Example: 919876543210 (country code + mobile number)
    facebook: "", // Your Facebook profile or business page URL
    instagram: "" // Your Instagram profile URL
};

// WhatsApp link
const whatsappLink = document.getElementById("whatsappLink");

if (/^\d{10,15}$/.test(BUSINESS.whatsapp)) {
    whatsappLink.href = `https://wa.me/${BUSINESS.whatsapp}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
} else {
    whatsappLink.addEventListener("click", event => {
        event.preventDefault();
        alert("Please add your official WhatsApp number in script.js.");
    });
}

// Social media links
document.querySelectorAll("[data-social]").forEach(link => {
    const platform = link.dataset.social;
    const url = BUSINESS[platform];

    if (url && /^https:\/\/(www\.)?(facebook\.com|instagram\.com)\//i.test(url)) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    } else {
        link.href = "#contact";

        link.addEventListener("click", event => {
            event.preventDefault();
            alert(`Please add your official ${platform} URL in script.js.`);
        });
    }
});

// Site visit booking: prepares a WhatsApp message
document.getElementById("bookingForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const property = document.getElementById("bookingProperty").value;
    const date = document.getElementById("visitDate").value;
    const message = document.getElementById("bookingMessage");

    if (!name || !/^\d{10}$/.test(phone) || !property || !date) {
        message.textContent = "Please enter valid details in all fields.";
        return;
    }

    if (date < localToday) {
        message.textContent = "Please choose today or a future date.";
        return;
    }

    const bookingMessage = [
        "Hello SVF HOMES!",
        "",
        "I would like to request a site visit.",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Property: ${property}`,
        `Preferred Date: ${date}`
    ].join("\n");

    if (/^\d{10,15}$/.test(BUSINESS.whatsapp)) {
        const url = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(bookingMessage)}`;

        window.open(url, "_blank", "noopener,noreferrer");

        message.textContent =
            "Your booking message is ready in WhatsApp. Please send it to confirm your request.";
    } else {
        message.textContent =
            "Demo only: Add your WhatsApp number in script.js to send this booking request.";
    }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
