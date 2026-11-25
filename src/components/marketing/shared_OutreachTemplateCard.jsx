import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export default function SharedOutreachTemplateCard({ template }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(template.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px] mb-1">
            {template.audience}
          </Badge>
          <h3 className="text-sm md:text-base font-semibold text-slate-100">{template.title}</h3>
          {template.subject && (
            <p className="text-[11px] text-slate-500 mt-1">
              Subject: <span className="text-slate-300">{template.subject}</span>
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copy}
          className="border-slate-600 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px] ml-1">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
        {template.body}
      </pre>
    </div>
  );
}