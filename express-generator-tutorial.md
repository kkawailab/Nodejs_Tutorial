# Express Application Generator チュートリアル

> Express アプリケーションの雛形を素早く作成する方法を学びます

## 目次

1. [はじめに](#はじめに)
2. [インストール方法](#インストール方法)
3. [基本的な使い方](#基本的な使い方)
4. [コマンドオプション](#コマンドオプション)
5. [テンプレートエンジン](#テンプレートエンジン)
6. [Pugサンプルアプリ](#pugサンプルアプリ)
7. [EJSサンプルアプリ](#ejsサンプルアプリ)
8. [Handlebarsサンプルアプリ](#handlebarsサンプルアプリ)
9. [Hoganサンプルアプリ](#hoganサンプルアプリ)
10. [テンプレートエンジンの比較](#テンプレートエンジンの比較)
11. [ベストプラクティス](#ベストプラクティス)

## はじめに

Express Application Generatorは、Expressアプリケーションの基本構造を素早く作成するためのコマンドラインツールです。プロジェクトの雛形を自動生成することで、開発の初期段階を大幅に短縮できます。

### このチュートリアルで学べること

- Express Generatorのインストールと基本的な使い方
- 様々なテンプレートエンジンの特徴と使い分け
- Pug、EJS、Handlebars、Hoganを使った実践的なサンプル
- 生成されたアプリケーションの構造とカスタマイズ方法

## インストール方法

Express Generatorは、Node.jsのバージョンによって異なる方法でインストールします。

### Node.js 8.2.0以降の場合

npxコマンドを使用して、インストールせずに直接実行できます：

```bash
npx express-generator
```

### 古いバージョンのNode.jsの場合

npmを使ってグローバルにインストールします：

```bash
npm install -g express-generator
```

> **💡 ヒント**: npxを使用する方法が推奨されています。これにより、常に最新バージョンのgeneratorを使用でき、グローバルな環境を汚染しません。

## 基本的な使い方

Express Generatorの基本的な使用方法を見ていきましょう。

### シンプルなアプリケーションの作成

```bash
# アプリケーションを作成
npx express-generator myapp

# ディレクトリに移動
cd myapp

# 依存関係をインストール
npm install

# アプリケーションを起動
DEBUG=myapp:* npm start
```

### 生成されるディレクトリ構造

```
myapp/
├── app.js              # アプリケーションのメインファイル
├── package.json        # プロジェクトの設定ファイル
├── bin/
│   └── www            # サーバー起動スクリプト
├── public/            # 静的ファイル
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
│       └── style.css
├── routes/            # ルーティング定義
│   ├── index.js
│   └── users.js
└── views/             # ビューテンプレート
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

## コマンドオプション

Express Generatorには様々なオプションが用意されています：

| オプション | 説明 | 使用例 |
|-----------|------|--------|
| `-h, --help` | ヘルプ情報を表示 | `express -h` |
| `--version` | バージョンを表示 | `express --version` |
| `-e, --ejs` | EJSテンプレートエンジンを使用 | `express -e myapp` |
| `--pug` | Pugテンプレートエンジンを使用（デフォルト） | `express --pug myapp` |
| `--hbs` | Handlebarsテンプレートエンジンを使用 | `express --hbs myapp` |
| `-H, --hogan` | Hoganテンプレートエンジンを使用 | `express -H myapp` |
| `-v, --view` | ビューエンジンを指定 | `express --view=ejs myapp` |
| `-c, --css` | CSSプリプロセッサを指定 | `express --css=sass myapp` |
| `--git` | .gitignoreファイルを生成 | `express --git myapp` |
| `-f, --force` | 既存ディレクトリに強制的に生成 | `express -f myapp` |

## テンプレートエンジン

Express Generatorは複数のテンプレートエンジンをサポートしています。それぞれの特徴を理解して、プロジェクトに最適なものを選びましょう。

### Pug（旧Jade）
- インデントベースの簡潔な構文
- HTMLタグの省略が可能
- 強力なミックスイン機能
- 学習曲線がやや急

### EJS
- HTMLに近い構文
- JavaScriptを直接埋め込み可能
- 学習が容易
- シンプルで分かりやすい

### Handlebars
- ロジックレステンプレート
- Mustache構文を拡張
- ヘルパー関数が使える
- セキュリティが高い

### Hogan
- Mustache互換
- 非常に高速
- 軽量（3KB）
- Twitter社が開発

## Pugサンプルアプリ

Pugを使ったExpressアプリケーションを作成してみましょう。

### 1. アプリケーションの生成

```bash
npx express-generator --view=pug pug-app
cd pug-app
npm install
```

### 2. ビューファイルの構造

**views/layout.pug**

```pug
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
```

**views/index.pug**

```pug
extends layout

block content
  h1= title
  p Welcome to #{title}
```

### 3. カスタマイズ例

**views/index.pug**を編集してページを拡張：

```pug
extends layout

block content
  .container
    h1= title
    p.lead Welcome to #{title} - Pugで作られたExpressアプリケーション
    
    .features
      h2 特徴
      ul
        li インデントベースの簡潔な構文
        li 強力なテンプレート継承
        li ミックスインによる再利用可能なコンポーネント
    
    .example
      h3 変数の使用例
      - const items = ['Node.js', 'Express', 'Pug']
      ul
        each item in items
          li= item
    
    button.btn.btn-primary(type='button') 
      | クリックしてください
```

### 4. ルーターの修正

**routes/index.js**

```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Pug Express App',
    message: 'Pugテンプレートエンジンを使用しています'
  });
});

module.exports = router;
```

### 5. アプリケーションの起動

```bash
DEBUG=pug-app:* npm start
```

## EJSサンプルアプリ

EJSを使ったExpressアプリケーションを作成します。

### 1. アプリケーションの生成

```bash
npx express-generator --view=ejs ejs-app
cd ejs-app
npm install
```

### 2. ビューファイルの構造

**views/index.ejs**

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

### 3. レイアウトの実装

EJSではレイアウト機能がないため、パーシャルを使います。

**views/partials/header.ejs**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">EJS Express App</a>
        </div>
    </nav>
    <div class="container mt-4">
```

**views/partials/footer.ejs**

```html
    </div>
    <footer class="footer mt-5 py-3 bg-light">
        <div class="container text-center">
            <span class="text-muted">&copy; 2024 EJS Express App</span>
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### 4. カスタマイズした index.ejs

```html
<%- include('partials/header') %>

<div class="row">
    <div class="col-md-8">
        <h1><%= title %></h1>
        <p class="lead">EJSテンプレートエンジンを使用したExpressアプリケーション</p>
        
        <h2>特徴</h2>
        <ul>
            <li>HTMLに近い構文で学習が容易</li>
            <li>JavaScriptコードを直接埋め込み可能</li>
            <li>条件分岐やループが簡単に書ける</li>
        </ul>
        
        <h3>動的なコンテンツの例</h3>
        <% const technologies = ['Node.js', 'Express', 'EJS', 'Bootstrap']; %>
        <div class="row">
            <% technologies.forEach(function(tech) { %>
                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><%= tech %></h5>
                        </div>
                    </div>
                </div>
            <% }); %>
        </div>
    </div>
    
    <div class="col-md-4">
        <h3>サイドバー</h3>
        <% if (user) { %>
            <p>ようこそ、<%= user.name %>さん！</p>
        <% } else { %>
            <p>ゲストユーザーです</p>
        <% } %>
    </div>
</div>

<%- include('partials/footer') %>
```

### 5. ルーターの更新

```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'EJS Express App',
    user: { name: '太郎' } // サンプルユーザーデータ
  });
});

module.exports = router;
```

## Handlebarsサンプルアプリ

Handlebarsを使ったExpressアプリケーションを作成します。

### 1. アプリケーションの生成

```bash
npx express-generator --view=hbs hbs-app
cd hbs-app
npm install
```

### 2. ビューファイルの構造

**views/layout.hbs**

```handlebars
<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    {{{body}}}
  </body>
</html>
```

**views/index.hbs**

```handlebars
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>
```

### 3. ヘルパー関数の追加

**app.js**に以下を追加：

```javascript
// Handlebarsの設定
var hbs = require('hbs');

// カスタムヘルパーの登録
hbs.registerHelper('uppercase', function(str) {
  return str.toUpperCase();
});

hbs.registerHelper('list', function(items, options) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});

// パーシャルの登録
hbs.registerPartials(__dirname + '/views/partials');
```

### 4. カスタマイズしたビュー

**views/index.hbs**

```handlebars
<div class="container">
    <h1>{{uppercase title}}</h1>
    <p class="lead">Handlebarsテンプレートエンジンを使用したExpressアプリケーション</p>
    
    <h2>特徴</h2>
    <ul>
        <li>ロジックレステンプレート</li>
        <li>Mustache構文の拡張版</li>
        <li>カスタムヘルパー関数</li>
        <li>パーシャルによる再利用</li>
    </ul>
    
    <h3>技術スタック</h3>
    {{#list technologies}}
        <strong>{{name}}</strong> - {{description}}
    {{/list}}
    
    {{#if showMessage}}
        <div class="alert alert-info">
            <p>{{message}}</p>
        </div>
    {{/if}}
    
    {{> userinfo user=currentUser}}
</div>
```

**views/partials/userinfo.hbs**

```handlebars
<div class="user-info">
    {{#if user}}
        <h4>ユーザー情報</h4>
        <p>名前: {{user.name}}</p>
        <p>メール: {{user.email}}</p>
    {{else}}
        <p>ログインしていません</p>
    {{/if}}
</div>
```

### 5. ルーターの更新

```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Handlebars Express App',
    technologies: [
      { name: 'Node.js', description: 'JavaScriptランタイム' },
      { name: 'Express', description: 'Webフレームワーク' },
      { name: 'Handlebars', description: 'テンプレートエンジン' }
    ],
    showMessage: true,
    message: 'Handlebarsは安全で使いやすいテンプレートエンジンです',
    currentUser: {
      name: '山田太郎',
      email: 'taro@example.com'
    }
  });
});

module.exports = router;
```

## Hoganサンプルアプリ

Hoganを使ったExpressアプリケーションを作成します。

### 1. アプリケーションの生成

```bash
npx express-generator --view=hogan hogan-app
cd hogan-app
npm install
```

> **⚠️ 注意**: Hoganテンプレートエンジンを使用した場合、ビューファイルは自動生成されません。手動で作成する必要があります。

### 2. ビューファイルの作成

**views/index.hjs**を作成：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <div class="container">
      <h1>{{ title }}</h1>
      <p class="lead">{{ description }}</p>
      
      <h2>特徴</h2>
      <ul>
        {{#features}}
          <li>{{ . }}</li>
        {{/features}}
      </ul>
      
      <h3>パフォーマンス</h3>
      <p>Hoganは{{ performance }}なテンプレートエンジンです。</p>
      
      {{#showBenchmark}}
      <div class="benchmark">
        <h4>ベンチマーク結果</h4>
        <table class="table">
          <thead>
            <tr>
              <th>エンジン</th>
              <th>処理時間</th>
            </tr>
          </thead>
          <tbody>
            {{#benchmarks}}
            <tr>
              <td>{{ engine }}</td>
              <td>{{ time }}ms</td>
            </tr>
            {{/benchmarks}}
          </tbody>
        </table>
      </div>
      {{/showBenchmark}}
    </div>
  </body>
</html>
```

**views/error.hjs**を作成：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Error</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>{{ message }}</h1>
    <h2>{{ error.status }}</h2>
    <pre>{{ error.stack }}</pre>
  </body>
</html>
```

### 3. app.jsの設定

```javascript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// Hoganの設定を追加
app.engine('hjs', require('hogan-express'));
```

### 4. ルーターの設定

**routes/index.js**

```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Hogan Express App',
    description: 'Hogan.jsは、Twitterが開発した高速で軽量なテンプレートエンジンです',
    features: [
      'Mustache構文に完全準拠',
      '非常に高速な処理',
      '軽量（わずか3KB）',
      'ブラウザとNode.js両方で動作'
    ],
    performance: '非常に高速',
    showBenchmark: true,
    benchmarks: [
      { engine: 'Hogan', time: 12 },
      { engine: 'Handlebars', time: 45 },
      { engine: 'EJS', time: 67 },
      { engine: 'Pug', time: 89 }
    ]
  });
});

