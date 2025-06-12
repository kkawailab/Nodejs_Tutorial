# Express.js 初心者向けチュートリアル

## 目次
1. [Express.jsとは](#expressjs-とは)
2. [環境設定](#環境設定)
3. [基本的なサーバー](#基本的なサーバー)
4. [ルーティング](#ルーティング)
5. [ミドルウェア](#ミドルウェア)
6. [テンプレートエンジン](#テンプレートエンジン)
7. [静的ファイル配信](#静的ファイル配信)
8. [リクエスト・レスポンス処理](#リクエストレスポンス処理)
9. [エラーハンドリング](#エラーハンドリング)
10. [セキュリティ](#セキュリティ)
11. [実践的なアプリケーション](#実践的なアプリケーション)
12. [デプロイメント](#デプロイメント)
13. [次のステップ](#次のステップ)

## Express.js とは

Express.jsは、Node.js用の軽量で柔軟なWebアプリケーションフレームワークです。シンプルでありながら強力な機能を提供し、Web APIやWebアプリケーションの開発を効率化します。

### Express.jsの特徴
- **軽量・高速**: 最小限の機能でスタート可能
- **柔軟性**: 必要な機能を追加可能
- **豊富なミドルウェア**: 多様な拡張機能
- **MVC パターン**: 構造化された開発
- **大規模エコシステム**: npmパッケージとの連携

### Express.jsでできること
- REST API の構築
- Webアプリケーションの開発
- リアルタイムアプリケーション
- マイクロサービスの構築

## 環境設定

### 前提条件
- Node.js（LTS版推奨）
- npm または yarn

### プロジェクトの初期化
```bash
# プロジェクトディレクトリを作成
mkdir express-tutorial
cd express-tutorial

# package.json を作成
npm init -y

# Express.js をインストール
npm install express

# 開発用ツールをインストール
npm install --save-dev nodemon
```

### package.json の設定
```json
{
  "name": "express-tutorial",
  "version": "1.0.0",
  "description": "Express.js tutorial project",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 基本的なサーバー

### 最小限のExpressサーバー
`app.js`:
```javascript
const express = require('express');
const app = express();
const port = 3000;

// 基本的なルート
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
```

### サーバーの起動
```bash
# 本番モード
npm start

# 開発モード（ファイル変更時に自動再起動）
npm run dev
```

### レスポンスの種類
```javascript
const express = require('express');
const app = express();

// テキストレスポンス
app.get('/text', (req, res) => {
  res.send('テキストレスポンス');
});

// JSONレスポンス
app.get('/json', (req, res) => {
  res.json({
    message: 'JSONレスポンス',
    timestamp: new Date(),
    data: [1, 2, 3]
  });
});

// HTMLレスポンス
app.get('/html', (req, res) => {
  res.send(`
    <html>
      <head><title>Express Tutorial</title></head>
      <body>
        <h1>HTMLレスポンス</h1>
        <p>これはHTMLです。</p>
      </body>
    </html>
  `);
});

// ステータスコード付きレスポンス
app.get('/status', (req, res) => {
  res.status(201).json({ message: '作成されました' });
});

app.listen(3000);
```

## ルーティング

### 基本的なHTTPメソッド
```javascript
const express = require('express');
const app = express();

// JSON解析ミドルウェア
app.use(express.json());

// GET リクエスト
app.get('/users', (req, res) => {
  res.json({ message: 'ユーザー一覧を取得' });
});

// POST リクエスト
app.post('/users', (req, res) => {
  const userData = req.body;
  res.status(201).json({ 
    message: 'ユーザーを作成',
    user: userData 
  });
});

// PUT リクエスト
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  res.json({ 
    message: `ユーザー ${userId} を更新`,
    user: userData 
  });
});

// DELETE リクエスト
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `ユーザー ${userId} を削除` });
});

app.listen(3000);
```

### パラメーター処理
```javascript
const express = require('express');
const app = express();

// ルートパラメーター
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId, message: `ユーザーID: ${userId}` });
});

// 複数のパラメーター
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ 
    userId, 
    postId, 
    message: `ユーザー ${userId} の投稿 ${postId}` 
  });
});

// クエリパラメーター
app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({
    query: q,
    page: page || 1,
    limit: limit || 10,
    message: '検索結果'
  });
});

