const fs = require('fs');

// 統一されたヘッダーとナビゲーション
const headerHTML = `    <!-- Header -->
    <header class="header">
        <nav class="navbar">
            <a href="index.html" class="logo">Node.js Tutorial</a>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link">ホーム</a></li>
                <li><a href="nodejs-tutorial.html" class="nav-link">Node.js</a></li>
                <li><a href="express-tutorial.html" class="nav-link">Express.js</a></li>
                <li><a href="https://nodejs.org/" target="_blank" class="nav-link">Node.js公式</a></li>
            </ul>
            <button class="nav-toggle" aria-label="メニューを開く">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
    </header>

    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav" style="background: #f8f9fa; padding: 1rem 0; border-bottom: 1px solid #dee2e6;">
        <div class="container">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.html">ホーム</a></li>
                <li class="breadcrumb-item active" aria-current="page">{TITLE}</li>
            </ol>
        </div>
    </nav>`;

// 統一されたフッター
const footerHTML = `    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="index.html" class="footer-link">ホーム</a>
                <a href="nodejs-tutorial.html" class="footer-link">Node.js Tutorial</a>
                <a href="express-tutorial.html" class="footer-link">Express.js Tutorial</a>
                <a href="https://nodejs.org/" target="_blank" class="footer-link">Node.js 公式</a>
                <a href="https://expressjs.com/" target="_blank" class="footer-link">Express.js 公式</a>
                <a href="https://github.com/nodejs/node" target="_blank" class="footer-link">GitHub</a>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Node.js Tutorial. このチュートリアルは学習目的で作成されました。</p>
                <p>
                    <i class="fas fa-heart" style="color: #e74c3c;"></i> 
                    Made with Node.js and Express.js
                </p>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <button class="back-to-top" aria-label="トップへ戻る">
        <i class="fas fa-arrow-up"></i>
    </button>`;

// 追加のスタイル
const additionalStyles = `
    <link href="assets/css/style.css" rel="stylesheet">
    <style>
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .breadcrumb-nav {
            background: #f8f9fa;
            padding: 1rem 0;
            border-bottom: 1px solid #dee2e6;
        }
        .breadcrumb {
            background: none;
            padding: 0;
            margin: 0;
        }
        .breadcrumb-item + .breadcrumb-item::before {
            content: ">";
            color: #6c757d;
        }
        .breadcrumb-item a {
            color: var(--primary-color);
            text-decoration: none;
        }
        .breadcrumb-item a:hover {
            text-decoration: underline;
        }
        .breadcrumb-item.active {
            color: #6c757d;
        }
        body {
            padding-top: 0;
        }
        main {
            padding-top: 2rem;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .copy-btn:hover {
            background: var(--secondary-color);
        }
        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            margin: 3rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .nav-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            background: var(--gradient);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            color: white;
        }
        .nav-btn.disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        .nav-btn.disabled:hover {
            transform: none;
            box-shadow: none;
        }
    </style>`;

// 追加のスクリプト
const additionalScripts = `
    <script src="assets/js/main.js"></script>
    <script>
        // Progress tracking
        document.addEventListener('DOMContentLoaded', function() {
            const currentPage = window.location.pathname.split('/').pop();
            let progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
            
            // Mark current page as visited
            progress[currentPage] = Math.max(progress[currentPage] || 0, 25);
            
            // Update progress when user scrolls
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
                maxScroll = Math.max(maxScroll, scrollPercent);
                progress[currentPage] = Math.max(progress[currentPage], Math.min(maxScroll, 100));
                localStorage.setItem('tutorialProgress', JSON.stringify(progress));
            });
        });
    </script>`;

function updateTutorialHTML(filename, title) {
    try {
        console.log(`Updating ${filename}...`);
        
        let html = fs.readFileSync(filename, 'utf-8');
        
        // Add Font Awesome for icons
        if (!html.includes('font-awesome')) {
            html = html.replace(
                '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">',
                `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">`
            );
        }
        
        // Add custom styles
        html = html.replace('</head>', additionalStyles + '\n</head>');
        
        // Add header and navigation after <body>
        const headerWithTitle = headerHTML.replace('{TITLE}', title);
        html = html.replace('<body>', '<body>\n' + headerWithTitle);
        
        // Wrap existing content in main tag and container
        const bodyStartIndex = html.indexOf('<body>');
        const bodyContent = html.substring(bodyStartIndex);
        const firstDivIndex = bodyContent.indexOf('<div class="container">');
        
        if (firstDivIndex !== -1) {
            const beforeContainer = bodyContent.substring(0, firstDivIndex);
            const afterContainer = bodyContent.substring(firstDivIndex);
            
            html = html.substring(0, bodyStartIndex) + beforeContainer + 
                   '<main>\n' + afterContainer.replace('</div>', '</div>\n</main>');
        }
        
        // Add navigation buttons before footer
        const navigationButtons = title === 'Node.js 初心者向けチュートリアル' 
            ? `    <div class="navigation-buttons">
        <a href="index.html" class="nav-btn">
            <i class="fas fa-home"></i> ホーム
        </a>
        <a href="express-tutorial.html" class="nav-btn">
            Express.js Tutorial <i class="fas fa-arrow-right"></i>
        </a>
    </div>`
            : `    <div class="navigation-buttons">
        <a href="nodejs-tutorial.html" class="nav-btn">
            <i class="fas fa-arrow-left"></i> Node.js Tutorial
        </a>
        <a href="index.html" class="nav-btn">
            <i class="fas fa-home"></i> ホーム
        </a>
    </div>`;
        
        // Add navigation buttons and footer before </body>
        html = html.replace('</body>', navigationButtons + '\n' + footerHTML + '\n\n' + additionalScripts + '\n</body>');
        
        // Update meta description
        const description = title === 'Node.js 初心者向けチュートリアル' 
            ? 'Node.jsの基本概念から実践的な使い方まで、初心者向けに分かりやすく解説します。'
            : 'Express.jsフレームワークを使ったWebアプリケーション開発を基礎から学習できます。';
        
        html = html.replace(
            /<meta name="viewport"[^>]*>/,
            `<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="keywords" content="Node.js, Express.js, JavaScript, チュートリアル, 初心者, 日本語">
    <meta name="author" content="Node.js Tutorial">`
        );
        
        fs.writeFileSync(filename, html, 'utf-8');
        console.log(`✅ Successfully updated ${filename}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update both tutorial files
updateTutorialHTML('nodejs-tutorial.html', 'Node.js 初心者向けチュートリアル');
updateTutorialHTML('express-tutorial.html', 'Express.js 初心者向けチュートリアル');

console.log('\n🎉 All tutorial files updated successfully!');