# AI Feedback System - Complete Project

A comprehensive project implementing LLM-based rating prediction and an intelligent feedback management system with user and admin dashboards.

## Project Overview

### Task 1: Rating Prediction via Prompting
Evaluates 3 different prompting strategies for classifying Yelp reviews into 1-5 star ratings using the Groq API.

**Key Features**:
- 3 distinct prompting approaches (Direct, Chain-of-Thought, Few-Shot)
- Comprehensive evaluation metrics (accuracy, JSON validity, consistency)
- Comparison table and visualizations
- Detailed analysis and recommendations

**Deliverables**:
- Jupyter Notebook with all code and results
- CSV exports of evaluation data
- Comparison charts

### Task 2: AI Feedback System - Web Application
A production-ready web application with public user dashboard and internal admin dashboard for managing customer feedback.

**Key Features**:
- **User Dashboard**: Submit 1-5 star reviews with AI-generated responses
- **Admin Dashboard**: Monitor all submissions with AI summaries and recommended actions
- **Live Updates**: Real-time data synchronization
- **Statistics**: Comprehensive analytics and rating distribution

**Deliverables**:
- Deployed User Dashboard (Public)
- Deployed Admin Dashboard (Internal)
- FastAPI backend with SQLite database
- React frontend with Tailwind CSS

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **LLM** | Groq API (Mixtral 8x7B) |
| **Backend** | FastAPI, SQLite, Python |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## Project Structure

```
fynd/
├── task1-rating-prediction/
│   ├── rating_prediction.ipynb    # Main notebook
│   ├── README.md
│   └── [output files]
└── task2-dashboard/
    ├── backend/
    │   ├── main.py                # FastAPI application
    │   ├── requirements.txt
    │   ├── .env.example
    │   └── feedback.db            # SQLite database
    ├── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   │   ├── UserDashboard.jsx
    │   │   │   └── AdminDashboard.jsx
    │   │   └── api/
    │   │       └── client.js
    │   ├── package.json
    │   ├── vite.config.js
    │   └── .env.example
    ├── data/
    └── README.md
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API Key (get from https://console.groq.com)
- Kaggle API (for Task 1 data)

### Task 1: Rating Prediction

```bash
# 1. Install dependencies
pip install groq pandas numpy matplotlib seaborn jupyter

# 2. Set environment variable
export GROQ_API_KEY="your_api_key_here"

# 3. Download dataset
kaggle datasets download -d omkarsabnis/yelp-reviews-dataset

# 4. Open and run notebook
jupyter notebook task1-rating-prediction/rating_prediction.ipynb
```

### Task 2: Web Application

**Backend**:
```bash
cd task2-dashboard/backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your GROQ_API_KEY

# Run server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
cd task2-dashboard/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

**Access**:
- User Dashboard: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- API Documentation: http://localhost:8000/docs

## Deployment

### Task 1: Jupyter Notebook
- Run locally or upload to Google Colab
- Export results as PDF for submission

### Task 2: Web Application

**Backend Deployment (Render)**:
1. Push code to GitHub
2. Create Render Web Service
3. Configure build: `pip install -r requirements.txt`
4. Configure start: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Add environment variable `GROQ_API_KEY`
6. Deploy and get backend URL

**Frontend Deployment (Vercel)**:
1. Push code to GitHub
2. Import project on Vercel
3. Configure build: `npm run build`
4. Output directory: `dist`
5. Add environment variable `VITE_API_URL` (your backend URL)
6. Deploy and get frontend URL

## API Documentation

### Endpoints

**User Submission**:
```
POST /submit
{
  "user_rating": 4,
  "user_review": "Great experience!"
}
```

**Get All Submissions**:
```
GET /submissions?limit=100&offset=0
```

**Get Statistics**:
```
GET /stats
```

For complete API documentation, visit `/docs` after starting the backend.

## Key Features & Design Decisions

### Task 1: Prompting Strategies

1. **Direct Classification (V1)**
   - Simplest approach
   - Baseline for comparison
   - Fastest inference

2. **Chain-of-Thought (V2)**
   - Multi-step reasoning
   - Improved consistency
   - Better explainability

3. **Few-Shot Learning (V3)**
   - Example-based guidance
   - Highest accuracy
   - Leverages in-context learning

### Task 2: System Design

1. **Real-time Updates**: Auto-refresh admin dashboard every 30s
2. **AI Integration**: Uses Groq for response, summary, and recommendations
3. **Data Persistence**: SQLite for lightweight, file-based storage
4. **Responsive UI**: Mobile-friendly with Tailwind CSS
5. **Error Handling**: Comprehensive validation and error messages

## Evaluation Metrics

### Task 1
- **JSON Validity Rate**: Percentage of valid JSON responses
- **Accuracy**: Exact match between predicted and actual ratings
- **Mean Absolute Error**: Average magnitude of prediction errors
- **Consistency**: Standard deviation of predictions

### Task 2
- **Submission Success Rate**: % of successfully processed submissions
- **Response Time**: AI generation latency
- **System Reliability**: Uptime and error recovery
- **User Satisfaction**: Rating distribution insights

## Performance Benchmarks

### Task 1 (Expected Results on ~200 samples)
| Metric | V1 (Direct) | V2 (CoT) | V3 (Few-Shot) |
|--------|-----------|---------|--------------|
| JSON Validity | ~85% | ~90% | ~95% |
| Accuracy | ~45-55% | ~55-65% | ~65-75% |
| MAE | ~0.8-1.0 | ~0.6-0.8 | ~0.4-0.6 |

### Task 2
- Backend response time: <2s per submission
- Frontend load time: <2s initial
- Admin dashboard refresh: 30s interval
- Database query time: <100ms

## Environment Configuration

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
# Or for production:
VITE_API_URL=https://your-backend-domain.com
```

## Troubleshooting

### Common Issues

**CORS errors**: Check CORS configuration in FastAPI
**LLM API errors**: Verify GROQ_API_KEY and rate limits
**Database errors**: Ensure SQLite file permissions
**Connection refused**: Check if backend is running on correct port

See individual README files in each task directory for detailed troubleshooting.

## Contributing

To extend this project:
1. Task 1: Add more prompting strategies or evaluation metrics
2. Task 2: Implement authentication, advanced analytics, or multi-language support

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced analytics and reporting
- [ ] Email notifications for new feedback
- [ ] Sentiment analysis integration
- [ ] Review moderation workflow
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Export to PDF/Excel

## Resources

- [Groq API Documentation](https://console.groq.com)
- [FastAPI Guide](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev)
- [Kaggle Yelp Dataset](https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset)
- [Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

## License

MIT License - Feel free to use this project for learning and development.

## Support

For issues or questions:
1. Check the README in the specific task directory
2. Review API documentation at `/docs`
3. Check browser console for frontend errors
4. Review server logs for backend issues

---

**Created**: December 2024
**Version**: 1.0.0
**Status**: Ready for Deployment
