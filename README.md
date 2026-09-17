# Huyhh205 Student Manager

Dự án quản lý sinh viên bằng stack MERN:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Container: Docker Compose

## Yêu cầu
- Docker
- Docker Compose
- Node.js (nếu muốn chạy local không qua Docker)

## Khởi động nhanh
Tại thư mục gốc:

```bash
npm start
```

Hoặc chạy trực tiếp:

```bash
docker compose up -d --build
```

## Dừng dịch vụ
```bash
npm run stop
```

Hoặc:

```bash
docker compose down
```

## Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API chính
- GET /api/hello
- GET /api/students
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

## Cấu trúc thư mục
```text
.
├── client/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── mern-demo/
│   ├── server/
│   └── package.json
├── docker-compose.yml
├── package.json
├── README.md
└── permission-test/
```

## Ghi chú
Project hiện đang dùng MongoDB local trong Docker vì môi trường dev container không ổn định với MongoDB Atlas và DNS external.

## Kiểm tra nhanh
```bash
curl http://localhost:5000/api/hello
```

Kết quả mong đợi:
```json
{"message":"Backend đang hoạt động!"}
```
