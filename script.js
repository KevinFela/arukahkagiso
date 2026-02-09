// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Booking Modal
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close-modal');

// Open booking modal
document.querySelectorAll('.book-btn, .booking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto-fill service if data attribute exists
            const service = btn.getAttribute('data-service');
            const serviceSelect = document.getElementById('serviceType');
            
            if (service && serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (option.text.includes(service)) {
                        serviceSelect.value = option.value;
                        break;
                    }
                }
            }
        }
    });
});

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Booking Form Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const service = document.getElementById('serviceType').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        
        // Validate
        if (!name || !phone || !service || !date || !time) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Create WhatsApp message
        const message = `*NEW BOOKING - Arukah Wellness*\n\n` +
                       `Name: ${name}\n` +
                       `Phone: ${phone}\n` +
                       `Service: ${service}\n` +
                       `Date: ${date}\n` +
                       `Time: ${time}\n\n` +
                       `Sent via website`;
        
        // Open WhatsApp
        window.open(`https://wa.me/27622990998?text=${encodeURIComponent(message)}`, '_blank');
        
        // Reset form
        bookingForm.reset();
        
        // Close modal
        if (bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        alert('Booking request sent! Please check WhatsApp.');
    });
}

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// Set current year in footer
document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});
