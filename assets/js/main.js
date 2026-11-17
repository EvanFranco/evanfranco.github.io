/*
	Escape Velocity by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// Experience dropdown functionality - defined globally
window.toggleExperience = function(id) {
	console.log('toggleExperience called with id:', id);
	const content = document.getElementById(id);
	const header = content.previousElementSibling;
	
	if (content && header) {
		// Toggle the active class
		content.classList.toggle('active');
		header.classList.toggle('active');
		console.log('Classes toggled successfully');
	} else {
		console.error('Could not find content or header elements');
	}
};

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			alignment: 'center',
			detach: false
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
					'<span class="title">' + $('#logo h1').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Smooth scrolling for navigation links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});

	// Add scroll-based navbar background
	const navbar = document.querySelector('.navbar');
	window.addEventListener('scroll', () => {
		if (window.scrollY > 50) {
			navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
			navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
		} else {
			navbar.style.backgroundColor = 'var(--white)';
			navbar.style.boxShadow = 'none';
		}
	});

	// Add animation to project cards on scroll
	const observerOptions = {
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);

	document.querySelectorAll('.project-card').forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(20px)';
		card.style.transition = 'all 0.5s ease-out';
		observer.observe(card);
	});


})

// Terminal typing animation - outside jQuery wrapper
function typeWriter() {
	const textElement = document.getElementById('typing-text');
	const cursorElement = document.getElementById('cursor');
	
	console.log('TypeWriter function called');
	console.log('Text element:', textElement);
	console.log('Cursor element:', cursorElement);
	
	if (!textElement || !cursorElement) {
		console.log('Elements not found, retrying in 500ms');
		setTimeout(typeWriter, 500);
		return;
	}
	
	const texts = [
		'python3 portfolio.py',
		'',
		'# Portfolio Information',
		'name = "Evan Franco"',
		'major = "Computer Science"',
		'university = "University of Connecticut"',
		'class_year = 2026'
	];
	
	let textIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	
	function type() {
		const currentText = texts[textIndex];
		
		// Handle empty strings (new lines)
		if (currentText === '') {
			textElement.innerHTML += '<br>';
			textIndex++;
			if (textIndex >= texts.length) {
				textIndex = 0; // Loop back to start
				textElement.innerHTML = ''; // Clear for restart
			}
			setTimeout(type, 300);
			return;
		}
		
		if (isDeleting) {
			// Remove the last character
			let currentHTML = textElement.innerHTML;
			textElement.innerHTML = currentHTML.slice(0, -1);
			charIndex--;
		} else {
			// Add the next character with proper formatting
			let char = currentText.charAt(charIndex);
			
			// Apply syntax highlighting based on the current line
			let coloredChar = char;
			if (currentText.startsWith('#')) {
				coloredChar = '<span style="color: #888;">' + char + '</span>';
			} else if (currentText.startsWith('print(')) {
				coloredChar = '<span style="color: #4CAF50;">' + char + '</span>';
			} else if (currentText.includes('=')) {
				coloredChar = '<span style="color: #2196F3;">' + char + '</span>';
			} else if (currentText.startsWith('python3')) {
				coloredChar = '<span style="color: #FF9800;">' + char + '</span>';
			} else if (currentText.startsWith('Name:') || currentText.startsWith('Major:') || 
					   currentText.startsWith('University:') || currentText.startsWith('Class:') || 
					   currentText.startsWith('Welcome')) {
				coloredChar = '<span style="color: #E91E63;">' + char + '</span>';
			}
			
			textElement.innerHTML += coloredChar;
			charIndex++;
		}
		
		let typeSpeed = isDeleting ? 10 : 25;
		
		if (!isDeleting && charIndex === currentText.length) {
			typeSpeed = 800; // Pause at end
			isDeleting = true;
		} else if (isDeleting && charIndex === 0) {
			isDeleting = false;
			textIndex++;
			if (textIndex >= texts.length) {
				// Add your information and stop the animation
				setTimeout(() => {
					textElement.innerHTML += '<br><br>';
					textElement.innerHTML += '<span style="color: #E91E63;">Name: Evan Franco</span><br>';
					textElement.innerHTML += '<span style="color: #E91E63;">Major: Computer Science</span><br>';
					textElement.innerHTML += '<span style="color: #E91E63;">University: University of Connecticut</span><br>';
					textElement.innerHTML += '<span style="color: #E91E63;">Class: 2026</span><br>';
					textElement.innerHTML += '<span style="color: #E91E63;">Welcome to my portfolio!</span>';
				}, 500);
				return;
			} else {
				// Add a line break after each line (except for empty strings)
				if (texts[textIndex] !== '') {
					textElement.innerHTML += '<br>';
				}
			}
			typeSpeed = 150; // Pause before next text
		}
		
		setTimeout(type, typeSpeed);
	}
	
	
	// Start typing after a short delay
	setTimeout(type, 1000);
}

// Start the typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM loaded, starting typewriter');
	typeWriter();
});