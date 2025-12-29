// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to navigation
let lastScroll = 0;
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    nav.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  } else {
    nav.style.boxShadow = "none";
  }

  lastScroll = currentScroll;
});

// Simple intersection observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards and benefit items
document.querySelectorAll(".card, .benefit-item").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// Hamburger menu logic
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Notification function
function showNotification(text) {
  const notif = document.getElementById("notification");
  notif.textContent = text;
  notif.style.opacity = "1";
  setTimeout(() => {
    notif.style.opacity = "0";
  }, 2000);
}

// Popup logic for Schedule Room Booking
const scheduleButton = document.getElementById("schedule-button");
const schedulePopup = document.getElementById("schedule-popup");
const closeSchedule = schedulePopup.querySelector(".close-popup");
const confirmSchedule = document.getElementById("confirm-schedule");
const scheduleLinkSection = document.getElementById("schedule-link-section");
const copySchedule = document.getElementById("copy-schedule");
const shareSchedule = document.getElementById("share-schedule");
const visitSchedule = document.getElementById("visit-schedule");
const scheduleLinkInput = document.getElementById("schedule-link");

scheduleButton.addEventListener("click", () => {
  schedulePopup.style.display = "block";
  scheduleLinkSection.style.display = "none";
});

closeSchedule.addEventListener("click", () => {
  schedulePopup.style.display = "none";
});

confirmSchedule.addEventListener("click", () => {
  // For now, generate a dummy link since backend is later
  scheduleLinkInput.value = "https://smartbook.com/meet/123456";
  scheduleLinkSection.style.display = "block";
});

copySchedule.addEventListener("click", () => {
  navigator.clipboard.writeText(scheduleLinkInput.value).then(() => {
    showNotification("Copied to clipboard");
  });
});

shareSchedule.addEventListener("click", () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Scheduled Meeting Link",
        url: scheduleLinkInput.value,
      })
      .then(() => showNotification("Shared successfully"))
      .catch((err) => {
        if (err.name !== "AbortError") {
          showNotification("Share not supported");
        }
      });
  } else {
    showNotification("Share not supported");
  }
});

visitSchedule.addEventListener("click", () => {
  window.open(scheduleLinkInput.value, "_blank");
});

// Popup logic for Instant Book Now
const instantButton = document.getElementById("instant-button");
const instantPopup = document.getElementById("instant-popup");
const closeInstant = instantPopup.querySelector(".close-popup");
const copyInstant = document.getElementById("copy-instant");
const shareInstant = document.getElementById("share-instant");
const visitInstant = document.getElementById("visit-instant");
const instantLinkInput = document.getElementById("instant-link");

instantButton.addEventListener("click", () => {
  // For now, generate a dummy link since backend is later
  instantLinkInput.value = "https://smartbook.com/meet/instant-789";
  instantPopup.style.display = "block";
});

closeInstant.addEventListener("click", () => {
  instantPopup.style.display = "none";
});

copyInstant.addEventListener("click", () => {
  navigator.clipboard.writeText(instantLinkInput.value).then(() => {
    showNotification("Copied to clipboard");
  });
});

shareInstant.addEventListener("click", () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Instant Meeting Link",
        url: instantLinkInput.value,
      })
      .then(() => showNotification("Shared successfully"))
      .catch((err) => {
        if (err.name !== "AbortError") {
          showNotification("Share not supported");
        }
      });
  } else {
    showNotification("Share not supported");
  }
});

visitInstant.addEventListener("click", () => {
  window.open(instantLinkInput.value, "_blank");
});
