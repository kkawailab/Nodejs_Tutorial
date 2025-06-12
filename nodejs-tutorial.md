# Node.js 初心者向けチュートリアル

## 目次
1. [Node.jsとは](#nodejs-とは)
2. [インストール](#インストール)
3. [基本概念](#基本概念)
4. [最初のプログラム](#最初のプログラム)
5. [モジュールシステム](#モジュールシステム)
6. [ファイル操作](#ファイル操作)
7. [HTTP サーバー](#http-サーバー)
8. [npm パッケージ管理](#npm-パッケージ管理)
9. [Express.js 入門](#expressjs-入門)
10. [次のステップ](#次のステップ)

## Node.js とは

Node.jsは、Chrome V8 JavaScriptエンジンで動作するJavaScriptランタイム環境です。ブラウザの外でJavaScriptを実行でき、サーバーサイド開発やツール作成に使用されます。

### Node.jsの特徴
- **非同期I/O**: ブロッキングしない処理
- **イベント駆動**: イベントループによる効率的な処理
- **軽量**: 高いパフォーマンス
- **豊富なエコシステム**: npmパッケージの充実

## インストール

### 公式サイトからダウンロード
1. [Node.js公式サイト](https://nodejs.org/) にアクセス
2. LTS版（推奨版）をダウンロード
3. インストーラーを実行

### インストール確認
```bash
node --version
npm --version
```

## 基本概念

### 非同期プログラミング
Node.jsでは非同期処理が基本です。

```javascript
// 同期的な処理（ブロッキング）
console.log('開始');
console.log('終了');

// 非同期な処理（ノンブロッキング）
console.log('開始');
setTimeout(() => {
  console.log('3秒後');
}, 3000);
console.log('終了');
```

### コールバック関数
```javascript
function greet(name, callback) {
  setTimeout(() => {
    callback(`こんにちは、${name}さん！`);
  }, 1000);
}

greet('田中', (message) => {
  console.log(message);
});
```

## 最初のプログラム

### Hello World
`hello.js` ファイルを作成：

```javascript
console.log('Hello, Node.js!');
console.log('Node.jsの世界へようこそ！');
```

実行：
```bash
node hello.js
```

### 対話的な実行
```bash
node
> console.log('Hello from REPL!')
> 2 + 3
> .exit
```

## モジュールシステム

### 組み込みモジュール
```javascript
// file system モジュール
const fs = require('fs');

// path モジュール
const path = require('path');

// HTTP モジュール
const http = require('http');
```

### 独自モジュールの作成
`math.js`:
```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};
```

`main.js`:
```javascript
const math = require('./math');

console.log(math.add(5, 3)); // 8
console.log(math.subtract(5, 3)); // 2
```

### ES6 モジュール（推奨）
`package.json` に `"type": "module"` を追加

`math.mjs`:
```javascript
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

`main.mjs`:
```javascript
import { add, subtract } from './math.mjs';

console.log(add(5, 3));
console.log(subtract(5, 3));
```

## ファイル操作

### ファイル読み込み
```javascript
const fs = require('fs').promises;

// 非同期でファイル読み込み
async function readFile() {
  try {
    const data = await fs.readFile('sample.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error('エラー:', error.message);
  }
}

readFile();
```

### ファイル書き込み
```javascript
const fs = require('fs').promises;

async function writeFile() {
  try {
    await fs.writeFile('output.txt', 'Hello, Node.js!', 'utf8');
    console.log('ファイルが作成されました');
  } catch (error) {
    console.error('エラー:', error.message);
  }
}

writeFile();
```

### ディレクトリ操作
```javascript
const fs = require('fs').promises;
const path = require('path');

async function listFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    files.forEach(file => {
      console.log(path.join(dirPath, file));
    });
  } catch (error) {
    console.error('エラー:', error.message);
  }
}

listFiles('./');
```

## HTTP サーバー

### 基本的なHTTPサーバー
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello, Node.js Server!</h1><p>これはNode.jsサーバーです。</p>');
});

const port = 3000;
server.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
```

### ルーティング機能付きサーバー
```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  if (path === '/') {
    res.end('<h1>ホームページ</h1><a href="/about">About</a>');
  } else if (path === '/about') {
    res.end('<h1>About</h1><a href="/">ホーム</a>');
  } else {
    res.writeHead(404);
    res.end('<h1>404 - ページが見つかりません</h1>');
  }
});

server.listen(3000, () => {
  console.log('サーバーが http://localhost:3000 で起動しました');
});
```

## npm パッケージ管理

### プロジェクトの初期化
```bash
mkdir my-node-project
cd my-node-project
npm init -y
```

### パッケージのインストール
```bash
# 本番依存
npm install lodash

# 開発依存
npm install --save-dev nodemon

# グローバルインストール
npm install -g http-server
```

### package.json の活用
```json
{
  "name": "my-node-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### スクリプトの実行
```bash
npm start
npm run dev
npm test
```

## Express.js 入門

### Expressのインストール
```bash
npm install express
```

### 基本的なExpressアプリ
```javascript
const express = require('express');
const app = express();
const port = 3000;

// ミドルウェア
app.use(express.json());
app.use(express.static('public'));

// ルート
app.get('/', (req, res) => {
  res.send('<h1>Express サーバー</h1>');
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: '田中太郎' },
    { id: 2, name: '佐藤花子' }
  ]);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  console.log('新しいユーザー:', newUser);
  res.status(201).json({ message: 'ユーザーが作成されました' });
});

app.listen(port, () => {
  console.log(`Express サーバーが http://localhost:${port} で起動しました`);
});
```

### ミドルウェアの活用
```javascript
const express = require('express');
const app = express();

// ログミドルウェア
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 認証ミドルウェア
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (token === 'Bearer secret-token') {
    next();
  } else {
    res.status(401).json({ error: '認証が必要です' });
  }
}

// 保護されたルート
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: '認証されたユーザーのみアクセス可能' });
});

app.listen(3000);
```

## 実践的な例

### シンプルなTODOアプリAPI
```javascript
const express = require('express');
const app = express();

app.use(express.json());

let todos = [
  { id: 1, text: 'Node.jsを学習する', completed: false },
  { id: 2, text: 'Expressを理解する', completed: true }
];

// 全てのTODOを取得
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// 新しいTODOを作成
app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// TODOを更新
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'TODOが見つかりません' });
  }
  
  todo.completed = req.body.completed;
  res.json(todo);
});

