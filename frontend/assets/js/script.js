/**
 * SMARTBOOK - FULL FRONTEND LOGIC (WHEREBY VERSION)
 * Features: Smooth Scroll, Scroll Animations, Nav Effects, Hamburger Menu,
 * and Dynamic Whereby API Integration.
 */

// --- 1. UTILITY FUNCTIONS ---

/**
 * Displays a temporary toast notification to the user
 */
function showNotification(text) {
  const notif = document.getElementById("notification");
  if (notif) {
    notif.textContent = text;
    notif.style.opacity = "1";
    setTimeout(() => {
      notif.style.opacity = "0";
    }, 3000);
  }
}

/**
 * Fetches a dynamic Whereby Meeting Link from the backend
 */
async function getWherebyMeetingLink() {
  try {
    const apiUrl = "http://localhost:3000/api/meetings/create";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Server Error: ${errorMsg}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log("Whereby Links Generated:", data);
      return {
        participantLink: data.roomUrl,
        hostLink: data.hostUrl,
      };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Whereby Meeting Error:", error);
    showNotification("Error: Could not connect to the Whereby server.");
    return null;
  }
}

// --- 2. NAVIGATION & UI EFFECTS ---

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

const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    nav.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  } else {
    nav.style.boxShadow = "none";
  }
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

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

document.querySelectorAll(".card, .benefit-item").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// --- 3. SCHEDULE ROOM BOOKING LOGIC ---

// Include benefits page IDs
const scheduleButtons = [
  document.getElementById("schedule-button"),
  document.getElementById("schedule-button-cta"),
  document.getElementById("schedule-button-benefits"),
];

const schedulePopup = document.getElementById("schedule-popup");
const closeSchedule = schedulePopup
  ? schedulePopup.querySelector(".close-popup")
  : null;
const confirmSchedule = document.getElementById("confirm-schedule");
const scheduleLinkSection = document.getElementById("schedule-link-section");
const copySchedule = document.getElementById("copy-schedule");
const shareSchedule = document.getElementById("share-schedule");
const visitSchedule = document.getElementById("visit-schedule");
const scheduleLinkInput = document.getElementById("schedule-link");

let currentScheduleHostLink = "";

scheduleButtons.forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      schedulePopup.style.display = "block";
      scheduleLinkSection.style.display = "none";
    });
  }
});

if (closeSchedule) {
  closeSchedule.addEventListener("click", () => {
    schedulePopup.style.display = "none";
  });
}

if (confirmSchedule) {
  confirmSchedule.addEventListener("click", async () => {
    const dateValue = document.getElementById("schedule-date").value;
    const timeValue = document.getElementById("schedule-time").value;

    if (!dateValue || !timeValue) {
      alert("Please select both a date and a time for your meeting.");
      return;
    }

    showNotification("Generating secure Whereby link...");

    const links = await getWherebyMeetingLink();

    if (links) {
      scheduleLinkInput.value = links.participantLink;
      currentScheduleHostLink = links.hostLink;
      scheduleLinkSection.style.display = "block";
      showNotification("Meeting scheduled successfully!");
    }
  });
}

if (visitSchedule) {
  visitSchedule.addEventListener("click", () => {
    const dateValue = document.getElementById("schedule-date").value;
    const timeValue = document.getElementById("schedule-time").value;

    const now = new Date();
    const scheduledTime = new Date(`${dateValue}T${timeValue}`);
    const gracePeriod = 5 * 60 * 1000;

    if (now < scheduledTime - gracePeriod) {
      alert(
        `Meeting has not started. Please join on ${dateValue} at ${timeValue}.`
      );
    } else {
      window.open(currentScheduleHostLink || scheduleLinkInput.value, "_blank");
    }
  });
}

if (copySchedule) {
  copySchedule.addEventListener("click", () => {
    navigator.clipboard.writeText(scheduleLinkInput.value).then(() => {
      showNotification("Link copied to clipboard");
    });
  });
}

// --- 4. INSTANT BOOK NOW LOGIC ---

// Include benefits page IDs
const instantButtons = [
  document.getElementById("instant-button"),
  document.getElementById("instant-button-cta"),
  document.getElementById("instant-button-benefits"),
];

const instantPopup = document.getElementById("instant-popup");
const closeInstant = instantPopup
  ? instantPopup.querySelector(".close-popup")
  : null;
const copyInstant = document.getElementById("copy-instant");
const shareInstant = document.getElementById("share-instant");
const visitInstant = document.getElementById("visit-instant");
const instantLinkInput = document.getElementById("instant-link");

let currentInstantHostLink = "";

instantButtons.forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", async () => {
      showNotification("Generating instant Whereby link...");

      const links = await getWherebyMeetingLink();

      if (links) {
        instantLinkInput.value = links.participantLink;
        currentInstantHostLink = links.hostLink;
        instantPopup.style.display = "block";
        showNotification("Instant link ready!");
      }
    });
  }
});

if (closeInstant) {
  closeInstant.addEventListener("click", () => {
    instantPopup.style.display = "none";
  });
}

if (copyInstant) {
  copyInstant.addEventListener("click", () => {
    navigator.clipboard.writeText(instantLinkInput.value).then(() => {
      showNotification("Copied to clipboard");
    });
  });
}

if (visitInstant) {
  visitInstant.addEventListener("click", () => {
    window.open(currentInstantHostLink || instantLinkInput.value, "_blank");
  });
}

// --- 5. GLOBAL SHARE LOGIC ---

const shareButtonsList = [
  {
    btn: document.getElementById("share-schedule"),
    input: document.getElementById("schedule-link"),
  },
  {
    btn: document.getElementById("share-instant"),
    input: document.getElementById("instant-link"),
  },
];

shareButtonsList.forEach(({ btn, input }) => {
  if (btn) {
    btn.addEventListener("click", () => {
      if (navigator.share) {
        navigator
          .share({
            title: "SmartBook Meeting Link",
            text: "Join my meeting on SmartBook:",
            url: input.value,
          })
          .then(() => showNotification("Link shared successfully"))
          .catch((err) => {
            if (err.name !== "AbortError") showNotification("Sharing failed");
          });
      } else {
        showNotification("Sharing is not supported in this browser");
      }
    });
  }
});
