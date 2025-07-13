window.addEventListener("load", () => {
  const root = document.documentElement;
  
  // Enhanced loading screen
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(loadingScreen);
  
  // Remove loading screen after content loads
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 2000);

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
});

// Enhanced scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      entry.target.classList.add('animate-in');
      
      // Add staggered animation to child elements
      const children = entry.target.querySelectorAll('.work__card, .about__box, .contact__card, .skills__data');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.style.animation = `slideInScale 0.6s ease-out forwards`;
        }, index * 100);
      });
    }
  });
}, observerOptions);

// Observe all sections for animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Scroll to top button
const scrollUp = () => {
  const scrollUp = document.getElementById('scroll-up');
  if (window.scrollY >= 560) {
    scrollUp.classList.add('show-scroll');
  } else {
    scrollUp.classList.remove('show-scroll');
  }
};
window.addEventListener('scroll', scrollUp);

// Enhanced header scroll effect
function scrollHeader() {
  const nav = document.getElementById('header');
  if (window.scrollY >= 80) {
    nav.classList.add('scroll-header');
  } else {
    nav.classList.remove('scroll-header');
  }
}
window.addEventListener('scroll', scrollHeader);

// Parallax effect for home section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.home__handle');
  const speed = scrolled * 0.5;
  
  if (parallax) {
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Enhanced typing effect for home name
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  element.style.borderRight = '3px solid var(--first-color)';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Typing complete, add glow effect
      setTimeout(() => {
        element.style.borderRight = 'none';
        element.classList.add('typing-complete');
      }, 1000);
    }
  }
  type();
}

// Smooth reveal animations for cards
function revealCards() {
  const cards = document.querySelectorAll('.work__card, .about__box, .skills__content, .contact__card');
  
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Enhanced button interactions
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button, .toggle-btn');
  
  buttons.forEach(button => {
    // Add magnetic effect
    button.classList.add('magnetic');
    
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.setProperty('--x', `${x * 0.1}px`);
      this.style.setProperty('--y', `${y * 0.1}px`);
    });
    
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.setProperty('--x', '0px');
      this.style.setProperty('--y', '0px');
    });
    
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(-1px) scale(1.02)';
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
  });
});

// Enhanced cursor trail effect with particles
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
const trails = [];

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Create trail particles
  if (Math.random() > 0.8) {
    createTrailParticle(mouseX, mouseY);
  }
});

