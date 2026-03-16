import { motion } from 'motion/react';

export default function Test() {
  return (
    <div className="relative min-h-[300vh] w-full bg-[#1a1a1a] text-white">
      {/* Dynamic Background - GPU Accelerated Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100vh] left-[-100vw] w-[300vw] h-[300vh] origin-center -rotate-45">
          <motion.div
            animate={{
              y: [0, 42],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 42px)',
            }}
          />
        </div>
      </div>

      {/* Stationary Text Relative to Page */}
      <div className="relative z-10 w-full pt-32 px-8">
        <h1 className="text-5xl md:text-7xl font-black text-white/90 tracking-tight">
          STATIONARY
          <br />
          TEXT
        </h1>
        <p className="mt-6 text-zinc-400 max-w-sm text-lg">
          This text is positioned relative to the document. As you scroll down, it will move up and into the safe area (behind the notch or dynamic island).
        </p>
      </div>
    </div>
  );
}
