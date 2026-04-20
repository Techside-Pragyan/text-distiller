import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

class Summarizer:
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        self.abstractive_model_name = "facebook/bart-large-cnn"
        self.abstractive_pipeline = None
        
    def _load_abstractive_model(self):
        if self.abstractive_pipeline is None:
            print(f"Loading abstractive model: {self.abstractive_model_name}")
            self.abstractive_pipeline = pipeline(
                "summarization", 
                model=self.abstractive_model_name, 
                device=self.device
            )
            print("Model loaded successfully.")

    def summarize_abstractive(self, text, max_length=150, min_length=50):
        self._load_abstractive_model()
        
        # Handle long text by chunking
        # Bart has a max position embedding of 1024
        chunks = self._chunk_text(text)
        summaries = []
        
        for chunk in chunks:
            summary = self.abstractive_pipeline(
                chunk, 
                max_length=max_length, 
                min_length=min_length, 
                do_sample=False
            )
            summaries.append(summary[0]['summary_text'])
            
        return " ".join(summaries)

    def summarize_extractive(self, text, ratio=0.3):
        sentences = sent_tokenize(text)
        if len(sentences) <= 1:
            return text
            
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(sentences)
        
        # Calculate sentence scores based on TF-IDF
        sentence_scores = np.array(tfidf_matrix.sum(axis=1)).flatten()
        
        # Select top N sentences
        num_sentences = max(1, int(len(sentences) * ratio))
        top_sentence_indices = np.argsort(sentence_scores)[-num_sentences:]
        top_sentence_indices.sort()
        
        summary = [sentences[i] for i in top_sentence_indices]
        return " ".join(summary)

    def _chunk_text(self, text, max_chunk_len=800):
        sentences = sent_tokenize(text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) < max_chunk_len:
                current_chunk += " " + sentence
            else:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
        
        if current_chunk:
            chunks.append(current_chunk.strip())
            
        return chunks

# Singleton instance
summarizer_instance = Summarizer()
