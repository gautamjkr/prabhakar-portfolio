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
    // Mobile theme toggle is now in the header (same button for both desktop and mobile)
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
            scrollToSection(targetId);
            
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
        });
    });
}

// Scroll to a specific section
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 64; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Handle hash navigation when coming from another page
function handleHashNavigation() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the #
        
        // Wait for all content to be rendered (sections are dynamically loaded)
        // Try multiple times to ensure content is loaded
        const attemptScroll = (attempts = 0) => {
            const targetElement = document.getElementById(hash);
            if (targetElement && targetElement.offsetTop > 0) {
                // Element exists and has been rendered
                scrollToSection(hash);
            } else if (attempts < 10) {
                // Retry after a short delay (content might still be loading)
                setTimeout(() => attemptScroll(attempts + 1), 100);
            } else {
                // Final attempt after longer delay
                setTimeout(() => scrollToSection(hash), 500);
            }
        };
        
        // Start attempting to scroll
        attemptScroll();
    }
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
        <h3 class="text-xl sm:text-2xl font-serif font-semibold mb-4 md:mb-6">${intro.title || 'Introduction'}</h3>
        <p class="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed article-text">${intro.description || ''}</p>
    `;
}

// Render Work Experience (Timeline)
function renderWork() {
    const workSection = document.getElementById('work-section');
    if (!workSection || !portfolioData.about?.work) return;
    
    const work = portfolioData.about.work;
    let html = `<h3 class="text-xl sm:text-2xl font-serif font-semibold mb-8 md:mb-10">${work.title || 'Work Experience'}</h3>`;
    
    if (work.experiences && work.experiences.length > 0) {
        html += '<div class="relative overflow-hidden">';
        
        // Vertical timeline line - adjust for mobile, add top padding
        html += '<div class="absolute left-3 md:left-8 top-2 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>';
        
        html += '<div class="space-y-6 md:space-y-8 pt-2">';
        work.experiences.forEach((exp, index) => {
            const isLast = index === work.experiences.length - 1;
            const typeColors = {
                'Television': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
                'Print': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
                'Digital': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
                'Organization': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800',
                'Social Impact': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-800'
            };
            
            // Handle type as array or string (backward compatibility)
            const types = Array.isArray(exp.type) ? exp.type : (exp.type ? [exp.type] : []);
            const typeBadges = types.map(type => {
                const typeColor = typeColors[type] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
                return `<span class="px-2.5 py-1 rounded-md text-xs font-medium border ${typeColor} whitespace-nowrap">${type}</span>`;
            }).join('');
            
            html += `
                <div class="relative pl-10 md:pl-16 timeline-item mb-4 md:mb-6">
                    <!-- Timeline dot -->
                    <div class="absolute left-1.5 md:left-6 top-5 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white border-2 border-white dark:border-gray-950 transform -translate-x-1/2 timeline-dot"></div>
                    
                    <div class="bg-white dark:bg-gray-900 border-l-2 border-gray-200 dark:border-gray-800 pl-3 md:pl-6 pt-3 md:pt-4 pb-3 md:pb-4 pr-2 md:pr-4 rounded-r-lg">
                        <div class="flex flex-col gap-2 md:gap-3">
                            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 md:gap-4">
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm sm:text-base md:text-lg font-serif font-semibold mb-1 md:mb-1.5 break-words leading-tight">${exp.role || ''}</h4>
                                    <p class="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium break-words">${exp.company || ''}</p>
                                </div>
                                <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                    ${typeBadges ? `<div class="flex flex-wrap gap-1 sm:gap-1.5">${typeBadges}</div>` : ''}
                                    <span class="text-xs text-gray-500 dark:text-gray-500 font-mono whitespace-nowrap">${exp.timeframe || ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        html += '</div>';
    }
    
    workSection.innerHTML = html;
}

