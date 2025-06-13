# データベース連携マスターコース

> MongoDB、PostgreSQL、Redisを使った本格的なデータベース設計と実装

## 目次

1. [はじめに](#はじめに)
2. [MongoDB と Mongoose](#mongodb-と-mongoose)
3. [PostgreSQL と Sequelize](#postgresql-と-sequelize)
4. [Redis でキャッシング](#redis-でキャッシング)
5. [ORMとクエリ最適化](#ormとクエリ最適化)
6. [データベース設計](#データベース設計)
7. [マイグレーション](#マイグレーション)
8. [バックアップとレプリケーション](#バックアップとレプリケーション)
9. [パフォーマンスチューニング](#パフォーマンスチューニング)
10. [ベストプラクティス](#ベストプラクティス)

## はじめに

現代のWebアプリケーション開発において、データベースは不可欠な要素です。このチュートリアルでは、Node.jsアプリケーションで最も人気のある3つのデータベース技術について学びます。

### このチュートリアルで学べること

- MongoDB（NoSQL）とMongooseを使ったドキュメント指向データベースの操作
- PostgreSQL（SQL）とSequelizeを使ったリレーショナルデータベースの管理
- Redisを使った高速キャッシングシステムの実装
- データベース設計の原則とベストプラクティス
- 本番環境でのパフォーマンス最適化とスケーリング

### データベースの選択基準

#### MongoDB
- スキーマレスで柔軟なデータ構造
- 水平スケーリングが容易
- JSONライクなドキュメント形式
- リアルタイムアプリケーションに最適

#### PostgreSQL
- ACID準拠の強力なトランザクション
- 複雑なクエリと結合に優れる
- データ整合性が重要な場合に最適
- 豊富な拡張機能とデータ型

#### Redis
- インメモリデータストア
- 超高速な読み書き性能
- セッション管理やキャッシュに最適
- Pub/Sub機能でリアルタイム通信

## MongoDB と Mongoose

MongoDBは最も人気のあるNoSQLデータベースで、Mongooseはそのための強力なODM（Object Document Mapper）です。

### 1. セットアップ

```bash
# MongoDBのインストール（macOS）
brew tap mongodb/brew
brew install mongodb-community

# MongoDBの起動
brew services start mongodb-community

# Mongooseのインストール
npm install mongoose
```

### 2. 接続設定

**config/database.js**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // 接続イベントのリスナー
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // グレースフルシャットダウン
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3. スキーマとモデルの定義

**models/User.js**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '名前は必須です'],
    trim: true,
    maxlength: [50, '名前は50文字以内で入力してください']
  },
  email: {
    type: String,
    required: [true, 'メールアドレスは必須です'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: '有効なメールアドレスを入力してください'
    }
  },
  password: {
    type: String,
    required: [true, 'パスワードは必須です'],
    minlength: [6, 'パスワードは6文字以上で入力してください'],
    select: false // デフォルトでパスワードを取得しない
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    bio: String,
    avatar: String,
    social: {
      twitter: String,
      facebook: String,
      linkedin: String
    }
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// インデックスの設定
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text', 'profile.bio': 'text' });

// 仮想プロパティ
userSchema.virtual('fullName').get(function() {
  return this.name;
});

userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

// ミドルウェア - 保存前にパスワードをハッシュ化
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// インスタンスメソッド
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// 静的メソッド
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### 4. CRUD操作の実装

**controllers/userController.js**

```javascript
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ユーザー一覧取得
exports.getUsers = catchAsync(async (req, res, next) => {
  // クエリビルダー
  const query = User.find();
  
  // フィルタリング
  if (req.query.role) {
    query.where('role').equals(req.query.role);
  }
  
  if (req.query.active) {
    query.where('isActive').equals(req.query.active === 'true');
  }
  
  // 検索
  if (req.query.search) {
    query.where('name').regex(new RegExp(req.query.search, 'i'));
  }
  
  // ソート
  const sortBy = req.query.sortBy || '-createdAt';
  query.sort(sortBy);
  
  // ページネーション
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  query.skip(skip).limit(limit);
  
  // フィールド選択
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query.select(fields);
  }
  
  // ポピュレート
  query.populate('posts', 'title status publishedAt');
  
  // 実行
  const users = await query;
  
  // 総数を取得
  const total = await User.countDocuments();
  
  res.json({
    status: 'success',
    results: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users
  });
});

// 単一ユーザー取得
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: 'posts',
      select: 'title slug status publishedAt views',
      match: { status: 'published' },
      options: { sort: '-publishedAt', limit: 10 }
    });
  
  if (!user) {
    return next(new AppError('ユーザーが見つかりません', 404));
  }
  
  res.json({
    status: 'success',
    data: user
  });
});

// ユーザー作成
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
  
  res.status(201).json({
    status: 'success',
    data: newUser
  });
});
```

### 5. 高度なクエリテクニック

```javascript
// 複雑なアグリゲーション
const getPopularPosts = async () => {
  const posts = await Post.aggregate([
    // 公開済みの投稿のみ
    { $match: { status: 'published' } },
    
    // 日付でフィルタ（過去30日）
    {
      $match: {
        publishedAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    },
    
    // いいね数を計算
    {
      $addFields: {
        likeCount: { $size: '$likes' },
        commentCount: { $size: '$comments' }
      }
    },
    
    // 人気度スコアを計算
    {
      $addFields: {
        popularityScore: {
          $add: [
            { $multiply: ['$views', 0.1] },
            { $multiply: ['$likeCount', 2] },
            { $multiply: ['$commentCount', 3] }
          ]
        }
      }
    },
    
    // ソート
    { $sort: { popularityScore: -1 } },
    
    // 上位10件を取得
    { $limit: 10 },
    
    // 著者情報を結合
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    
    // 配列を単一オブジェクトに変換
    { $unwind: '$author' },
    
    // 必要なフィールドのみ選択
    {
      $project: {
        title: 1,
        slug: 1,
        excerpt: 1,
        author: {
          name: 1,
          email: 1,
          'profile.avatar': 1
        },
        category: 1,
        tags: 1,
        views: 1,
        likeCount: 1,
        commentCount: 1,
        popularityScore: 1,
        publishedAt: 1
      }
    }
  ]);
  
  return posts;
};

// トランザクションの使用
const transferPost = async (postId, fromUserId, toUserId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 投稿の著者を更新
    const post = await Post.findByIdAndUpdate(
      postId,
      { author: toUserId },
      { session, new: true }
    );
    
    if (!post) {
      throw new Error('投稿が見つかりません');
    }
    
    // 元の著者から投稿を削除
    await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { posts: postId } },
      { session }
    );
    
    // 新しい著者に投稿を追加
    await User.findByIdAndUpdate(
      toUserId,
      { $push: { posts: postId } },
      { session }
    );
    
    // トランザクションをコミット
    await session.commitTransaction();
    session.endSession();
    
    return post;
  } catch (error) {
    // エラーが発生したらロールバック
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
```

## PostgreSQL と Sequelize

PostgreSQLは最も高機能なオープンソースのリレーショナルデータベースで、SequelizeはNode.js用の強力なORMです。

### 1. セットアップ

```bash
# PostgreSQLのインストール（macOS）
brew install postgresql
brew services start postgresql

# データベースの作成
createdb myapp_development
createdb myapp_test
createdb myapp_production

# Sequelizeと必要なパッケージのインストール
npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli

# Sequelizeの初期化
npx sequelize-cli init
```

### 2. 設定ファイル

**config/config.js**

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'myapp_development',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || 'myapp_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

### 3. モデルの定義

**models/user.js**

```javascript
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin', 'vendor'),
      defaultValue: 'customer'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profile: {
      type: DataTypes.JSONB,
      defaultValue: {},
      get() {
        return this.getDataValue('profile') || {};
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['username'] },
      { fields: ['createdAt'] }
    ],
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // インスタンスメソッド
  User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  // クラスメソッド
  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.findActiveUsers = function() {
    return this.findAll({ 
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
  };

  return User;
};
```

### 4. アソシエーション

**models/index.js**

```javascript
const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// モデルのインポート
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Product = require('./product')(sequelize, Sequelize.DataTypes);
const Order = require('./order')(sequelize, Sequelize.DataTypes);
const OrderItem = require('./orderItem')(sequelize, Sequelize.DataTypes);

// アソシエーションの定義
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  OrderItem
};
```

## Redis でキャッシング

Redisは高速なインメモリデータストアで、キャッシング、セッション管理、リアルタイム機能の実装に最適です。

### 1. セットアップ

```bash
# Redisのインストール（macOS）
brew install redis
brew services start redis

# Node.jsクライアントのインストール
npm install redis ioredis
```

### 2. Redis接続の設定

**config/redis.js**

```javascript
const Redis = require('ioredis');

// Redis接続の作成
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

// 接続イベント
redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

// Pub/Sub用の別接続
const pubClient = redis.duplicate();
const subClient = redis.duplicate();

module.exports = {
  redis,
  pubClient,
  subClient
};
```

### 3. キャッシングミドルウェア

**middleware/cache.js**

```javascript
const { redis } = require('../config/redis');

// キャッシュキーの生成
const generateCacheKey = (req) => {
  const { originalUrl, method } = req;
  const userId = req.user?.id || 'anonymous';
  return `cache:${method}:${originalUrl}:${userId}`;
};

// キャッシュミドルウェア
const cache = (duration = 300) => {
  return async (req, res, next) => {
    // POSTリクエストはキャッシュしない
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = generateCacheKey(req);
    
    try {
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        const data = JSON.parse(cachedData);
        console.log('Cache hit:', key);
        return res.json(data);
      }
      
      // キャッシュがない場合は次へ
      console.log('Cache miss:', key);
      
      // レスポンスをインターセプト
      const originalJson = res.json;
      res.json = function(data) {
        // レスポンスをキャッシュに保存
        redis.setex(key, duration, JSON.stringify(data))
          .catch(err => console.error('Cache set error:', err));
        
        // 元のjsonメソッドを呼ぶ
        originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = { cache };
```

### 4. セッション管理

**config/session.js**

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { redis } = require('./redis');

const sessionConfig = {
  store: new RedisStore({
    client: redis,
    prefix: 'sess:',
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1週間
    sameSite: 'lax'
  },
  name: 'sessionId'
};

module.exports = sessionConfig;
```

## ORMとクエリ最適化

ORMを効率的に使用し、パフォーマンスを最適化するためのテクニックを学びます。

### 1. N+1問題の解決

```javascript
// 悪い例：N+1問題が発生
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findByPk(post.authorId); // N回のクエリ
}

// 良い例：Eager Loading
const posts = await Post.findAll({
  include: [{
    model: User,
    as: 'author',
    attributes: ['id', 'name', 'email'] // 必要なフィールドのみ
  }]
});

// さらに最適化：ネストした関連の読み込み
const posts = await Post.findAll({
  include: [
    {
      model: User,
      as: 'author',
      attributes: ['id', 'name'],
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['avatar', 'bio']
      }]
    }
  ]
});
```

### 2. クエリの最適化

```javascript
// インデックスの活用
// Mongooseの場合
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'profile.location': '2dsphere' }); // 地理空間インデックス

// Sequelizeの場合
User.init({
  // ... fields
}, {
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['createdAt']
    },
    {
      type: 'FULLTEXT',
      fields: ['bio']
    }
  ]
});

// プロジェクションで必要なフィールドのみ取得
const users = await User.find({}, 'name email createdAt');

// Lean()で軽量なオブジェクトを取得（Mongoose）
const products = await Product
  .find({ status: 'active' })
  .select('name price')
  .lean(); // Mongooseドキュメントではなく、プレーンオブジェクトを返す
```

### 3. バッチ処理とストリーミング

```javascript
// カーソルを使った大量データの処理（MongoDB）
async function processLargeDataset() {
  const cursor = User.find({ isActive: true }).cursor();
  
  for (let user = await cursor.next(); user != null; user = await cursor.next()) {
    // 各ユーザーを個別に処理
    await processUser(user);
  }
}

// バッチ処理
async function batchProcess(model, batchSize = 1000) {
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const batch = await model.findAll({
      limit: batchSize,
      offset: offset,
      raw: true
    });
    
    if (batch.length === 0) {
      hasMore = false;
    } else {
      await processBatch(batch);
      offset += batchSize;
    }
  }
}
```

## データベース設計

効率的で拡張可能なデータベース設計の原則とパターンを学びます。

### 1. 正規化と非正規化

```javascript
// 正規化されたスキーマ（リレーショナル）
// 第3正規形まで正規化
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  username: { type: DataTypes.STRING, unique: true }
});

