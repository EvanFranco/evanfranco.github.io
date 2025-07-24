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