// TODOを削除
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'TODOが見つかりません' });
  }
  
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('TODO API サーバーが起動しました');
});
```

## デバッグとエラーハンドリング

### try-catch文
```javascript
async function riskyOperation() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    throw error;
  }
}
```

### プロセスレベルのエラーハンドリング
```javascript
process.on('uncaughtException', (error) => {
  console.error('未処理の例外:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未処理のPromise rejection:', reason);
  process.exit(1);
});
```

### デバッグ
```javascript
// Node.js組み込みデバッガー
node --inspect server.js

// console.logを活用
console.log('変数の値:', variable);
console.error('エラー情報:', error);
console.table(arrayData);
```

## 環境変数とセキュリティ

### 環境変数の使用
```javascript
// .env ファイル（dotenvパッケージ使用）
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error('SECRET_KEY環境変数が設定されていません');
}
```

### 基本的なセキュリティ対策
```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// セキュリティヘッダー
app.use(helmet());

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100 // 最大100リクエスト
});
app.use(limiter);

// 入力検証
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: '名前とメールアドレスは必須です' });
  }
  
  if (name.length > 50) {
    return res.status(400).json({ error: '名前は50文字以内で入力してください' });
  }
  
  // メールアドレスの簡単な検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '有効なメールアドレスを入力してください' });
  }
  
  // ユーザー作成処理...
  res.json({ message: 'ユーザーが作成されました' });
});
```

## テスト

### Jest を使用した単体テスト
```bash
npm install --save-dev jest
```

`math.test.js`:
```javascript
const { add, subtract } = require('./math');

describe('Math functions', () => {
  test('足し算が正しく動作する', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
  
  test('引き算が正しく動作する', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(1, 1)).toBe(0);
  });
});
```

`package.json`:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### API テスト
```javascript
const request = require('supertest');
const app = require('./app'); // Expressアプリ

describe('API Tests', () => {
  test('GET /api/todos should return todos', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(200);
      
    expect(response.body).toBeInstanceOf(Array);
  });
  
  test('POST /api/todos should create new todo', async () => {
    const newTodo = { text: 'テスト用TODO' };
    
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(201);
      
    expect(response.body.text).toBe(newTodo.text);
    expect(response.body.completed).toBe(false);
  });
});
```

## 次のステップ

### 学習すべき追加トピック
1. **データベース連携**
   - MongoDB (Mongoose)
   - MySQL/PostgreSQL (Sequelize, Prisma)
   - Redis

2. **認証・認可**
   - JWT (JSON Web Tokens)
   - Passport.js
   - OAuth 2.0

3. **リアルタイム通信**
   - WebSocket
   - Socket.io

4. **マイクロサービス**
   - Docker
   - Kubernetes
   - API Gateway

5. **パフォーマンス最適化**
   - クラスタリング
   - キャッシング
   - ロードバランシング

### 推奨学習リソース
- [Node.js 公式ドキュメント](https://nodejs.org/docs/)
- [Express.js ガイド](https://expressjs.com/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [npmjs.com](https://www.npmjs.com/)

### 実践プロジェクト案
1. **ブログシステム**
   - CRUD操作
   - ユーザー認証
   - ファイルアップロード

2. **チャットアプリケーション**
   - リアルタイム通信
   - ユーザー管理
   - メッセージ履歴

3. **REST API**
   - データベース連携
   - 認証機能
   - API ドキュメント

4. **コマンドラインツール**
   - ファイル処理
   - 外部API連携
   - 設定管理

## まとめ

このチュートリアルでは、Node.jsの基本的な概念から実践的な開発まで幅広くカバーしました。Node.jsは強力で柔軟な技術ですが、継続的な学習と実践が重要です。

重要なポイント：
- **非同期プログラミング**を理解する
- **モジュールシステム**を活用する
- **エラーハンドリング**を適切に行う
- **セキュリティ**を常に意識する
- **テスト**を書く習慣をつける

Node.jsエコシステムは急速に進歩しているため、公式ドキュメントや最新のベストプラクティスを定期的に確認することをお勧めします。

頑張って学習を続けてください！🚀