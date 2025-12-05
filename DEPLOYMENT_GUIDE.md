# Deployment Guide

This guide walks through deploying both Task 1 and Task 2 to production.

## Prerequisites

- GitHub account and repository
- Groq API key (free tier available)
- Vercel account (for frontend)
- Render account (for backend)
- Node.js 16+ and Python 3.8+ installed locally

## Step 1: Prepare GitHub Repository

```bash
# Initialize git repository
cd ~/fynd
git init

# Create .gitignore (already created)

# Stage files
git add .

# Create initial commit
git commit -m "Initial commit: AI Feedback System"

# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/fynd.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy Task 2 Backend to Render

### Backend Setup on Render

1. **Create Render Account**
   - Visit https://render.com
   - Sign up (can use GitHub account)

2. **Connect GitHub Repository**
   - Dashboard → New → Web Service
   - Connect your `fynd` repository
   - Select this repository

3. **Configure Service**
   - **Name**: `ai-feedback-backend` (or your choice)
   - **Region**: Select closest to users
   - **Branch**: `main`
   - **Root Directory**: `task2-dashboard/backend`
   - **Runtime**: Python 3
   - **Build Command**: 
     ```
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```
     uvicorn main:app --host 0.0.0.0 --port 8000
     ```

4. **Set Environment Variables**
   - Click "Environment"
   - Add variable:
     - **Key**: `GROQ_API_KEY`
     - **Value**: Your Groq API key from https://console.groq.com
   
5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Get your backend URL: `https://ai-feedback-backend.render.com`

### Verify Backend Deployment

```bash
# Check if API is running
curl https://ai-feedback-backend.render.com/health

# Should return:
# {"status":"healthy"}

# View API docs
# Visit: https://ai-feedback-backend.render.com/docs
```

## Step 3: Deploy Task 2 Frontend to Vercel

### Frontend Setup on Vercel

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up (recommend GitHub login)

2. **Import Project**
   - Dashboard → New Project
   - Select `fynd` repository from GitHub
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `task2-dashboard/frontend`
   - **Build Command**: 
     ```
     npm install && npm run build
     ```
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   - Before deployment, add environment variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://ai-feedback-backend.render.com` (your backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment (1-2 minutes)
   - Get your frontend URL: `https://fynd.vercel.app` (or similar)

### Verify Frontend Deployment

```bash
# Visit in browser
https://fynd.vercel.app

# Should show User Dashboard
# Try submitting a test review
```

## Step 4: Test Deployed Application

### User Dashboard Test

1. Navigate to: `https://fynd.vercel.app`
2. Select a rating (e.g., 5 stars)
3. Enter a test review: "Great service and amazing food!"
4. Click "Submit Feedback"
5. Should see AI response within 2 seconds

### Admin Dashboard Test

For admin access, you can:

1. Create admin subdomain on frontend:
   - Update `src/App.jsx` to route `/admin` to AdminDashboard
   - Or create separate admin deployment

2. For now, test locally:
   ```bash
   # In frontend directory
   npm install
   npm run dev
   
   # Edit src/App.jsx to show AdminDashboard instead
   # Then visit http://localhost:3000
   ```

### API Test

```bash
# Test submission endpoint
curl -X POST https://ai-feedback-backend.render.com/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_rating": 4,
    "user_review": "The food was excellent and service was friendly!"
  }'

# Should return submission with AI response

# Get statistics
curl https://ai-feedback-backend.render.com/stats

# View API docs
# https://ai-feedback-backend.render.com/docs
```

## Step 5: Task 1 Notebook Deployment

### Option A: Google Colab (Recommended)

1. Upload notebook to Google Drive
2. Open with Google Colaboratory
3. Install dependencies in first cell:
   ```python
   !pip install groq pandas numpy matplotlib seaborn
   ```
4. Set environment variable:
   ```python
   import os
   os.environ['GROQ_API_KEY'] = 'your_api_key'
   ```
5. Upload Yelp dataset CSV or download via Kaggle
6. Run all cells
7. Export results to PDF

### Option B: Local Jupyter

1. Install Jupyter:
   ```bash
   pip install jupyter
   ```

2. Run notebook:
   ```bash
   cd task1-rating-prediction
   jupyter notebook rating_prediction.ipynb
   ```

3. Set environment variable before running:
   ```bash
   export GROQ_API_KEY="your_api_key"
   ```

4. Export as PDF:
   - File → Download as → PDF via HTML

### Option C: GitHub + NBViewer

