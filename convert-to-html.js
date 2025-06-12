const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// HTML テンプレート
function createHTMLTemplate(title, content) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 5px;
        }
        code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            color: #e83e8c;
        }
        pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
        }
        .table-of-contents {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .table-of-contents h2 {
            margin-top: 0;
            color: #495057;
            border-bottom: none;
        }
        .table-of-contents ul {
            margin-bottom: 0;
        }
        .alert {
            border-radius: 8px;
            margin: 1rem 0;
        }
        .card {
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }
        .btn-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1rem 0;
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 0 8px 8px 0;
        }
        .badge {
            font-size: 0.8em;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 2px 4px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
        
        <button type="button" class="btn btn-primary btn-top" onclick="scrollToTop()">
            ↑ トップへ
        </button>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
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
        
        // コードブロックの言語指定
        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.className.includes('language-')) {
                block.className += ' language-javascript';
            }
        });
    </script>
</body>
</html>`;
}

// marked の設定
marked.setOptions({
  highlight: function(code, lang) {
    return `<code class="language-${lang || 'javascript'}">${code}</code>`;
  },
  breaks: true,
  gfm: true
});

// カスタムレンダラー
const renderer = new marked.Renderer();

// 見出しにIDを追加
renderer.heading = function(text, level) {
  const cleanText = typeof text === 'string' ? text : String(text);
  const id = cleanText.toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `<h${level} id="${id}">${cleanText}</h${level}>`;
};

// コードブロックのスタイリング
renderer.code = function(code, infostring) {
  const lang = infostring || 'javascript';
  return `<pre><code class="language-${lang}">${code}</code></pre>`;
};

// テーブルのBootstrapクラス追加
renderer.table = function(header, body) {
  return `<div class="table-responsive">
    <table class="table table-striped table-hover">
      <thead class="table-dark">${header}</thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
};

marked.use({ renderer });

async function convertMarkdownToHTML(inputFile, outputFile, title) {
  try {
    console.log(`Converting ${inputFile} to ${outputFile}...`);
    
    const markdown = fs.readFileSync(inputFile, 'utf-8');
    const htmlContent = marked(markdown);
    const fullHTML = createHTMLTemplate(title, htmlContent);
    
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