// パラメーターの検証
app.get('/users/:id(\\d+)', (req, res) => {
  const userId = parseInt(req.params.id);
  res.json({ userId, message: '数値のIDのみ受け付け' });
});

app.listen(3000);
```

### ルーターモジュール
`routes/users.js`:
```javascript
const express = require('express');
const router = express.Router();

// サンプルデータ
let users = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  { id: 2, name: '佐藤花子', email: 'sato@example.com' }
];

// 全ユーザー取得
router.get('/', (req, res) => {
  res.json(users);
});

// 特定ユーザー取得
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'ユーザーが見つかりません' });
  }
  res.json(user);
});

// ユーザー作成
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// ユーザー更新
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'ユーザーが見つかりません' });
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

// ユーザー削除
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'ユーザーが見つかりません' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = router;
```

`app.js`:
```javascript
const express = require('express');
const app = express();

// ミドルウェア
app.use(express.json());

// ルーターを使用
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API サーバーが動作中' });
});

app.listen(3000, () => {
  console.log('サーバーが起動しました');
});
```

## ミドルウェア

### ミドルウェアとは
ミドルウェアは、リクエストとレスポンスの間で実行される関数です。リクエストの前処理、レスポンスの後処理、認証、ログ出力などに使用されます。

### 組み込みミドルウェア
```javascript
const express = require('express');
const app = express();

// JSON解析ミドルウェア
app.use(express.json());

// URL エンコードされたデータ解析
app.use(express.urlencoded({ extended: true }));

// 静的ファイル配信
app.use(express.static('public'));

app.listen(3000);
```

### カスタムミドルウェア
```javascript
const express = require('express');
const app = express();

// ログ出力ミドルウェア
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next(); // 次のミドルウェアまたはルートハンドラーに制御を渡す
};

// 認証ミドルウェア
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: '認証トークンが必要です' });
  }
  
  if (token !== 'Bearer secret-token') {
    return res.status(403).json({ error: '無効なトークンです' });
  }
  
  req.user = { id: 1, name: 'ユーザー' }; // ユーザー情報をリクエストに追加
  next();
};

// CORS ミドルウェア
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// ミドルウェアを適用
app.use(logger);
app.use(cors);
app.use(express.json());

// 公開ルート
app.get('/public', (req, res) => {
  res.json({ message: '誰でもアクセス可能' });
});

// 保護されたルート
app.get('/protected', authenticate, (req, res) => {
  res.json({ 
    message: '認証されたユーザーのみアクセス可能',
    user: req.user 
  });
});

app.listen(3000);
```

### サードパーティミドルウェア
```bash
npm install helmet morgan compression
```

```javascript
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// セキュリティヘッダー
app.use(helmet());

// ログ出力
app.use(morgan('combined'));

// レスポンス圧縮
app.use(compression());

// JSON解析
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'セキュアなExpressアプリ' });
});

app.listen(3000);
```

### エラーハンドリングミドルウェア
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// 通常のルート
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express' });
});

// エラーを発生させるルート
app.get('/error', (req, res, next) => {
  const error = new Error('意図的なエラー');
  error.status = 500;
  next(error);
});

// 404 ハンドラー（他のルートにマッチしない場合）
app.use((req, res, next) => {
  const error = new Error(`パス ${req.path} が見つかりません`);
  error.status = 404;
  next(error);
});

// エラーハンドリングミドルウェア（最後に配置）
app.use((err, req, res, next) => {
  console.error('エラーが発生しました:', err.message);
  
  const status = err.status || 500;
  const message = status === 500 ? 'サーバーエラーが発生しました' : err.message;
  
  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(3000);
```

## テンプレートエンジン

### EJSの設定と使用
```bash
npm install ejs
```

```javascript
const express = require('express');
const path = require('path');
const app = express();

// ビューエンジンの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイル
app.use(express.static('public'));

// サンプルデータ
const users = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  { id: 2, name: '佐藤花子', email: 'sato@example.com' },
  { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' }
];

// ホームページ
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Express Tutorial',
    message: 'Express.jsへようこそ！'
  });
});

// ユーザー一覧ページ
app.get('/users', (req, res) => {
  res.render('users', { 
    title: 'ユーザー一覧',
    users 
  });
});

app.listen(3000);
```

`views/layout.ejs`:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">Express Tutorial</a>
            <div class="navbar-nav">
                <a class="nav-link" href="/">ホーム</a>
                <a class="nav-link" href="/users">ユーザー</a>
            </div>
        </div>
    </nav>
    
    <main class="container mt-4">
        <%- body %>
    </main>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

