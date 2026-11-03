
// 1. Typing animation
const typingElement = document.getElementById("typing");

const words = [
    "web experiences",
    "smart solutions",
    "useful applications",
    "digital products"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!deleting) {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1300);
            return;
        }
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, deleting ? 45 : 85);
}

if (typingElement) {
    typeEffect();
}


// 2. Navbar closes after clicking a link on mobile
const navLinks = document.querySelectorAll(".navbar .nav-link");
const navMenu = document.getElementById("navMenu");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu && navMenu.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
    });
});


// 3. Update footer year automatically
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// 4. Smooth reveal animation while scrolling
const revealElements = document.querySelectorAll(
    ".section-heading, .about-text, .education-card, .skill-card, .project-card, .timeline-item, .contact-box"
);

revealElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => revealObserver.observe(element));


// 5. Active navigation link while scrolling
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});


/* ===== HOLOGRAPHIC 3D UNIVERSE ===== */

const canvas = document.getElementById("three-bg");

if (canvas && window.THREE) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Main holographic sphere
    const orbGroup = new THREE.Group();
    orbGroup.position.set(3.1, 0.3, -1);
    scene.add(orbGroup);

    const sphereGeometry = new THREE.IcosahedronGeometry(2, 4);

    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x8064ff,
        wireframe: true,
        transparent: true,
        opacity: 0.28
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    orbGroup.add(sphere);

    // Inner glowing core
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 48, 48),
        new THREE.MeshBasicMaterial({
            color: 0x312080,
            transparent: true,
            opacity: 0.12
        })
    );

    orbGroup.add(core);

    // Orbital rings
    const rings = [];

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.35 + i * 0.2, 0.012, 8, 120),
            new THREE.MeshBasicMaterial({
                color: i === 1 ? 0x40d9ff : 0xa68aff,
                transparent: true,
                opacity: 0.7
            })
        );

        ring.rotation.x = Math.PI / 2 + i * 0.6;
        ring.rotation.y = i * 0.7;

        orbGroup.add(ring);
        rings.push(ring);
    }

    // Small floating stars
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 30;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
    );

    const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
            color: 0xb4a5ff,
            size: 0.035,
            transparent: true,
            opacity: 0.8
        })
    );

    scene.add(stars);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 0.7;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 0.7;
    });

    // Animation
    function animateUniverse() {
        requestAnimationFrame(animateUniverse);

        orbGroup.rotation.y += 0.003;
        orbGroup.rotation.x += 0.001;

        rings.forEach((ring, index) => {
            ring.rotation.z += 0.002 * (index + 1);
        });

        stars.rotation.y += 0.0002;

        orbGroup.position.x +=
            (3.1 + mouseX * 0.4 - orbGroup.position.x) * 0.02;

        orbGroup.position.y +=
            (0.3 - mouseY * 0.4 - orbGroup.position.y) * 0.02;

        renderer.render(scene, camera);
    }

    animateUniverse();

    // Resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}


/* ===== MOUSE-BASED 3D CARD TILT ===== */

const tiltCards = document.querySelectorAll(
    ".project-card, .skill-card, .education-card"
);

tiltCards.forEach(card => {
    card.addEventListener("mousemove", event => {
        if (window.innerWidth < 768) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform =
            `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
});


// =================================
// PROFILE PHOTO VIEWER
// =================================

document.addEventListener("DOMContentLoaded", () => {

    const profilePhoto = document.getElementById("profilePhoto");
    const photoModal = document.getElementById("photoModal");
    const fullProfilePhoto = document.getElementById("fullProfilePhoto");
    const closePhoto = document.getElementById("closePhoto");
    const profileFallback = document.getElementById("profileFallback");

    // Profile photo viewer
    if (profilePhoto && photoModal && fullProfilePhoto && closePhoto) {

        profilePhoto.addEventListener("error", () => {
            profilePhoto.style.display = "none";

            if (profileFallback) {
                profileFallback.style.display = "flex";
            }
        });

        profilePhoto.addEventListener("load", () => {
            profilePhoto.style.display = "block";

            if (profileFallback) {
                profileFallback.style.display = "none";
            }
        });

        function openPhoto() {
            if (!profilePhoto.naturalWidth) return;

            fullProfilePhoto.src = profilePhoto.src;
            photoModal.classList.add("show");
            photoModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            photoModal.classList.remove("show");
            photoModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        profilePhoto.addEventListener("click", openPhoto);

        profilePhoto.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPhoto();
            }
        });

        closePhoto.addEventListener("click", closeModal);

        photoModal.addEventListener("click", (event) => {
            if (event.target === photoModal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                photoModal.classList.contains("show")
            ) {
                closeModal();
            }
        });

        // Handle already-loaded image
        if (profilePhoto.complete && profilePhoto.naturalWidth) {
            profilePhoto.style.display = "block";

            if (profileFallback) {
                profileFallback.style.display = "none";
            }
        }
    }


    // =================================
    // CONTACT FORM - OPEN GMAIL
    // =================================

    const contactForm = document.getElementById("portfolio-mail-form");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name = document.getElementById("visitor-name").value.trim();
            const email = document.getElementById("visitor-email").value.trim();
            const message = document.getElementById("visitor-message").value.trim();

            const status = document.getElementById("mail-form-status");

            if (!name || !email || !message) {
                status.textContent = "Please fill in all fields.";
                return;
            }

            const subject = encodeURIComponent("Portfolio Contact Message");

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\n\nMessage:\n" + message
            );

            const gmailURL =
                "https://mail.google.com/mail/?view=cm&fs=1" +
                "&to=muskanjoshi24122005@gmail.com" +
                "&su=" + subject +
                "&body=" + body;

            window.open(gmailURL, "_blank");

            status.textContent = "Gmail is opening. Please click Send there.";

        });
    }

});

