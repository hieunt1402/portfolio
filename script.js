document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 2. Fetch Data & Render
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json();
        })
        .then(data => {
            renderHero(data.profile);
            renderAbout(data.about);
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderContact(data.profile);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            const greeting = document.getElementById('hero-greeting');
            if (greeting) greeting.textContent = "Please use VS Code Live Server to load data.";
        });

    // 3. Setup Modal Logic
    setupModal();
});

// --- Functions Render ---
function renderHero(profile) {
    const greetingEl = document.getElementById('hero-greeting');
    if (greetingEl) greetingEl.textContent = `${profile.greeting} ${profile.name}`;
    document.getElementById('hero-name').textContent = profile.name;
    document.getElementById('hero-role').textContent = profile.role;
    document.getElementById('hero-desc').innerHTML = profile.desc;
}

function renderAbout(about) {
    const container = document.getElementById('about-text');
    if (container) container.innerHTML = `<p>${about.text_1}</p><p>${about.text_2}</p>`;
}

function renderSkills(skills) {
    const container = document.getElementById('skills-grid');
    if (!container) return;
    let html = '';
    skills.forEach(skill => {
        let listItems = skill.items.map(item => `<p>${item}</p>`).join('');
        html += `<div class="skill-card"><div class="icon-box"><i class="${skill.icon}"></i></div><h3>${skill.title}</h3>${listItems}</div>`;
    });
    container.innerHTML = html;
}

function renderProjects(projects) {
    const container = document.getElementById('project-grid');
    if (!container) return;
    let html = '';
    projects.forEach(project => {
        let stackHtml = project.stack.map(tech => `<span>${tech}</span>`).join('');
        // Fallback ảnh nếu thiếu
        const imgSrc = project.image ? project.image : 'https://via.placeholder.com/600x400?text=No+Image';

        html += `
        <div class="project-card">
            <div class="card-image">
                <img src="${imgSrc}" alt="${project.title}" class="zoomable-img" loading="lazy" title="Click để phóng to">
                <div class="card-badge">${project.badge}</div>
            </div>
            <div class="card-content">
                <h3>${project.title}</h3>
                <div class="tech-stack">${stackHtml}</div>
                <p class="desc">${project.desc}</p>
                <div class="card-links">
                    <a href="${project.link}" target="_blank"><i class="fab fa-github"></i> Xem Workflow</a>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

function renderContact(profile) {
    const emailBtn = document.getElementById('contact-email');
    if (emailBtn) {
        emailBtn.href = `mailto:${profile.email}`;
        emailBtn.querySelector('span').textContent = profile.email;
    }
    document.getElementById('contact-github').href = profile.github;
    document.getElementById('contact-linkedin').href = profile.linkedin;
}

// --- Logic Modal ---
function setupModal() {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const projectGrid = document.getElementById('project-grid');

    // Event Delegation: Lắng nghe click từ project grid
    if (projectGrid) {
        projectGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoomable-img')) {
                modal.style.display = "block";
                modalImg.src = e.target.src;
                captionText.innerHTML = e.target.alt;
            }
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = "none");
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = "none";
    });
}