'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState('abstractive');
  const [length, setLength] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async () => {
    setIsProcessing(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    if (activeTab === 'text') formData.append('text', inputText);
    else if (activeTab === 'url') formData.append('url', url);
    else if (activeTab === 'file' && file) formData.append('file', file);
    
    formData.append('style', style);
    formData.append('length', length);

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to summarize');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearInputs = () => {
    setInputText('');
    setUrl('');
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="app-container">
      <Head>
        <title>Text Distiller | AI Summarization</title>
        <meta name="description" content="State-of-the-art AI text summarization tool" />
      </Head>

      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: 'url("/hero.png")', backgroundSize: 'cover' }}></div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Text Distiller</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Distill complex documents into clear, concise insights using advanced neural networks.
        </p>
      </section>

      <div className="workspace">
        {/* Left Panel: Inputs */}
        <div className="glass-card">
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'text' ? 'active' : ''}`} 
              onClick={() => setActiveTab('text')}
            >
              Text Input
            </div>
            <div 
              className={`tab ${activeTab === 'url' ? 'active' : ''}`} 
              onClick={() => setActiveTab('url')}
            >
              URL
            </div>
            <div 
              className={`tab ${activeTab === 'file' ? 'active' : ''}`} 
              onClick={() => setActiveTab('file')}
            >
              File Upload
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {activeTab === 'text' && (
              <textarea 
                placeholder="Paste your text here (minimum 10 words)..."
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            )}

            {activeTab === 'url' && (
              <input 
                type="url" 
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            )}

            {activeTab === 'file' && (
              <div 
                className="file-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  padding: '3rem',
                  textCenter: 'center',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.docx,.txt"
                />
                <p style={{ color: 'var(--text-secondary)' }}>
                  {file ? `Selected: ${file.name}` : 'Click to upload PDF, DOCX or TXT'}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Summarization Style
              </label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="abstractive">Abstractive (Human-like)</option>
                <option value="extractive">Extractive (Key Sentences)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Target Length
              </label>
              <select value={length} onChange={(e) => setLength(e.target.value)}>
                <option value="short">Short (Punchy)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="detailed">Detailed (In-depth)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleSummarize} 
              disabled={isProcessing || (activeTab === 'text' && !inputText) || (activeTab === 'url' && !url) || (activeTab === 'file' && !file)}
              style={{ flex: 2 }}
            >
              {isProcessing ? <div className="loader"></div> : 'Distill Text'}
            </button>
            <button onClick={clearInputs} style={{ background: 'rgba(255,255,255,0.05)', flex: 1 }}>
              Clear
            </button>
          </div>

          {error && (
            <p style={{ color: '#ff5e95', marginTop: '1rem', fontSize: '0.9rem' }}>
              Error: {error}
            </p>
          )}
        </div>

        {/* Right Panel: Results */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Distilled Insights</h3>
          
          {!result && !isProcessing && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
              <p>Your distilled summary will appear here.</p>
            </div>
          )}

          {isProcessing && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ marginBottom: '1rem' }}>AI is analyzing the content...</p>
              <div className="loader" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
            </div>
          )}

          {result && (
            <div className="result-content">
              <h2 style={{ marginBottom: '1rem' }}>{result.title}</h2>
              
              <div 
                style={{ 
                  background: 'rgba(123, 79, 255, 0.05)', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--accent-color)',
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}
              >
                {result.summary}
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                  Keywords
                </h4>
                <div>
                  {result.keywords.map((kw: string) => (
                    <span key={kw} className="keyword">{kw}</span>
                  ))}
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                Metrics
              </h4>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">{result.metrics.reduction_percentage}%</div>
                  <div className="metric-label">Reduction</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{result.metrics.summary_word_count}</div>
                  <div className="metric-label">Words</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{Math.round(result.metrics.readability_score)}</div>
                  <div className="metric-label">Readability</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => navigator.clipboard.writeText(result.summary)}
                  style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}
                >
                  Copy Summary
                </button>
                <button 
                   onClick={() => {
                     const element = document.createElement("a");
                     const file = new Blob([result.summary], {type: 'text/plain'});
                     element.href = URL.createObjectURL(file);
                     element.download = "summary.txt";
                     document.body.appendChild(element);
                     element.click();
                   }}
                   style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}
                >
                  Download .txt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .file-drop-zone:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: var(--accent-color) !important;
        }
      `}</style>
    </div>
  );
}
