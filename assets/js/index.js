trackVisitor();

window.addEventListener("load", () => {
  const root = document.documentElement;
  const updateBtn = document.getElementById("updatecolors");
  const colorHint = document.getElementById("color-hint");
  const phrases = [
    "Shift the vibe",
    "Paint the UI",
    "Recast colors",
    "New mood",
    "Refresh the look",
    "Change the theme",
    "Switch the style",
    "Redefine the feel",
    "Set the tone",
    "Reimagine design",
    "Update the palette",
    "Transform the UI",
    "Style the experience",
    "Visual refresh",
    "Mood switch",
    "Design reboot",
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  document.getElementById("color-hint").innerText = randomPhrase + " ✨";
  const updateColors = () => {
    updateBtn.classList.add("animating");
    setTimeout(() => updateBtn.classList.remove("animating"), 600);

    if (colorHint) {
      colorHint.classList.add("hint-hidden");
    }

    const mainHue = Math.floor(Math.random() * 360);
    const complementHue = (mainHue + 180) % 360;
    const saturation = `${Math.floor(Math.random() * 21) + 80}%`;
    const lightness = `${Math.floor(Math.random() * 21) + 40}%`;

    root.style.setProperty("--first-hue", mainHue);
    root.style.setProperty("--second-hue", complementHue);
    root.style.setProperty("--sat", saturation);
    root.style.setProperty("--lig", lightness);
  };
  updateColors();
  updateBtn.addEventListener("click", updateColors);
});
function animateCountUp(element, target, duration = 1000) {
  if (!element || isNaN(target)) return;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Calculate current number based on progress percentage
    const currentCount = Math.floor(progress * target);
    element.textContent = currentCount.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

async function trackVisitor() {
  const APPSCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzsjJTpeFyMnfT-kmMQvQuqFe1nk3eExwpAV3ZRWcFtwgM-z0Vw4XZ6qqogxz3TvJH5kg/exec";
  const IPAPI_URL = "https://ipapi.co/json/";

  const visitorCountElement = document.getElementById("visitors_count");
  const cachedCount = parseInt(
    localStorage.getItem("cachedVisitorCount") || "3"
  );
  const lastFetch = localStorage.getItem("lastCountFetchTime");
  const isFresh = lastFetch && Date.now() - lastFetch < 300000;

  if (isFresh || !visitorCountElement) {
    if (visitorCountElement)
      animateCountUp(visitorCountElement, cachedCount, 800);
  } else {
    try {
      const response = await fetch(APPSCRIPT_URL);
      const data = await response.json();
      const newCount = parseInt(data.value) || cachedCount;

      localStorage.setItem("cachedVisitorCount", newCount);
      localStorage.setItem("lastCountFetchTime", Date.now());
      animateCountUp(visitorCountElement, newCount, 1200);
    } catch (error) {
      animateCountUp(visitorCountElement, cachedCount, 800);
    }
  }

  if (localStorage.getItem("visitorCounted") === "true") return;

  try {
    const ipRes = await fetch(IPAPI_URL);
    const ipData = await ipRes.json();

    const formData = new URLSearchParams({
      ip: ipData.ip,
      browserName: navigator.userAgent,
      osName: navigator.platform,
      deviceType: /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop",
      country: ipData.country_name,
      city: ipData.city,
      location: `${ipData.latitude},${ipData.longitude}`,
      TimeStamp: new Date().toLocaleString(),
    });

    await fetch(APPSCRIPT_URL, { method: "POST", body: formData });
    localStorage.setItem("visitorCounted", "true");
  } catch (err) {
    console.error("Tracking failed:", err);
  }
}

const themeToggle = document.querySelector("#theme-button");
let shootingStarInterval = null;

const controlShootingStars = (action) => {
  if (action === "start") {
    if (shootingStarInterval) return;
    shootingStarInterval = setInterval(() => {
      const star = document.createElement("div");
      star.className = "shooting-star";
      star.style.left = `${Math.random() * window.innerWidth}px`;
      star.style.top = `${Math.random() * (window.innerHeight / 2)}px`;

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2000);
    }, 1500);
  } else {
    clearInterval(shootingStarInterval);
    shootingStarInterval = null;
  }
};

const generateStars = (selector, count) => {
  const container = document.querySelector(selector);
  if (!container) return;

  const shadows = Array.from({ length: count }, () => {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    return `${x}px ${y}px var(--first-color)`;
  }).join(", ");

  container.style.boxShadow = shadows;

  container.style.setProperty("--star-shadow", shadows);
};

const updateThemeUI = (isDark) => {
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.classList.toggle("bx-moon", isDark);
  themeToggle.classList.toggle("bx-sun", !isDark);

  if (isDark) {
    generateStars("#stars", 150);
    generateStars("#stars2", 100);
    generateStars("#stars3", 50);
    controlShootingStars("start");
  } else {
    controlShootingStars("stop");
  }
};

// Initialize
const isDarkStored = localStorage.getItem("theme") === "dark";
updateThemeUI(isDarkStored);

themeToggle.addEventListener("click", () => {
  const isDarkNow = !document.body.classList.contains("dark-theme");
  updateThemeUI(isDarkNow);
  localStorage.setItem("theme", isDarkNow ? "dark" : "light");
});

// --- SCROLL MANAGEMENT ---
const navLinks = document.querySelectorAll(".nav__link");
const scrollUpBtn = document.getElementById("scroll-up");

// 1. Unified Scroll Listener (Button Visibility & Active Links)
window.addEventListener("scroll", () => {
  // Show/Hide Scroll-Up Button
  scrollUpBtn.classList.toggle("show-scroll", window.scrollY >= 200);
});

// 2. Smooth Scroll to Top
scrollUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 3. Modern Active Link Highlighting (Intersection Observer)
const observerOptions = { threshold: 0.6 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active-link",
          link.getAttribute("href") === `#${id}`
        );
      });
    }
  });
}, observerOptions);