`views/index.ejs`:
```html
<% layout('layout') -%>

<div class="jumbotron">
    <h1 class="display-4"><%= message %></h1>
    <p class="lead">Express.jsの基本的な使い方を学習しましょう。</p>
    <a class="btn btn-primary btn-lg" href="/users" role="button">ユーザー一覧を見る</a>
</div>

<div class="row">
    <div class="col-md-4">
        <h3>ルーティング</h3>
        <p>URLパスに応じて異なるページを表示する機能を学習します。</p>
    </div>
    <div class="col-md-4">
        <h3>ミドルウェア</h3>
        <p>リクエストとレスポンスの間で実行される処理を学習します。</p>
    </div>
    <div class="col-md-4">
        <h3>テンプレート</h3>
        <p>動的なHTMLページの生成方法を学習します。</p>
    </div>
</div>
```

`views/users.ejs`:
```html
<% layout('layout') -%>

<h1><%= title %></h1>

<div class="row">
    <div class="col-12">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>メールアドレス</th>
                </tr>
            </thead>
            <tbody>
                <% users.forEach(user => { %>
                    <tr>
                        <td><%= user.id %></td>
                        <td><%= user.name %></td>
                        <td><%= user.email %></td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>
</div>

<% if (users.length === 0) { %>
    <div class="alert alert-info">
        ユーザーが登録されていません。
    </div>
<% } %>
```

### Handlebarsの使用
```bash
npm install express-handlebars
```

```javascript
const express = require('express');
const { engine } = require('express-handlebars');
const app = express();

// Handlebarsの設定
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Handlebars Tutorial',
    users: [
      { name: '田中', active: true },
      { name: '佐藤', active: false }
    ]
  });
});

app.listen(3000);
```

## 静的ファイル配信

### 基本的な静的ファイル配信
```javascript
const express = require('express');
const path = require('path');
const app = express();

// 静的ファイルの配信（publicディレクトリから）
app.use(express.static('public'));

// 異なるパスで静的ファイルを配信
app.use('/assets', express.static('public'));

// 複数の静的ディレクトリ
app.use(express.static('public'));
app.use(express.static('files'));

// 絶対パスを使用
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);
```

### ディレクトリ構造
```
project/
├── app.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── images/
│   │   └── logo.png
│   └── index.html
└── uploads/
    └── files...
```

### ファイルアップロード
```bash
npm install multer
```

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// アップロード設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB制限
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('許可されていないファイル形式です'));
    }
  }
});

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// ファイルアップロード（単一ファイル）
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ファイルが選択されていません' });
  }
  
  res.json({
    message: 'ファイルがアップロードされました',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// 複数ファイルアップロード
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'ファイルが選択されていません' });
  }
  
  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size
  }));
  
  res.json({
    message: `${req.files.length}個のファイルがアップロードされました`,
    files: uploadedFiles
  });
});

app.listen(3000);
```

## リクエスト・レスポンス処理

### リクエストオブジェクト
```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/request-info', (req, res) => {
  const requestInfo = {
    // HTTPメソッド
    method: req.method,
    
    // URL関連
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    
    // パラメーター
    params: req.params,
    query: req.query,
    body: req.body,
    
    // ヘッダー
    headers: req.headers,
    userAgent: req.get('User-Agent'),
    
    // その他
    ip: req.ip,
    protocol: req.protocol,
    secure: req.secure,
    cookies: req.cookies
  };
  
  res.json(requestInfo);
});

app.listen(3000);
```

### レスポンスオブジェクト
```javascript
const express = require('express');
const app = express();

app.get('/response-methods', (req, res) => {
  // 基本的なレスポンス
  res.send('基本的なレスポンス');
});

app.get('/json-response', (req, res) => {
  // JSONレスポンス
  res.json({ message: 'JSONレスポンス', data: [1, 2, 3] });
});

app.get('/status-response', (req, res) => {
  // ステータスコード付きレスポンス
  res.status(201).json({ message: '作成されました' });
});

app.get('/redirect', (req, res) => {
  // リダイレクト
  res.redirect('/new-location');
});

app.get('/new-location', (req, res) => {
  res.send('リダイレクト先');
});