// Render Education (Vertical Timeline on Mobile, Horizontal on Desktop)
function renderEducation() {
    const educationSection = document.getElementById('education-section');
    if (!educationSection || !portfolioData.about?.education) return;
    
    const education = portfolioData.about.education;
    let html = `<h3 class="text-xl sm:text-2xl font-serif font-semibold mb-8 md:mb-10">${education.title || 'Education'}</h3>`;
    
    if (education.institutions && education.institutions.length > 0) {
        // Mobile: Vertical Timeline (same as work experience)
        html += '<div class="relative overflow-hidden md:hidden">';
        html += '<div class="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>';
        html += '<div class="space-y-6 pt-2">';
        
        education.institutions.forEach((inst, index) => {
            const yearMatch = inst.name.match(/\((\d{4})-(\d{4})\)/);
            const startYear = yearMatch ? yearMatch[1] : '';
            const endYear = yearMatch ? yearMatch[2] : '';
            const isPursuing = inst.name.toLowerCase().includes('pursuing') || inst.name.toLowerCase().includes('present');
            let cleanName = inst.name.replace(/\s*\([^)]*\)\s*/g, '').trim();
            cleanName = cleanName.replace(/\s*-\s*(Pursuing|Present)/i, '').trim();
            
            let yearDisplay = '';
            if (yearMatch) {
                yearDisplay = `${startYear} - ${endYear || 'Present'}`;
            } else if (isPursuing) {
                yearDisplay = 'Ongoing';
            }
            
            html += `
                <div class="relative pl-10 timeline-item mb-4">
                    <!-- Timeline dot -->
                    <div class="absolute left-1.5 top-5 w-3 h-3 rounded-full bg-gray-900 dark:bg-white border-2 border-white dark:border-gray-950 transform -translate-x-1/2 timeline-dot"></div>
                    
                    <div class="bg-white dark:bg-gray-900 border-l-2 border-gray-200 dark:border-gray-800 pl-3 pt-3 pb-3 pr-2 rounded-r-lg">
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-col gap-2">
                                <div class="flex-1 min-w-0">
                                    ${isPursuing ? '<span class="inline-block px-2 py-0.5 mb-1.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">Ongoing</span>' : ''}
                                    <h4 class="text-sm font-serif font-semibold mb-1 break-words leading-tight">${cleanName}</h4>
                                    <p class="text-xs text-gray-600 dark:text-gray-400 break-words">${inst.description || ''}</p>
                                </div>
                                ${yearDisplay ? `<span class="text-xs text-gray-500 dark:text-gray-500 font-mono whitespace-nowrap mt-1">${yearDisplay}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        html += '</div>';
        
        // Desktop: Horizontal Timeline
        html += '<div class="relative overflow-x-auto pb-6 md:pb-8 w-full hidden md:block">';
        html += '<div class="absolute left-0 right-0 top-6 h-0.5 bg-gray-300 dark:bg-gray-700"></div>';
        html += '<div class="grid grid-cols-4 gap-4 relative">';
        
        education.institutions.forEach((inst, index) => {
            const yearMatch = inst.name.match(/\((\d{4})-(\d{4})\)/);
            const startYear = yearMatch ? yearMatch[1] : '';
            const endYear = yearMatch ? yearMatch[2] : '';
            const isPursuing = inst.name.toLowerCase().includes('pursuing') || inst.name.toLowerCase().includes('present');
            let cleanName = inst.name.replace(/\s*\([^)]*\)\s*/g, '').trim();
            cleanName = cleanName.replace(/\s*-\s*(Pursuing|Present)/i, '').trim();
            
            let yearDisplay = '';
            if (yearMatch) {
                yearDisplay = `<div class="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">${startYear} - ${endYear || 'Present'}</div>`;
            } else if (isPursuing) {
                yearDisplay = `<div class="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">Ongoing</div>`;
            }
            
            html += `
                <div class="relative flex flex-col items-center text-center timeline-item">
                    <!-- Timeline dot -->
                    <div class="relative z-10 w-6 h-6 rounded-full bg-gray-900 dark:bg-white border-4 border-white dark:border-gray-950 mb-4 timeline-dot"></div>
                    
                    <!-- Degree card -->
                    <div class="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        ${isPursuing ? '<span class="inline-block px-2 py-1 mb-2 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">Ongoing</span>' : ''}
                        ${yearDisplay}
                        <h4 class="text-sm font-serif font-semibold mb-2 leading-tight flex-grow">${cleanName}</h4>
                        <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2">${inst.description || ''}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        html += '</div>';
    }
    
    educationSection.innerHTML = html;
}

// Render Skills (Enhanced with Icons)
function renderSkills() {
    const skillsSection = document.getElementById('skills-section');
    if (!skillsSection || !portfolioData.about?.skills) return;
    
    const skills = portfolioData.about.skills;
    let html = `<h3 class="text-xl sm:text-2xl font-serif font-semibold mb-8 md:mb-10">${skills.title || 'Skills'}</h3>`;
    
    if (skills.items && skills.items.length > 0) {
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">';
        
        skills.items.forEach((item, index) => {
            const iconName = item.icon || 'star';
            const iconMap = {
                'search': 'search',
                'video': 'video',
                'pen-tool': 'pen-tool',
                'check-circle': 'check-circle',
                'camera': 'camera',
                'edit': 'edit'
            };
            const icon = iconMap[iconName] || 'star';
            
            html += `
                <div class="group relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-4 md:p-6 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 skill-card">
                    <!-- Icon -->
                    <div class="mb-3 md:mb-4 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-700 dark:group-hover:to-gray-800 transition-all duration-300 shadow-sm">
                        <i data-lucide="${icon}" class="w-6 h-6 md:w-7 md:h-7 text-gray-900 dark:text-gray-100"></i>
                    </div>
                    
                    <!-- Title -->
                    <h4 class="text-base md:text-lg font-serif font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 leading-tight">${item.title || ''}</h4>
                    
                    <!-- Description -->
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">${item.description || ''}</p>
                    
                    <!-- Tools/Technologies -->
                    ${item.tools && item.tools.length > 0 ? `
                        <div class="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-800">
                            ${item.tools.map(tool => `
                                <span class="px-2 py-1 md:px-3 md:py-1.5 text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
                                    ${tool}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    skillsSection.innerHTML = html;
    lucide.createIcons();
}

// Render Articles
function renderArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid || !portfolioData.articles) return;
    
    if (portfolioData.articles.length === 0) {
        articlesGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No articles yet. Check back soon!</p>';
        return;
    }
    
    // Check if we're on home page (limit to 3) or articles page (show all)
    // Handle GitHub Pages URLs: /, /repo-name/, /repo-name/index.html, /index.html
    const pathname = window.location.pathname;
    const isHomePage = pathname === '/' || 
                       pathname === '' || 
                       pathname.endsWith('/') || 
                       pathname.endsWith('index.html') || 
                       pathname.endsWith('/index.html');
    const articlesToShow = isHomePage ? portfolioData.articles.slice(0, 3) : portfolioData.articles;
    
    // Helper function to detect if text contains Devanagari (Hindi) characters
    function containsDevanagari(text) {
        return /[\u0900-\u097F]/.test(text);
    }
    
    articlesGrid.innerHTML = articlesToShow.map(article => {
        const hasHindi = containsDevanagari(article.title || '');
        const titleClass = hasHindi ? 'text-xl font-semibold mt-4 mb-4 leading-relaxed hindi-text' : 'text-xl font-serif font-semibold mt-4 mb-4 leading-tight';
        
        return `
        <article class="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
            <h3 class="${titleClass}" ${hasHindi ? 'lang="hi"' : ''}>${article.title || ''}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed article-text">${article.excerpt || ''}</p>
            <a href="${article.link || '#'}" target="_blank" rel="noopener noreferrer" class="text-gray-900 dark:text-gray-100 font-medium underline-elegant inline-flex items-center group">
                Read More
                <i data-lucide="arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"></i>
            </a>
        </article>
    `;
    }).join('');
    
    lucide.createIcons();
}

// Render Gallery
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid || !portfolioData.gallery) return;
    
    // Check if gallery is array of strings (filenames) or old structure
    let files = [];
    
    if (Array.isArray(portfolioData.gallery)) {
        if (portfolioData.gallery.length > 0) {
            // Check if first item is a string (filename) or object
            if (typeof portfolioData.gallery[0] === 'string') {
                // New structure: array of filenames
                files = portfolioData.gallery
                    .filter(filename => filename && filename.trim() !== '')
                    .sort(); // Sort alphabetically
            } else {
                // Old structure: array of objects with url (backward compatibility)
                files = portfolioData.gallery
                    .filter(img => img.url && img.url.trim() !== '');
            }
        }
    }
    
    // Check if we're on home page (limit to 3) or gallery page (show all)
    // Handle GitHub Pages URLs: /, /repo-name/, /repo-name/index.html, /index.html
    const pathname = window.location.pathname;
    const isHomePage = pathname === '/' || 
                       pathname === '' || 
                       pathname.endsWith('/') || 
                       pathname.endsWith('index.html') || 
                       pathname.endsWith('/index.html');
    if (isHomePage) {
        files = files.slice(0, 3); // Take top 3 on home page
    }
    
    if (files.length === 0) {
        galleryGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No photos yet. Add image filenames to the gallery array in data.json.</p>';
        return;
    }
    
    galleryGrid.innerHTML = files.map((file, index) => {
        let imageUrl, alt, caption;
        
        if (typeof file === 'string') {
            // New structure: filename string
            imageUrl = `assets/images/gallery/${file}`;
            alt = file.replace(/\.[^/.]+$/, ''); // Remove extension for alt text
            caption = '';
        } else {
            // Old structure: object with url (backward compatibility)
            imageUrl = convertGoogleDriveUrl(file.url);
            alt = file.alt || 'Gallery image';
            caption = file.caption || '';
        }
        
        return `
            <div class="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 aspect-square cursor-pointer" 
                 onclick="openLightbox('${imageUrl}', ${index}, ${files.length})">
                <img 
                    src="${imageUrl}" 
                    alt="${alt}" 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 image-loading"
                    loading="lazy"
                    data-image-index="${index}"
                    data-image-url="${imageUrl}"
                    data-image-alt="${alt}"
                    onload="this.classList.remove('image-loading'); this.style.opacity='1'"
                    onerror="this.classList.remove('image-loading'); this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400\\'><i data-lucide=\\'image-off\\' class=\\'w-12 h-12\\'></i></div>'; lucide.createIcons();"
                    style="opacity: 0; transition: opacity 0.3s"
                >
                ${caption ? `
                    <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p class="text-sm">${caption}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
    
    // Store gallery images for lightbox navigation
    window.galleryImages = files.map((file, idx) => {
        if (typeof file === 'string') {
            return {
                url: `assets/images/gallery/${file}`,
                alt: file.replace(/\.[^/.]+$/, '')
            };
        } else {
            return {
                url: convertGoogleDriveUrl(file.url),
                alt: file.alt || 'Gallery image'
            };
        }
    });
}

// Lightbox functionality
let currentImageIndex = 0;
let lightboxImages = [];

function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    if (!lightbox) return;
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateLightbox(-1));
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });
    
    // Prevent body scroll when lightbox is open
    const observer = new MutationObserver(() => {
        if (!lightbox.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    observer.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
}

// Open lightbox with image
function openLightbox(imageUrl, imageIndex, totalImages) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    if (!lightbox || !lightboxImage) return;
    
    // Use stored gallery images or get from DOM
    if (window.galleryImages && window.galleryImages.length > 0) {
        lightboxImages = window.galleryImages;
    } else {
        // Fallback: get images from DOM
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
            const images = Array.from(galleryGrid.querySelectorAll('img[data-image-url]'));
            lightboxImages = images.map(img => ({
                url: img.getAttribute('data-image-url'),
                alt: img.getAttribute('data-image-alt') || ''
            }));
        }
    }
    
    if (lightboxImages.length === 0) return;
    
    // Find the index of the clicked image
    currentImageIndex = lightboxImages.findIndex(img => img.url === imageUrl);
    if (currentImageIndex === -1) {
        currentImageIndex = imageIndex || 0;
    }
    
    // Update image
    lightboxImage.src = lightboxImages[currentImageIndex].url;
    lightboxImage.alt = lightboxImages[currentImageIndex].alt || 'Gallery image';
    
    // Show/hide navigation buttons
    if (prevBtn) {
        prevBtn.classList.toggle('hidden', lightboxImages.length <= 1);
    }
    if (nextBtn) {
        nextBtn.classList.toggle('hidden', lightboxImages.length <= 1);
    }
    
    // Show lightbox
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Refresh icons
    lucide.createIcons();
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Navigate lightbox
function navigateLightbox(direction) {
    if (lightboxImages.length <= 1) return;
    
    currentImageIndex += direction;
    
    // Wrap around
    if (currentImageIndex < 0) {
        currentImageIndex = lightboxImages.length - 1;
    } else if (currentImageIndex >= lightboxImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) {
        lightboxImage.src = lightboxImages[currentImageIndex].url;
        lightboxImage.alt = lightboxImages[currentImageIndex].alt || 'Gallery image';
    }
}

// Make functions globally available
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;

// Initialize Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    if (!contactForm) return;
    
    // Populate form fields from data.json
    if (portfolioData.contact) {
        const accessKeyInput = document.getElementById('form-access-key');
        const subjectInput = document.getElementById('form-subject');
        const fromNameInput = document.getElementById('form-from-name');
        
        if (accessKeyInput && portfolioData.contact.access_key) {
            accessKeyInput.value = portfolioData.contact.access_key;
        }
        if (subjectInput && portfolioData.contact.subject) {
            subjectInput.value = portfolioData.contact.subject;
        }
        if (fromNameInput && portfolioData.contact.from_name) {
            fromNameInput.value = portfolioData.contact.from_name;
        }
    }
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        formMessage.classList.add('hidden');
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Success
                formMessage.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
                formMessage.className = 'p-3 rounded text-sm mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
                formMessage.classList.remove('hidden');
                contactForm.reset();
            } else {
                // Error
                formMessage.textContent = data.message || 'Sorry, there was an error sending your message. Please try again.';
                formMessage.className = 'p-3 rounded text-sm mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
                formMessage.classList.remove('hidden');
            }
        } catch (error) {
            // Network or other error
            formMessage.textContent = 'Sorry, there was an error sending your message. Please check your connection and try again.';
            formMessage.className = 'p-3 rounded text-sm mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
            formMessage.classList.remove('hidden');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Initialize everything
async function init() {
    try {
        // Fetch data
        const response = await fetch('assets/data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        portfolioData = await response.json();
        
        // Render all sections (only if they exist on the page)
        if (document.getElementById('hero-headline')) {
            renderHero();
            renderSocialLinks();
        }
        if (document.getElementById('intro-section')) {
            renderIntro();
            renderWork();
            renderEducation();
            renderSkills();
        }
        if (document.getElementById('articles-grid')) {
            renderArticles();
        }
        if (document.getElementById('gallery-grid')) {
            renderGallery();
        }
        
        // Initialize contact form
        if (document.getElementById('contact-form')) {
            initContactForm();
        }
        
        // Set current year
        const currentYearEl = document.getElementById('current-year');
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
        
        // Initialize theme
        initTheme();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize lightbox
        initLightbox();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
        // Handle hash navigation from other pages (after page loads)
        handleHashNavigation();
        
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
                        <p class="text-gray-600 dark:text-gray-400 mb-4">Please check that assets/data/data.json exists and is valid.</p>
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