// Attach observer to sections linked in nav
navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) observer.observe(section);
});

// --- DATA FETCHING ---
async function fetchData() {
  try {
    const response = await fetch("../assets/js/data.json");
    if (!response.ok) throw new Error("Fetch failed");

    const data = await response.json();

    loadHome(data.home);
    loadAbout(data.about);
    loadSkills(data.skills);
    loadEducation(data.Education);
    loadProjects(data.projects);
    loadInternships(data.internshipExperience);
    loadcertification(data.certification);
  } catch (error) {
    console.error("Data error:", error);
  }
}

function loadHome(homeData) {
  const homeSection = document.querySelector("#home");

  if (!homeSection || !homeData) return;

  const socialLinksHTML = homeData.socialLinks
    .map(
      (link) => `
    <a href="${link.url}" target="_blank" class="home__social-link">
      <i class='${link.icon}'></i>
    </a>
  `
    )
    .join("");

  homeSection.innerHTML = `
    <div class="home__container container grid">
      <div class="home__data">
        <span class="home__greeting">${homeData.greeting}</span>
        <h1 class="home__name">${homeData.name}</h1>
        <h3 class="home__education">${homeData.Designation}</h3>

        <div class="home__button">
          <a href="${homeData.cvLink}" target="_blank" class="button button--ghost">Resume</a>
          <a href="#about" class="button">About</a>
        </div>
      </div>

      <div class="home__handle">
        <img src="${homeData.profileImage}" alt="Profile Image" class="home__img">
      </div>

      <div class="home__social">
        ${socialLinksHTML}
      </div>

      <a href="#about" class="home__scroll">
        <i class='bx bx-mouse home__scroll-icon'></i>
        <span class="home__scroll-name">Scroll Down</span>
      </a>
    </div>`;
}

