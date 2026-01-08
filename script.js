// Data container
let portfolioData = {};

// Google Drive URL converter
function convertGoogleDriveUrl(url) {
    if (!url) return '';
    // Convert shareable link to direct image link
    if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
        }
    }
    // If already a direct link or UC link, return as is
    if (url.includes('uc?export=view') || url.includes('googleusercontent.com')) {
        return url;
    }
    return url;
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    function toggleTheme() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        lucide.createIcons(); // Refresh icons
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            lucide.createIcons();
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });
    }
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 64; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = document.querySelector('#mobile-menu-btn i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons();
                    }
                }
            }
        });
    });
}

// Render Hero Section
function renderHero() {
    const heroHeadline = document.getElementById('hero-headline');
    const heroSubline = document.getElementById('hero-subline');
    
    if (heroHeadline && portfolioData.home) {
        heroHeadline.textContent = portfolioData.home.headline || '';
    }
    
    if (heroSubline && portfolioData.home) {
        heroSubline.textContent = portfolioData.home.subline || '';
    }
}

// Render Social Links
function renderSocialLinks() {
    const socialContainer = document.getElementById('social-links');
    if (!socialContainer || !portfolioData.social) return;
    
    const iconMap = {
        'linkedin': 'linkedin',
        'twitter': 'twitter',
        'x': 'twitter',
        'email': 'mail',
        'mail': 'mail',
        'github': 'github',
        'instagram': 'instagram'
    };
    
    portfolioData.social.forEach(social => {
        const link = document.createElement('a');
        link.href = social.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';
        link.setAttribute('aria-label', social.name);
        
        const iconName = iconMap[social.icon] || 'link';
        link.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
        
        socialContainer.appendChild(link);
    });
    
    lucide.createIcons();
}

// Render Introduction
function renderIntro() {
    const introSection = document.getElementById('intro-section');
    if (!introSection || !portfolioData.about?.intro) return;
    
    const intro = portfolioData.about.intro;
    introSection.innerHTML = `
        <h3 class="text-2xl font-serif font-semibold mb-6">${intro.title || 'Introduction'}</h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed article-text text-lg">${intro.description || ''}</p>
    `;
}

// Render Work Experience
function renderWork() {
    const workSection = document.getElementById('work-section');
    if (!workSection || !portfolioData.about?.work) return;
    
    const work = portfolioData.about.work;
    let html = `<h3 class="text-2xl font-serif font-semibold mb-10">${work.title || 'Work Experience'}</h3>`;
    
    if (work.experiences && work.experiences.length > 0) {
        work.experiences.forEach((exp, index) => {
            html += `
                <div class="mb-12 pb-10 border-b-2 border-gray-200 dark:border-gray-800 last:border-0">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                        <div>
                            <h4 class="text-xl font-serif font-semibold mb-2">${exp.role || ''}</h4>
                            <p class="text-gray-600 dark:text-gray-400 font-medium text-lg">${exp.company || ''}</p>
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-500 mt-2 sm:mt-0 font-mono tracking-wide">${exp.timeframe || ''}</span>
                    </div>
                    <ul class="space-y-3 mt-4">
                        ${exp.achievements ? exp.achievements.map(ach => `<li class="text-gray-700 dark:text-gray-300 leading-relaxed article-text">${ach}</li>`).join('') : ''}
                    </ul>
                </div>
            `;
        });
    }
    
    workSection.innerHTML = html;
}

