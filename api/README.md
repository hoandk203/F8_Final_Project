# 🚀 Scraplan API - Backend Service

<div align="center">
  <h3>NestJS Backend for Scraplan Waste Management Platform</h3>
  
  [![NestJS](https://img.shields.io/badge/NestJS-10.0-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-green?style=flat-square&logo=swagger)](https://swagger.io/)
</div>

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc](#-kiến-trúc)
- [Cài đặt](#-cài-đặt)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🌟 Giới thiệu

Scraplan API là backend service được xây dựng bằng NestJS, cung cấp RESTful API cho nền tảng quản lý chất thải thông minh. API hỗ trợ đầy đủ các tính năng từ authentication, quản lý đơn hàng, thanh toán đến thống kê real-time.

### 🎯 Tính năng chính

- **🔐 JWT Authentication** - Xác thực và phân quyền
- **👥 Multi-role System** - Admin, Vendor, Store, Driver
- **📦 Order Management** - Quản lý đơn hàng thu gom
- **💳 VNPay Integration** - Thanh toán trực tuyến
- **📊 Analytics & Reports** - Thống kê và báo cáo
- **📧 Email Service** - Gửi email xác thực
- **📁 File Upload** - Quản lý tài liệu
- **🔍 Search & Filter** - Tìm kiếm và lọc dữ liệu

## 🏗 Kiến trúc

```
src/
├── 📁 modules/              # Feature modules
│   ├── auth/               # Authentication & authorization
│   ├── users/              # User management
│   ├── admin/              # Admin operations
│   ├── vendor/             # Vendor management
│   ├── store/              # Store management
│   ├── driver/             # Driver operations
│   ├── order/              # Order management
│   ├── material/           # Material & pricing
│   ├── payment/            # Payment processing
│   ├── issue/              # Issue tracking
│   └── base/               # Base services
│
├── 📁 guard/               # Authentication guards
│   ├── jwt-auth.guard.ts
│   └── local-auth.guard.ts
│
├── 📁 strategy/            # Passport strategies
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
│
├── 📁 entities/            # Database entities
├── 📁 dto/                 # Data transfer objects
├── 📁 utils/               # Utility functions
├── database.module.ts      # Database configuration
└── main.ts                 # Application entry point
```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

### 1. Cài đặt dependencies
```bash
cd api
npm install
```

### 2. Cấu hình environment variables
```bash
cp .env.example .env
```

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=scraplan_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRATION_TIME=3600
JWT_REFRESH_EXPIRATION_TIME=86400

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_terminal_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/return

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@scraplan.com

# Application Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Chạy database migrations
```bash
npm run migration:run
```

### 4. Seed initial data
```bash
npm run seed
```

### 5. Chạy ứng dụng

#### Development mode
```bash
npm run start:dev
```

#### Production mode
```bash
npm run build
npm run start:prod
```

## 📚 API Endpoints

### 🔐 Authentication
```http
POST   /auth/login                    # Đăng nhập
POST   /auth/register                 # Đăng ký
POST   /auth/refresh                  # Refresh token
POST   /auth/logout                   # Đăng xuất
POST   /auth/change-password          # Đổi mật khẩu
GET    /auth/profile                  # Lấy thông tin profile
```

### 👥 User Management
```http
GET    /users                         # Lấy danh sách users
GET    /users/:id                     # Lấy thông tin user
PUT    /users/:id                     # Cập nhật user
DELETE /users/:id                     # Xóa user
```

### 🏪 Store Management
```http
GET    /store                         # Lấy danh sách stores
POST   /store                         # Tạo store mới
GET    /store/:id                     # Lấy thông tin store
PUT    /store/:id                     # Cập nhật store
DELETE /store/:id                     # Xóa store
```

### 🚛 Driver Management
```http
GET    /driver                        # Lấy danh sách drivers
POST   /driver                        # Tạo driver mới
GET    /driver/:id                    # Lấy thông tin driver
PUT    /driver/:id                    # Cập nhật driver
GET    /driver/orders/:id             # Đơn hàng của driver
```

### 🏭 Vendor Management
```http
GET    /vendor                        # Lấy danh sách vendors
POST   /vendor                        # Tạo vendor mới
GET    /vendor/:id                    # Lấy thông tin vendor
PUT    /vendor/:id                    # Cập nhật vendor
GET    /vendor/drivers/:id            # Drivers của vendor
```

### 📦 Order Management
```http
GET    /order                         # Lấy danh sách orders
POST   /order                         # Tạo order mới
GET    /order/:id                     # Lấy thông tin order
PUT    /order/:id                     # Cập nhật order
DELETE /order/:id                     # Xóa order
GET    /order/store/:storeId          # Orders của store
GET    /order/driver/:driverId        # Orders của driver
GET    /order/unpaid/byStore/:storeId # Orders chưa thanh toán
```

### 🧱 Material Management
```http
GET    /material/public               # Lấy materials (public)
GET    /material                      # Lấy danh sách materials
POST   /material                      # Tạo material mới
GET    /material/:id                  # Lấy thông tin material
PUT    /material/:id                  # Cập nhật material
DELETE /material/:id                  # Xóa material
GET    /material/search               # Tìm kiếm materials
```

### 💳 Payment Management
```http
POST   /payment/create                # Tạo thanh toán VNPay
GET    /payment/return                # Callback VNPay
GET    /payment/unpaid/:driverId      # Thanh toán chưa hoàn thành
PUT    /payment/:id/status            # Cập nhật trạng thái thanh toán
```

### 🎫 Issue Management
```http
GET    /issue                         # Lấy danh sách issues
POST   /issue                         # Tạo issue mới
GET    /issue/:id                     # Lấy thông tin issue
PUT    /issue/:id                     # Cập nhật issue
GET    /issue/user/:userId            # Issues của user
```

## 🗃 Database Schema

### Core Entities

#### Users
```sql
- id: number (PK)
- email: string (unique)
- password: string (hashed)
- role: enum (admin, vendor, store, driver)
- active: boolean
- emailVerified: boolean
- createdAt: timestamp
- modifiedAt: timestamp
```

#### Stores
```sql
- id: number (PK)
- userId: number (FK)
- storeName: string
- address: string
- phoneNumber: string
- status: enum
- createdAt: timestamp
```

#### Drivers
```sql
- id: number (PK)
- userId: number (FK)
- vendorId: number (FK)
- driverName: string
- phoneNumber: string
- licenseNumber: string
- status: enum
- createdAt: timestamp
```

#### Orders
```sql
- id: number (PK)
- storeId: number (FK)
- driverId: number (FK)
- totalAmount: decimal
- status: enum
- pickupAddress: string
- pickupDate: timestamp
- createdAt: timestamp
```

#### Materials
```sql
- id: number (PK)
- name: string
- unitPrice: decimal
- active: boolean
- createdAt: timestamp
```

## 🔐 Authentication

### JWT Strategy
- **Access Token**: 1 hour expiration
- **Refresh Token**: 24 hours expiration
- **Cookie-based**: Secure HTTP-only cookies

### Role-based Access Control
```typescript
enum UserRole {
  ADMIN = 'admin',
  VENDOR = 'vendor', 
  STORE = 'store',
  DRIVER = 'driver'
}
```

### Guards
- **JwtAuthGuard**: Xác thực JWT token
- **LocalAuthGuard**: Xác thực username/password
- **RolesGuard**: Phân quyền theo role

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### API Testing với Postman
Import collection từ `docs/postman/scraplan-api.json`

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t scraplan-api .

# Run container
docker run -p 3001:3001 scraplan-api
```

### Production Deployment (Render.com)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=production_secret
FRONTEND_URL=https://scraplan.vercel.app
```

## 📖 API Documentation

### Swagger UI
Truy cập: `http://localhost:3001/api`

### Generate API Docs
```bash
npm run docs:generate
```

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Type checking

### Database Tools
- **TypeORM**: ORM và migrations
- **PostgreSQL**: Primary database
- **pgAdmin**: Database administration

### Monitoring
- **Winston**: Logging
- **Swagger**: API documentation
- **Health Check**: Application health monitoring

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Write tests
4. Ensure code quality
5. Submit pull request

### Code Standards
- Follow NestJS conventions
- Write comprehensive tests
- Document API endpoints
- Use TypeScript strictly

## 📞 Support

- **API Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [API Docs](http://localhost:3001/api)
- **Email**: api-support@scraplan.com

---

<div align="center">
  <p>Built with ❤️ using NestJS</p>
  <p>© 2024 Scraplan API. All rights reserved.</p>
</div>