1. Push notebook to GitHub
2. View via nbviewer:
   ```
   https://nbviewer.org/github/YOUR_USERNAME/fynd/blob/main/task1-rating-prediction/rating_prediction.ipynb
   ```

## Step 6: Monitor and Maintain

### Render Backend Monitoring

- Dashboard shows:
  - Deployment status
  - Logs and errors
  - CPU/Memory usage
  - Requests per minute

```bash
# Tail logs
curl https://api.render.com/v1/services/YOUR_SERVICE_ID/logs \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Vercel Frontend Monitoring

- Analytics in Vercel dashboard:
  - Web Vitals
  - Request volume
  - Error rate
  - Performance metrics

### Database Backup

For SQLite database on Render:

```bash
# SSH into Render service
# Download database
# Local: scp render:/app/feedback.db ./backup.db
```

Or implement auto-backup:

```bash
# Add to backend startup
import shutil
import datetime

def backup_database():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    shutil.copy("feedback.db", f"backups/feedback_{timestamp}.db")

# Call on startup
backup_database()
```

## Step 7: Environment-Specific Configuration

### Production URLs

Update `.env` files:

**Frontend (`task2-dashboard/frontend/.env`)**:
```env
VITE_API_URL=https://ai-feedback-backend.render.com
```

**Backend (`task2-dashboard/backend/.env`)**:
```env
GROQ_API_KEY=your_production_key
```

### Database Management

For production, consider:
1. Migrate to PostgreSQL (scalability)
2. Implement connection pooling
3. Set up automated backups
4. Enable replication

## Step 8: Troubleshooting Deployment

### Backend Won't Start

Check logs:
```
Render Dashboard → Your Service → Logs
```

Common issues:
- Missing `GROQ_API_KEY` environment variable
- Python version mismatch
- Missing dependencies in `requirements.txt`

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` is set correctly
2. Verify backend is running (check Render dashboard)
3. Check browser console for CORS errors
4. Test API directly: `curl your-backend-url/health`

### Database Errors

1. Check disk space on Render
2. Verify SQLite file permissions
3. Check for concurrent connections
4. Review backend logs

### LLM API Errors

1. Verify `GROQ_API_KEY` is valid
2. Check Groq rate limits (console.groq.com)
3. Monitor API usage
4. Check for timeouts (may need retry logic)

## Step 9: CI/CD Setup (Optional)

### GitHub Actions for Auto-Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render and Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Trigger Render deployment
        run: |
          curl -X POST https://api.render.com/deploy/srv-YOUR_SERVICE_ID \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
      
      - name: Vercel deployment
        run: |
          npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Step 10: Documentation & Reporting

### Create PDF Report

```bash
# Option 1: Use markdown-to-pdf tool
# pip install markdown-pdf
# markdown-pdf PROJECT_REPORT.md -o report.pdf

# Option 2: Use pandoc
# pandoc PROJECT_REPORT.md -o report.pdf --from markdown --to pdf

# Option 3: Manual
# - Open PROJECT_REPORT.md in browser via markdown viewer
# - Print to PDF
```

### Prepare Submission

1. **GitHub Repository**: https://github.com/YOUR_USERNAME/fynd
2. **Report PDF**: Upload to repo or cloud storage
3. **User Dashboard URL**: https://fynd.vercel.app
4. **Admin Dashboard URL**: https://fynd.vercel.app/admin
5. **API Documentation**: https://ai-feedback-backend.render.com/docs

## Final Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed on Render
  - [ ] Health check passes (/health endpoint)
  - [ ] Environment variables set
  - [ ] Logs show no errors
- [ ] Frontend deployed on Vercel
  - [ ] Builds successfully
  - [ ] Connected to backend API
  - [ ] User dashboard loads
- [ ] Admin dashboard accessible
- [ ] Test submission works end-to-end
- [ ] Task 1 notebook runs successfully locally
- [ ] Report PDF generated
- [ ] All URLs documented and tested

## Support & Issues

If deployment fails:

1. Check service logs (Render/Vercel dashboard)
2. Verify environment variables
3. Test locally first
4. Check GitHub repository settings
5. Review prerequisites section

## Cost Estimation

**Free Tier Limits**:
- Render: 750 hours/month free (~31 days continuous)
- Vercel: 100 GB bandwidth/month
- Groq API: Depends on tier (check console.groq.com)

For production:
- Render hobby plan: $7/month
- Vercel pro: $20/month
- Groq API: Usage-based

---

**Deployment completed successfully!** 🚀

Your system is now live and ready for production use.
