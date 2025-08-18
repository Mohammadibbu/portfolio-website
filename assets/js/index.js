async function sendVisitorData() {
  try {
    // Get visitor data from ipapi.co
    const res = await fetch("https://ipapi.co/json/");
    const ipData = await res.json();

    // Build data object
    const now = new Date().toISOString();

    const data = {
      ip: ipData.ip,
      browser: navigator.userAgent, // Full browser info
      firstVisit: now,
      lastVisit: now,
      totalVisits: 1, // You can update this if you store it in cookies or server
      country: ipData.country_name,
      city: ipData.city,
      location: `${ipData.latitude},${ipData.longitude}`,
    };
    console.log("Visitor data:", data);

    // Send data to Google Sheets
    await fetch(
      "https://script.google.com/macros/s/AKfycby8CKU6u-ub87BaWg6D3qUOjqnq5DwuXshAWbCpImnEHnsELoxejkhUXulocyDxHYi5qQ/exec",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Visitor data sent successfully:", data);
  } catch (error) {
    console.error("Failed to send visitor data:", error);
  }
}

// Run on page load
window.onload = sendVisitorData;
window.addEventListener("load", () => {
  const root = document.documentElement;

  function updateColors() {
    const firstHue = Math.floor(Math.random() * 360);
    const secondHue = (firstHue + 180) % 360; // Opposing hue for contrast
    const saturation = Math.floor(80 + Math.random() * 20) + "%"; // 80%–100%
    const lightness = Math.floor(40 + Math.random() * 20) + "%"; // 40%–60%

    root.style.setProperty("--first-hue", firstHue);
    root.style.setProperty("--second-hue", secondHue);
    root.style.setProperty("--sat", saturation);
    root.style.setProperty("--lig", lightness);
  }

  updateColors(); // initial call

  document
    .getElementById("updatecolors")
    .addEventListener("click", () => location.reload());
});

const themeToggle = document.querySelector("#theme-button");
const body = document.body;

// Apply saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-theme");
  themeToggle.classList.add("bx-moon");
} else {
  themeToggle.classList.add("bx-sun");
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  const isDark = body.classList.contains("dark-theme");

  themeToggle.classList.toggle("bx-moon", isDark);
  themeToggle.classList.toggle("bx-sun", !isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Smooth scroll for internal links
const navLinks = document.querySelectorAll(".nav__link");
const sections = Array.from(navLinks).map((link) => {
  const href = link.getAttribute("href");
  return document.querySelector(href);
});
// Scroll to section on link click
window.addEventListener("scroll", () => {
  const scrollUp = document.getElementById("scroll-up");

  if (window.scrollY >= 200) {
    scrollUp.classList.add("show-scroll");
  } else {
    scrollUp.classList.remove("show-scroll");
  }
});

// Scroll to section on link click
document.getElementById("scroll-up").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
function onScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach((section, index) => {
    if (!section) return; // safety check

    const sectionTop = section.offsetTop - 50; // offset to trigger a bit before
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active-link"));

      // Add active class to current link
      navLinks[index].classList.add("active-link");
    }
  });
}

// Update active link on scroll
window.addEventListener("scroll", onScroll);

// Also keep your click listener to handle clicks
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // Remove active-link from all links
    navLinks.forEach((eachlink) => eachlink.classList.remove("active-link"));

    // Add active-link to clicked one
    e.currentTarget.classList.add("active-link");
  });
});

