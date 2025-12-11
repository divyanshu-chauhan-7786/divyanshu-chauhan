console.log("Portfolio Loaded Successfully!");

const EMAILJS_PUBLIC_KEY = "aU2ntCTGbZd2p9ulV"; 
const EMAILJS_SERVICE_ID = "service_h0cb8vr";
const EMAILJS_TEMPLATE_ID = "template_ivp13cv";

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

document.addEventListener('DOMContentLoaded', function() {

    
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log(" EmailJS Initialized!");
    } else {
        console.error(" EmailJS SDK not loaded. Check script tag in HTML.");
    }


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

    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-circle, .hero-title, .hero-sub, .hero-tagline, .hero-buttons, .hero-icons').forEach(el => {
        observer.observe(el);
    });


    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-img-wrapper, .about-content').forEach(el => {
        aboutObserver.observe(el);
    });

    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
    
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .skills-badges').forEach(el => {
        skillsObserver.observe(el);
    });


    const projectsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(el => {
        projectsObserver.observe(el);
    });

    const experienceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(el => {
        experienceObserver.observe(el);
    });

    const contactObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.contact-card, .footer-content').forEach(el => {
        contactObserver.observe(el);
    });


    initializeCertifications();

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