console.log("Portfolio Loaded Successfully! Ready to rock.");

const EMAILJS_PUBLIC_KEY = "aU2ntCTGbZd2p9ulV"; 
const EMAILJS_SERVICE_ID = "service_h0cb8vr";
const EMAILJS_TEMPLATE_ID = "template_ivp13cv";

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

document.addEventListener('DOMContentLoaded', function() {

    // Initialize Theme
    initializeThemeSwitcher();

    // Initialize Particles Background
    initializeParticles();

    // Initialize Custom Cursor
    initializeCustomCursor();
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log(" EmailJS Initialized!");
    } else {
        console.error(" EmailJS SDK not loaded. Check script tag in HTML.");
    }


    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            const isLightMode = document.body.classList.contains('light-mode');
            
            if (window.scrollY > 100) {
                navbar.style.background = isLightMode 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(11, 18, 34, 0.95)';
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.background = isLightMode 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'rgba(11, 18, 34, 0.85)';
                navbar.style.padding = '1rem 0';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Close the mobile navbar menu if it's open
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    // Use a single IntersectionObserver for all animated elements
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                entry.target.classList.add('animate-in');
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, observerOptions);
    document.querySelectorAll('.js-animate').forEach(el => {
        animationObserver.observe(el);
    });


    initializeCertifications();

    // Initialize 3D Hover Effects for cards
    initialize3dCardHover('.project-card');
    initialize3dCardHover('.certification-card');

    // Initialize Back to Top Button
    initializeBackToTopButton();

    // Initialize Project Filter
    initializeProjectFilter();
    initializeEmailJSContactForm();
});

function initializeEmailJSContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm && typeof emailjs !== 'undefined') {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                showFormMessage('error', 'Please fill in all fields.');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('error', 'Please enter a valid email address.');
                return;
            }

            const sendBtn = this.querySelector('.btn-send');
            const originalText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="bi bi-hourglass"></i> Sending...';
            sendBtn.disabled = true;

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
                .then(function(response) {
                    console.log(' Email sent successfully!', response.status, response.text);
                    
        
                    sendBtn.innerHTML = '<i class="bi bi-check-circle"></i> Message Sent!';
                    showFormMessage('success', 'Thank you! Your message has been sent successfully.');
                    
                
                    setTimeout(() => {
                        sendBtn.innerHTML = originalText;
                        sendBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                    
                }, function(error) {
                    console.error(' EmailJS Failed:', error);
                    sendBtn.innerHTML = '<i class="bi bi-x-circle"></i> Failed';
                    showFormMessage('error', 'Sorry, failed to send message. Please try again or email directly.');
                    setTimeout(() => {
                        sendBtn.innerHTML = originalText;
                        sendBtn.disabled = false;
                    }, 3000);
                });
        });
    } else {
        console.error(" Contact form or EmailJS SDK not available.");
    }
}

