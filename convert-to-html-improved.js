const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// HTML テンプレート（改良版）
function createHTMLTemplate(title, content, isNodejsTutorial = false) {
  const breadcrumbTitle = isNodejsTutorial ? 'Node.js 初心者向けチュートリアル' : 'Express.js 初心者向けチュートリアル';
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${isNodejsTutorial ? 'Node.jsの基本概念から実践的な使い方まで、初心者向けに分かりやすく解説します。' : 'Express.jsフレームワークを使ったWebアプリケーション開発を基礎から学習できます。'}">
    <meta name="keywords" content="Node.js, Express.js, JavaScript, チュートリアル, 初心者, 日本語">
    <meta name="author" content="Node.js Tutorial">
    <title>${title}</title>
    
    <!-- Stylesheets -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    
    <style>
        :root {
            --primary-color: #339933;
            --secondary-color: #68217a;
            --accent-color: #f39c12;
            --dark-color: #2c3e50;
            --text-color: #333;
            --border-color: #dee2e6;
            --shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: #f8f9fa;
            padding-top: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        main {
            padding: 2rem 0;
            background: white;
            min-height: calc(100vh - 200px);
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: var(--dark-color);
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        h1 {
            border-bottom: 3px solid var(--primary-color);
            padding-bottom: 10px;
            margin-top: 1rem;
            font-size: 2.5rem;
        }
        
        h2 {
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            font-size: 2rem;
            color: var(--primary-color);
        }
        
        h3 {
            font-size: 1.5rem;
            color: var(--secondary-color);
        }
        
        /* コードスタイル */
        code {
            background-color: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            color: #d73a49;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        }
        
        pre {
            background-color: #2d3748 !important;
            border: 1px solid #4a5568;
            border-radius: 8px;
            padding: 1.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            position: relative;
            box-shadow: var(--shadow);
        }
        
        pre code {
            background-color: transparent !important;
            padding: 0;
            color: #e2e8f0 !important;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        /* Prism.js のカスタマイズ */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
            color: #68d391;
        }
        
        .token.punctuation {
            color: #e2e8f0;
        }
        
        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
            color: #f6e05e;
        }
        
        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
            color: #fc8181;
        }
        
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
            color: #90cdf4;
        }
        
        .token.atrule,
        .token.attr-value,
        .token.keyword {
            color: #90cdf4;
        }
        
        .token.function,
        .token.class-name {
            color: #b794f6;
        }
        
        .token.regex,
        .token.important,
        .token.variable {
            color: #fbb6ce;
        }
        
        /* テーブルスタイル */
        .table-responsive {
            margin: 1.5rem 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        
        table {
            margin-bottom: 0;
        }
        
        .table-dark th {
            background-color: var(--dark-color) !important;
            border-color: var(--border-color);
        }
        
        /* リストスタイル */
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        /* 目次スタイル */
        .table-of-contents {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 2rem;
            border-radius: 10px;
            margin: 2rem 0;
            border: 1px solid var(--border-color);
        }
        
        .table-of-contents h2 {
            margin-top: 0;
            color: var(--dark-color);
            border-bottom: none;
            text-align: center;
        }
        
        .table-of-contents ul {
            list-style: none;
            padding-left: 0;
        }
        
        .table-of-contents li {
            margin: 0.3rem 0;
        }
        
        .table-of-contents a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-block;
            padding: 0.2rem 0;
        }
        
        .table-of-contents a:hover {
            color: var(--secondary-color);
            text-decoration: underline;
            transform: translateX(5px);
        }
        
        /* ブロッククォート */
        blockquote {
            border-left: 4px solid var(--primary-color);
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 0 8px 8px 0;
            position: relative;
        }
        
        blockquote::before {
            content: '"';
            font-size: 3rem;
            color: var(--primary-color);
            position: absolute;
            top: -10px;
            left: 10px;
            opacity: 0.3;
        }
        
        /* アラート */
        .alert {
            border-radius: 8px;
            margin: 1.5rem 0;
            border: none;
            box-shadow: var(--shadow);
        }
        
        /* コピーボタン */
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.8;
        }
        
        .copy-btn:hover {
            background: var(--secondary-color);
            opacity: 1;
        }
        
        /* ナビゲーションボタン */
        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            margin: 3rem 0;
            padding: 2rem;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 10px;
            gap: 1rem;
        }
        
        .nav-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            flex: 1;
            justify-content: center;
            text-align: center;
        }
        
        .nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            color: white;
        }
        
        /* レスポンシブ */
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            pre {
                padding: 1rem;
                font-size: 0.8rem;
            }
            
            .navigation-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-btn {
                justify-content: center;
            }
        }
        
        /* スクロールアニメーション */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.6s ease forwards;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* トップに戻るボタン */
        .btn-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
        }
        
        .btn-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        /* パンくずリスト */
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
    </style>
