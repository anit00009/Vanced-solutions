const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

function toggleMenu() {
    menuToggle.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active")
        ? "hidden"
        : "";
}

menuToggle.addEventListener("click", toggleMenu);

mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        if (link.classList.contains("mobile-services-toggle")) {
            e.preventDefault();
            const subMenu = link.nextElementSibling;
            subMenu.classList.toggle("active");
            link.classList.toggle("active");
            return;
        }
        if (mobileNav.classList.contains("active")) {
            toggleMenu();
        }
    });
});

// Step Navigation Logic
const counters = document.querySelectorAll(".counter");
const nextBtn = document.querySelector(".next-step-btn");
const backBtn = document.querySelector(".light-btn");
const stepBadge = document.getElementById("step-badge");
const stepTitle = document.getElementById("step-title");
const cardsContainer = document.getElementById("cards-container");

let currentStep = 0;

const stepsData = [
    {
        badge: "Step 01: Alignment",
        title: "What is the primary objective for this engagement?",
        cards: [
            { icon: "fa-rocket", title: "New Product Launch", desc: "MVP development and market entry strategy.", dark: false },
            { icon: "fa-download", title: "Scaling & Optimization", desc: "Enhancing performance for established platforms.", dark: true },
            { icon: "fa-universal-access", title: "Enterprise Modernization", desc: "Migrating legacy systems to modern stacks.", dark: false },
            { icon: "fa-regular fa-lightbulb", title: "Strategic Consulting", desc: "Technical audits and roadmap architecture.", dark: false }
        ]
    },
    {
        badge: "Step 02: Infrastructure",
        title: "Which technologies or platforms are you targeting?",
        cards: [
            { icon: "fa-mobile-screen", title: "Mobile Ecosystems", desc: "Native iOS and Android application development.", dark: false },
            { icon: "fa-cloud-arrow-up", title: "Cloud Architecture", desc: "Scalable AWS/Azure infrastructure design.", dark: false },
            { icon: "fa-microchip", title: "AI & Intelligence", desc: "Integrating LLMs and custom machine learning.", dark: false },
            { icon: "fa-code", title: "Web Platforms", desc: "High-performance React/Next.js architectures.", dark: false }
        ]
    },
    {
        badge: "Step 03: Delivery",
        title: "What is the anticipated scale of this project?",
        cards: [
            { icon: "fa-stopwatch", title: "Rapid Prototype", desc: "Deliverable MVP within 4-6 weeks.", dark: false },
            { icon: "fa-layer-group", title: "Full Product Cycle", desc: "End-to-end development (3-6 months).", dark: false },
            { icon: "fa-building-shield", title: "Enterprise Solution", desc: "Complex systems with high security needs.", dark: false },
            { icon: "fa-handshake-angle", title: "Ongoing Partnership", desc: "Continuous support and iterative growth.", dark: false }
        ]
    },
    {
        badge: "Step 04: Summary",
        title: "Finalize your project architecture request",
        cards: [
            { icon: "fa-envelope-open-text", title: "Request Audit", desc: "Get a detailed technical review.", dark: false },
            { icon: "fa-bolt", title: "Fast Track", desc: "Prioritized scheduling for urgent needs.", dark: false },
            { icon: "fa-chart-pie", title: "Budget Analysis", desc: "Get custom cost projections.", dark: false },
            { icon: "fa-circle-check", title: "Confirm Details", desc: "Submit selections to our team.", dark: false }
        ]
    }
];

function updateProgress() {
    // Update Counters
    counters.forEach((counter, index) => {
        if (index === currentStep) {
            counter.classList.add("active");
            counter.classList.remove("deactive");
        } else {
            counter.classList.remove("active");
            counter.classList.add("deactive");
        }
    });

    // Update Text Content
    const data = stepsData[currentStep];
    stepBadge.textContent = data.badge;
    stepTitle.textContent = data.title;

    // Render Cards
    cardsContainer.innerHTML = data.cards.map(card => `
        <div class="contact-tab-card ${card.dark ? 'contact-tab-dark' : 'contact-tab-light'}">
          <div class="d-flex gap-3">
            <div class="icon ${card.dark ? 'icon-bg-light-fade' : 'icon-bg-light'}">
              <i class="fa-solid fs-20 ${card.icon} ${card.dark ? 'text-light' : ''}"></i>
            </div>
            <div>
              <h4 class="fs-16 fw-bold ${card.dark ? 'text-light' : ''}">${card.title}</h4>
              <p class="fs-14 ${card.dark ? 'text-light-fade' : 'text-gray'} mb-0">${card.desc}</p>
            </div>
          </div>
        </div>
      `).join('');

    // Re-attach card click listeners
    attachCardListeners();
}

function attachCardListeners() {
    const cards = document.querySelectorAll(".contact-tab-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => {
                c.classList.remove("contact-tab-dark");
                c.classList.add("contact-tab-light");
                c.querySelector('h4').classList.remove("text-light");
                c.querySelector('p').classList.remove("text-light-fade");
                c.querySelector('p').classList.add("text-gray");
                const iconDiv = c.querySelector('.icon');
                iconDiv.classList.remove('icon-bg-light-fade');
                iconDiv.classList.add('icon-bg-light');
                iconDiv.querySelector('i').classList.remove('text-light');
            });

            card.classList.remove("contact-tab-light");
            card.classList.add("contact-tab-dark");
            card.querySelector('h4').classList.add("text-light");
            card.querySelector('p').classList.remove("text-gray");
            card.querySelector('p').classList.add("text-light-fade");
            const iconDiv = card.querySelector('.icon');
            iconDiv.classList.remove('icon-bg-light');
            iconDiv.classList.add('icon-bg-light-fade');
            iconDiv.querySelector('i').classList.add('text-light');
        });
    });
}

nextBtn.addEventListener("click", () => {
    if (currentStep < stepsData.length - 1) {
        currentStep++;
        updateProgress();
    }
});

backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
    }
});

// Initialize listeners for initial HTML state
attachCardListeners();