module.exports = router;
```

### 5. パッケージの追加インストール

```bash
npm install hogan-express --save
```

## テンプレートエンジンの比較

各テンプレートエンジンの特徴を比較して、プロジェクトに最適なものを選びましょう。

| 特徴 | Pug | EJS | Handlebars | Hogan |
|------|-----|-----|------------|-------|
| **構文** | インデントベース | HTML埋め込み | Mustache拡張 | Mustache準拠 |
| **学習曲線** | やや急 | 緩やか | 普通 | 緩やか |
| **パフォーマンス** | 普通 | 高速 | 普通 | 非常に高速 |
| **ファイルサイズ** | 大きい | 中程度 | 中程度 | 非常に小さい（3KB） |
| **機能性** | 非常に豊富 | 豊富 | 適度 | 最小限 |
| **セキュリティ** | 高い | 要注意 | 非常に高い | 高い |
| **おすすめ用途** | 複雑なレイアウト | シンプルなアプリ | 大規模アプリ | 高速性重視 |

### 選択の指針

#### Pugを選ぶべき場合
- HTMLの記述量を減らしたい
- 強力なテンプレート継承が必要
- チームメンバーがPugに慣れている

#### EJSを選ぶべき場合
- HTMLの知識をそのまま活かしたい
- JavaScriptのロジックを直接書きたい
- 学習コストを最小限にしたい

#### Handlebarsを選ぶべき場合
- ビューとロジックを明確に分離したい
- セキュリティを重視する
- フロントエンドでも同じテンプレートを使いたい

#### Hoganを選ぶべき場合
- パフォーマンスが最優先
- ファイルサイズを最小限にしたい
- シンプルなテンプレート機能で十分

## ベストプラクティス

Express Generatorを使った開発で推奨される実践的なアドバイスです。

### 1. プロジェクト構造の拡張

生成された基本構造を、プロジェクトの規模に応じて拡張しましょう：

```
myapp/
├── app.js
├── package.json
├── bin/
│   └── www
├── config/           # 設定ファイル
│   ├── database.js
│   └── auth.js
├── controllers/      # コントローラー層
│   ├── userController.js
│   └── productController.js
├── models/          # データモデル
│   ├── User.js
│   └── Product.js
├── middleware/      # カスタムミドルウェア
│   ├── auth.js
│   └── validation.js
├── public/
├── routes/
├── views/
├── tests/           # テストファイル
│   ├── unit/
│   └── integration/
└── utils/           # ユーティリティ関数
    └── helpers.js