</head>
<body>
    <!-- Header -->
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
    <nav class="breadcrumb-nav">
        <div class="container">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="index.html">ホーム</a></li>
                <li class="breadcrumb-item active" aria-current="page">${breadcrumbTitle}</li>
            </ol>
        </div>
    </nav>
    
    <main>
        <div class="container">
            ${content}
            
            ${isNodejsTutorial ? `
            <div class="navigation-buttons">
                <a href="index.html" class="nav-btn">
                    <i class="fas fa-home"></i> ホーム
                </a>
                <a href="express-tutorial.html" class="nav-btn">
                    Express.js Tutorial <i class="fas fa-arrow-right"></i>
                </a>
            </div>
            ` : `
            <div class="navigation-buttons">
                <a href="nodejs-tutorial.html" class="nav-btn">
                    <i class="fas fa-arrow-left"></i> Node.js Tutorial
                </a>
                <a href="index.html" class="nav-btn">
                    <i class="fas fa-home"></i> ホーム
                </a>
            </div>
            `}
        </div>
    </main>
    
    <!-- Footer -->
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
    <button type="button" class="btn btn-primary btn-top" onclick="scrollToTop()">
        <i class="fas fa-arrow-up"></i>
    </button>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script src="assets/js/main.js"></script>
    
    <script>
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // 目次のリンクにスムーススクロールを追加
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
        
        // コードブロックにコピーボタンを追加
        document.querySelectorAll('pre').forEach(pre => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'コードをコピー';
            
            copyBtn.addEventListener('click', async () => {
                const code = pre.querySelector('code').textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                } catch (err) {
                    console.error('コピーに失敗しました:', err);
                }
            });
            
            pre.style.position = 'relative';
            pre.appendChild(copyBtn);
        });
        
        // プログレス追跡
        document.addEventListener('DOMContentLoaded', function() {
            const currentPage = window.location.pathname.split('/').pop();
            let progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
            
            progress[currentPage] = Math.max(progress[currentPage] || 0, 25);
            
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
                maxScroll = Math.max(maxScroll, scrollPercent);
                progress[currentPage] = Math.max(progress[currentPage], Math.min(maxScroll, 100));
                localStorage.setItem('tutorialProgress', JSON.stringify(progress));
            });
        });
        
        // アニメーション効果
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('h2, h3, .table-responsive, blockquote, .alert').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
}

// marked の設定（改良版）
marked.setOptions({
  highlight: function(code, lang) {
    // HTMLエスケープ
    const escapeHtml = (unsafe) => {
      if (typeof unsafe !== 'string') {
        unsafe = String(unsafe);
      }
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    return escapeHtml(code);
  },
  breaks: true,
  gfm: true,
  sanitize: false,
  smartypants: true
});

// カスタムレンダラー（改良版）
const renderer = new marked.Renderer();

// 見出しにIDを追加
renderer.heading = function(text, level) {
  const cleanText = typeof text === 'string' ? text : String(text);
  // HTML タグを除去してIDを生成
  const plainText = cleanText.replace(/<[^>]*>/g, '');
  const id = plainText.toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `<h${level} id="${id}">${cleanText}</h${level}>`;
};

// コードブロックのスタイリング（改良版）
renderer.code = function(code, infostring, escaped) {
  const lang = (infostring || '').match(/\S*/)[0];
  const language = lang || 'javascript';
  
  // HTMLエスケープ
  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') {
      unsafe = String(unsafe);
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  const escapedCode = escaped ? code : escapeHtml(code);
  
  return `<pre><code class="language-${language}">${escapedCode}</code></pre>`;
};

// インラインコードの処理
renderer.codespan = function(text) {
  return `<code>${text}</code>`;
};

// テーブルのBootstrapクラス追加（改良版）
renderer.table = function(header, body) {
  if (body) body = `<tbody>${body}</tbody>`;
  
  return `<div class="table-responsive">
    <table class="table table-striped table-hover">
      <thead class="table-dark">${header}</thead>
      ${body}
    </table>
  </div>`;
};

// リストのスタイリング
renderer.list = function(body, ordered, start) {
  const type = ordered ? 'ol' : 'ul';
  const startatt = (ordered && start !== 1) ? ` start="${start}"` : '';
  return `<${type}${startatt}>\n${body}</${type}>\n`;
};

// リンクの処理
renderer.link = function(href, title, text) {
  let link = `<a href="${href}"`;
  if (title) {
    link += ` title="${title}"`;
  }
  // 外部リンクの場合は target="_blank" を追加
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    link += ' target="_blank" rel="noopener noreferrer"';
  }
  link += `>${text}</a>`;
  return link;
};

marked.use({ renderer });

async function convertMarkdownToHTML(inputFile, outputFile, title) {
  try {
    console.log(`Converting ${inputFile} to ${outputFile}...`);
    
    const markdown = fs.readFileSync(inputFile, 'utf-8');
    const htmlContent = marked(markdown);
    const isNodejsTutorial = inputFile.includes('nodejs-tutorial');
    const fullHTML = createHTMLTemplate(title, htmlContent, isNodejsTutorial);
    
    fs.writeFileSync(outputFile, fullHTML, 'utf-8');
    console.log(`✅ Successfully converted to ${outputFile}`);
    
  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
  }
}

// ファイル変換
async function main() {
  const files = [
    {
      input: 'nodejs-tutorial.md',
      output: 'nodejs-tutorial.html',
      title: 'Node.js 初心者向けチュートリアル'
    },
    {
      input: 'express-tutorial.md',
      output: 'express-tutorial.html',
      title: 'Express.js 初心者向けチュートリアル'
    }
  ];
  
  for (const file of files) {
    if (fs.existsSync(file.input)) {
      await convertMarkdownToHTML(file.input, file.output, file.title);
    } else {
      console.log(`⚠️  File ${file.input} not found, skipping...`);
    }
  }
  
  console.log('\n🎉 All conversions completed!');
}

main().catch(console.error);