function loadAbout(aboutData) {
  const aboutSection = document.querySelector("#about");

  if (!aboutSection || !aboutData) return;

  // Generate the information boxes (like Experience, Completed, Support)
  const infoBoxesHTML = aboutData.infoBoxes
    .map(
      (item) => `
    <div class="about__box">
      <i class='${item.icon} about__icon'></i>
      <h3 class="about__title">${item.title}</h3>
      <span class="about__subtitle">${item.subtitle}</span>
    </div>
  `
    )
    .join("");

  aboutSection.innerHTML = `
    <span class="section__subtitle">My Intro</span>
    <h2 class="section__title">About Me</h2>
    
    <p class="section__subtitle" style="color: var(--text-color); text-transform: capitalize; font-size: 18px">
      ${aboutData.smallDescription}
    </p>

    <div class="about__container container grid">
      <img src="${aboutData.image}" alt="Profile Image" class="about__img">

      <div class="about__data">
        <div class="about__info"> 
          ${infoBoxesHTML}
        </div>

        <p class="about__description">${aboutData.description}</p>

        <a href="#contact" class="button about__button-contact">Contact Me</a>
      </div>
    </div>`;
}
function loadSkills(skillsData) {
  const skillsSection = document.querySelector("#skills");

  const LEVEL_MAP = {
    Beginner: 40,
    Intermediate: 60,
    Comfortable: 80,
  };

  const categoriesHTML = skillsData.categories
    .map((category) => {
      // Split skills into 2 columns
      const mid = Math.ceil(category.skills.length / 2);

      const createSkillHTML = (skill) => `
        <div class="skills__data">
          <img src="${skill.icon}" alt="${skill.name}">
          <div>
            <h3 class="skills__name">${skill.name}</h3>
            <div class="slider-container">
              <div 
                class="slider-fill"
                data-level="${skill.level}"
                data-percent="${LEVEL_MAP[skill.level] || 0}">
              </div>
            </div>
            <div class="skill-level">${skill.level}</div>
          </div>
        </div>
      `;

      return `
        <div class="skills__content">
          <h3 class="skills__title">${category.categoryTitle}</h3>
          <div class="skills__box">
            <div class="skills__group">
              ${category.skills.slice(0, mid).map(createSkillHTML).join("")}
            </div>
            <div class="skills__group">
              ${category.skills.slice(mid).map(createSkillHTML).join("")}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const logosMarquee = skillsData.categories
    .map((category) =>
      category.skills
        .map(
          (skill) =>
            `<img src="${skill.icon}" alt="${skill.name}" title="${skill.name}">`
        )
        .join("")
    )
    .join("");

  skillsSection.innerHTML = `
    <span class="section__subtitle">${skillsData.subtitle}</span>
    <h2 class="section__title">${skillsData.title}</h2>
     <i class="section__subtitle" style="color: var(--text-color);text-transform:capitalize;font-size:18px">${skillsData.description}</i>

    <div class="logo-marquee">
      <div class="logo-marquee--gradient"></div>
      <div class="logo-marquee--marquee">
        <div class="logo-marquee--marquee-group">
          ${logosMarquee}
        </div>
        <div class="logo-marquee--marquee-group">
          ${logosMarquee}
        </div>
      </div>
    </div>

    <div class="skills__container container grid">
      ${categoriesHTML}
    </div>

    <div class="logo-marquee">
      <div class="logo-marquee--gradient"></div>
      <div class="logo-marquee--marquee">
        <div class="logo-marquee--marquee-group">
          ${logosMarquee}
        </div>
        <div class="logo-marquee--marquee-group">
          ${logosMarquee}
        </div>
      </div>
      
    </div>
  `;

  // Animate sliders
  document.querySelectorAll(".slider-fill").forEach((slider) => {
    const percent = slider.dataset.percent || 0;
    slider.style.width = "0%";

    setTimeout(() => {
      slider.style.width = `${percent}%`;
    }, 200);
  });
}

// Global variable to store projects for the modal to access
let projectList = [];

function loadEducation(educationData) {
  const section = document.querySelector("#EDUCATION");
  if (!section || !educationData) return;

  const educationHTML = educationData.educations
    .map(
      (edu) => `
    <div class="education__card">
      <div>
        <img src="${edu.image}" alt="Education" class="education__img">
      </div>
      <div class="education__data">
        <h3 class="education__name">${edu.degree}</h3>
        <p class="education__institution">${edu.institution}</p>
        ${edu.cgpa ? `<p class="education__cgpa">CGPA: ${edu.cgpa}</p>` : ""}
        <p class="education__duration">${edu.duration}</p>
      </div>
    </div>`
    )
    .join("");

  section.innerHTML = `
    <span class="section__subtitle">${educationData.sectionSubtitle}</span>
    <h2 class="section__title">${educationData.sectionTitle}</h2>
    <div class="education__container container">
       ${educationHTML}
    </div>`;
}

function loadProjects(projectData) {
  const projectSection = document.querySelector("#project-section");
  if (!projectSection) return;

  projectList = projectData.projects; // Store globally
  let visibleCount = 3;

  projectSection.innerHTML = `
    <span class="section__subtitle">${projectData.sectionSubtitle}</span>
    <h2 class="section__title">${projectData.sectionTitle}</h2>
    <div class="work__container container grid" id="project-container"></div>
    <div style="text-align:center; margin-top:2rem;">
      <button id="toggle-btn" class="toggle-btn button">Show More</button>
    </div>`;

  const container = document.querySelector("#project-container");
  const toggleBtn = document.querySelector("#toggle-btn");

  const renderProjects = () => {
    container.innerHTML = projectList
      .slice(0, visibleCount)
      .map(
        (project, index) => `
      <div class="work__card" style="animation-delay: ${index * 0.1}s;">
        <img src="${project.image}" alt="${project.title}" class="work__img">
        <h3 class="work__title">${project.title}</h3>
       
  <div style="
    width: 100px;
    height: 1px;
    margin: 10px auto ;
    background: linear-gradient(50deg, transparent, var(--first-color-alt), transparent);
    opacity: 0.5;
  "></div>
        <div >
          <button onclick="handleOpenModal(${index})"  class="work__button">
            Know More <i class='bx bx-right-arrow-alt work__icon'></i>
          </button>
        </div>
      </div>`
      )
      .join("");

    const isAllShown = visibleCount >= projectList.length;
    toggleBtn.innerHTML = isAllShown
      ? `Show Less <i class='bx bx-chevron-up'></i>`
      : `Show More <i class='bx bx-chevron-down'></i>`;
  };

  renderProjects();

  toggleBtn.addEventListener("click", () => {
    visibleCount = visibleCount >= projectList.length ? 3 : visibleCount + 3;
    renderProjects();
  });
}

function handleOpenModal(index) {
  const project = projectList[index];
  const modal = document.getElementById("project-modal");
  const techContainer = document.getElementById("modal-tech");
  const noteContainer = document.getElementById("modal-note");

  // Fill Basic Info
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-description").textContent =
    project.description;
  document.getElementById("modal-github").href = project.knowMore;
  document.getElementById("modal-img").src = project.image;
  document.getElementById("modal-live").href = project.link;

  // 1. Handle Tech Stack Badges
  techContainer.innerHTML = project.techStack
    .map((tech) => `<span class="tech-badge">${tech}</span>`)
    .join("");

  // 2. Handle Chatbot Note (Replaces Alert)
  if (project.link.includes("59k265GmL56vvrm")) {
    noteContainer.innerHTML = `<strong>Note:</strong> This chatbot is protected. <br> Password: <code>reverse(654321)</code>`;
    noteContainer.classList.add("show");
  } else {
    noteContainer.classList.remove("show");
    noteContainer.innerHTML = "";
  }

  modal.classList.add("active-modal");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("project-modal").classList.remove("active-modal");
  document.body.style.overflow = "auto";
}

// Close on background click
window.addEventListener("click", (e) => {
  const modal = document.getElementById("project-modal");
  if (e.target === modal) closeModal();
});

function loadInternships(internshipData) {
  const section = document.querySelector("#EXPERIENCE");
  if (!section || !internshipData) return;

  const internshipsHTML = internshipData.internships
    .map(
      (intern) => `
    <div class="internship__card">
      <h3 class="internship__company">${intern.company}</h3>
      <p class="internship__position">
        <strong>${intern.position}</strong> | 
        <span class="internship__duration">${intern.duration}</span>
      </p>
      <p class="internship__description">${intern.description}</p>
      <a href="${intern.certificate}" class="internship__button" target="_blank">
        View Certificate <i class='bx bx-link-external internship__icon'></i>
      </a>
    </div>
  `
    )
    .join("");

  section.innerHTML = `
    <span class="section__subtitle">${internshipData.sectionSubtitle}</span>
    <h2 class="section__title">${internshipData.sectionTitle}</h2>
    <div class="internship__container container grid">
      ${internshipsHTML}
    </div>`;
}

function loadcertification(certificationData) {
  const section = document.querySelector("#CERTIFICATION");
  if (!section || !certificationData) return;

  let visibleCount = 3;
  const certificates = certificationData.certificates;

  // Initialize Structure
  section.innerHTML = `
    <span class="section__subtitle">${certificationData.sectionSubtitle}</span>
    <h2 class="section__title">${certificationData.sectionTitle}</h2>
    <div class="internship__container container grid" id="cert-container"></div>
    <div style="text-align:center; margin-top:2rem;">
      <button id="cert-toggle-btn" class="toggle-btn button">Show More</button>
    </div>`;

  const container = document.querySelector("#cert-container");
  const toggleBtn = document.querySelector("#cert-toggle-btn");

  const render = () => {
    container.innerHTML = certificates
      .slice(0, visibleCount)
      .map(
        (cert, index) => `
      <div class="internship__card" style="animation-delay: ${index * 0.1}s;">
        <h3 class="internship__company">${cert.title}</h3>
        <p class="internship__description">${cert.description}</p>
        <div style="margin-top: 1rem;">
          <a href="${cert.link}" class="internship__button" target="_blank">
            View Certificate <i class='bx bx-link-external internship__icon'></i>
          </a>
        </div>
      </div>
    `
      )
      .join("");

    const isAllShown = visibleCount >= certificates.length;
    toggleBtn.innerHTML = isAllShown
      ? `Show Less <i class='bx bx-chevron-up'></i>`
      : `Show More <i class='bx bx-chevron-down'></i>`;
  };

  render();

  toggleBtn.addEventListener("click", () => {
    visibleCount = visibleCount >= certificates.length ? 3 : visibleCount + 3;
    render();
  });
}

// Start the application
fetchData();

// --- CONTACT FORM LOGIC ---
document.getElementById("sendmessage").addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // 1. Validation (Check before doing anything else)
  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  if (message.length < 10 || message.length > 500) {
    alert("Message must be between 10 and 500 characters.");
    return;
  }

  // 2. Execution
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${email}`);

  window.location.href = `mailto:mohammadibbu008@gmail.com?subject=${subject}&body=${body}`;
});

