# Portfolio Website

A minimalistic, elegant portfolio website for a multimedia journalist built with HTML, Tailwind CSS, and vanilla JavaScript.

## Project Structure

```
.
├── index.html              # Home page
├── articles.html           # All articles page
├── gallery.html            # Full gallery page
├── assets/
│   ├── css/               # Stylesheets (if any)
│   ├── js/
│   │   └── script.js      # Main JavaScript file
│   ├── images/
│   │   ├── avatar.png     # Profile avatar
│   │   └── gallery/       # Gallery images
│   └── data/
│       └── data.json      # Portfolio content data
├── docs/
│   └── Prabhakar_MultimediaJournalist_CV.pdf
└── .gitignore
```

## Features

- **Responsive Design**: Mobile-first approach with aggressive mobile responsiveness
- **Dark/Light Mode**: System preference detection with manual toggle
- **Multi-language Support**: Hindi (Devanagari) and English text rendering
- **Data-Driven**: All content managed through `data.json`
- **Accessible**: WCAG compliant with semantic HTML and ARIA labels
- **Optimized for GitHub Pages**: Ready for static hosting

## Setup

### Local Development

1. Clone the repository
2. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### GitHub Pages

1. Push the code to your repository
2. Go to Settings > Pages
3. Select the branch (usually `main` or `master`)
4. Your site will be live at `https://username.github.io/repository-name`

## Content Management

All portfolio content is managed through `assets/data/data.json`:

- **Person Info**: Name, role, avatar, email, location, languages
- **Social Links**: LinkedIn, Twitter, Email, etc.
- **About Section**: Introduction, work experience, education, skills
- **Articles**: Published news articles with titles, excerpts, and links
- **Gallery**: Array of image filenames from `assets/images/gallery/`
- **Contact Form**: Web3forms configuration

## Adding Images

1. Add images to `assets/images/gallery/`
2. Add the filename to the `gallery` array in `assets/data/data.json`
3. Images are automatically sorted alphabetically

## Technologies

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **Lucide Icons**: Icon library (via CDN)
- **Web3forms**: Contact form backend
- **Google Fonts**: Playfair Display, Inter, Noto Sans Devanagari

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved.

