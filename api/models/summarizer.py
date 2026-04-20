import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Download necessary NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
except Exception as e:
    print(f"NLTK download failed: {e}")

class Summarizer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.abstractive_model_name = "facebook/bart-large-cnn"
        self.tokenizer = None
        self.model = None
        
    def _load_abstractive_model(self):
        if self.model is None:
            print(f"Loading abstractive model: {self.abstractive_model_name}")
            self.tokenizer = AutoTokenizer.from_tokenizer(self.abstractive_model_name) if hasattr(AutoTokenizer, "from_tokenizer") else AutoTokenizer.from_pretrained(self.abstractive_model_name)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.abstractive_model_name).to(self.device)
            print("Model loaded successfully.")

    def summarize_abstractive(self, text, max_length=150, min_length=50):
        self._load_abstractive_model()
        
        chunks = self._chunk_text(text)
        summaries = []
        
        for chunk in chunks:
            inputs = self.tokenizer([chunk], max_length=1024, return_tensors="pt", truncation=True).to(self.device)
            summary_ids = self.model.generate(
                inputs["input_ids"], 
                num_beams=4, 
                max_length=max_length, 
                min_length=min_length, 
                early_stopping=True
            )
            summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            summaries.append(summary)
            
        return " ".join(summaries)

    def summarize_extractive(self, text, ratio=0.3):
        sentences = sent_tokenize(text)
        if len(sentences) <= 1:
            return text
            
        vectorizer = TfidfVectorizer(stop_words='english')
        try:
            tfidf_matrix = vectorizer.fit_transform(sentences)
        except ValueError:
            return text
            
        # Calculate sentence scores based on TF-IDF
        sentence_scores = np.array(tfidf_matrix.sum(axis=1)).flatten()
        
        # Select top N sentences
        num_sentences = max(1, int(len(sentences) * ratio))
        top_sentence_indices = np.argsort(sentence_scores)[-num_sentences:]
        top_sentence_indices.sort()
        
        summary = [sentences[i] for i in top_sentence_indices]
        return " ".join(summary)

    def _chunk_text(self, text, max_chunk_len=800):
        try:
            sentences = sent_tokenize(text)
        except Exception:
            # Fallback if sent_tokenize fails
            return [text[i:i+max_chunk_len] for i in range(0, len(text), max_chunk_len)]
            
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
            
        return [c for c in chunks if c.strip()]

# Singleton instance
summarizer_instance = Summarizer()
