const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
        mobileMenuBtn.innerHTML = icon;
        
        // Add body lock when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
    });
});

// Modal functionality
const bookingModal = document.getElementById('bookingModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

// Open modal when clicking any "Book Now" button
document.querySelectorAll('[href="#openBookingModal"], #openBookingModal, #openBookingModalAbout, #openBookingModalServices, #openBookingModalGallery, #openBookingModalContact, #openBookingModalCTA, #openBookingModalHome, #openBookingModalValentine').forEach(button => {
    if (button.tagName === 'A') {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (bookingModal) {
                bookingModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Focus on first input field
                setTimeout(() => {
                    const firstInput = document.getElementById('clientName');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    } else if (button.tagName === 'BUTTON') {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (bookingModal) {
                bookingModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Focus on first input field
                setTimeout(() => {
                    const firstInput = document.getElementById('clientName');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    }
});

// Auto-fill service when booking from service buttons
document.querySelectorAll('button[data-service]').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-select the service
            const serviceType = document.getElementById('serviceType');
            const serviceValue = button.getAttribute('data-service');
            
            if (serviceType) {
                // Find the matching option
                for (let i = 0; i < serviceType.options.length; i++) {
                    if (serviceType.options[i].text.includes(serviceValue)) {
                        serviceType.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Focus on first input field
            setTimeout(() => {
                const firstInput = document.getElementById('clientName');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    });
});

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.style.display === 'flex') {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Booking form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) dateInput.min = today;
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Format time for display
    function formatTime(timeString) {
        return timeString;
    }
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const service = document.getElementById('serviceType').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const notes = document.getElementById('specialRequests').value.trim();
        
        // Validate required fields
        if (!name || !phone || !service || !date || !time) {
            alert('Please fill in all required fields marked with *.');
            return;
        }
        
        // Validate date is not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a date in the future.');
            return;
        }
        
        // Create professional WhatsApp message
        let message = `*NEW BOOKING REQUEST - Arukah Wellness Spa*\n\n`;
        
        message += `*CLIENT INFORMATION:*\n`;
        message += `• Name: ${name}\n`;
        message += `• Phone: ${phone}\n`;
        if (email) {
            message += `• Email: ${email}\n`;
        }
        message += `\n`;
        
        message += `*BOOKING DETAILS:*\n`;
        message += `• Service: ${service}\n`;
        message += `• Date: ${formatDate(date)}\n`;
        message += `• Time: ${formatTime(time)}\n`;
        message += `\n`;
        
        if (notes) {
            message += `*SPECIAL REQUESTS / NOTES:*\n`;
            message += `${notes}\n`;
            message += `\n`;
        }
        
        message += `*LOCATION:*\n`;
        message += `Arukah Wellness Spa\n`;
        message += `15871 Rebecca Tlharipe Street, Pretoria\n`;
        message += `\n`;
        
        message += `---\n`;
        message += `Sent via Arukah Wellness Website\n`;
        message += `Please confirm availability\n`;
        
        // WhatsApp number (South Africa)
        const whatsappNumber = '27622990998';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Show loading state
        const submitBtn = bookingForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset form after delay
            setTimeout(() => {
                bookingForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                if (bookingModal) {
                    bookingModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                
                // Show success message
                alert('✓ Your booking request has been prepared!\n\nPlease send the message in WhatsApp to complete your booking.\n\nOur team will respond shortly to confirm your appointment.');
            }, 1500);
        }, 500);
    });
    
    // Auto-format phone number for South Africa
    const phoneInput = document.getElementById('clientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('0')) {
                // Format as 0XX XXX XXXX
                if (value.length > 3 && value.length <= 6) {
                    value = value.replace(/(\d{3})(\d+)/, '$1 $2');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
                }
            } else if (value.startsWith('27')) {
                // Format as +27 XX XXX XXXX
                if (value.length > 2 && value.length <= 4) {
                    value = value.replace(/(\d{2})(\d+)/, '+$1 $2');
                } else if (value.length > 4 && value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{2})(\d+)/, '+$1 $2 $3');
                } else if (value.length > 7) {
                    value = value.replace(/(\d{2})(\d{2})(\d{3})(\d+)/, '+$1 $2 $3 $4');
                }
            }
            
            e.target.value = value;
        });
        
        // Validate South African phone number
        phoneInput.addEventListener('blur', function() {
            const value = this.value.replace(/\s/g, '');
            const saRegex = /^(0[0-9]{9}|27[0-9]{9}|\+27[0-9]{9})$/;
            
            if (value && !saRegex.test(value)) {
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.1)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }
}

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
    // Create lightbox modal
    const lightboxModal = document.createElement('div');
    lightboxModal.className = 'lightbox-modal';
    lightboxModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 62, 58, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const lightboxContent = document.createElement('div');
    lightboxContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        width: 100%;
        height: auto;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.style.cssText = `
        text-align: center;
        color: white;
        margin-top: 20px;
        font-family: 'Montserrat', sans-serif;
    `;
    
    const closeLightbox = document.createElement('button');
    closeLightbox.innerHTML = '<i class="fas fa-times"></i>';
    closeLightbox.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    
    closeLightbox.addEventListener('mouseenter', () => {
        closeLightbox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        closeLightbox.style.transform = 'rotate(90deg)';
    });
    
    closeLightbox.addEventListener('mouseleave', () => {
        closeLightbox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        closeLightbox.style.transform = 'rotate(0deg)';
    });
    
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightboxContent.appendChild(closeLightbox);
    lightboxModal.appendChild(lightboxContent);
    document.body.appendChild(lightboxModal);
    
    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h3')?.textContent || '';
            const description = item.querySelector('p')?.textContent || '';
            
            lightboxImg.src = imgSrc;
            lightboxCaption.innerHTML = `
                <h3 style="font-size: 20px; margin-bottom: 8px; font-family: 'Cormorant Garamond', serif;">${title}</h3>
                ${description ? `<p style="font-size: 14px; opacity: 0.8;">${description}</p>` : ''}
            `;
            
            lightboxModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animate in
            setTimeout(() => {
                lightboxModal.style.opacity = '1';
                lightboxContent.style.transform = 'scale(1)';
            }, 10);
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightboxModal.style.opacity = '0';
        lightboxContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox.click();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
            closeLightbox.click();
        }
    });
}

