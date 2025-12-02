// script.js
console.log("Portfolio Loaded Successfully!");

// Global observer options
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Add some interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(11, 18, 34, 0.95)';
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.background = 'rgba(11, 18, 34, 0.85)';
                navbar.style.padding = '1rem 0';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
            }
        });
    });
    
    // Add animation to elements when they come into view
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.hero-circle, .hero-title, .hero-sub, .hero-tagline, .hero-buttons, .hero-icons').forEach(el => {
        observer.observe(el);
    });

    // About section animation
    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe about section elements
    document.querySelectorAll('.about-img-wrapper, .about-content').forEach(el => {
        aboutObserver.observe(el);
    });

    // Skills section animation
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Animate progress bars
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
            }
        });
    }, observerOptions);

    // Observe skills section elements
    document.querySelectorAll('.skill-category, .skills-badges').forEach(el => {
        skillsObserver.observe(el);
    });

    // Projects section animation
    const projectsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(el => {
        projectsObserver.observe(el);
    });

    // Experience section animation
    const experienceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(el => {
        experienceObserver.observe(el);
    });

    // Contact section animation
    const contactObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe contact elements
    document.querySelectorAll('.contact-card, .footer-content').forEach(el => {
        contactObserver.observe(el);
    });

    // ✅ Certifications PDF Viewer - FIXED VERSION
    initializeCertifications();
    
    // ✅ Contact Form Handling
    initializeContactForm();
});

// Certifications PDF Viewer Function
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
            
            // Set modal title
            document.querySelector('#pdfModal .modal-title').textContent = certTitle;
            
            // Reset and prepare modal content
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
                    <i class="bi bi-exclamation-triangle"></i> PDF file not found. Please check the file path.
                </div>
            `;
            
            const pdfViewer = document.getElementById('pdfViewer');
            const downloadLink = document.getElementById('downloadPdf');
            const pdfError = document.getElementById('pdfError');
            
            // Set PDF source with proper encoding
            pdfViewer.src = pdfPath + '#toolbar=0&navpanes=0';
            downloadLink.href = pdfPath;
            downloadLink.setAttribute('download', certTitle.toLowerCase().replace(/\s+/g, '-') + '.pdf');
            downloadLink.innerHTML = '<i class="bi bi-download"></i> Download PDF';
            
            // Show loading initially
            pdfError.style.display = 'none';
            
            // Check if PDF loads successfully
            pdfViewer.onload = function() {
                console.log('PDF loaded successfully');
                document.querySelector('.pdf-loading').style.display = 'none';
                pdfViewer.style.display = 'block';
                pdfError.style.display = 'none';
            };
            
            pdfViewer.onerror = function() {
                console.log('PDF failed to load:', pdfPath);
                document.querySelector('.pdf-loading').style.display = 'none';
                pdfViewer.style.display = 'none';
                pdfError.style.display = 'block';
                
                // Show fallback image if PDF fails
                const imagePath = certificationCard.querySelector('img').src;
                const certDescription = certificationCard.querySelector('p').textContent;
                
                modalBody.innerHTML = `
                    <div class="certificate-fallback text-center">
                        <h4 class="text-light mb-3">${certTitle}</h4>
                        <p class="text-muted mb-4">${certDescription}</p>
                        <div class="certificate-img-container">
                            <img src="${imagePath}" alt="${certTitle}" class="img-fluid rounded shadow" style="max-height: 400px;">
                        </div>
                        <div class="alert alert-info mt-3">
                            <i class="bi bi-info-circle"></i> 
                            Showing certificate preview (PDF loading failed)
                        </div>
                    </div>
                `;
                
                downloadLink.href = imagePath;
                downloadLink.setAttribute('download', certTitle.toLowerCase().replace(/\s+/g, '-') + '.png');
                downloadLink.innerHTML = '<i class="bi bi-download"></i> Download Image';
            };
            
            // Show modal
            const pdfModal = new bootstrap.Modal(document.getElementById('pdfModal'));
            pdfModal.show();
        });
    });
    
    // Reset modal when closed
    document.getElementById('pdfModal').addEventListener('hidden.bs.modal', function() {
        const modalBody = document.querySelector('#pdfModal .modal-body');
        modalBody.innerHTML = `
            <iframe id="pdfViewer" width="100%" height="600px" frameborder="0" style="display: none;"></iframe>
            <div id="pdfError" class="alert alert-warning mt-3" style="display: none;">
                <i class="bi bi-exclamation-triangle"></i> PDF file not found. Please check the file path.
            </div>
        `;
    });
}

// Contact Form Handling Function
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Simple form validation
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            const sendBtn = this.querySelector('.btn-send');
            const originalText = sendBtn.innerHTML;
            
            sendBtn.innerHTML = '<i class="bi bi-check"></i> Message Sent!';
            sendBtn.disabled = true;
            
            setTimeout(() => {
                sendBtn.innerHTML = originalText;
                sendBtn.disabled = false;
                this.reset();
                
                // Show success notification
                alert('Thank you for your message! I\'ll get back to you soon.');
            }, 2000);
        });
    }
}