const images = document.querySelectorAll('.image-container img');

let currentIndex = 0;

function changeImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}

setInterval(changeImage, 4000);

// HERO IMAGE CAROUSEL WITH PAN EFFECT
const heroImages = document.querySelectorAll('.hero .image-container img');

let heroIndex = 0;

function changeHeroImage() {
    heroImages[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroImages.length;
    heroImages[heroIndex].classList.add('active');
}

setInterval(changeHeroImage, 4000);

// FILM STRIP CAROUSELS WITH PAN EFFECT
document.querySelectorAll('.film-strip').forEach(filmStrip => {
    const imgs = filmStrip.querySelectorAll('img');
    let idx = 0;

    // Set the width of the film strip based on the number of images
    filmStrip.style.width = `${imgs.length * 250}px`; // Assuming each image is 250px wide

    function showFilmStripImage() {
        // Move images based on the index
        filmStrip.style.transform = `translateX(-${idx * 250}px)`;
        idx = (idx + 1) % (imgs.length - 1); // Loop back to the first image (excluding the duplicate)
    }

    showFilmStripImage();
    setInterval(showFilmStripImage, 4000); // Change image every 4 seconds
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
let menuVisible = false;

menuButton.addEventListener('click', () => {
    menuVisible = !menuVisible;
    menuButton.classList.toggle('active', menuVisible);
    navLinks.style.display = menuVisible ? 'flex' : 'none';
});

window.addEventListener('scroll', () => {
    if (menuVisible) {
        menuVisible = false;
        navLinks.style.display = 'none';
        menuButton.classList.remove('active');
    }
});

// BOOKING MODAL LOGIC (from WhatsappForm V2.html)
document.addEventListener('DOMContentLoaded', function() {
    const serviceBookBtns = document.querySelectorAll('.service-book-btn');
    const bookingModal = document.getElementById('bookingModal'); // Make sure this targets your modal
    const closeModal = document.getElementById('closeModal'); // This line already exists and targets the button
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const serviceOptions = document.querySelectorAll('.service-option');
    const sendBookingBtn = document.getElementById('sendBookingBtn');
    const userInfoForm = document.getElementById('userInfoForm');
    const businessWhatsAppNumber = '254115411167';

    let lastScrollY = 0;

    // Open modal when a service button is clicked
    serviceBookBtns.forEach(button => {
        button.addEventListener('click', function() {
            lastScrollY = window.scrollY; // Save scroll position
            const serviceName = this.getAttribute('data-service');
            // Select the corresponding service option in the modal
            serviceOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.getAttribute('data-service') === serviceName) {
                    option.classList.add('selected');
                }
            });
            // Ensure quick-book tab is active
            tabBtns[0].click();
            bookingModal.classList.add('active');
        });
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(tb => tb.classList.remove('active-tab'));
            this.classList.add('active-tab');
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Service selection
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Send booking via WhatsApp
    sendBookingBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        if (!name || !phone) {
            alert('Please enter your name and phone number.');
            return;
        }
        const activeTab = document.querySelector('.tab-content.active').id;
        let whatsappMessage = '';
        if (activeTab === 'quick-book') {
            const selectedServiceElement = document.querySelector('.service-option.selected');
            const selectedService = selectedServiceElement ? selectedServiceElement.getAttribute('data-service') : 'Not specified';
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const notes = document.getElementById('notes').value;
            whatsappMessage = `Hello Dog Tales Kennels! I'd like to inquire about your services.\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Service of Interest:* ${selectedService}\n` +
                (date ? `*Preferred Date:* ${date}\n` : '') +
                (time ? `*Preferred Time:* ${time}\n` : '') +
                (notes ? `*Additional Notes:* ${notes}` : '');
        } else {
            const customMessage = document.getElementById('message').value;
            whatsappMessage = `Hello Dog Tales Kennels! This is ${name} (${phone}).\n\n` + customMessage;
        }
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${businessWhatsAppNumber}?text=${encodedMessage}`, '_blank');
        bookingModal.classList.remove('active');
        userInfoForm.reset();
        serviceOptions.forEach(opt => opt.classList.remove('selected'));
        tabBtns[0].click();
    });

    // Close modal with close button (no scroll)
    closeModal.addEventListener('click', function() {
        bookingModal.classList.remove('active');
    });

    // Close modal when clicking outside (no scroll)
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
        }
    });

    // Keyboard accessibility: close modal on Escape (no scroll)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            bookingModal.classList.remove('active');
        }
    });
});