app.get('/headers', (req, res) => {
  // カスタムヘッダー
  res.set('X-Custom-Header', 'カスタム値');
  res.set({
    'X-Another-Header': '別の値',
    'Content-Type': 'application/json'
  });
  res.json({ message: 'カスタムヘッダー付きレスポンス' });
});

app.get('/cookie', (req, res) => {
  // クッキーの設定
  res.cookie('username', 'ユーザー', {
    maxAge: 900000, // 15分
    httpOnly: true,
    secure: false
  });
  res.send('クッキーが設定されました');
});

app.get('/download', (req, res) => {
  // ファイルダウンロード
  res.download('./package.json', 'download.json', (err) => {
    if (err) {
      console.error('ダウンロードエラー:', err);
      res.status(500).send('ダウンロードに失敗しました');
    }
  });
});

app.listen(3000);
```

### バリデーション
```bash
npm install joi
```

```javascript
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

// バリデーションスキーマ
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(120),
  password: Joi.string().min(6).required()
});

// バリデーションミドルウェア
const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'バリデーションエラー',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

app.post('/users', validateUser, (req, res) => {
  const userData = req.validatedData;
  
  // ユーザー作成処理...
  console.log('バリデーション済みデータ:', userData);
  
  res.status(201).json({
    message: 'ユーザーが作成されました',
    user: {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      age: userData.age
      // パスワードは含めない
    }
  });
});

app.listen(3000);
```

## エラーハンドリング

### 包括的なエラーハンドリング
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// カスタムエラークラス
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 非同期エラーをキャッチするヘルパー
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// サンプルデータベース（メモリ内）
let users = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' }
];

// ユーザー取得（エラーハンドリング付き）
app.get('/users/:id', catchAsync(async (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return next(new AppError('無効なユーザーIDです', 400));
  }
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return next(new AppError('ユーザーが見つかりません', 404));
  }
  
  res.json(user);
}));

// データベースエラーをシミュレート
app.get('/database-error', catchAsync(async (req, res, next) => {
  // データベース接続エラーをシミュレート
  throw new Error('データベース接続エラー');
}));

// 意図的なエラー
app.get('/trigger-error', (req, res, next) => {
  next(new AppError('これは意図的なエラーです', 500));
});

// 404 ハンドラー
app.all('*', (req, res, next) => {
  next(new AppError(`パス ${req.originalUrl} が見つかりません`, 404));
});

// グローバルエラーハンドラー
app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  
  // 開発環境でのデバッグ情報
  if (process.env.NODE_ENV === 'development') {
    console.error('エラー詳細:', {
      error: err,
      stack: err.stack,
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers
      }
    });
  }
  
  // 本番環境では詳細なエラー情報を隠す
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'サーバーエラーが発生しました';
  }
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000, () => {
  console.log('サーバーが起動しました');
});
```

### ログ出力
```bash
npm install winston
```

```javascript
const express = require('express');
const winston = require('winston');
const app = express();

// ログ設定
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'express-app' },
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

// リクエストログミドルウェア
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  logger.info('ホームページがアクセスされました');
  res.json({ message: 'Hello Express' });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  logger.error('エラーが発生しました', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({ error: 'サーバーエラー' });
});

app.listen(3000);
```

## セキュリティ

### 基本的なセキュリティ対策
```bash
npm install helmet express-rate-limit bcrypt jsonwebtoken
```

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// セキュリティヘッダー
app.use(helmet());

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: {
    error: 'リクエストが多すぎます。しばらく待ってから再試行してください。'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ログイン用のより厳しいレート制限
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 15分間に5回まで
  skipSuccessfulRequests: true
});

app.use(express.json({ limit: '10mb' }));

// サンプルユーザーデータ
const users = [];

// JWT秘密鍵（実際の開発では環境変数を使用）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ユーザー登録
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // 入力検証
    if (!username || !password || !email) {
      return res.status(400).json({ error: '必要な項目が入力されていません' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'パスワードは6文字以上で入力してください' });
    }
    
    // 既存ユーザーチェック
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'ユーザー名またはメールアドレスが既に使用されています' });
    }
    
    // パスワードハッシュ化
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // ユーザー作成
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(user);
    
    // レスポンス（パスワードは含めない）
    const { password: _, ...userResponse } = user;
    res.status(201).json({
      message: 'ユーザーが作成されました',
      user: userResponse
    });
    
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ログイン
app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
    }
    
    // ユーザー検索
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: '認証に失敗しました' });
    }
    
    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '認証に失敗しました' });
    }
    
    // JWTトークン生成
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'ログインに成功しました',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 認証ミドルウェア
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'アクセストークンが必要です' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '無効なトークンです' });
    }
    req.user = user;
    next();
  });
};

