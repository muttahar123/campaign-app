import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { PdfExportButton } from './PdfExportButton';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export function CreativeBriefBuilder({ jwtToken }) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    productOrService: '',
    goal: '',
    targetAudience: '',
    tone: '',
    keyMessage: '',
    exclusions: ''
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const generateCopy = async () => {
    setStep(5);
    setIsGenerating(true);
    setResultText('');

    const prompt = `Write a comprehensive, professional AI creative ad brief.
    Client: ${formData.clientName}
    Product: ${formData.productOrService}
    Goal: ${formData.goal}
    Target Audience: ${formData.targetAudience}
    Tone: ${formData.tone}
    Key Message: ${formData.keyMessage}
    Must Exclude: ${formData.exclusions}`;

    try {
      const response = await fetch('http://localhost:3000/api/generate/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.body) throw new Error("No readable stream available.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.includes('data: [DONE]')) return;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              setResultText(prev => prev + data.content);
            } catch (e) {
              console.error('SSE parsing error', e);
            }
          }
        }
      }
    } catch (err) {
      setResultText(`Error generating brief: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentProgress = (step / 5) * 100;

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in slide-in-from-right-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Creative Brief Builder</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Generate high-converting ad copy instantly with precision inputs.</p>
        
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${currentProgress}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
          <span className={step >= 1 ? 'text-primary' : ''}>Client Details</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Objectives</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Creative Prefs</span>
          <span className={step >= 4 ? 'text-primary' : ''}>Review</span>
          <span className={step >= 5 ? 'text-primary' : ''}>Generated</span>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardContent className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-between">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">1. Client Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company / Brand Name</label>
                    <input type="text" value={formData.clientName} onChange={e => updateForm('clientName', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. Acme Corp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Product or Service</label>
                    <textarea value={formData.productOrService} onChange={e => updateForm('productOrService', e.target.value)} rows={3} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Describe what you are selling..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">2. Campaign Objectives</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Goal</label>
                    <input type="text" value={formData.goal} onChange={e => updateForm('goal', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. Drive 500 webinar signups" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Audience</label>
                    <textarea value={formData.targetAudience} onChange={e => updateForm('targetAudience', e.target.value)} rows={3} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Who are we speaking to? Be specific..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">3. Creative Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand Tone of Voice</label>
                    <input type="text" value={formData.tone} onChange={e => updateForm('tone', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. Professional yet witty" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Core Key Message</label>
                    <input type="text" value={formData.keyMessage} onChange={e => updateForm('keyMessage', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="What is the one thing they need to remember?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Things to Exclude / Constraints</label>
                    <textarea value={formData.exclusions} onChange={e => updateForm('exclusions', e.target.value)} rows={2} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="e.g. Do not use the word 'cheap'"></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">4. Review & Generate</h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 space-y-4 border border-border text-sm">
                  <p><strong className="text-slate-900 dark:text-white">Brand:</strong> {formData.clientName || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Product:</strong> {formData.productOrService || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Goal:</strong> {formData.goal || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Audience:</strong> {formData.targetAudience || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Tone:</strong> {formData.tone || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Core Message:</strong> {formData.keyMessage || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-white">Exclusions:</strong> {formData.exclusions || 'N/A'}</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> 
                    AI Output Generation
                  </h2>
                  {!isGenerating && <PdfExportButton targetId="print-ready-brief" filename={`${(formData.clientName || 'AI').replace(/\\s+/g, '_')}_Brief`} />}
                </div>
                
                <div className="bg-white overflow-hidden rounded-lg border border-slate-200 shadow-md">
                  <div id="print-ready-brief" className="bg-white text-black p-8 sm:p-12 min-h-[500px]">
                    <div className="border-b-2 border-slate-900 pb-4 mb-8">
                      <h1 className="text-3xl font-black uppercase text-slate-900">Creative Ad Brief</h1>
                      <p className="text-slate-500 mt-1 uppercase font-semibold tracking-wider">CampaignHQ AI Builder</p>
                    </div>
                    
                    <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif leading-relaxed text-slate-800">
                      {resultText || <span className="animate-pulse text-slate-400 font-sans">Thinking...</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
            {step > 1 && step < 5 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 4 ? (
              <button disabled={!jwtToken} onClick={generateCopy} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50">
                <Sparkles className="w-4 h-4" /> Generate Copy
              </button>
            ) : (
              <button disabled={isGenerating} onClick={() => { setStep(1); setResultText(''); }} className="text-sm font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white underline disabled:opacity-50">
                Start Over
              </button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
