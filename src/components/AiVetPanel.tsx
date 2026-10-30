import React from 'react';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export interface AiAnalysisState {
  technicalStatus: string; // e.g. "[AI Durum Analizi: Whale_Eye_Detected // Sempatik_Sinir_Sistemi: %85]"
  pedagogicalFeedback: string;
  verdict: 'correct' | 'warning' | 'info' | 'danger';
  etologicalTerm?: string; // e.g. "Turid Rugaas Sakinleştirici Sinyali (Calming Signal)"
  timestamp?: string;
}

interface AiVetPanelProps {
  analysis: AiAnalysisState;
}

export const AiVetPanel: React.FC<AiVetPanelProps> = ({ analysis }) => {
  const getVerdictStyle = () => {
    switch (analysis.verdict) {
      case 'correct':
        return {
          headerBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          statusColor: 'text-emerald-700',
        };
      case 'danger':
        return {
          headerBg: 'bg-red-50 border-red-200 text-red-900',
          badgeBg: 'bg-red-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />,
          statusColor: 'text-red-700',
        };
      case 'warning':
        return {
          headerBg: 'bg-amber-50 border-amber-200 text-amber-900',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          statusColor: 'text-amber-700',
        };
      case 'info':
      default:
        return {
          headerBg: 'bg-sky-50 border-sky-200 text-sky-900',
          badgeBg: 'bg-sky-700 text-white',
          icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
          statusColor: 'text-sky-700',
        };
    }
  };

  const style = getVerdictStyle();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Üst Başlık Şeridi */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${style.headerBg}`}>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-sm tracking-wide text-slate-900">
            AI Veteriner Davranış Uzmanı Paneli
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Klinik Etoloji & LLM Analizörü</span>
        </div>
      </div>

      {/* İçerik Gövdesi */}
      <div className="p-4 space-y-3">
        {/* Teknik AI Durum Analizi Satırı */}
        <div className="bg-slate-900 text-slate-100 font-mono text-xs p-2.5 rounded-lg flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sky-400 font-bold shrink-0">&gt;</span>
            <span className="text-sky-300 font-semibold">{analysis.technicalStatus}</span>
          </div>
          {analysis.etologicalTerm && (
            <span className="hidden sm:inline-block text-[11px] text-amber-300 bg-slate-800 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
              {analysis.etologicalTerm}
            </span>
          )}
        </div>

        {/* Pedagojik Açıklama */}
        <div className="flex items-start gap-3 pt-1">
          {style.icon}
          <div className="space-y-1 text-slate-700 text-sm leading-relaxed">
            <p className="font-semibold text-slate-900">
              Davranışsal ve Bilimsel Açıklama:
            </p>
            <p className="text-slate-800 leading-normal">
              {analysis.pedagogicalFeedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
