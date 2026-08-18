import React, { useState } from 'react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onEngage: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEngage }) => {
  const [email, setEmail] = useState('OPERATIVE_ID@SYS.COM');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onEngage();
    }, 400);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-end bg-[#131313] bg-cover bg-center antialiased"
      style={{
        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDam6JOQqjsW716mjjDm8BmZm9H17EFtXL9AmjBTKbRja3-6RsP_ge8tjSknJxdpL_OGLIt-D2pHYFeIJcALvwtbW4RiQNxika_ygneBNk0F1f1oSD4eAJ3TwW6bG3LFEIwUqqEpJsJV0dbP0VRI5xHYsBoWBwfb92TUspQttimJJY1QcaU-E_GEJhYntXyOyhzDDzgzFNveFZdyFan-LWqR4CgPZ92DjWCyRqveFqtubxgYqKhpVAP')`,
      }}
    >
      {/* Background Dark & Gritty Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/60 via-[#131313]/85 to-[#0e0e0e] z-0 pointer-events-none" />

      {/* Top Branding */}
      <header className="absolute top-0 left-0 w-full z-10 flex justify-center items-center h-16 px-5">
        <h1 className="font-headline font-bold text-lg md:text-xl tracking-tighter text-white">
          IRONFORGE PRO
        </h1>
      </header>

      {/* Main Form Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto px-6 pb-10 flex flex-col gap-6"
      >
        {/* Header Title */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-headline text-4xl md:text-5xl text-white uppercase font-extrabold leading-none tracking-tight">
            INITIALIZE<br />
            <span className="text-[#c3f400]">PROTOCOL</span>
          </h2>
          <p className="font-body-md text-base text-[#c4c9ac] mt-1">
            Enter your credentials to access your terminal.
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c4c9ac] group-focus-within:text-[#c3f400] transition-colors">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <input
              id="operative-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="OPERATIVE_ID@SYS.COM"
              required
              className="bg-[#131313]/90 border border-[#444933] text-[#e5e2e1] font-mono text-sm md:text-base rounded focus:ring-1 focus:ring-[#c3f400] focus:border-[#c3f400] block w-full pl-11 p-3.5 tracking-wider transition-all placeholder:text-[#8e9379]"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c4c9ac] group-focus-within:text-[#c3f400] transition-colors">
              <span className="material-symbols-outlined text-[20px]">key</span>
            </div>
            <input
              id="operative-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#131313]/90 border border-[#444933] text-[#e5e2e1] font-mono text-sm md:text-base rounded focus:ring-1 focus:ring-[#c3f400] focus:border-[#c3f400] block w-full pl-11 p-3.5 tracking-widest transition-all placeholder:text-[#8e9379]"
            />
          </div>

          {/* Main CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-xl uppercase py-4 rounded-lg hover:bg-[#abd600] active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] cursor-pointer"
          >
            {loading ? 'INITIALIZING...' : 'ENGAGE'}
            <span className="material-symbols-outlined text-[22px] font-bold">bolt</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-[#444933] flex-1"></div>
          <span className="font-mono text-xs text-[#c4c9ac] tracking-widest uppercase">OR BYPASS VIA</span>
          <div className="h-px bg-[#444933] flex-1"></div>
        </div>

        {/* Social / Quick Login Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEngage}
            className="flex-1 bg-[#1c1b1b] border border-[#444933] py-3 rounded text-white hover:border-[#c3f400] active:scale-95 transition-all flex items-center justify-center font-headline font-bold text-lg hover:text-[#c3f400]"
          >
            G
          </button>
          <button
            type="button"
            onClick={onEngage}
            className="flex-1 bg-[#1c1b1b] border border-[#444933] py-3 rounded text-white hover:border-[#c3f400] active:scale-95 transition-all flex items-center justify-center hover:text-[#c3f400]"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              file_download
            </span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => alert("Credentials bypass mode active for Operative Alex Rivera.")}
            className="font-mono text-xs text-[#c4c9ac] hover:text-white tracking-wider uppercase transition-colors"
          >
            REQUEST NEW CREDENTIALS
          </button>
        </div>
      </motion.main>
    </div>
  );
};