// Fetch data from the JSON file
async function fetchData() {
  try {
    const response = await fetch("../assets/js/data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await response.json();
    console.log(jsonData);

    loadHome(jsonData.home);
    loadAbout(jsonData.about);
    loadSkills(jsonData.skills);
    loadEducation(jsonData.Education);
    loadProjects(jsonData.projects);
    loadInternships(jsonData.internshipExperience);
    loadcertification(jsonData.certification);
  } catch (error) {
    console.error("There was an error:", error);
  }
}

function loadHome(homeData) {
  const home = document.querySelector("#home");

  const socialLinksHTML = homeData.socialLinks
    .map(
      (link) => `
      <a href="${link.url}" target="_blank" class="home__social-link">
        <i class='${link.icon}'></i>
      </a>
    `
    )
    .join("");
  console.log(socialLinksHTML);

  home.innerHTML = `
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
    </div>
  `;
}

function loadAbout(aboutData) {
  const about = document.querySelector("#about");
  const aboutBoxInfoList = aboutData.infoBoxes
    .map(
      (item) =>
        `
   <div class="about__box">
            <i class='${item.icon} about__icon'></i>
            <h3 class="about__title">${item.title}</h3>
            <span class="about__subtitle">${item.subtitle}</span>
          </div>`
    )
    .join("");
  about.innerHTML = `
    <span class="section__subtitle">My Intro</span>
    <h2 class="section__title">About Me</h2>

    <div class="about__container container grid">
      <img src="${aboutData.image}" alt="" class="about__img">

      <div class="about__data">
        <div class="about__info"> 
          ${aboutBoxInfoList}
        </div>

        <p class="about__description">${aboutData.description}</p>

        <a href="#contact" class="button about__button-contact">Contact Me</a>
      </div>
    </div>`;
}

function loadSkills(skillsData) {
  const skillsSection = document.querySelector("#skills");

  const categoriesHTML = skillsData.categories
    .map((category) => {
      category.skills
        .map(
          (skill) => `
          <div class="skills__data">
            <i class='bx bxs-badge-check'></i>
            <div>
              <h3 class="skills__name">${skill.name}</h3>
              <span class="skills__level">${skill.level}</span>
            </div>
          </div>
        `
        )
        .join("");

      // Split skills into 2 groups
      const mid = Math.ceil(category.skills.length / 2);
      const group1 = category.skills
        .slice(0, mid)
        .map(
          (skill) => `
        <div class="skills__data">
          <i class='bx bxs-badge-check'></i>
          <div>
            <h3 class="skills__name">${skill.name}</h3>
            <span class="skills__level">${skill.level}</span>
          </div>
        </div>`
        )
        .join("");

      const group2 = category.skills
        .slice(mid)
        .map(
          (skill) => `
        <div class="skills__data">
          <i class='bx bxs-badge-check'></i>
          <div>
            <h3 class="skills__name">${skill.name}</h3>
            <span class="skills__level">${skill.level}</span>
          </div>
        </div>`
        )
        .join("");

      return `
        <div class="skills__content">
          <h3 class="skills__title">${category.categoryTitle}</h3>
          <div class="skills__box">
            <div class="skills__group">${group1}</div>
            <div class="skills__group">${group2}</div>
          </div>
        </div>`;
    })
    .join("");

  skillsSection.innerHTML = `
    <span class="section__subtitle">${skillsData.subtitle}</span>
    <h2 class="section__title">${skillsData.title}</h2>
    <div class="skills__container container grid">
      ${categoriesHTML}
    </div>
  `;
}

function loadEducation(EducationData) {
  const EducationSection = document.querySelector("#EDUCATION");

  const EducationHTML = EducationData.educations
    .map((education) => {
      return `
        <div class="education__card ">
        <div><img src="${
          education.image
        }" alt="Education Image" class="education__img"></div>
        <div class="education__data">
          <h3 class="education__name">${education.degree}</h3>
          <p class="education__institution">${education.institution}</p>
         
          ${
            education.cgpa
              ? `<p class="education__cgpa">CGPA: ${education.cgpa}</p>`
              : " "
          }
           <p class="education__duration">${education.duration}</p>
        </div>
        </div>
      `;
    })
    .join("");

  EducationSection.innerHTML = `
    <span class="section__subtitle">${EducationData.sectionSubtitle}</span>
    <h2 class="section__title">${EducationData.sectionTitle}</h2>
    <div class="education__container container ">
      <div class="">
        ${EducationHTML}
      </div>
     
    </div>
  `;
}

function loadProjects(projectData) {
  const projectSection = document.querySelector("#project-section");

  // Section Headers
  const sectionHTML = `
    <span class="section__subtitle">${projectData.sectionTitle}</span>
    <h2 class="section__title">${projectData.sectionSubtitle}</h2>
    <div class="work__container container grid" id="project-container"></div>
    <div style="text-align:center; margin-top:2rem;">
      <button id="toggle-btn" class="toggle-btn">Show More</button>
    </div>
  `;

  projectSection.innerHTML = sectionHTML;

  const container = document.querySelector("#project-container");
  const toggleBtn = document.querySelector("#toggle-btn");

  let visibleCount = 3;
  const increment = 3;

  function renderProjects() {
    const visibleProjects = projectData.projects.slice(0, visibleCount);

    container.innerHTML = visibleProjects
      .map((project, index) => {
        const alertAttr = project.link.includes("59k265GmL56vvrm")
          ? `onclick="alert('The chatbot have been protected\\npassword : reverse(654321)')"`
          : "";
        return `
        <div class="work__card" style="animation-delay: ${index * 0.1}s;">
          <img src="${project.image}" alt="${project.title}" class="work__img">
          <h3 class="work__title">${project.title}</h3>

          <div style="display: flex; justify-content: space-between;margin-top: 1rem;">
            <a href="${
              project.knowMore
            }" ${alertAttr} target="_blank" class="work__button">
              Know More <i class='bx bx-right-arrow work__icon'></i>
            </a>
            <a href="${
              project.link
            }" ${alertAttr} target="_blank" class="work__button">
              Live <i class='bx bx-right-arrow work__icon'></i>
            </a>
          </div>
        </div>
      `;
      })
      .join("");

    toggleBtn.innerHTML =
      visibleCount >= projectData.projects.length
        ? `Show Less <i class='bx bx-chevron-up'></i>`
        : `Show More <i class='bx bx-chevron-down'></i>`;
  }

  // Initial render
  renderProjects();

  // Button event
  toggleBtn.addEventListener("click", () => {
    if (visibleCount >= projectData.projects.length) {
      // Reset to show only 3
      visibleCount = 3;
    } else {
      // Show more
      visibleCount += increment;
    }

    renderProjects();
  });
}

// Function to load internships
function loadInternships(internshipData) {
  const internshipSection = document.querySelector("#EXPERIENCE");

  const internshipsHTML = internshipData.internships
    .map(
      (internship) => `
      <div class="internship__card">
        <h3 class="internship__company">${internship.company}</h3>
        <p class="internship__position">
          <strong>${internship.position}</strong> |
          <span class="internship__duration">${internship.duration}</span>
        </p>
        <p class="internship__description">${internship.description}</p>
        <a href="${internship.certificate}" class="internship__button" target="_blank">
          View Certificate <i class='bx bx-link-external internship__icon'></i>
        </a>
      </div>
    `
    )
    .join("");

  internshipSection.innerHTML = `
    <span class="section__subtitle">${internshipData.sectionSubtitle}</span>
    <h2 class="section__title">${internshipData.sectionTitle}</h2>
    <div class="internship__container container grid">
      ${internshipsHTML}
    </div>
  `;
}
function loadcertification(certificationData) {
  const certificationSection = document.querySelector("#CERTIFICATION");

  // Render section headers and containers
  const sectionHTML = `
    <span class="section__subtitle">${certificationData.sectionSubtitle}</span>
    <h2 class="section__title">${certificationData.sectionTitle}</h2>
    <div class="internship__container container grid" id="certification-container"></div>
    <div style="text-align:center; margin-top:2rem;">
      <button id="cert-toggle-btn" class="toggle-btn">Show More</button>
    </div>
  `;

  certificationSection.innerHTML = sectionHTML;

  const container = document.querySelector("#certification-container");
  const toggleBtn = document.querySelector("#cert-toggle-btn");

  let visibleCount = 3;
  const increment = 3;

  function renderCertificates() {
    const visibleCertificates = certificationData.certificates.slice(
      0,
      visibleCount
    );

    container.innerHTML = visibleCertificates
      .map(
        (certificate, index) => `
        <div class="internship__card" style="animation-delay: ${index * 0.1}s;">
         
          <h3 class="internship__company">${certificate.title}</h3>
          <p class="internship__description">${certificate.description}</p>
          <div style="margin-top: 1rem;">
            <a href="${
              certificate.link
            }" class="internship__button" target="_blank">
              View Certificate <i class='bx bx-link-external internship__icon'></i>
            </a>
          </div>
        </div>
      `
      )
      .join("");

    toggleBtn.innerHTML =
      visibleCount >= certificationData.certificates.length
        ? `Show Less <i class='bx bx-chevron-up'></i>`
        : `Show More <i class='bx bx-chevron-down'></i>`;
  }

  // Initial render
  renderCertificates();

  // Toggle button event
  toggleBtn.addEventListener("click", () => {
    if (visibleCount >= certificationData.certificates.length) {
      visibleCount = 3; // Reset
    } else {
      visibleCount += increment; // Show more
    }

    renderCertificates();
  });
}

// Call the fetchData function to start everything
fetchData();

document.getElementById("sendmessage").addEventListener("click", function (e) {
  e.preventDefault(); // prevent default form submission

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const mailtoLink = `mailto:mohammadibbu008@gmail.com?subject=Message from ${encodeURIComponent(
    name
  )}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(
    email
  )}`;

  // Open the user's default email client
  if (name === "" || email === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  } else if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  } else if (message.length < 10) {
    alert("Message should be at least 10 characters long.");
    return;
  } else if (message.length > 500) {
    alert("Message should be less than 500 characters.");
    return;
  }
  window.location.href = mailtoLink;
});

ScrollReveal({
  distance: "50px",
  duration: 1000,
  easing: "ease-out",
  reset: false, // true = animation occurs every time you scroll up/down
});

// Example usage per section
ScrollReveal().reveal(".home", { origin: "top" });
ScrollReveal().reveal(".about", { origin: "left", delay: 200 });
ScrollReveal().reveal(".skills", { origin: "right", delay: 300 });
ScrollReveal().reveal(".education", { origin: "bottom", delay: 400 });
ScrollReveal().reveal(".experience", { origin: "top", delay: 500 });
ScrollReveal().reveal(".work", { origin: "bottom", delay: 600 });
ScrollReveal().reveal(".contact__content", { origin: "left", delay: 700 });
ScrollReveal().reveal(".footer__container", { origin: "bottom", delay: 800 });

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