const UserProfile = sequelize.define('UserProfile', {
  userId: { type: DataTypes.UUID, references: { model: User } },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  bio: DataTypes.TEXT,
  avatar: DataTypes.STRING
});

// 非正規化されたスキーマ（NoSQL）
// パフォーマンスを優先して一部のデータを埋め込み
const userSchema = new Schema({
  email: String,
  username: String,
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  // 頻繁にアクセスされる集計データを保存
  stats: {
    postCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  }
});
```

### 2. スキーマ設計パターン

```javascript
// 1. ポリモーフィック関連
const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.UUID, primaryKey: true },
  content: DataTypes.TEXT,
  commentableId: DataTypes.UUID,
  commentableType: DataTypes.STRING, // 'Post', 'Product', 'User'
  userId: DataTypes.UUID
});

// 2. 階層データ（ツリー構造）
const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: DataTypes.STRING,
  parentId: {
    type: DataTypes.UUID,
    references: { model: 'categories', key: 'id' }
  },
  path: DataTypes.STRING, // '/electronics/computers/laptops'
  depth: DataTypes.INTEGER
});

// 3. タグシステム（多対多）
const Tag = sequelize.define('Tag', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true },
  slug: { type: DataTypes.STRING, unique: true }
});

const PostTag = sequelize.define('PostTag', {
  postId: DataTypes.UUID,
  tagId: DataTypes.UUID,
  order: DataTypes.INTEGER
});

Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });
```

## マイグレーション

データベースのスキーマ変更を安全に管理する方法を学びます。

### 1. マイグレーションの基本

```bash
# Sequelizeマイグレーションの作成
npx sequelize-cli migration:generate --name add-user-table