// --- SCROLL REVEAL ANIMATIONS ---
const sr = ScrollReveal({
  distance: "50px",
  duration: 1000,
  easing: "ease-out",
  reset: false,
});

// Grouped reveals for better readability
sr.reveal(".home", { origin: "top" });
sr.reveal(".about", { origin: "left", delay: 200 });
sr.reveal(".skills", { origin: "right", delay: 300 });
sr.reveal(".education", { origin: "bottom", delay: 400 });
sr.reveal(".experience, .work", { origin: "top", interval: 100 });
sr.reveal(".contact__content", { origin: "left", delay: 700 });
sr.reveal(".footer__container", { origin: "bottom", delay: 800 });

// Custom cursor functionality
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");
const hoverTargets = document.querySelectorAll(".hover-target");
const buttons = document.querySelectorAll(".button, .toggle-btn");

if (window.matchMedia("(pointer: coarse)").matches) {
  // Disable custom cursor effects for touch devices
  cursor.style.display = "none";
  follower.style.display = "none";
} else {
  // Enable custom cursor effects for non-touch devices
  cursor.style.display = "block";
  follower.style.display = "block";
}

let posX = 0,
  posY = 0;
let mouseX = 0,
  mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  // Randomly create trail particles
  if (Math.random() > 0.8) createTrailParticle(mouseX, mouseY);
});

