# Task 2: AI Feedback System - Web Application

## Overview
A two-tier web application with User and Admin dashboards for collecting, analyzing, and managing customer feedback using AI-powered summaries and recommendations.

## Features

### User Dashboard (Public-Facing)
- **Star Rating Selection**: 1-5 star interactive selector
- **Review Submission**: Write detailed feedback (10-5000 characters)
- **AI Response**: Automatic AI-generated response from business
- **Real-time Feedback**: Instant confirmation and AI response display

### Admin Dashboard (Internal-Facing)
- **Live Submission List**: Real-time table of all submissions
- **Advanced Statistics**: 
  - Total submission count
  - Average rating
  - Rating distribution chart
- **Detailed View Modal**: Full submission details including:
  - User review text
  - AI-generated summary
  - Recommended actions
  - AI response sent to user
- **Auto-refresh**: Updates every 30 seconds
- **Pagination**: Browse through submissions efficiently

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **LLM**: Groq API (Mixtral 8x7B)
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Deployment
- **Backend**: Render or Railway
- **Frontend**: Vercel or Netlify

## Project Structure

```
task2-dashboard/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example         # Environment template
│   └── feedback.db          # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # React entry point
│   │   ├── index.css        # Global styles
│   │   ├── api/
│   │   │   └── client.js    # API client
│   │   └── pages/
│   │       ├── UserDashboard.jsx
│   │       └── AdminDashboard.jsx
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── .env.example         # Environment template
└── data/
    └── feedback.db          # Database file
```

## Installation & Setup

### Backend Setup

```bash
# Navigate to backend directory
cd task2-dashboard/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd task2-dashboard/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and set VITE_API_URL

# Run development server
npm run dev
```

### Access

- **User Dashboard**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Docs**: http://localhost:8000/docs

## API Endpoints

### User Endpoints

#### Submit Review
```
POST /submit
Content-Type: application/json

{
  "user_rating": 4,
  "user_review": "Great service and food was delicious!"
}

Response:
{
  "id": 1,
  "user_rating": 4,
  "user_review": "Great service...",
  "ai_response": "Thank you for your feedback...",
  "ai_summary": "Customer praised service and food quality",
  "recommended_actions": "Continue maintaining high service standards",
  "created_at": "2024-01-01T12:00:00"
}
```

### Admin Endpoints

#### Get All Submissions
```
GET /submissions?limit=100&offset=0

Response:
{
  "submissions": [...],
  "total": 42
}
```

#### Get Submission Details
```
GET /submissions/{id}

Response:
{
  "id": 1,
  "user_rating": 4,
  ...
}
```

#### Get Statistics
```
GET /stats

Response:
{
  "total_submissions": 42,
  "average_rating": 4.2,
  "rating_distribution": {
    "1": 2,
    "2": 3,
    "3": 5,
    "4": 15,
    "5": 17
  }
}
```

## AI Capabilities

The system uses Groq's Mixtral 8x7B model for:

1. **User Response Generation**
   - Professional, empathetic responses
   - Acknowledgment of feedback
   - Resolution-oriented language

2. **Summary Generation**
   - Concise 1-2 sentence summaries
   - Key point extraction
   - Sentiment preservation

3. **Action Recommendations**
   - Specific, actionable suggestions
   - Priority-based recommendations
   - Business-focused solutions

## Database Schema

### submissions table
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_rating INTEGER NOT NULL,          -- 1-5
    user_review TEXT NOT NULL,             -- Review text
    ai_response TEXT,                      -- AI response
    ai_summary TEXT,                       -- Summary
    recommended_actions TEXT,              -- Recommended actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Deployment Instructions

### Deploy Backend to Render

1. Create Render account at https://render.com
2. Push code to GitHub
3. Create New → Web Service
4. Connect your GitHub repo
5. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Environment: Add `GROQ_API_KEY`
6. Deploy and note the URL

### Deploy Frontend to Vercel

1. Create Vercel account at https://vercel.com
2. Import project from GitHub
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment: Set `VITE_API_URL` to your backend URL
4. Deploy and note the URL

### Update Configuration

After deployment, update the frontend `.env` file to point to your deployed backend:
```
VITE_API_URL=https://your-backend.render.com
```

## Development Workflow

1. **Start Backend**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test**:
   - Open http://localhost:3000
   - Submit a test review
   - Check http://localhost:3000/admin for admin view
   - Verify data in database: `sqlite3 feedback.db "SELECT * FROM submissions;"`

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_api_key_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000  # or your deployed backend URL
```

## Error Handling

The system handles:
- Invalid JSON responses from LLM
- Network errors
- Database errors
- API rate limiting
- Input validation errors

All errors return appropriate HTTP status codes with descriptive messages.

## Monitoring & Logging

- Backend logs all API requests
- Database queries are logged
- LLM API calls include timing information
- Frontend logs errors to console

## Performance Considerations

1. **Frontend**:
   - Debounced API calls
   - Optimistic UI updates
   - Efficient re-rendering with React

2. **Backend**:
   - Connection pooling
   - Async operations where possible
   - Caching for statistics

3. **LLM Calls**:
   - Temperature=0.3 for speed
   - Max tokens limited to prevent waste
   - Timeout handling for slow responses

## Security Considerations

1. Input validation on all endpoints
2. CORS properly configured
3. Environment variables for secrets
4. No sensitive data in logs
5. SQL parameterization prevents injection

## Troubleshooting

### Issue: CORS errors
**Solution**: Ensure backend CORS is configured correctly in `main.py`

### Issue: LLM API timeouts
**Solution**: Check GROQ_API_KEY and rate limits

### Issue: Database locked
**Solution**: Close other connections or restart backend

### Issue: Frontend can't connect to backend
**Solution**: Verify VITE_API_URL and ensure backend is running

## Future Enhancements

1. User authentication
2. Review flagging/moderation
3. Sentiment analysis
4. Export reports
5. Email notifications
6. Multi-language support
7. API rate limiting
8. Advanced analytics

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev)
- [Groq API Docs](https://console.groq.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
