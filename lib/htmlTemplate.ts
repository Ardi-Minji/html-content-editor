import { ContentData } from '@/types/content'
import { sanitizeString } from './security'

export function generateAuthorWebsite (data: ContentData): string {
  // Sanitize all inputs
  const authorName = sanitizeString(data.authorName)
  const subtitle = sanitizeString(data.subtitle)
  const tagline = sanitizeString(data.tagline)
  const bio1 = sanitizeString(data.bioParagraph1)
  const bio2 = sanitizeString(data.bioParagraph2)
  const bio3 = sanitizeString(data.bioParagraph3)
  const contactEmail = sanitizeString(data.contactEmail)
  const contactMessage = sanitizeString(data.contactMessage)

  // Generate awards HTML
  const awardsHTML = data.awards
    .map(award => `<li>${sanitizeString(award.title)}</li>`)
    .join('')

  // Generate books HTML
  const booksHTML = data.books
    .map(book => {
      const coverClass = book.coverColor === 'navy' ? '' : book.coverColor
      return `
            <div class="book-card fade-in">
                <div class="book-cover ${coverClass}">${sanitizeString(
        book.title
      )}</div>
                <div class="book-info">
                    <h3>${sanitizeString(book.title)}</h3>
                    <span class="year">${sanitizeString(book.year)}</span>
                    <p>${sanitizeString(book.description)}</p>
                    <div class="review">${sanitizeString(book.review)}</div>
                </div>
            </div>`
    })
    .join('')

  // Generate social links HTML
  const socialLinksHTML = data.socialLinks
    .map(
      link =>
        `<a href="${sanitizeString(link.url)}">${sanitizeString(
          link.platform
        )}</a>`
    )
    .join('')

  // Get initials for author image
  const initials = authorName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${authorName}</title>
    <meta name="description" content="${subtitle}">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --color-cream: #FBF8F3;
            --color-navy: #1A2332;
            --color-gold: #D4AF37;
            --color-gray: #6B7280;
            --color-light-gray: #E5E7EB;
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Inter', sans-serif;
        }
        html { scroll-behavior: smooth; }
        body {
            font-family: var(--font-sans);
            background-color: var(--color-cream);
            color: var(--color-navy);
            line-height: 1.6;
        }
        nav {
            position: fixed; top: 0; width: 100%;
            background-color: rgba(251, 248, 243, 0.95);
            backdrop-filter: blur(10px); z-index: 1000;
            border-bottom: 1px solid var(--color-light-gray);
        }
        nav ul {
            display: flex; justify-content: center; list-style: none;
            padding: 1.5rem; gap: 2rem; max-width: 1200px; margin: 0 auto;
        }
        nav a {
            color: var(--color-navy); text-decoration: none; font-weight: 500;
            font-size: 0.95rem; letter-spacing: 0.05em; text-transform: uppercase;
            transition: color 0.3s ease;
        }
        nav a:hover { color: var(--color-gold); }
        #hero {
            min-height: 100vh; display: flex; align-items: center;
            justify-content: center; text-align: center; padding: 2rem;
            margin-top: 60px;
            background: linear-gradient(135deg, var(--color-cream) 0%, #F5F0E8 100%);
        }
        .hero-content h1 {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 700; margin-bottom: 1rem; color: var(--color-navy);
        }
        .hero-content .subtitle {
            font-size: clamp(1rem, 2vw, 1.5rem);
            color: var(--color-gray); margin-bottom: 2rem; font-weight: 300;
        }
        .hero-content .tagline {
            font-family: var(--font-serif);
            font-size: clamp(1rem, 2vw, 1.25rem);
            font-style: italic; color: var(--color-gold); margin-bottom: 3rem;
            max-width: 600px; margin-left: auto; margin-right: auto;
        }
        .cta-button {
            display: inline-block; padding: 1rem 2.5rem;
            background-color: var(--color-navy); color: var(--color-cream);
            text-decoration: none; border-radius: 4px; font-weight: 500;
            letter-spacing: 0.05em; transition: all 0.3s ease;
            text-transform: uppercase; font-size: 0.9rem;
        }
        .cta-button:hover {
            background-color: var(--color-gold); color: var(--color-navy);
            transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        section {
            max-width: 1200px; margin: 0 auto; padding: 6rem 2rem;
        }
        .section-title {
            font-family: var(--font-serif);
            font-size: clamp(2rem, 4vw, 3rem);
            text-align: center; margin-bottom: 3rem;
            color: var(--color-navy); position: relative;
        }
        .section-title::after {
            content: ''; display: block; width: 80px; height: 3px;
            background-color: var(--color-gold); margin: 1rem auto 0;
        }
        #about { background-color: white; }
        .about-content {
            display: grid; grid-template-columns: 1fr 2fr;
            gap: 4rem; align-items: center;
        }
        .author-image {
            width: 100%; max-width: 350px; aspect-ratio: 3/4;
            background: linear-gradient(135deg, #D4AF37 0%, #C4A03C 100%);
            border-radius: 8px; display: flex; align-items: center;
            justify-content: center; font-family: var(--font-serif);
            font-size: 4rem; color: white;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .bio p {
            margin-bottom: 1.5rem; font-size: 1.1rem;
            line-height: 1.8; color: var(--color-gray);
        }
        .awards {
            margin-top: 2rem; padding-top: 2rem;
            border-top: 1px solid var(--color-light-gray);
        }
        .awards h3 {
            font-family: var(--font-serif); font-size: 1.5rem;
            margin-bottom: 1rem; color: var(--color-navy);
        }
        .awards ul { list-style: none; }
        .awards li {
            padding: 0.5rem 0; color: var(--color-gray);
        }
        .awards li::before {
            content: '→'; color: var(--color-gold);
            font-weight: bold; margin-right: 1rem;
        }
        #books { background-color: var(--color-cream); }
        .books-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 3rem; margin-top: 3rem;
        }
        .book-card {
            background: white; border-radius: 8px; overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .book-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .book-cover {
            width: 100%; aspect-ratio: 3/4;
            background: linear-gradient(135deg, #1A2332 0%, #2D3A4D 100%);
            display: flex; align-items: center; justify-content: center;
            font-family: var(--font-serif); font-size: 2rem;
            color: white; padding: 2rem; text-align: center;
        }
        .book-cover.gold {
            background: linear-gradient(135deg, #D4AF37 0%, #C4A03C 100%);
        }
        .book-cover.teal {
            background: linear-gradient(135deg, #2C7A7B 0%, #2D5A5D 100%);
        }
        .book-info { padding: 2rem; }
        .book-info h3 {
            font-family: var(--font-serif); font-size: 1.5rem;
            margin-bottom: 0.5rem; color: var(--color-navy);
        }
        .book-info .year {
            color: var(--color-gold); font-weight: 600;
            font-size: 0.9rem; margin-bottom: 1rem; display: block;
        }
        .book-info p {
            color: var(--color-gray); line-height: 1.7; margin-bottom: 1rem;
        }
        .book-info .review {
            font-style: italic; color: var(--color-gray);
            border-left: 3px solid var(--color-gold);
            padding-left: 1rem; margin-top: 1rem;
        }
        #contact {
            background-color: var(--color-navy);
            color: white; text-align: center;
        }
        #contact .section-title { color: white; }
        #contact .section-title::after { background-color: var(--color-gold); }
        .contact-content {
            max-width: 600px; margin: 0 auto;
        }
        .contact-content p {
            font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;
        }
        .social-links {
            display: flex; justify-content: center; gap: 2rem; margin-top: 2rem;
        }
        .social-links a {
            color: white; text-decoration: none; font-weight: 500;
            padding: 0.8rem 1.5rem; border: 2px solid white;
            border-radius: 4px; transition: all 0.3s ease;
        }
        .social-links a:hover {
            background-color: var(--color-gold);
            border-color: var(--color-gold);
            color: var(--color-navy);
        }
        footer {
            background-color: #0F1419; color: white;
            text-align: center; padding: 2rem;
            font-size: 0.9rem; opacity: 0.8;
        }
        @media (max-width: 768px) {
            nav ul { gap: 1rem; padding: 1rem; }
            nav a { font-size: 0.8rem; }
            .about-content {
                grid-template-columns: 1fr; text-align: center;
            }
            .author-image { margin: 0 auto; }
            .books-grid { grid-template-columns: 1fr; }
            .social-links {
                flex-direction: column; align-items: center;
            }
            .social-links a {
                width: 100%; max-width: 250px;
            }
        }
        
        /* Pure CSS scroll-driven animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeInUp 0.8s ease-out forwards;
            animation-timeline: view();
            animation-range: entry 0% cover 30%;
        }
        
        /* Fallback for browsers that don't support animation-timeline */
        @supports not (animation-timeline: view()) {
            .fade-in {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#books">Books</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section id="hero">
        <div class="hero-content">
            <h1>${authorName}</h1>
            <p class="subtitle">${subtitle}</p>
            <p class="tagline">"${tagline}"</p>
            <a href="#books" class="cta-button">Explore My Books</a>
        </div>
    </section>

    <section id="about">
        <h2 class="section-title">About the Author</h2>
        <div class="about-content fade-in">
            <div class="author-image">${initials}</div>
            <div class="bio">
                <p>${bio1}</p>
                <p>${bio2}</p>
                <p>${bio3}</p>
                <div class="awards">
                    <h3>Awards & Recognition</h3>
                    <ul>${awardsHTML}</ul>
                </div>
            </div>
        </div>
    </section>

    <section id="books">
        <h2 class="section-title">Published Works</h2>
        <div class="books-grid">${booksHTML}</div>
    </section>

    <section id="contact">
        <h2 class="section-title">Get in Touch</h2>
        <div class="contact-content">
            <p>${contactMessage}</p>
            <div class="social-links">${socialLinksHTML}</div>
        </div>
    </section>

    <footer>
        <p>&copy; ${new Date().getFullYear()} ${authorName}. All rights reserved.</p>
    </footer>

    <script>
        // Navigation highlighting on scroll
        (function() {
            function updateNavHighlight() {
                const sections = document.querySelectorAll('section');
                const navLinks = document.querySelectorAll('nav a');
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href').slice(1) === current) {
                        link.style.color = 'var(--color-gold)';
                    }
                });
            }
            
            window.addEventListener('scroll', updateNavHighlight);
            setTimeout(updateNavHighlight, 100);
        })();
        
        // Fallback animation for browsers without animation-timeline support
        if (!CSS.supports('animation-timeline: view()')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
            
            const initFallback = () => {
                document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
            };
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initFallback);
            } else {
                initFallback();
            }
        }
    </script>
</body>
</html>`
}
