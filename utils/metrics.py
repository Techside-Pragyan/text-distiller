import textstat
from keybert import KeyBERT

kw_model = KeyBERT()

def get_metrics(original_text, summary_text):
    metrics = {
        "original_word_count": len(original_text.split()),
        "summary_word_count": len(summary_text.split()),
        "readability_score": textstat.flesch_reading_ease(summary_text),
        "reduction_percentage": round((1 - len(summary_text) / len(original_text)) * 100, 2) if len(original_text) > 0 else 0
    }
    return metrics

def extract_keywords(text, top_n=5):
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 1), stop_words='english', top_n=top_n)
    return [kw[0] for kw in keywords]
