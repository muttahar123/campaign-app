import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Share2 } from 'lucide-react';

export function SocialGenerator({ jwtToken }) {
  const [formData, setFormData] = useState({ platform: 'LinkedIn', campaign_goal: '', brand_voice: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const generateSocial = async () => {
    setIsGenerating(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:4000/api/generate/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      
      const extractedOptions = data.options || data.captions || Object.values(data)[0];
      if (Array.isArray(extractedOptions)) {
        setResults(extractedOptions);
      } else {
        setResults([JSON.stringify(data)]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-right-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Social Content Generator</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Generate multiple caption variations tailored for specific platforms.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 h-fit">
          <CardContent className="p-6 space-y-4">
            {error && <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg dark:bg-rose-500/10 font-medium">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Platform</label>
              <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50">
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Goal / Topic</label>
              <textarea required value={formData.campaign_goal} onChange={e => setFormData({...formData, campaign_goal: e.target.value})} rows={3} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Announcing our new B2B Lead Gen product feature..."></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Brand Voice</label>
              <input required type="text" value={formData.brand_voice} onChange={e => setFormData({...formData, brand_voice: e.target.value})} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" placeholder="Authoritative but approachable" />
            </div>

            <button disabled={isGenerating || !jwtToken} onClick={generateSocial} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50 mt-4">
              <Share2 className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Generate Captions'}
            </button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((caption, i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">Option {i + 1}</div>
                <p className="text-sm whitespace-pre-wrap">{caption}</p>
              </div>
            ))
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
              {isGenerating ? 'AI is brainstorming options...' : 'Awaiting prompt...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
