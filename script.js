// Arukah Wellness Spa - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Arukah Wellness Spa loaded');
    
    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            mobileMenuBtn.innerHTML = isActive ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // ========== BOOKING MODAL ==========
    const bookingModal = document.getElementById('bookingModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Function to open modal
    function openBookingModal(service = '') {
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-fill service if provided
            if (service) {
                const serviceSelect = document.getElementById('serviceType');
                if (serviceSelect) {
                    // Try to find and select the service
                    for (let i = 0; i < serviceSelect.options.length; i++) {
                        if (serviceSelect.options[i].value.includes(service) || 
                            serviceSelect.options[i].text.includes(service)) {
                            serviceSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = document.getElementById('clientName');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }
    
    // Open modal from all "Book Now" buttons
    document.querySelectorAll('[href="#openBookingModal"], .booking-btn, .book-btn, #openBookingModal, [id*="openBookingModal"]').forEach(element => {
        if (element.tagName === 'A') {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                openBookingModal();
            });
        } else if (element.tagName === 'BUTTON') {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                const service = this.getAttribute('data-service') || '';
                openBookingModal(service);
            });
        }
    });
    
    // Close modal
    if (closeModalBtn && bookingModal) {
        closeModalBtn.addEventListener('click', function() {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close when clicking outside modal
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                bookingModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bookingModal.style.display === 'flex') {
                bookingModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ========== BOOKING FORM ==========
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.min = today;
            
            // Set max date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.max = maxDate.toISOString().split('T')[0];
        }
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const email = document.getElementById('clientEmail')?.value.trim() || '';
            const service = document.getElementById('serviceType').value;
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const notes = document.getElementById('specialRequests')?.value.trim() || '';
            
            // Validate required fields
            if (!name || !phone || !service || !date || !time) {
                alert('Please fill in all required fields marked with *.');
                return;
            }
            
            // Validate date
            const selectedDate = new Date(date);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (selectedDate < todayDate) {
                alert('Please select a date in the future.');
                return;
            }
            
            // Create WhatsApp message
            const message = `*NEW BOOKING - Arukah Wellness Spa*\n\n` +
                           `👤 *Client Information:*\n` +
                           `• Name: ${name}\n` +
                           `• Phone: ${phone}\n` +
                           (email ? `• Email: ${email}\n` : '') +
                           `\n📅 *Appointment Details:*\n` +
                           `• Service: ${service}\n` +
                           `• Date: ${formatDate(date)}\n` +
                           `• Time: ${time}\n` +
                           (notes ? `\n📝 *Special Requests:*\n${notes}\n` : '') +
                           `\n📍 *Location:*\n` +
                           `Arukah Wellness Spa\n` +
                           `15871 Rebecca Tlharipe Street, Pretoria\n\n` +
                           `_Sent via website booking form_`;
            
            // WhatsApp number
            const whatsappNumber = '27622990998';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Open WhatsApp after delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                // Reset form
                bookingForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                if (bookingModal) {
                    bookingModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                
                // Show success message
                alert('✅ Booking request sent!\n\nPlease check WhatsApp to send the message to our team.\n\nWe will confirm your appointment shortly.');
            }, 1000);
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('clientPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                // Format South African numbers
                if (value.length > 0) {
                    if (value.startsWith('0')) {
                        // Format as 0XX XXX XXXX
                        if (value.length <= 3) {
                            value = value;
                        } else if (value.length <= 6) {
                            value = value.replace(/(\d{3})(\d+)/, '$1 $2');
                        } else {
                            value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
                        }
                    } else if (value.startsWith('27')) {
                        // Format as +27 XX XXX XXXX
                        value = '+27 ' + value.substring(2);
                    }
                }
                
                e.target.value = value;
            });
        }
    }
    
    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const contactMessage = `*CONTACT FORM - Arukah Wellness Spa*\n\n` +
                                  `👤 From: ${name}\n` +
                                  `📧 Email: ${email}\n` +
                                  `📋 Subject: ${subject}\n\n` +
                                  `💬 Message:\n${message}\n\n` +
                                  `_Sent via website contact form_`;
            
            const whatsappUrl = `https://wa.me/27622990998?text=${encodeURIComponent(contactMessage)}`;
            
            // Show loading
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                // Reset form
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                alert('✅ Message sent!\n\nPlease check WhatsApp to send your inquiry.\n\nWe will respond within 24 hours.');
            }, 1000);
        });
    }
    
    // ========== GALLERY LIGHTBOX ==========
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            padding: 20px;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Open lightbox on image click
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close lightbox
        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ========== ANIMATIONS ==========
    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // ========== UTILITY FUNCTIONS ==========
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Set current year in footer
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Active nav link highlighting
    function highlightActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath.endsWith(linkPath) || 
                (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    highlightActiveNav();
    
    // Initialize page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '1';
    }, 100);
});
