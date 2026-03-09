import { useEffect, useRef, useState } from 'react';
import { DAILY_FORTUNE_SHARE_TEXT } from './lib/scratchCard';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instructionText = 'Use your finger to scratch the gold area!';
  const [shareFeedback, setShareFeedback] = useState('Share your fortune with friends.');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    let isDrawing = false;
    const initCanvas = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#D4AF37');
      gradient.addColorStop(0.5, '#F9E076');
      gradient.addColorStop(1, '#B8860B');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
      
      for(let i=0; i<500; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
      }
    };

    initCanvas();

    const getMousePos = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };



    let lastPos = { x: 0, y: 0 };

    const scratch = (e: Event) => {
      if (!isDrawing) return;
      e.preventDefault();
      const event = e as unknown as MouseEvent | TouchEvent;
      const pos = getMousePos(event);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 50;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPos = pos;
    };

    const handleDown = (e: Event) => {
      isDrawing = true;
      if (e.type === 'touchstart') e.preventDefault();
      const event = e as unknown as MouseEvent | TouchEvent;
      lastPos = getMousePos(event);
      
      // Draw a dot right where user clicks to start
      scratch(e);
    };
    const handleUp = () => isDrawing = false;
    
    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('touchstart', handleDown, {passive: false});
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch, {passive: false});

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('touchstart', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, []);

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Fortune',
          text: DAILY_FORTUNE_SHARE_TEXT,
        });
        setShareFeedback('Fortune shared successfully.');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(DAILY_FORTUNE_SHARE_TEXT);
        setShareFeedback('Fortune copied to clipboard.');
        return;
      }

      setShareFeedback('Sharing is not supported on this device.');
    } catch {
      setShareFeedback('Share canceled or unavailable.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-mystic-dark to-black min-h-screen flex flex-col items-center justify-between py-8 px-4 font-sans text-white">
      {/* MainHeader */}
      <header className="text-center mb-6" data-purpose="page-title">
        <div className="inline-block p-2 rounded-full bg-mystic-dark/20 mb-2 animate-sparkle">
          <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
          DAILY FORTUNE
        </h1>
        <p className="text-mystic-light/80 text-sm mt-1 uppercase tracking-widest">Scratch to Reveal Your Destiny</p>
      </header>
      
      {/* ScratchSection */}
      <main className="w-full flex flex-col items-center gap-8">
        <div data-purpose="scratch-game-area" id="scratch-container">
          <div className="text-gray-800" id="fortune-result">
            <div className="mb-2">
              <span className="text-xs font-bold text-mystic-dark uppercase tracking-tighter">Today's Luck</span>
              <div className="flex gap-1 justify-center text-xl text-yellow-500 mt-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
              </div>
            </div>
            <div className="my-3 border-y border-mystic-light/30 py-3 w-full">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Key Notes</p>
              <p className="text-sm font-medium italic">"Stay hydrated & be patient with yourself today."</p>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400 mb-1">Motto of the Day</p>
              <p className="text-sm leading-tight font-bold text-mystic-dark">
                "The best way to predict the future is to create it."
              </p>
            </div>
          </div>
          <canvas ref={canvasRef} height="320" width="320" id="scratch-canvas"></canvas>
        </div>
        <div className="text-mystic-light/60 text-sm animate-pulse" id="instruction-text">
          {instructionText}
        </div>
      </main>

      {/* ActionsFooter */}
      <footer className="w-full max-w-xs mt-auto space-y-4" data-purpose="user-actions">
        <button className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform" onClick={handleTryAgain}>
          Try Again Tomorrow
        </button>
        <button className="w-full py-3 px-6 bg-white/10 border border-white/20 rounded-2xl font-semibold text-white/90 flex items-center justify-center gap-2 active:bg-white/20 hover:bg-white/20 transition-colors" onClick={handleShare}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
          </svg>
          Share My Fortune
        </button>
        <p className="text-center text-xs text-white/70" role="status" aria-live="polite">
          {shareFeedback}
        </p>
      </footer>
    </div>
  );
};

export default App;