# マイグレーションの実行
npx sequelize-cli db:migrate

# マイグレーションのロールバック
npx sequelize-cli db:migrate:undo
```

### 2. 安全なマイグレーション戦略

```javascript
// カラムの追加（安全）
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true, // 最初はNULL許可
      defaultValue: null
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'phoneNumber');
  }
};

// インデックスの追加（CONCURRENTLYを使用）
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE INDEX CONCURRENTLY idx_users_email ON users(email);'
    );
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY idx_users_email;'
    );
  }
};
```

### 3. データマイグレーション

```javascript
// データの変換を伴うマイグレーション
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新しいカラムを追加
    await queryInterface.addColumn('users', 'fullName', {
      type: Sequelize.STRING
    });
    
    // バッチでデータを更新
    const batchSize = 1000;
    let offset = 0;
    
    while (true) {
      const users = await queryInterface.sequelize.query(
        `SELECT id, "firstName", "lastName" FROM users 
         LIMIT :limit OFFSET :offset`,
        {
          replacements: { limit: batchSize, offset },
          type: Sequelize.QueryTypes.SELECT
        }
      );
      
      if (users.length === 0) break;
      
      // バルクアップデート
      const updates = users.map(user => ({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`
      }));
      
      await queryInterface.bulkUpdate('users', updates);
      
      offset += batchSize;
      console.log(`Updated ${offset} users...`);
    }
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'fullName');
  }
};
```

## バックアップとレプリケーション

データの安全性を確保するためのバックアップ戦略とレプリケーションの設定方法を学びます。

### 1. PostgreSQLバックアップ

```bash
# 論理バックアップ（pg_dump）
pg_dump -h localhost -U postgres -d myapp > backup.sql

# カスタムフォーマットでバックアップ（圧縮）
pg_dump -h localhost -U postgres -d myapp -Fc > backup.dump

# バックアップのリストア
psql -h localhost -U postgres -d myapp_restore < backup.sql

# カスタムフォーマットのリストア
pg_restore -h localhost -U postgres -d myapp_restore backup.dump
```

### 2. MongoDBバックアップ

```bash
# mongodumpを使用したバックアップ
mongodump --host localhost --port 27017 --db myapp --out /backup/mongo/

# 圧縮バックアップ
mongodump --archive=myapp.archive --gzip --db myapp

# リストア
mongorestore --host localhost --port 27017 /backup/mongo/myapp/

# アーカイブからのリストア
mongorestore --archive=myapp.archive --gzip
```

### 3. 自動バックアップスクリプト

**scripts/backup.js**

```javascript
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

class BackupManager {
  constructor(config) {
    this.config = config;
    this.backupDir = config.backupDir || '/tmp/backups';
  }
  
  async backupPostgres() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `postgres-backup-${timestamp}.dump`;
    const filepath = path.join(this.backupDir, filename);
    
    // バックアップディレクトリの作成
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // pg_dumpの実行
    return new Promise((resolve, reject) => {
      const pgDump = spawn('pg_dump', [
        '-h', this.config.postgres.host,
        '-U', this.config.postgres.user,
        '-d', this.config.postgres.database,
        '-Fc',
        '-f', filepath
      ], {
        env: {
          ...process.env,
          PGPASSWORD: this.config.postgres.password
        }
      });
      
      pgDump.on('exit', (code) => {
        if (code === 0) {
          resolve(filepath);
        } else {
          reject(new Error(`pg_dump exited with code ${code}`));
        }
      });
    });
  }
  
  async uploadToS3(filepath) {
    const fileStream = await fs.readFile(filepath);
    const filename = path.basename(filepath);
    
    const params = {
      Bucket: this.config.s3.bucket,
      Key: `backups/${filename}`,
      Body: fileStream,
      ServerSideEncryption: 'AES256'
    };
    
    const result = await s3.upload(params).promise();
    console.log(`Uploaded to S3: ${result.Location}`);
    
    // ローカルファイルを削除
    await fs.unlink(filepath);
    
    return result.Location;
  }
  
  async runBackup() {
    try {
      console.log('Starting backup process...');
      
      // PostgreSQLバックアップ
      if (this.config.postgres) {
        const pgFile = await this.backupPostgres();
        await this.uploadToS3(pgFile);
        console.log('PostgreSQL backup completed');
      }
      
      console.log('Backup process completed successfully');
    } catch (error) {
      console.error('Backup failed:', error);
    }
  }
}
```

## パフォーマンスチューニング

データベースのパフォーマンスを最大化するための実践的なテクニックを学びます。

### 1. クエリの分析と最適化

```javascript
// PostgreSQL EXPLAIN分析
const analyzeQuery = async (query) => {
  const result = await sequelize.query(
    `EXPLAIN (ANALYZE, BUFFERS) ${query}`,
    { type: sequelize.QueryTypes.SELECT }
  );
  
  console.log('Query Plan:', result);
};

// スロークエリログの有効化
sequelize.options.logging = (sql, timing) => {
  if (timing > 1000) { // 1秒以上かかるクエリ
    console.warn('Slow query detected:', {
      sql,
      duration: timing,
      timestamp: new Date()
    });
  }
};
```

### 2. インデックスの最適化

```javascript
// インデックス使用状況の分析
async function analyzeIndexUsage() {
  // PostgreSQL
  const pgIndexStats = await sequelize.query(`
    SELECT 
      schemaname,
      tablename,
      indexname,
      idx_scan,
      idx_tup_read,
      idx_tup_fetch
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    ORDER BY pg_relation_size(indexrelid) DESC;
  `, { type: sequelize.QueryTypes.SELECT });
  
  console.log('Unused indexes:', pgIndexStats);
}

// 複合インデックスの最適化
// カーディナリティの高い順に並べる
userSchema.index({ userId: 1, createdAt: -1, status: 1 }); // 良い例
```

### 3. 接続プールの最適化

```javascript
// 接続プールの監視と調整
class ConnectionPoolMonitor {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }
  
  start() {
    const pool = this.sequelize.connectionManager.pool;
    
    pool.on('acquire', () => {
      console.log('Connection acquired');
    });
    
    pool.on('release', () => {
      console.log('Connection released');
    });
  }
}
```

## ベストプラクティス

データベース開発における重要な原則とベストプラクティスをまとめます。

### 1. セキュリティ
- SQLインジェクション対策（パラメータ化クエリの使用）
- 最小権限の原則に従ったユーザー権限設定
- 接続の暗号化（SSL/TLS）
- 機密データの暗号化

### 2. パフォーマンス
- 適切なインデックスの設計と管理
- クエリの最適化とEXPLAIN分析
- 接続プールの適切な設定
- キャッシュ戦略の実装

### 3. 可用性
- レプリケーションの設定
- 自動フェイルオーバーの実装
- 定期的なバックアップとテスト
- 災害復旧計画の策定

### 4. 保守性
- 明確な命名規則の採用
- スキーマのバージョン管理
- 包括的なドキュメンテーション
- 監視とアラートの設定

## まとめ

このチュートリアルでは、Node.jsアプリケーションにおける主要なデータベース技術（MongoDB、PostgreSQL、Redis）の実践的な使用方法を学びました。適切なデータベースの選択、効率的な設計、パフォーマンスの最適化、そして信頼性の高い運用方法を理解することで、スケーラブルで堅牢なアプリケーションを構築できるようになります。

---

*約 4-5時間で完了 | 上級レベル | 最終更新: 2024年*