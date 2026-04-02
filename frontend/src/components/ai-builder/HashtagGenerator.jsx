import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Hash } from 'lucide-react';

export function HashtagGenerator({ jwtToken }) {
  const [formData, setFormData] = useState({ content: '', industry: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const generateHashtags = async () => {
    setIsGenerating(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:4000/api/generate/hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      
      const tags = data.hashtags || Object.values(data)[0];
      if (Array.isArray(tags)) {
        setResults(tags);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in slide-in-from-right-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Hashtag Generator</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Extract high-performing hashtags based on content and industry.</p>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 mb-6 flex-1">
        <CardContent className="p-6 space-y-4">
          {error && <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Content Snippet</label>
            <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={2} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" placeholder="Paste a brief summary of the campaign..."></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input required type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Healthcare, Tech, Fashion" />
          </div>

          <button disabled={isGenerating || !jwtToken} onClick={generateHashtags} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50 mt-2">
             <Hash className="w-4 h-4" /> {isGenerating ? 'Analyzing...' : 'Generate 10 Hashtags'}
          </button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="flex flex-wrap gap-3 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border animate-in slide-in-from-bottom-4">
          {results.map((tag, idx) => (
             <span key={idx} className="px-4 py-2 bg-white dark:bg-slate-800 text-primary font-medium rounded-full shadow-sm text-sm border border-border hover:bg-primary/10 transition-colors">
               {tag.startsWith('#') ? tag : `#${tag}`}
             </span>
          ))}
        </div>
      )}
    </div>
  );
}