// 保護されたルート
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'ユーザーが見つかりません' });
  }
  
  const { password: _, ...userProfile } = user;
  res.json(userProfile);
});

app.listen(3000, () => {
  console.log('セキュアなサーバーが起動しました');
});
```

### CORS設定
```bash
npm install cors
```

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// 基本的なCORS設定
app.use(cors());

// カスタムCORS設定
const corsOptions = {
  origin: ['http://localhost:3000', 'https://mydomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.listen(3000);
```

## 実践的なアプリケーション

### ブログAPI
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// サンプルデータ
let posts = [
  {
    id: 1,
    title: 'Express.js入門',
    content: 'Express.jsの基本的な使い方について...',
    author: '田中太郎',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['Express', 'Node.js', 'Web開発']
  }
];

let comments = [
  {
    id: 1,
    postId: 1,
    author: '佐藤花子',
    content: 'とても参考になりました！',
    createdAt: new Date('2024-01-02')
  }
];

// 全投稿取得
app.get('/api/posts', (req, res) => {
  const { page = 1, limit = 10, tag, author } = req.query;
  
  let filteredPosts = posts;
  
  // タグフィルター
  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }
  
  // 著者フィルター
  if (author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  // ページネーション
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    posts: paginatedPosts,
    totalPosts: filteredPosts.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(filteredPosts.length / limit)
  });
});

// 特定投稿取得
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: '投稿が見つかりません' });
  }
  
  // その投稿のコメントも含める
  const postComments = comments.filter(c => c.postId === postId);
  
  res.json({
    ...post,
    comments: postComments
  });
});

// 投稿作成
app.post('/api/posts', (req, res) => {
  const { title, content, author, tags = [] } = req.body;
  
  // バリデーション
  if (!title || !content || !author) {
    return res.status(400).json({ 
      error: 'タイトル、内容、著者は必須です' 
    });
  }
  
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author,
    tags,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 投稿更新
app.put('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: '投稿が見つかりません' });
  }
  
  const { title, content, tags } = req.body;
  
  posts[postIndex] = {
    ...posts[postIndex],
    ...(title && { title }),
    ...(content && { content }),
    ...(tags && { tags }),
    updatedAt: new Date()
  };
  
  res.json(posts[postIndex]);
});

// 投稿削除
app.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: '投稿が見つかりません' });
  }
  
  // 関連するコメントも削除
  comments = comments.filter(c => c.postId !== postId);
  posts.splice(postIndex, 1);
  
  res.status(204).send();
});

// コメント追加
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: '投稿が見つかりません' });
  }
  
  const { author, content } = req.body;
  
  if (!author || !content) {
    return res.status(400).json({ 
      error: '著者と内容は必須です' 
    });
  }
  
  const newComment = {
    id: comments.length + 1,
    postId,
    author,
    content,
    createdAt: new Date()
  };
  
  comments.push(newComment);
  res.status(201).json(newComment);
});

// タグ一覧取得
app.get('/api/tags', (req, res) => {
  const allTags = posts.flatMap(post => post.tags);
  const uniqueTags = [...new Set(allTags)];
  res.json(uniqueTags);
});

