// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- Scroll Effect for Header ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    } else {
        header.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    }
});

// --- Breeds Carousel Infinite Scroll (Clone Logic) ---
const track = document.querySelector('.carousel-track');
// Cloning for smoother infinite loop visual is handled by CSS animation in this version,
// but doubling content helps gapless loop.
const slides = Array.from(track.children);
slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
});


// --- HERO CAROUSEL WITH PAN EFFECT (Handles Images AND Video) ---
// Updated selector to target both img and video
const heroMedia = document.querySelectorAll('.hero .image-container img, .hero .image-container video');
let heroIndex = 0;

function changeHeroMedia() {
    // Remove active class from current
    heroMedia[heroIndex].classList.remove('active');
    
    // Calculate next index
    heroIndex = (heroIndex + 1) % heroMedia.length;
    
    // Add active class to next
    const currentItem = heroMedia[heroIndex];
    currentItem.classList.add('active');

    // If it's a video, ensure it plays
    if (currentItem.tagName === 'VIDEO') {
        currentItem.play().catch(e => console.log("Auto-play prevented:", e));
    }
}

// Change hero media every 5 seconds
setInterval(changeHeroMedia, 5000);


// --- FILM STRIP CAROUSELS WITH PAN EFFECT (Handles Images AND Video) ---
document.querySelectorAll('.film-strip').forEach(filmStrip => {
    // Select both images and videos
    const mediaItems = filmStrip.querySelectorAll('img, video');
    let idx = 0;

    // Set the width of the film strip based on the number of items
    // IMPORTANT: CSS forces videos to be 250px wide to match this calculation
    filmStrip.style.width = `${mediaItems.length * 250}px`; 

    function showFilmStripMedia() {
        // Move strip based on the index
        filmStrip.style.transform = `translateX(-${idx * 250}px)`;
        
        // Loop back logic
        // We use (length - 1) to determine the boundary, ensuring we cycle through
        idx = (idx + 1) % (mediaItems.length);
    }

    // Start movement immediately
    // showFilmStripMedia(); // Optional: Start shifted if desired
    
    // Change item every 4 seconds
    setInterval(showFilmStripMedia, 4000); 
});


// --- Modal & Booking Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const bookButtons = document.querySelectorAll('.btn-book, .btn-secondary'); // Also the 'Book a Session' button in Hero
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-x');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const optionChips = document.querySelectorAll('.option-chip');
    const sendBtn = document.getElementById('sendBookingBtn');
    const userInfoForm = document.getElementById('userInfoForm');

    let selectedService = "";

    // Open Modal
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent anchor jump
            bookingModal.classList.add('active');
            
            // Pre-select service if clicked from a service card
            const serviceData = this.getAttribute('data-service');
            if (serviceData) {
                selectedService = serviceData;
                highlightChip(selectedService);
            }
        });
    });

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Chip Selection
    optionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Toggle selection logic (single select here)
            optionChips.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedService = this.getAttribute('data-value');
        });
    });

    function highlightChip(serviceName) {
        optionChips.forEach(chip => {
            if (chip.getAttribute('data-value') === serviceName) {
                chip.classList.add('selected');
            } else {
                chip.classList.remove('selected');
            }
        });
    }

    // Send to WhatsApp
    sendBtn.addEventListener('click', function() {
        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const businessWhatsAppNumber = "254797296255"; // Your Number

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        // Determine which tab is active to construct message
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        let whatsappMessage = "";

        if (activeTab === 'quick-book') {
            const date = document.getElementById('preferredDate').value;
            const time = document.getElementById('preferredTime').value;
            const notes = document.getElementById('notes').value;

            whatsappMessage = 
                `Hello Dog Tales Kennels! I would like to book a session.\n\n` +
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
        
        // Optional: Close modal after sending
        bookingModal.classList.remove('active');
        userInfoForm.reset();
        optionChips.forEach(opt => opt.classList.remove('selected'));
        tabBtns[0].click(); // Reset to first tab
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

    // --- Floating Contact Button Logic ---
    const contactToggle = document.getElementById('contactToggle');
    const contactWrapper = document.querySelector('.floating-contact');

    if (contactToggle && contactWrapper) {
        contactToggle.addEventListener('click', function() {
            contactWrapper.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (contactWrapper.classList.contains('active')) {
                icon.classList.remove('fa-comment-dots');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-comment-dots');
            }
        });
    }
});