// Set current year in footer
document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for grid items
            if (entry.target.classList.contains('service-card') || 
                entry.target.classList.contains('gallery-item') ||
                entry.target.classList.contains('value-item')) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                entry.target.style.transitionDelay = `${delay}s`;
            }
        }
    });
}, observerOptions);

// Observe elements with animation class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroSection.style.backgroundPositionY = rate + 'px';
    }
});

// Active navigation link highlighting
function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath) || 
            (linkPath === 'index.html' && currentPath.endsWith('/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    
    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize form date restrictions
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // Initialize contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create email message
            const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone || 'Not provided'}%0D%0ASubject: ${subject}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            const mailtoLink = `mailto:support@arukahwellness.co.za?subject=Contact Form: ${subject}&body=${emailBody}`;
            
            window.location.href = mailtoLink;
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                alert('Thank you for your message! An email client should have opened. If not, please email us at support@arukahwellness.co.za');
            }, 1000);
        });
    }
});

// WhatsApp float button click tracking
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', () => {
        // You can add analytics tracking here
        console.log('WhatsApp button clicked - Direct booking initiated');
    });
}

// Add click event to all CTA buttons with booking functionality
document.querySelectorAll('.cta-button, .submit-btn[data-service]').forEach(button => {
    button.addEventListener('click', function() {
        if (this.hasAttribute('data-service')) {
            // This button will auto-fill the service in the modal
            console.log('Service booking button clicked:', this.getAttribute('data-service'));
        }
    });
});

// Fix for February Specials package booking
document.querySelectorAll('[data-service*="Besties"]').forEach(button => {
    button.addEventListener('click', function(e) {
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-select the Besties package
            const serviceType = document.getElementById('serviceType');
            if (serviceType) {
                for (let i = 0; i < serviceType.options.length; i++) {
                    if (serviceType.options[i].text.includes('Besties for Life Package')) {
                        serviceType.selectedIndex = i;
                        break;
                    }
                }
            }
            
            setTimeout(() => {
                const firstInput = document.getElementById('clientName');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    });
});

// Fix for Self Love package booking
document.querySelectorAll('[data-service*="Self Love"]').forEach(button => {
    button.addEventListener('click', function(e) {
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-select the Self Love package
            const serviceType = document.getElementById('serviceType');
            if (serviceType) {
                for (let i = 0; i < serviceType.options.length; i++) {
                    if (serviceType.options[i].text.includes('Self Love Package')) {
                        serviceType.selectedIndex = i;
                        break;
                    }
                }
            }
            
            setTimeout(() => {
                const firstInput = document.getElementById('clientName');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    });
});

// Fix for Age with Grace package booking
document.querySelectorAll('[data-service*="Age with Grace"]').forEach(button => {
    button.addEventListener('click', function(e) {
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-select the Age with Grace package
            const serviceType = document.getElementById('serviceType');
            if (serviceType) {
                for (let i = 0; i < serviceType.options.length; i++) {
                    if (serviceType.options[i].text.includes('Age with Grace Package')) {
                        serviceType.selectedIndex = i;
                        break;
                    }
                }
            }
            
            setTimeout(() => {
                const firstInput = document.getElementById('clientName');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    });
});
