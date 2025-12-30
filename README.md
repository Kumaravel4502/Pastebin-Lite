# Pastebin-Lite

A lightweight pastebin application that allows users to create text pastes and share them via unique URLs. Pastes can optionally expire after a time-to-live (TTL) period or after reaching a maximum view count.

## Project Description

Pastebin-Lite is a full-stack web application built with Node.js/Express for the backend and React for the frontend. Users can create text pastes, receive shareable URLs, and view pastes through both API endpoints and HTML pages. The application supports optional constraints including time-based expiry and view-count limits.

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local instance or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pastebin-Lite
   ```

2. **Set up the Server**
   ```bash
   cd Server
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `Server` directory (optional):
   ```env
   PORT=5000
   PUBLIC_BASE_URL=http://localhost:5000
   ```
   
   Note: No database setup required - the app uses in-memory storage.

4. **Start the server**
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

5. **Set up the Client**
   
   Open a new terminal:
   ```bash
   cd Client
   npm install
   ```

6. **Configure client environment**
   
   Create a `.env` file in the `Client` directory (optional for local development):
   ```env
   VITE_API_BASE=http://localhost:5000
   ```

7. **Start the client**
   ```bash
   npm run dev
   ```

8. **Access the application**
   
   - Frontend: http://localhost:5173 (or the port shown in terminal)
   - Backend API: http://localhost:5000

## Persistence Layer

**In-Memory Storage** is used as the persistence layer. The application uses a simple Map-based storage system.

### Storage Implementation

- **PasteStore**: In-memory Map that stores paste objects
- **No database required**: All data is stored in memory during server runtime
- **Automatic cleanup**: Expired pastes are checked on access

### Important Notes

⚠️ **Limitations of In-Memory Storage:**
- Data is lost when the server restarts
- Not suitable for production or serverless environments
- For production, consider using a persistent database (MongoDB, PostgreSQL, Redis, etc.)

### For Production Deployment

If deploying to production or serverless platforms, you should replace the in-memory storage with a persistent database. The code structure makes it easy to swap the storage implementation.

## Important Design Decisions

### 1. Numeric Paste IDs
- Uses a numeric counter instead of MongoDB ObjectIds for cleaner, shorter URLs
- Counter is maintained atomically to prevent ID collisions

### 2. Atomic View Counting
- View counting and constraint checking are done atomically using MongoDB's `findOneAndUpdate`
- Prevents race conditions where a paste might be viewed beyond its limits under concurrent load
- Uses `$expr` for comparing fields within the same query

### 3. Deterministic Time for Testing
- Supports `TEST_MODE=1` environment variable for automated testing
- When enabled, accepts `x-test-now-ms` header to override current time
- Allows test suites to verify expiry behavior without waiting

### 4. Content Security
- HTML content is escaped using a custom `escapeHtml` utility
- Prevents XSS attacks when rendering paste content in HTML views
- API responses return raw content (consumers should handle escaping)

### 5. Constraint Logic
- Both TTL and max_views constraints are checked in a single atomic query
- Paste becomes unavailable as soon as either constraint triggers
- Uses MongoDB's `$and` and `$or` operators for efficient querying

### 6. Error Handling
- All API errors return JSON with appropriate HTTP status codes
- 400 for validation errors, 404 for unavailable pastes, 500 for server errors
- Consistent error format: `{ "error": "error message" }`

### 7. URL Generation
- Uses `PUBLIC_BASE_URL` environment variable for production deployments
- Falls back to request host for development
- Ensures generated URLs work correctly in serverless environments

## API Endpoints

### Health Check
- `GET /api/healthz` - Returns `{ "ok": true }` if database is connected

### Create Paste
- `POST /api/pastes` - Creates a new paste
  - Body: `{ "content": "string", "ttl_seconds": 60, "max_views": 5 }`
  - Returns: `{ "id": "string", "url": "https://..." }`

### Fetch Paste (API)
- `GET /api/pastes/:id` - Retrieves paste content as JSON
  - Returns: `{ "content": "string", "remaining_views": 4, "expires_at": "..." }`

### View Paste (HTML)
- `GET /p/:id` - Returns HTML page with paste content

## Testing

The application supports deterministic time testing for automated test suites:

1. Set `TEST_MODE=1` in environment variables
2. Send requests with `x-test-now-ms` header containing milliseconds since epoch
3. The application will use this time for expiry calculations instead of system time

Example:
```bash
curl -H "x-test-now-ms: 1609459200000" http://localhost:5000/api/pastes/1
```

## Deployment

### Recommended: Vercel

1. **Deploy Server** (as a serverless function):
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard:
     - `MONGO_URI`
     - `PUBLIC_BASE_URL` (your Vercel deployment URL)
     - `PORT` (optional, Vercel sets this automatically)
   - Vercel will automatically detect and deploy Express apps

2. **Deploy Client**:
   - Set `VITE_API_BASE` to your server URL
   - Deploy to Vercel (or any static hosting)

### Environment Variables for Production

**Server:**
- `MONGO_URI` - MongoDB connection string (required)
- `PUBLIC_BASE_URL` - Your public domain URL (required for production)
- `PORT` - Server port (optional, defaults to 5000)
- `TEST_MODE` - Set to "1" for testing mode (optional)

**Client:**
- `VITE_API_BASE` - Backend API URL (optional, defaults to empty string for relative URLs)

## Repository Structure

```
Pastebin-Lite/
├── Server/                 # Backend Express application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   ├── server.js          # Entry point
│   └── package.json
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── Api/           # API client
│   │   ├── components/    # React components
│   │   └── pages/         # Page components
│   ├── index.jsx          # Entry point
│   └── package.json
└── README.md
```

## License

ISC