function showFormMessage(type, message) {
    
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}"></i>
        ${message}
    `;
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.padding = '15px';
    messageDiv.style.marginTop = '15px';
    messageDiv.style.transition = 'all 0.3s ease';
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.btn-send');
    
    contactForm.insertBefore(messageDiv, submitButton);
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.height = '0';
            messageDiv.style.margin = '0';
            messageDiv.style.padding = '0';
            messageDiv.style.overflow = 'hidden';
            
            setTimeout(() => {
                if (messageDiv.parentNode) messageDiv.remove();
            }, 500);
        }
    }, 5000);
}

function initializeCertifications() {
    const viewCertButtons = document.querySelectorAll('.view-cert-btn');

    viewCertButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const certificationCard = this.closest('.certification-card');
            const pdfPath = certificationCard.getAttribute('data-pdf');
            const certTitle = certificationCard.querySelector('h4').textContent;

            console.log('Loading PDF:', pdfPath);

            document.querySelector('#pdfModal .modal-title').textContent = certTitle;

            const modalBody = document.querySelector('#pdfModal .modal-body');
            modalBody.innerHTML = `
                <div class="pdf-loading text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-light">Loading certificate...</p>
                </div>
                <iframe id="pdfViewer" width="100%" height="600px" frameborder="0" style="display: none;"></iframe>
                <div id="pdfError" class="alert alert-warning mt-3" style="display: none;">
                    <i class="bi bi-exclamation-triangle"></i> PDF file not found.
                </div>
            `;

            const pdfViewer = document.getElementById('pdfViewer');
            const downloadLink = document.getElementById('downloadPdf');
            const pdfError = document.getElementById('pdfError');

            pdfViewer.src = pdfPath + '#toolbar=0&navpanes=0';
            downloadLink.href = pdfPath;
            downloadLink.setAttribute('download', certTitle.toLowerCase().replace(/\s+/g, '-') + '.pdf');

            pdfViewer.onload = function() {
                document.querySelector('.pdf-loading').style.display = 'none';
                pdfViewer.style.display = 'block';
                pdfError.style.display = 'none';
            };

            pdfViewer.onerror = function() {
                document.querySelector('.pdf-loading').style.display = 'none';
                pdfViewer.style.display = 'none';
                pdfError.style.display = 'block';

                const imagePath = certificationCard.querySelector('img').src;
                const certDescription = certificationCard.querySelector('p').textContent;

                modalBody.innerHTML = `
                    <div class="certificate-fallback text-center">
                        <h4 class="text-light mb-3">${certTitle}</h4>
                        <p class="text-muted mb-4">${certDescription}</p>
                        <img src="${imagePath}" class="img-fluid rounded shadow" style="max-height: 400px;">
                        <div class="alert alert-info mt-3">
                            <i class="bi bi-info-circle"></i> Showing certificate preview (PDF failed)
                        </div>
                    </div>
                `;

                downloadLink.href = imagePath;
                downloadLink.setAttribute('download', certTitle.toLowerCase().replace(/\s+/g, '-') + '.png');
            };

            const pdfModal = new bootstrap.Modal(document.getElementById('pdfModal'));
            pdfModal.show();
        });
    });

    document.getElementById('pdfModal').addEventListener('hidden.bs.modal', function() {
        const modalBody = document.querySelector('#pdfModal .modal-body');
        modalBody.innerHTML = `
            <iframe id="pdfViewer" width="100%" height="600px" frameborder="0" style="display: none;"></iframe>
            <div id="pdfError" class="alert alert-warning mt-3" style="display: none;">
                <i class="bi bi-exclamation-triangle"></i> PDF file not found.
            </div>
        `;
    });
}

function initializeThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggle.classList.remove('bi-moon-stars-fill');
            themeToggle.classList.add('bi-sun-fill');
        } else {
            body.classList.remove('light-mode');
            themeToggle.classList.remove('bi-sun-fill');
            themeToggle.classList.add('bi-moon-stars-fill');
        }
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check user's system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Add event listener for the toggle button
    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.contains('light-mode');
        const newTheme = isLight ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initializeParticles() {
    if (typeof tsParticles === 'undefined') {
        console.error('tsParticles not loaded.');
        return;
    }

    const getThemeColors = () => {
        const isLightMode = document.body.classList.contains('light-mode');
        return {
            particleColor: isLightMode ? '#007bff' : '#5ce1e6',
            lineColor: isLightMode ? '#adb5bd' : '#94a3b8'
        };
    };

    const colors = getThemeColors();

    const particlesConfig = {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "grab",
                },
                onClick: {
                    enable: true,
                    mode: "push",
                },
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 1,
                    },
                },
                push: {
                    quantity: 4,
                },
            },
        },
        particles: {
            color: {
                value: colors.particleColor,
            },
            links: {
                color: colors.lineColor,
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    };

    tsParticles.load({ id: "tsparticles", options: particlesConfig });

    // Update particles on theme change
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        // Use a small timeout to allow CSS variables to update
        setTimeout(() => {
            const newColors = getThemeColors();
            const particles = tsParticles.domItem(0);
            particles.options.particles.color.value = newColors.particleColor;
            particles.options.particles.links.color.value = newColors.lineColor;
            particles.refresh();
        }, 100);
    });
}

function initializeCustomCursor() {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Animate dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Animate outline with a delay (lerp)
        const speed = 0.1;
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    };

    requestAnimationFrame(animateCursor);

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .social-icon, .project-link, .skill-badge, .certification-card, .theme-icon, input, textarea'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hovered');
        });
    });

    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

function initialize3dCardHover(selector) {
    const cards = document.querySelectorAll(selector);

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = x - centerX;
            const deltaY = y - centerY;

            // Tilt effect
            const rotateY = (deltaX / centerX) * 10; // Max rotation 10deg
            const rotateX = -(deltaY / centerY) * 10; // Max rotation 10deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function initializeBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category');
                
                // Hide item first
                item.classList.add('hide');
                item.style.display = 'none';

                const shouldShow = filterValue === 'all' || itemCategories.includes(filterValue);

                if (shouldShow) {
                    // Use a timeout to allow the 'hide' animation to be visible
                    setTimeout(() => {
                        item.style.display = 'block';
                        // Another timeout to trigger the show animation
                        setTimeout(() => {
                            item.classList.remove('hide');
                        }, 50);
                    }, 100);
                }
            });
        });
    });
}