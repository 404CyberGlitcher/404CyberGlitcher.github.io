# ColorMart - Beauty & Cosmetics E-commerce Store

A professional, high-conversion e-commerce website built for beauty and lifestyle products. Features a minimalist design with Shopify-style layout, complete admin panel, and Firebase integration.

## 🚀 Features

- **Minimalist Design**: Clean, white-background aesthetic with red sale badges
- **Responsive Layout**: Fully responsive for all devices (mobile, tablet, desktop)
- **Product Management**: Complete CMS for adding/editing/deleting products
- **Image Compression**: Automatic image compression to under 500KB
- **Live Reviews**: Real customer review system with star ratings
- **Email Notifications**: Automatic order confirmations via EmailJS
- **Contact Management**: Store and manage customer inquiries
- **SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards
- **AOS Animations**: Smooth scroll animations for enhanced UX
- **Shopping Cart**: Full cart functionality with local storage

## 📁 Project Structure
├── index.html # Homepage
├── .env # Environment variables
├── .env.example # Example env file
├── .gitignore # Git ignore rules
├── package.json # Dependencies
├── vercel.json # Vercel deployment config
├── firebase.json # Firebase hosting config
├── README.md # Documentation
├── public/ # Static assets
│ ├── favicon.ico
│ ├── robots.txt
│ └── sitemap.xml
├── assets/ # Images and icons
│ ├── images/
│ └── icons/
└── src/ # Source files
├── catalog.html # Product catalog
├── product.html # Product detail
├── contact.html # Contact page
├── checkout.html # Checkout page
├── order-confirmation.html
├── css/ # Stylesheets
│ ├── style.css
│ ├── catalog.css
│ ├── product.css
│ ├── contact.css
│ ├── checkout.css
│ ├── order-confirmation.css
│ └── admin/
│ ├── login.css
│ ├── dashboard.css
│ ├── products.css
│ ├── orders.css
│ ├── reviews.css
│ └── contacts.css
├── js/ # JavaScript
│ ├── config/
│ │ ├── env.js
│ │ └── firebase.js
│ ├── utils/
│ │ ├── imageCompressor.js
│ │ ├── skeletonLoader.js
│ │ ├── discountCalculator.js
│ │ ├── emailService.js
│ │ └── seo.js
│ ├── components/
│ │ ├── header.js
│ │ ├── footer.js
│ │ ├── cart.js
│ │ └── reviewSystem.js
│ ├── main.js
│ ├── catalog.js
│ ├── product.js
│ ├── contact.js
│ ├── checkout.js
│ └── admin/
│ ├── auth.js
│ ├── dashboard.js
│ ├── products.js
│ ├── orders.js
│ ├── reviews.js
│ └── contacts.js
└── admin/
├── login.html
├── dashboard.html
├── products.html
├── orders.html
├── reviews.html
└── contacts.html