// Render Education
function renderEducation() {
    const educationSection = document.getElementById('education-section');
    if (!educationSection || !portfolioData.about?.education) return;
    
    const education = portfolioData.about.education;
    let html = `<h3 class="text-2xl font-serif font-semibold mb-10">${education.title || 'Education'}</h3>`;
    
    if (education.institutions && education.institutions.length > 0) {
        html += '<div class="space-y-6">';
        education.institutions.forEach(inst => {
            html += `
                <div class="pb-6 border-b-2 border-gray-200 dark:border-gray-800 last:border-0">
                    <h4 class="text-lg font-serif font-semibold mb-2">${inst.name || ''}</h4>
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${inst.description || ''}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    educationSection.innerHTML = html;
}

// Render Skills
function renderSkills() {
    const skillsSection = document.getElementById('skills-section');
    if (!skillsSection || !portfolioData.about?.skills) return;
    
    const skills = portfolioData.about.skills;
    let html = `<h3 class="text-2xl font-serif font-semibold mb-10">${skills.title || 'Skills'}</h3>`;
    
    if (skills.items && skills.items.length > 0) {
        html += '<div class="space-y-10">';
        skills.items.forEach(item => {
            html += `
                <div class="pb-8 border-b-2 border-gray-200 dark:border-gray-800 last:border-0">
                    <h4 class="text-lg font-serif font-semibold mb-4">${item.title || ''}</h4>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed article-text">${item.description || ''}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    skillsSection.innerHTML = html;
}

// Render Articles
function renderArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid || !portfolioData.articles) return;
    
    if (portfolioData.articles.length === 0) {
        articlesGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No articles yet. Check back soon!</p>';
        return;
    }
    
    articlesGrid.innerHTML = portfolioData.articles.map(article => `
        <article class="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300" data-aos="fade-up">
            <time class="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wide uppercase">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <h3 class="text-xl font-serif font-semibold mt-4 mb-4 leading-tight">${article.title || ''}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed article-text">${article.excerpt || ''}</p>
            <a href="${article.link || '#'}" target="_blank" rel="noopener noreferrer" class="text-gray-900 dark:text-gray-100 font-medium underline-elegant inline-flex items-center group">
                Read More
                <i data-lucide="arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"></i>
            </a>
        </article>
    `).join('');
    
    lucide.createIcons();
}

// Render Gallery
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid || !portfolioData.gallery) return;
    
    if (portfolioData.gallery.length === 0 || !portfolioData.gallery.some(img => img.url)) {
        galleryGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No photos yet. Add Google Drive URLs to the data.json file.</p>';
        return;
    }
    
    galleryGrid.innerHTML = portfolioData.gallery
        .filter(img => img.url && img.url.trim() !== '')
        .map((img, index) => {
            const imageUrl = convertGoogleDriveUrl(img.url);
            return `
                <div class="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 aspect-square" data-aos="fade-up" data-aos-delay="${index % 6 * 50}">
                    <img 
                        src="${imageUrl}" 
                        alt="${img.alt || 'Gallery image'}" 
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 image-loading"
                        loading="lazy"
                        onload="this.classList.remove('image-loading'); this.style.opacity='1'"
                        onerror="this.classList.remove('image-loading'); this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400\\'><i data-lucide=\\'image-off\\' class=\\'w-12 h-12\\'></i></div>'; lucide.createIcons();"
                        style="opacity: 0; transition: opacity 0.3s"
                    >
                    ${img.caption ? `
                        <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p class="text-sm">${img.caption}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    
    lucide.createIcons();
}

// Render Newsletter
function renderNewsletter() {
    const newsletterSection = document.getElementById('newsletter');
    const newsletterTitle = document.getElementById('newsletter-title');
    const newsletterDescription = document.getElementById('newsletter-description');
    
    if (!portfolioData.newsletter || !portfolioData.newsletter.display) {
        if (newsletterSection) {
            newsletterSection.style.display = 'none';
        }
        return;
    }
    
    if (newsletterTitle && portfolioData.newsletter.title) {
        newsletterTitle.textContent = portfolioData.newsletter.title;
    }
    
    if (newsletterDescription && portfolioData.newsletter.description) {
        newsletterDescription.textContent = portfolioData.newsletter.description;
    }
}

// Initialize everything
async function init() {
    try {
        // Fetch data
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        portfolioData = await response.json();
        
        // Render all sections
        renderHero();
        renderSocialLinks();
        renderIntro();
        renderWork();
        renderEducation();
        renderSkills();
        renderArticles();
        renderGallery();
        renderNewsletter();
        
        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
        
        // Initialize theme
        initTheme();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        const isFileProtocol = window.location.protocol === 'file:';
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
                <div class="text-center max-w-2xl mx-auto">
                    <h1 class="text-2xl md:text-3xl font-serif font-bold mb-4">Error Loading Portfolio</h1>
                    ${isFileProtocol ? `
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                            <p class="text-gray-800 dark:text-gray-200 mb-4">
                                <strong>This page must be served via HTTP/HTTPS.</strong> Browsers block local file access for security reasons.
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">To fix this, run a local server:</p>
                            <div class="text-left bg-white dark:bg-gray-900 rounded p-4 font-mono text-sm space-y-2">
                                <p class="text-green-600 dark:text-green-400"># Using Python 3:</p>
                                <p class="text-gray-800 dark:text-gray-200">python -m http.server 8000</p>
                                <p class="text-green-600 dark:text-green-400 mt-4"># Using Python 2:</p>
                                <p class="text-gray-800 dark:text-gray-200">python -m SimpleHTTPServer 8000</p>
                                <p class="text-green-600 dark:text-green-400 mt-4"># Using Node.js (if you have http-server installed):</p>
                                <p class="text-gray-800 dark:text-gray-200">npx http-server -p 8000</p>
                                <p class="text-green-600 dark:text-green-400 mt-4"># Using PHP:</p>
                                <p class="text-gray-800 dark:text-gray-200">php -S localhost:8000</p>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                Then open <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">http://localhost:8000</code> in your browser.
                            </p>
                        </div>
                    ` : `
                        <p class="text-gray-600 dark:text-gray-400 mb-4">Please check that data.json exists and is valid.</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Error details: ${error.message}</p>
                    `}
                    <button onclick="location.reload()" class="mt-6 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium">
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

