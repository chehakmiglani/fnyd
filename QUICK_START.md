# Quick Start Guide

Get the project running locally in 5 minutes.

## Prerequisites

- Python 3.8+ 
- Node.js 16+
- Groq API key (free from https://console.groq.com)
- Kaggle account (for Task 1 dataset, optional)

## Quick Start

### 1. Set Up Environment Variables

**Backend**:
```bash
cd task2-dashboard/backend
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

**Frontend**:
```bash
cd task2-dashboard/frontend
cp .env.example .env
```

File already has `VITE_API_URL=http://localhost:8000` ✓

### 2. Start Backend

```bash
cd task2-dashboard/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verify**: Visit http://localhost:8000/health → Should show `{"status":"healthy"}`

### 3. Start Frontend (New Terminal)

```bash
cd task2-dashboard/frontend

# Install dependencies (one time)
npm install

# Run dev server
npm run dev
```

**Verify**: Visit http://localhost:3000 → Should show User Dashboard

### 4. Test the System

1. **User Dashboard**: http://localhost:3000
   - Select 5 stars
   - Enter review: "Great food and service!"
   - Click Submit
   - See AI response

2. **Admin Dashboard**: http://localhost:3000/admin
   - See all submissions
   - Click "View Details" to see AI summary and actions
   - Refresh button updates data

3. **API Docs**: http://localhost:8000/docs
   - Interactive API documentation
   - Try submitting review via API

## Task 1: Rating Prediction Notebook

### Quick Run

```bash
cd task1-rating-prediction

# Install dependencies
pip install groq pandas numpy matplotlib seaborn jupyter

# Set API key
export GROQ_API_KEY="your_groq_api_key_here"

# Download Yelp dataset (optional, or use sample)
kaggle datasets download -d omkarsabnis/yelp-reviews-dataset

# Run notebook
jupyter notebook rating_prediction.ipynb
```

**Or use Google Colab**:
1. Upload notebook to Google Drive
2. Open with Colaboratory
3. Set GROQ_API_KEY in first cell
4. Run all cells
5. Export as PDF

## Common Commands

### Backend

```bash
# Start with auto-reload
python -m uvicorn main:app --reload

# Production mode
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Install new package
pip install package_name

# Freeze requirements
pip freeze > requirements.txt

# Access database
sqlite3 feedback.db
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package_name
```

## Project URLs

- **User Dashboard**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Root**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: `task2-dashboard/backend/feedback.db`

## File Structure Quick Ref

```
fynd/
├── README.md                      # Main documentation
├── PROJECT_REPORT.md              # Detailed report
├── DEPLOYMENT_GUIDE.md            # Deployment steps
├── task1-rating-prediction/
│   ├── rating_prediction.ipynb    # Main notebook
│   └── README.md
└── task2-dashboard/
    ├── backend/
    │   ├── main.py               # FastAPI server
    │   ├── requirements.txt
    │   └── .env.example
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx           # Routing
    │   │   ├── pages/
    │   │   │   ├── UserDashboard.jsx
    │   │   │   └── AdminDashboard.jsx
    │   │   └── api/
    │   │       └── client.js     # API client
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    └── README.md
```

## Troubleshooting

### Backend won't start
```bash
# Check port 8000 is free
# Or use different port: 
python -m uvicorn main:app --port 8001

# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+
```

### API connection errors
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check VITE_API_URL in frontend/.env
cat task2-dashboard/frontend/.env

# Browser console should show fetch error details
# Press F12 → Console tab
```

### LLM API errors
```bash
# Verify API key
echo $GROQ_API_KEY

# Check API key is valid
curl -H "Authorization: Bearer YOUR_KEY" https://api.groq.com/...

# Check rate limits in Groq console
# https://console.groq.com
```

## Database Queries

```bash
# Connect to database
sqlite3 task2-dashboard/backend/feedback.db

# View all submissions
SELECT * FROM submissions;

# Count submissions
SELECT COUNT(*) FROM submissions;

# Average rating
SELECT AVG(user_rating) FROM submissions;

# Rating distribution
SELECT user_rating, COUNT(*) FROM submissions GROUP BY user_rating;

# Exit
.quit
```

## Next Steps

1. **Explore the code**:
   - Backend: `task2-dashboard/backend/main.py`
   - Frontend: `task2-dashboard/frontend/src/pages/`
   - Notebook: `task1-rating-prediction/rating_prediction.ipynb`

2. **Run Task 1 notebook**:
   - Follow instructions in task1-rating-prediction/README.md
   - Generate evaluation results

3. **Deploy**:
   - Follow DEPLOYMENT_GUIDE.md
   - Get public URLs for submission

4. **Customize**:
   - Modify prompts in notebook
   - Change UI styling with Tailwind
   - Add more API endpoints

## Environment Checklist

- [ ] Python 3.8+ installed: `python --version`
- [ ] Node.js 16+ installed: `node --version`
- [ ] Groq API key obtained
- [ ] Git repository initialized
- [ ] .env files created with API key
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Can connect to backend from frontend

## Support

- Check individual README.md files in each directory
- Review error logs: Backend logs in terminal, Frontend in browser console
- API docs available at http://localhost:8000/docs
- Project report in PROJECT_REPORT.md

---

**Ready to deploy?** See DEPLOYMENT_GUIDE.md

**Questions?** Check the appropriate README file for your task
