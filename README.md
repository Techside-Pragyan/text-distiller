# Text Distiller - AI Summarization System

Text Distiller is a high-performance, full-stack AI application designed to transform lengthy documents into concise, meaningful summaries. Using state-of-the-art transformer models, it provides both abstractive (human-like) and extractive (key-point) summarization.

## 🚀 Key Features
- **Multi-Source Input**: Summarize text from pastes, uploaded files (PDF, DOCX, TXT), or direct URLs.
- **Advanced AI**: Powered by Hugging Face Transformers (`bart-large-cnn`) and KeyBERT.
- **Dynamic Insights**: Get readability scores, keyword extraction, and word count reduction metrics.
- **Adjustable Styles**: Choose between Abstractive and Extractive modes with varying length targets.
- **Premium UI**: Sleek, glassmorphic dark-themed interface built for performance.

## 🛠️ Tech Stack
- **Frontend**: Next.js (TS) + Vanilla CSS
- **Backend**: FastAPI (Python)
- **NLP**: Transformers, PyTorch, SpaCy, KeyBERT
- **Parsing**: Newspaper3k, PyPDF, Python-Docx

## 🏁 Getting Started

### 1. Backend Setup
```bash
# Navigate to root
pip install -r requirements.txt
python -m api.main
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure
- `/api`: FastAPI backend and summarization routes.
- `/api/models`: NLP model logic and chunking strategies.
- `/utils`: File parsing and text metrics.
- `/frontend`: Next.js application.