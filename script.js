document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    if (!menuToggle || !mobileNav) return;

    const content = mobileNav.querySelector(".mobile-nav-content");
    if (!content) return;

    function closeMenu() {
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
    }

    function openMenu() {
        mobileNav.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function toggleMenu() {
        if (mobileNav.classList.contains("active")) closeMenu();
        else openMenu();
    }

    if (!content.querySelector(".mobile-nav-topbar")) {
        const logoA = document.querySelector(".header .company-logo a");
        const logoImg = document.querySelector(".header .company-logo img");
        const topbar = document.createElement("div");
        topbar.className = "mobile-nav-topbar";
        const href = logoA ? logoA.getAttribute("href") : "index.html";
        const src = logoImg ? logoImg.getAttribute("src") : "";
        const alt = logoImg
            ? logoImg.getAttribute("alt") || "Vanced Solutions"
            : "Vanced Solutions";
        topbar.innerHTML = `<a href="${href}" class="mobile-nav-logo-link"><img src="${src}" alt="${alt}" /></a><button type="button" class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
        content.insertBefore(topbar, content.firstChild);
    }

    document
        .getElementById("mobileNavClose")
        ?.addEventListener("click", closeMenu);

    content.querySelectorAll(".mobile-nav-list > li").forEach((li) => {
        const sub = li.querySelector(":scope > .mobile-sub-menu");
        const link = li.querySelector(":scope > a.mobile-nav-link");
        if (!sub || !link || li.querySelector(".mobile-nav-row")) return;

        const row = document.createElement("div");
        row.className = "mobile-nav-row";
        const icon = link.querySelector("i");
        if (icon) icon.remove();

        link.classList.remove(
            "mobile-about-toggle",
            "mobile-services-toggle",
            "mobile-resources-toggle"
        );

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mobile-nav-submenu-toggle";
        const isOpen = sub.classList.contains("active");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        btn.setAttribute("aria-label", "Toggle submenu");
        btn.innerHTML =
            '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';

        row.appendChild(link);
        row.appendChild(btn);
        li.insertBefore(row, sub);

        if (isOpen) li.classList.add("submenu-open");

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const open = sub.classList.toggle("active");
            li.classList.toggle("submenu-open", open);
            btn.setAttribute("aria-expanded", open ? "true" : "false");
        });
    });

    menuToggle.addEventListener("click", toggleMenu);

    mobileNav.querySelectorAll("a[href]").forEach((a) => {
        a.addEventListener("click", () => {
            const href = a.getAttribute("href") || "";
            if (href.startsWith("#")) {
                closeMenu();
                return;
            }
            closeMenu();
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileNav.classList.contains("active"))
            closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 992) closeMenu();
    });
});

// Step Navigation Logic
if (document.getElementById("contact-steps-section")) {
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
}

const blogDefaults = [
    {
        id: "building-scalable-digital-platforms",
        title: "Building Scalable Digital Platforms for Modern Businesses",
        category: "Future Tech",
        excerpt: "Learn how modern architectures can support business growth and handle increasing user demands.",
        image: "Images/en-insight-img1.png",
        author: "Vanced Solutions",
        date: "2026-05-12",
        readTime: "6 min read",
        content: [
            "Scalable digital platforms start with a clear understanding of business goals, user behavior, and the operational demands that will grow over time.",
            "Modern architecture favors modular systems, clean APIs, reliable observability, and a deployment model that can evolve without slowing the business down.",
            "The best platform decisions are rarely only technical. They connect product strategy, engineering discipline, data visibility, and support workflows into one maintainable system."
        ]
    },
    {
        id: "why-user-experience-matters",
        title: "Why User Experience Matters in Web Development",
        category: "Expert Insights",
        excerpt: "Discover the critical role of UI/UX design in driving customer engagement and retention.",
        image: "Images/en-insight-img2.png",
        author: "Vanced Solutions",
        date: "2026-05-12",
        readTime: "5 min read",
        content: [
            "User experience is the bridge between technical capability and customer value. A fast, stable product still needs clear flows, readable content, and helpful interactions.",
            "Strong UX reduces friction, builds confidence, and helps users finish important tasks without second-guessing the interface.",
            "For growing businesses, thoughtful experience design can improve conversion, reduce support requests, and make every marketing campaign work harder."
        ]
    },
    {
        id: "modern-web-technologies-shaping-growth",
        title: "Modern Web Technologies Shaping Digital Growth",
        category: "Modern Technology",
        excerpt: "Explore the tools and frameworks that are defining the future of digital product development.",
        image: "Images/en-insight-img3.png",
        author: "Vanced Solutions",
        date: "2026-05-12",
        readTime: "7 min read",
        content: [
            "Modern web development is shaped by performance-first frameworks, cloud-native hosting, API-driven systems, and richer front-end experiences.",
            "Teams that choose stable technology foundations can ship faster while keeping maintenance predictable.",
            "The goal is not to chase every new tool. The goal is to build a stack that supports the product, the team, and the business model."
        ]
    },
    {
        id: "aws-vs-azure-for-startups",
        title: "Navigating the Cloud: AWS vs. Azure for Startups",
        category: "Development",
        excerpt: "A practical comparison to help you choose the right cloud provider for your business.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
        author: "Vanced Solutions",
        date: "2026-05-12",
        readTime: "8 min read",
        content: [
            "AWS and Azure both offer mature cloud services, global infrastructure, and strong security capabilities. The right choice depends on your team, integrations, budget, and roadmap.",
            "AWS is often favored for broad service coverage and startup ecosystem depth. Azure is a natural fit for teams already invested in Microsoft tools and enterprise workflows.",
            "Startups should evaluate hosting, database, monitoring, identity, deployment, and support requirements before committing to a provider."
        ]
    }
];

const blogStorageKey = "vanced-blog-posts";

function getPlainTextFromContent(content) {
    if (Array.isArray(content)) return content.join("\n\n");
    return content || "";
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
}

function formatBlogDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
}

function normalizePost(post) {
    const contentText = getPlainTextFromContent(post.content);
    return {
        id: post.id || slugify(post.title),
        title: post.title || "Untitled Blog Post",
        category: post.category || "Insights",
        excerpt: post.excerpt || contentText.slice(0, 150),
        image: post.image || "Images/en-insight-img1.png",
        author: post.author || "Vanced Solutions",
        date: post.date || new Date().toISOString().slice(0, 10),
        readTime: post.readTime || post.read_time || "5 min read",
        content: contentText
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
    };
}

async function loadBlogPosts() {
    try {
        const response = await fetch("blog-data.json", { cache: "no-store" });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.posts)) {
                return data.posts.map(normalizePost);
            }
        }
    } catch (error) {
        // Local file previews can block fetch; localStorage/admin fallback still works.
    }

    const saved = localStorage.getItem(blogStorageKey);
    if (saved) {
        try {
            const posts = JSON.parse(saved);
            if (Array.isArray(posts)) return posts.map(normalizePost);
        } catch (error) {
            localStorage.removeItem(blogStorageKey);
        }
    }

    return blogDefaults.map(normalizePost);
}

function saveBlogPostsLocally(posts) {
    localStorage.setItem(blogStorageKey, JSON.stringify(posts.map(normalizePost)));
}

function renderBlogCards(posts) {
    const grid = document.querySelector("[data-blog-list]");
    const emptyState = document.querySelector("[data-blog-empty]");
    if (!grid) return;

    if (!posts.length) {
        grid.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = posts.map((post) => `
        <article class="blog-card">
            <a href="blog-post.html?id=${encodeURIComponent(post.id)}" class="blog-card-media position-relative overflow-hidden rounded-4 mb-24 shadow-sm d-block">
                <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="w-100 object-fit-cover" style="height: 240px;">
                <span class="badge-item card_third fs-10 position-absolute top-0 end-0 m-3">${escapeHtml(post.category)}</span>
            </a>
            <div class="d-flex gap-3 flex-wrap fs-12 text-gray mb-12">
                <span>${escapeHtml(formatBlogDate(post.date))}</span>
                <span>${escapeHtml(post.readTime)}</span>
            </div>
            <h3 class="fs-22 fw-bold mb-16">${escapeHtml(post.title)}</h3>
            <p class="fs-14 text-gray mb-24">${escapeHtml(post.excerpt)}</p>
            <a href="blog-post.html?id=${encodeURIComponent(post.id)}" class="link-btn fw-bold text-decoration-none">Read Article <i class="fa-solid fa-arrow-right ms-1"></i></a>
        </article>
    `).join("");
}

function renderFeaturedPosts(posts) {
    const grid = document.querySelector("[data-featured-blogs]");
    if (!grid) return;

    grid.innerHTML = posts.slice(0, 3).map((post) => `
        <a href="blog-post.html?id=${encodeURIComponent(post.id)}" class="engineering-insights-card text-decoration-none text-dark">
            <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" />
            <p class="fs-10 fw-semibold mb-12">${escapeHtml(post.category)}</p>
            <h3 class="fs-20 fw-bold mb-0">${escapeHtml(post.title)}</h3>
        </a>
    `).join("");
}

function renderBlogPost(posts) {
    const article = document.querySelector("[data-blog-post]");
    if (!article) return;

    const params = new URLSearchParams(window.location.search);
    const post = posts.find((item) => item.id === params.get("id")) || posts[0];
    if (!post) {
        article.innerHTML = `<div class="container"><p class="fs-18 text-gray mb-0">No blog post found.</p></div>`;
        return;
    }

    document.title = `${post.title} | Vanced Solutions`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", post.excerpt);

    article.innerHTML = `
        <section class="blog-detail-hero bg-soft-gray">
            <div class="container">
                <a href="blog.html" class="link-btn fw-bold text-decoration-none d-flex align-items-center gap-2 mb-32 w-fit-content">
                    <i class="fa-solid fa-arrow-left"></i> Back to Blog
                </a>
                <span class="badge-item card_one d-block fs-12 fw-semibold mb-24 w-fit-content">${escapeHtml(post.category)}</span>
                <h1 class="main-heading fs-72 mb-24">${escapeHtml(post.title)}</h1>
                <div class="d-flex gap-3 flex-wrap fs-14 text-gray">
                    <span>${escapeHtml(post.author)}</span>
                    <span>${escapeHtml(formatBlogDate(post.date))}</span>
                    <span>${escapeHtml(post.readTime)}</span>
                </div>
            </div>
        </section>
        <section class="bg-white bg-light">
            <div class="container blog-detail-container">
                <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="blog-detail-image mb-48">
                <div class="blog-detail-content">
                    ${post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                </div>
            </div>
        </section>
    `;
}

function renderAdminPosts(posts) {
    const list = document.querySelector("[data-admin-posts]");
    if (!list) return;

    list.innerHTML = posts.map((post) => `
        <div class="admin-post-row" data-post-id="${escapeHtml(post.id)}">
            <div>
                <h3 class="fs-18 fw-bold mb-1">${escapeHtml(post.title)}</h3>
                <p class="fs-12 text-gray mb-0">${escapeHtml(post.category)} | ${escapeHtml(formatBlogDate(post.date))}</p>
            </div>
            <div class="d-flex gap-2">
                <button class="light-btn admin-edit-btn" type="button" data-edit-post="${escapeHtml(post.id)}"><i class="fa-solid fa-pen"></i></button>
                <button class="light-btn admin-delete-btn" type="button" data-delete-post="${escapeHtml(post.id)}"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join("");
}

function initBlogAdmin(posts) {
    const form = document.querySelector("[data-blog-admin-form]");
    if (!form) return;

    let currentPosts = [...posts];
    const status = document.querySelector("[data-admin-status]");
    const setStatus = (message, type = "info") => {
        if (!status) return;
        status.textContent = message;
        status.dataset.type = type;
    };

    const fillForm = (post) => {
        form.elements.id.value = post.id;
        form.elements.title.value = post.title;
        form.elements.category.value = post.category;
        form.elements.excerpt.value = post.excerpt;
        form.elements.image.value = post.image;
        form.elements.author.value = post.author;
        form.elements.date.value = post.date;
        form.elements.readTime.value = post.readTime;
        form.elements.content.value = getPlainTextFromContent(post.content);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = "Save Edits";
        
        form.elements.title.focus();
    };

    const clearForm = () => {
        form.reset();
        form.elements.id.value = "";
        form.elements.author.value = "Vanced Solutions";
        form.elements.date.value = new Date().toISOString().slice(0, 10);
        form.elements.readTime.value = "5 min read";
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = "Publish Post";
    };

    const persistPosts = async (postsToSave) => {
        saveBlogPostsLocally(postsToSave);
        let password = form.elements.password.value.trim();
        
        if (!password) {
            password = prompt("Please enter the Admin Password to publish this change to the server:");
            if (!password) {
                setStatus("Saved in this browser only. Add the admin password to save permanently on the Node.js server.", "warning");
                return;
            }
            form.elements.password.value = password; // Temporarily set it
        }

        try {
            const response = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, posts: postsToSave })
            });

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                if (!response.ok) {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
                throw new Error("Invalid response from server. Make sure your hosting supports PHP.");
            }

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not publish posts.");
            }
            setStatus("Published successfully. Your blog-data.json file has been updated.", "success");
        } catch (error) {
            throw error;
        }
    };

    renderAdminPosts(currentPosts);
    clearForm();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const post = normalizePost({
            id: formData.get("id") || slugify(formData.get("title")),
            title: formData.get("title"),
            category: formData.get("category"),
            excerpt: formData.get("excerpt"),
            image: formData.get("image"),
            author: formData.get("author"),
            date: formData.get("date"),
            readTime: formData.get("readTime"),
            content: formData.get("content")
        });

        const existingIndex = currentPosts.findIndex((item) => item.id === post.id);
        if (existingIndex >= 0) {
            currentPosts[existingIndex] = post;
        } else {
            currentPosts = [post, ...currentPosts];
        }

        try {
            await persistPosts(currentPosts);
            renderAdminPosts(currentPosts);
            renderBlogCards(currentPosts);
            clearForm();
        } catch (error) {
            setStatus(error.message, "danger");
        }
    });

    document.addEventListener("click", async (event) => {
        const editButton = event.target.closest("[data-edit-post]");
        const deleteButton = event.target.closest("[data-delete-post]");

        if (editButton) {
            const post = currentPosts.find((item) => item.id === editButton.dataset.editPost);
            if (post) fillForm(post);
        }

        if (deleteButton) {
            const id = deleteButton.dataset.deletePost;
            let password = form.elements.password.value.trim();
            
            if (!password) {
                password = prompt("Please enter the Admin Password to delete this post from the server:");
                if (!password) return; // User cancelled
                form.elements.password.value = password; // temporarily set it so persistPosts can use it
            }

            if (confirm("Are you sure you want to permanently delete this post?")) {
                currentPosts = currentPosts.filter((post) => post.id !== id);
                try {
                    await persistPosts(currentPosts);
                    renderAdminPosts(currentPosts);
                } catch (error) {
                    setStatus(error.message, "danger");
                }
            }
        }
    });

    const resetButton = document.querySelector("[data-admin-reset]");
    if (resetButton) {
        resetButton.addEventListener("click", clearForm);
    }
}

loadBlogPosts().then((posts) => {
    renderBlogCards(posts);
    renderFeaturedPosts(posts);
    renderBlogPost(posts);
    initBlogAdmin(posts);
});

// Contact Form AJAX Handler
document.addEventListener("DOMContentLoaded", () => {
    const contactForms = document.querySelectorAll('form[action="/api/contact"]');
    
    contactForms.forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent the browser from navigating to the raw JSON page
            
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : '';
            if (submitBtn) submitBtn.innerText = "Sending...";
            
            try {
                const formData = new URLSearchParams(new FormData(form));
                
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.type === 'success') {
                    alert(result.message);
                    form.reset();
                } else {
                    alert("Error: " + result.message);
                }
            } catch (error) {
                alert("There was an error sending your message. Please try again later.");
            } finally {
                if (submitBtn) submitBtn.innerText = originalBtnText;
            }
        });
    });
});
