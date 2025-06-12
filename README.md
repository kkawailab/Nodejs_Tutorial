# Node.js チュートリアルサイト

Node.jsとExpress.jsの初心者向け日本語チュートリアルサイトです。基本から実践まで段階的に学習できるように構成されています。

## 🚀 特徴

- **日本語対応**: すべて日本語で書かれているため、理解しやすく学習効率が向上
- **段階的学習**: 基礎から応用まで、無理なく段階的にスキルアップ
- **実践的なコード**: 実際のプロジェクトで使える実践的なコード例を豊富に提供
- **モバイル対応**: レスポンシブデザインでスマートフォンでも快適に学習
- **プログレス追跡**: 学習進捗を自動的に保存・追跡

## 📚 コンテンツ

### 1. Node.js 基礎チュートリアル
- Node.jsとは何か
- インストールと環境設定
- モジュールシステム
- ファイル操作とI/O
- HTTPサーバーの構築
- npm パッケージ管理
- 非同期プログラミング
- デバッグとテスト

### 2. Express.js フレームワーク
- Express.jsの基本設定
- ルーティングとミドルウェア
- テンプレートエンジン
- REST API の構築
- セキュリティ対策
- エラーハンドリング
- 実践的なアプリ開発
- デプロイメント

## 🎯 対象者

- プログラミング初心者
- JavaScript の基本を理解している方
- サーバーサイド開発に興味がある方
- Node.js を体系的に学習したい方

## 🛠 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **フレームワーク**: Bootstrap 5
- **アイコン**: Font Awesome 6
- **シンタックスハイライト**: Prism.js
- **マークダウン変換**: marked.js

## 📁 ファイル構成

```
Nodejs_Tutorial/
├── index.html              # メインページ
├── nodejs-tutorial.html    # Node.js チュートリアル
├── express-tutorial.html   # Express.js チュートリアル
├── assets/
│   ├── css/
│   │   └── style.css       # カスタムスタイル
│   ├── js/
│   │   └── main.js         # JavaScript機能
│   └── images/             # 画像ファイル
├── nodejs-tutorial.md      # Node.js マークダウン
├── express-tutorial.md     # Express.js マークダウン
├── convert-to-html.js      # Markdown→HTML変換スクリプト
├── update-tutorials.js     # チュートリアル更新スクリプト
└── README.md              # このファイル
```

## 🚀 使用方法

### 1. ローカルで表示

シンプルにHTMLファイルをブラウザで開く：

```bash
# index.html をブラウザで開く
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### 2. ローカルサーバーで起動

Node.js がインストールされている場合：

```bash
# http-server をインストール
npm install -g http-server

# サーバーを起動
http-server

# ブラウザで http://localhost:8080 にアクセス
```

Python を使用する場合：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 3. GitHub Pages でホスティング

1. このリポジトリをGitHubにプッシュ
2. Settings → Pages → Source を "Deploy from a branch" に設定
3. Branch を "main" に設定
4. 自動的にデプロイされてURLが発行される

## 🔧 開発・カスタマイズ

### マークダウンからHTML変換

新しいマークダウンファイルを追加した場合：

```bash
# 必要なパッケージをインストール
npm install marked

# HTMLに変換
node convert-to-html.js
```

### スタイルのカスタマイズ

`assets/css/style.css` を編集してカスタマイズできます：

```css
:root {
    --primary-color: #339933;    /* メインカラー */
    --secondary-color: #68217a;  /* セカンダリカラー */
    --accent-color: #f39c12;     /* アクセントカラー */
}
```

### JavaScript機能の追加

`assets/js/main.js` に新しい機能を追加できます。

## 📱 レスポンシブ対応

- **デスクトップ**: 1200px以上
- **タブレット**: 768px-1199px
- **モバイル**: 767px以下

## 🌟 主な機能

### インタラクティブ機能
- **スムーススクロール**: アンカーリンクでのスムーズな移動
- **モバイルメニュー**: ハンバーガーメニュー対応
- **プログレストラッキング**: 学習進捗の自動保存
- **コードコピー**: コードブロックのワンクリックコピー
- **トップに戻る**: スクロール時に表示されるボタン

### アニメーション
- **スクロール連動**: 要素が表示範囲に入ると表示アニメーション
- **ホバーエフェクト**: ボタンやカードのホバー時アニメーション
- **ローディング**: ページ読み込み時のアニメーション

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: #339933 (Node.js グリーン)
- **セカンダリ**: #68217a (パープル)
- **アクセント**: #f39c12 (オレンジ)
- **ダーク**: #2c3e50
- **ライト**: #ecf0f1

### タイポグラフィ
- **メインフォント**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **コードフォント**: 'Courier New', monospace

## 📈 パフォーマンス最適化

- **画像最適化**: WebP形式の使用推奨
- **CSS/JS圧縮**: 本番環境では圧縮版を使用
- **CDN利用**: Bootstrap、Font Awesome、Prism.jsはCDNから読み込み
- **キャッシュ戦略**: 静的ファイルの適切なキャッシュ設定

## 🔒 セキュリティ

- **Content Security Policy**: XSS攻撃の防止
- **HTTPS**: 本番環境ではHTTPS必須
- **入力検証**: フォームがある場合は適切な検証を実装

## 🚀 デプロイメント

### Netlify
1. GitHubリポジトリと連携
2. Build command: (なし)
3. Publish directory: `.`

### Vercel
1. GitHubリポジトリをインポート
2. 自動でデプロイされる

### GitHub Pages
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/improvement`)
3. 変更をコミット (`git commit -m 'Add some improvement'`)
4. ブランチにプッシュ (`git push origin feature/improvement`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは学習目的で作成されており、MIT ライセンスの下で公開されています。

## 📞 サポート

質問や問題がある場合は、以下の方法でお問い合わせください：

- **Issue**: GitHub Issues を使用
- **Email**: (メールアドレスを追加)
- **Twitter**: (Twitterアカウントを追加)

## 🙏 謝辞

- [Node.js](https://nodejs.org/) - 公式ドキュメント
- [Express.js](https://expressjs.com/) - 公式ドキュメント
- [Bootstrap](https://getbootstrap.com/) - UIフレームワーク
- [Font Awesome](https://fontawesome.com/) - アイコン
- [Prism.js](https://prismjs.com/) - シンタックスハイライト

---

**Happy Learning! 🎉**