```

### 2. 環境変数の管理

**.env**ファイルを使用して環境設定を管理：

```bash
npm install dotenv --save
```

**.env**

```
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
SESSION_SECRET=your-secret-key
```

**app.js**の先頭に追加：

```javascript
require('dotenv').config();
```

### 3. エラーハンドリングの改善

```javascript
// カスタムエラーハンドラー
app.use((err, req, res, next) => {
  // ログ記録
  console.error(err.stack);
  
  // 開発環境では詳細なエラー情報を表示
  if (app.get('env') === 'development') {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  } else {
    // 本番環境では一般的なエラーメッセージ
    res.status(err.status || 500);
    res.render('error', {
      message: 'エラーが発生しました',
      error: {}
    });
  }
});
```

### 4. セキュリティの強化

```bash
npm install helmet cors express-rate-limit --save
```

```javascript
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// セキュリティヘッダーの設定
app.use(helmet());

// CORS設定
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100 // リクエスト数の上限
});
app.use('/api/', limiter);
```

### 5. ロギングの実装

```bash
npm install winston --save
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 6. デプロイメントの準備

**package.json**にスクリプトを追加：

```json
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    "test": "jest",
    "lint": "eslint .",
    "build": "npm run lint && npm test"
  }
}
```

**プロセスマネージャー（PM2）の使用**

```bash
# PM2のインストール
npm install pm2 -g

# アプリケーションの起動
pm2 start ./bin/www --name myapp

# クラスターモードで起動
pm2 start ./bin/www -i max --name myapp
```

## まとめ

Express Application Generatorは、Expressアプリケーションの開発を素早く始めるための強力なツールです。このチュートリアルで学んだ内容を活用して、効率的にWebアプリケーションを構築しましょう。

### 学んだこと
- Express Generatorの基本的な使い方
- 4つの主要なテンプレートエンジンの特徴
- 各エンジンでの実装方法
- プロジェクト構造の拡張方法

### 次のステップ
- データベースとの連携
- 認証システムの実装
- RESTful APIの構築
- 実際のプロジェクトへの適用

---

*約 1時間で完了 | 中級レベル | 最終更新: 2024年*