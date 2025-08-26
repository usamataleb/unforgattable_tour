# Image Upload API with Prisma (ES Modules)

This is an Express.js API for handling image uploads with Prisma ORM, using ES Modules.

## Setup

1. Install dependencies: `npm install`
2. Initialize the database: `npm run db:migrate`
3. Generate Prisma client: `npm run db:generate`

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Test Database Connection

```bash
node test-api.js
```

## Database Management

- View and edit data: `npm run db:studio`
- Create new migration: `npx prisma migrate dev --name your_migration_name`

## API Endpoints

- POST /upload - Upload an image
- GET /images - Get all uploaded images
- GET /images/:id - Get a specific image by ID
- POST /users - Create a new user
- GET /users - Get all users
- POST /packages - Create a new package
- GET /packages - Get all packages
- POST /carousel - Create a new carousel item
- GET /carousel - Get all carousel items
- GET /carousel/active - Get active carousel items
- GET /health - Health check endpoint

## Environment Variables

- PORT: Server port (default: 3000)
- DATABASE_URL: Database connection string
- UPLOAD_PATH: Path to store uploaded images
- BASE_URL: Base URL for image links

## Example Usage

Upload an image:
```bash
curl -X POST -F 'image=@/path/to/your/image.jpg' http://localhost:3000/upload
```

Create a user:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}' http://localhost:3000/users
```
