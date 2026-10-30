import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  mode: 'calm' | 'panic' | 'idle';
  label: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserNode, mode, label }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let idlePhase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Zemin hafif ızgara (akıllı tahta dostu)
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let y = 15; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (analyserNode && mode !== 'idle') {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        // Dalga formu çizimi
        ctx.lineWidth = 3;
        ctx.strokeStyle = mode === 'calm' ? '#059669' : '#DC2626';
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Frekans spektrum barları (alt kısımdaki dikey çizgiler)
        const freqArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(freqArray);
        const barWidth = (width / 24);
        for (let b = 0; b < 24; b++) {
          const barHeight = (freqArray[b * 2] / 255) * (height * 0.45);
          ctx.fillStyle = mode === 'calm' ? 'rgba(5, 150, 105, 0.35)' : 'rgba(220, 38, 38, 0.35)';
          ctx.fillRect(b * (barWidth + 2), height - barHeight, barWidth, barHeight);
        }
      } else {
        // Idle sakin sinüs çizgisi
        idlePhase += 0.05;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#94A3B8';
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.03 + idlePhase) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [analyserNode, mode]);

  return (
    <div className="w-full bg-slate-900 rounded-lg p-3 border border-slate-700 shadow-inner">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="font-mono text-slate-300 font-semibold tracking-wider">
          CANLI SES SPEKTRUMU
        </span>
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
            mode === 'calm'
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
              : mode === 'panic'
              ? 'bg-red-900/60 text-red-300 border border-red-600'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {label}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={360}
        height={100}
        className="w-full h-24 rounded bg-slate-950 block"
      />
      <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-slate-400">
        <span>Frekans Aralığı: 60 Hz — 3200 Hz</span>
        <span>Örnekleme: Web Audio API 48kHz</span>
      </div>
    </div>
  );
};