function animate() {
  posX += (mouseX - posX) / 8;
  posY += (mouseY - posY) / 8;
  follower.style.left = posX + "px";
  follower.style.top = posY + "px";
  requestAnimationFrame(animate);
}
animate();

// Hover effects on targets
hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => {
    follower.style.transform = "scale(2)";
    follower.style.borderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--first-color-alt");
  });
  target.addEventListener("mouseleave", () => {
    follower.style.transform = "scale(1)";
    follower.style.borderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--first-color");
  });
});

// Button magnetic and ripple effects
buttons.forEach((button) => {
  button.classList.add("magnetic");

  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.setProperty("--x", `${x * 0.1}px`);
    button.style.setProperty("--y", `${y * 0.1}px`);
  });

  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-3px) scale(1.05)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0) scale(1)";
    button.style.setProperty("--x", "0px");
    button.style.setProperty("--y", "0px");
  });

  button.addEventListener("mousedown", () => {
    button.style.transform = "translateY(-1px) scale(1.02)";
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  button.addEventListener("mouseup", () => {
    button.style.transform = "translateY(-3px) scale(1.05)";
  });
});

function createTrailParticle(x, y) {
  const particle = document.createElement("div");
  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 4px;
    height: 4px;
    background: var(--first-color);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    animation: fadeOut 1s ease-out forwards;
  `;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 1000);
}

// Append keyframes style only once
if (!document.getElementById("fadeOut-style")) {
  const style = document.createElement("style");
  style.id = "fadeOut-style";
  style.textContent = `
    @keyframes fadeOut {
      0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
    }
  `;
  document.head.appendChild(style);
}

//loader
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");

    if (loader) {
      loader.style.transition = "opacity 0.5s ease";
      loader.style.opacity = "0";

      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }
  }, 1500);

  window.scrollTo(0, 0);
});
