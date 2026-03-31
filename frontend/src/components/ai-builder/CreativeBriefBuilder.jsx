import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { PdfExportButton } from './PdfExportButton';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export function CreativeBriefBuilder({ jwtToken }) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1
    clientName: '', industry: '', website: '', competitors: '',
    // Step 2
    objective: 'awareness', audience: '', budget: '',
    // Step 3
    tone: '', imagery: '', colors: '', dosDonts: ''
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const generateCopy = async () => {
    setStep(5);
    setIsGenerating(true);
    setResultText('');

    // Backend specifically expects {product, tone, platform, word_limit}
    // We compose the "product" description meticulously out of the form variables to obey the exact prompt guidelines
    const compositeProductPayload = `
      Brief context for ${formData.clientName} (${formData.industry}). Website: ${formData.website}. 
      Objective: ${formData.objective}. Audience: ${formData.audience}. Budget: ${formData.budget}.
      Imagery: ${formData.imagery}. Colors: ${formData.colors}. Rules: ${formData.dosDonts}.
      Please generate the output structured carefully: 1. Title Suggestion 2. Three Headlines 3. Tone of voice guide 4. Recommended channels with budget allocation percentages 5. Key visual direction (Hero Image concept)
    `;

    try {
      const response = await fetch('http://localhost:3000/api/generate/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ 
          product: compositeProductPayload,
          tone: formData.tone,
          platform: "Multi-Channel",
          word_limit: 500
        })
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
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-right-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Creative Brief Builder</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Generate structured creative direction documents using AI.</p>
        
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${currentProgress}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span className={step >= 1 ? 'text-primary' : ''}>Client</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Objectives</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Creative</span>
          <span className={step >= 4 ? 'text-primary' : ''}>Review</span>
          <span className={step >= 5 ? 'text-primary' : ''}>Output</span>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardContent className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-between">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">1. Client Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company / Brand Name</label>
                    <input type="text" value={formData.clientName} onChange={e => updateForm('clientName', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <input type="text" value={formData.industry} onChange={e => updateForm('industry', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <input type="text" value={formData.website} onChange={e => updateForm('website', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Competitors</label>
                    <input type="text" value={formData.competitors} onChange={e => updateForm('competitors', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">2. Campaign Objectives</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Campaign Objective</label>
                    <select value={formData.objective} onChange={e => updateForm('objective', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="awareness">Awareness</option>
                      <option value="consideration">Consideration</option>
                      <option value="conversion">Conversion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Audience</label>
                    <textarea value={formData.audience} onChange={e => updateForm('audience', e.target.value)} rows={2} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget Allocation</label>
                    <input type="text" value={formData.budget} onChange={e => updateForm('budget', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">3. Creative Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tone of Voice</label>
                    <input type="text" value={formData.tone} onChange={e => updateForm('tone', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Direction</label>
                    <input type="text" value={formData.colors} onChange={e => updateForm('colors', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Imagery Style</label>
                    <input type="text" value={formData.imagery} onChange={e => updateForm('imagery', e.target.value)} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Do's and Don'ts</label>
                    <textarea value={formData.dosDonts} onChange={e => updateForm('dosDonts', e.target.value)} rows={2} className="w-full bg-background border border-border p-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50"></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold">4. Review & Submit</h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 space-y-4 border border-border text-sm grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 mb-1 text-xs uppercase">Client Details</p>
                    <p><strong className="text-slate-900 dark:text-white">Brand:</strong> {formData.clientName}</p>
                    <p><strong className="text-slate-900 dark:text-white">Industry:</strong> {formData.industry}</p>
                    <p><strong className="text-slate-900 dark:text-white">Site:</strong> {formData.website}</p>
                    <p><strong className="text-slate-900 dark:text-white">Competitors:</strong> {formData.competitors}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1 text-xs uppercase">Objectives</p>
                    <p><strong className="text-slate-900 dark:text-white">Objective:</strong> <span className="capitalize">{formData.objective}</span></p>
                    <p><strong className="text-slate-900 dark:text-white">Audience:</strong> {formData.audience}</p>
                    <p><strong className="text-slate-900 dark:text-white">Budget:</strong> {formData.budget}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 mb-1 text-xs uppercase">Creative Direction</p>
                    <p><strong className="text-slate-900 dark:text-white">Tone:</strong> {formData.tone}</p>
                    <p><strong className="text-slate-900 dark:text-white">Imagery/Colors:</strong> {formData.imagery} / {formData.colors}</p>
                    <p><strong className="text-slate-900 dark:text-white">Do's & Don'ts:</strong> {formData.dosDonts}</p>
                  </div>
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
                  {!isGenerating && <PdfExportButton targetId="print-ready-brief" filename={`${(formData.clientName || 'AI').replace(/\\s+/g, '_')}_Creative_Brief`} />}
                </div>
                
                <div className="bg-white overflow-hidden rounded-lg border border-slate-200 shadow-md">
                  <div id="print-ready-brief" className="bg-white text-black p-8 sm:p-12 min-h-[500px]">
                    <div className="border-b-2 border-slate-900 pb-4 mb-8">
                      <h1 className="text-3xl font-black uppercase text-slate-900">{formData.clientName || 'Campaign'} Brief</h1>
                      <p className="text-slate-500 mt-1 uppercase font-semibold tracking-wider">AI Generated Direction Document</p>
                    </div>
                    
                    <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif leading-relaxed text-slate-800">
                      {resultText || <span className="animate-pulse text-slate-400 font-sans">Drafting document layout...</span>}
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
                <Sparkles className="w-4 h-4" /> Issue Brief to AI
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