app.listen(3000, () => {
  console.log('ブログAPI サーバーが起動しました');
});
```

### WebSocketチャット（Socket.io）
```bash
npm install socket.io
```

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// チャットルームとユーザー管理
const rooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log('ユーザーが接続しました:', socket.id);
  
  // ユーザー参加
  socket.on('join', (data) => {
    const { username, room } = data;
    
    socket.username = username;
    socket.room = room;
    socket.join(room);
    
    // ユーザー情報を保存
    users.set(socket.id, { username, room });
    
    // ルーム情報を更新
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room).add(socket.id);
    
    // 参加通知
    socket.to(room).emit('user-joined', {
      username,
      message: `${username}さんがチャットに参加しました`,
      timestamp: new Date()
    });
    
    // ルーム内のユーザー一覧を送信
    const roomUsers = Array.from(rooms.get(room)).map(id => {
      const user = users.get(id);
      return user ? user.username : null;
    }).filter(Boolean);
    
    io.to(room).emit('room-users', roomUsers);
  });
  
  // メッセージ送信
  socket.on('message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const messageData = {
      id: Date.now(),
      username: user.username,
      message: data.message,
      timestamp: new Date(),
      room: user.room
    };
    
    io.to(user.room).emit('message', messageData);
  });
  
  // タイピング状態
  socket.on('typing', (isTyping) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    socket.to(user.room).emit('typing', {
      username: user.username,
      isTyping
    });
  });
  
  // 切断処理
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // ルームからユーザーを削除
      if (rooms.has(user.room)) {
        rooms.get(user.room).delete(socket.id);
        if (rooms.get(user.room).size === 0) {
          rooms.delete(user.room);
        }
      }
      
      // 退出通知
      socket.to(user.room).emit('user-left', {
        username: user.username,
        message: `${user.username}さんがチャットから退出しました`,
        timestamp: new Date()
      });
      
      // 更新されたユーザー一覧を送信
      if (rooms.has(user.room)) {
        const roomUsers = Array.from(rooms.get(user.room)).map(id => {
          const u = users.get(id);
          return u ? u.username : null;
        }).filter(Boolean);
        
        io.to(user.room).emit('room-users', roomUsers);
      }
      
      users.delete(socket.id);
    }
    
    console.log('ユーザーが切断しました:', socket.id);
  });
});

// REST API
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.keys()).map(room => ({
    name: room,
    userCount: rooms.get(room).size
  }));
  res.json(roomList);
});

server.listen(3000, () => {
  console.log('チャットサーバーが起動しました: http://localhost:3000');
});
```

## デプロイメント

### Herokuデプロイ
```json
// package.json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

`Procfile`:
```
web: node app.js
```

### 環境変数設定
```javascript
const express = require('express');
const app = express();

// 環境変数の設定
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL;

app.get('/', (req, res) => {
  res.json({
    message: 'Express App',
    environment: NODE_ENV,
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
```

### PM2を使用したプロダクション運用
```bash
npm install -g pm2
```

`ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'express-app',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

コマンド:
```bash
# アプリ起動
pm2 start ecosystem.config.js --env production

# ステータス確認
pm2 status

# ログ確認
pm2 logs

# 再起動
pm2 restart express-app

# 停止
pm2 stop express-app
```

### Docker化
`Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "app.js"]
```

`docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

## 次のステップ

### 学習すべき高度なトピック

1. **データベース統合**
   - MongoDB (Mongoose)
   - PostgreSQL/MySQL (Sequelize, Prisma)
   - Redis (キャッシング、セッション)

2. **認証・認可**
   - Passport.js
   - OAuth 2.0
   - JWT ベストプラクティス

3. **テスト**
   - Jest
   - Supertest
   - モックとスタブ

4. **GraphQL**
   - Apollo Server
   - Resolvers とスキーマ

5. **マイクロサービス**
   - サービス分割
   - API Gateway
   - 分散トレーシング

### 実践プロジェクト案

1. **ECサイトAPI**
   - 商品管理
   - ユーザー認証
   - 注文処理
   - 決済統合

2. **タスク管理システム**
   - プロジェクト管理
   - チーム機能
   - ファイル添付

3. **学習管理システム**
   - コース管理
   - 進捗追跡
   - 動画配信

4. **SNSアプリケーション**
   - ユーザーフォロー
   - 投稿とコメント
   - リアルタイム通知

### 推奨リソース

- [Express.js 公式ドキュメント](https://expressjs.com/)
- [Node.js ベストプラクティス](https://github.com/goldbergyoni/nodebestpractices)
- [MDN Web API リファレンス](https://developer.mozilla.org/en-US/docs/Web/API)
- [REST API 設計ガイド](https://restfulapi.net/)

## まとめ

このチュートリアルでは、Express.jsの基本概念から実践的な応用まで幅広くカバーしました。Express.jsは柔軟で強力なフレームワークですが、適切な設計とセキュリティ対策が重要です。

重要なポイント：
- **ルーティング**でAPIエンドポイントを整理
- **ミドルウェア**で共通処理を効率化
- **エラーハンドリング**で堅牢性を確保
- **セキュリティ**を常に意識
- **テスト**でコード品質を保証

継続的な学習と実践を通じて、Express.jsの能力を最大限に活用してください！