function createTrailParticle(x, y) {
  const particle = document.createElement('div');
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

// Add CSS for fadeOut animation
const style = document.createElement('style');
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

  // Enhanced theme transition
  body.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

  themeToggle.classList.toggle("bx-moon", isDark);
  themeToggle.classList.toggle("bx-sun", !isDark);

  // Add rotation animation to theme button
  themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
  setTimeout(() => {
    themeToggle.style.transform = 'rotate(0deg) scale(1)';
  }, 300);

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Smooth scroll for internal links
const navLinks = document.querySelectorAll(".nav__link");
const sections = Array.from(navLinks).map((link) => {
  const href = link.getAttribute("href");
  return document.querySelector(href);
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

  // Add particles background
  const particlesHTML = `
    <div class="particles">
      ${Array.from({length: 10}, (_, i) => `<div class="particle"></div>`).join('')}
    </div>
  `;

  // Enhanced social links with stagger animation
  const socialLinksHTML = homeData.socialLinks
    .map(
      (link, index) => `
      <a href="${link.url}" target="_blank" class="home__social-link">
        <i class='${link.icon}'></i>
      </a>
    `
    )
    .join("");
  console.log(socialLinksHTML);

  home.innerHTML = `
    ${particlesHTML}
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
  
  // Add typing effect to name after content loads
  setTimeout(() => {
    const nameElement = document.querySelector('.home__name');
    if (nameElement) {
      const originalText = nameElement.textContent;
      typeWriter(nameElement, originalText, 150);
    }
  }, 1000);
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
        return `
        <div class="work__card" style="--card-delay: ${index * 0.1}s;">
          <img src="${project.image}" alt="${project.title}" class="work__img">
          <h3 class="work__title">${project.title}</h3>
          <p class="work__description" style="font-size: var(--small-font-size); color: var(--text-color); margin: 0.5rem 0; line-height: 1.5; flex-grow: 1;">${project.description}</p>
          <div style="display: flex; justify-content: space-between;margin-top: 1rem;">
            <a href="${project.knowMore}" target="_blank" class="work__button">
              Know More <i class='bx bx-right-arrow work__icon'></i>
            </a>
            <a href="${project.link}" target="_blank" class="work__button">
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
    
    // Re-observe new cards for animations
    const newCards = container.querySelectorAll('.work__card');
    newCards.forEach(card => observer.observe(card));
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
        <div class="internship__card" style="--intern-delay: ${index * 0.1}s;">
         
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
    
    // Re-observe new cards for animations
    const newCards = container.querySelectorAll('.internship__card');
    newCards.forEach(card => observer.observe(card));
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

// Enhanced form validation and submission
document.getElementById("sendmessage").addEventListener("click", function (e) {
  e.preventDefault(); // prevent default form submission

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  
  // Enhanced validation with visual feedback
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  
  function showError(input, message) {
    input.style.borderColor = '#ff6b6b';
    input.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
    
    // Remove error styling after 3 seconds
    setTimeout(() => {
      input.style.borderColor = 'var(--text-color-light)';
      input.style.boxShadow = 'none';
    }, 3000);
  }
  
  function showSuccess(input) {
    input.style.borderColor = 'var(--first-color)';
    input.style.boxShadow = '0 0 10px hsla(var(--first-hue), var(--sat), var(--lig), 0.3)';
  }

  const mailtoLink = `mailto:mohammadibbu008@gmail.com?subject=Message from ${encodeURIComponent(
    name
  )}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(
    email
  )}`;

  // Open the user's default email client
  if (name === "" || email === "" || message === "") {
    if (name === "") showError(nameInput, "Name is required");
    if (email === "") showError(emailInput, "Email is required");
    if (message === "") showError(messageInput, "Message is required");
    alert("Please fill in all fields.");
    return;
  } else if (!email.includes("@")) {
    showError(emailInput, "Invalid email format");
    alert("Please enter a valid email address.");
    return;
  } else if (message.length < 10) {
    showError(messageInput, "Message too short");
    alert("Message should be at least 10 characters long.");
    return;
  } else if (message.length > 500) {
    showError(messageInput, "Message too long");
    alert("Message should be less than 500 characters.");
    return;
  }
  
  // Show success state
  showSuccess(nameInput);
  showSuccess(emailInput);
  showSuccess(messageInput);
  
  window.location.href = mailtoLink;
});

// Enhanced ScrollReveal configuration
ScrollReveal({
  distance: "60px",
  duration: 1200,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  reset: false,
  viewFactor: 0.2,
  interval: 100
});

// Enhanced ScrollReveal animations
ScrollReveal().reveal(".home__data", { origin: "left", delay: 200 });
ScrollReveal().reveal(".home__handle", { origin: "top", delay: 400 });
ScrollReveal().reveal(".home__social", { origin: "left", delay: 600 });
ScrollReveal().reveal(".home__scroll", { origin: "right", delay: 800 });

ScrollReveal().reveal(".about__img", { origin: "left", delay: 200 });
ScrollReveal().reveal(".about__data", { origin: "right", delay: 400 });
ScrollReveal().reveal(".about__box", { origin: "bottom", delay: 200, interval: 100 });

ScrollReveal().reveal(".skills__content", { origin: "top", delay: 200, interval: 200 });
ScrollReveal().reveal(".skills__data", { origin: "left", delay: 100, interval: 50 });

ScrollReveal().reveal(".education__card", { origin: "bottom", delay: 200, interval: 200 });
ScrollReveal().reveal(".internship__card", { origin: "top", delay: 200, interval: 200 });
ScrollReveal().reveal(".work__card", { origin: "bottom", delay: 100, interval: 100 });

ScrollReveal().reveal(".contact__card", { origin: "top", delay: 200, interval: 150 });
ScrollReveal().reveal(".contact__form", { origin: "right", delay: 400 });

ScrollReveal().reveal(".footer__title", { origin: "top", delay: 200 });
ScrollReveal().reveal(".footer__list", { origin: "left", delay: 400 });
ScrollReveal().reveal(".footer__social", { origin: "right", delay: 600 });
ScrollReveal().reveal(".footer__copy", { origin: "bottom", delay: 800 });