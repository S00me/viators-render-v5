import { motion, useScroll, useTransform } from 'motion/react';

export default function Test() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);

  return (
    <div className="relative min-h-[300vh] w-full overflow-hidden bg-zinc-950 text-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-emerald-500/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -100, 0],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] bg-blue-500/20 blur-[100px] rounded-full"
        />
      </div>

      {/* Scattered Text Content */}
      <div className="relative z-10 w-full h-full">
        <motion.h1 
          style={{ y: y1 }}
          className="absolute top-[5vh] left-[5vw] text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50"
        >
          TESTING
        </motion.h1>

        <motion.h2 
          style={{ y: y2 }}
          className="absolute top-[25vh] right-[5vw] text-4xl md:text-7xl font-bold text-emerald-400"
        >
          SAFE AREA
        </motion.h2>

        <motion.div 
          style={{ rotate }}
          className="absolute top-[45vh] left-[20vw] text-2xl md:text-5xl font-mono text-purple-400"
        >
          SCROLL ME
        </motion.div>

        <motion.div 
          style={{ scale }}
          className="absolute top-[80vh] right-[20vw] text-3xl md:text-6xl font-serif italic text-amber-400"
        >
          DYNAMIC
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="absolute top-[120vh] left-[10vw] text-xl md:text-3xl max-w-md text-zinc-300 bg-black/50 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
        >
          This text appears as you scroll down. It tests the scrollability and visibility of elements in the extended viewport.
        </motion.p>

        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            color: ["#ffffff", "#f472b6", "#ffffff"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[160vh] right-[10vw] text-5xl md:text-8xl font-black"
        >
          COLORS
        </motion.div>

        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[200vh] left-[5vw] text-7xl md:text-[10rem] font-black text-white/5"
        >
          BACKGROUND
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="absolute top-[240vh] right-[15vw] text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-emerald-400"
        >
          MIXED
        </motion.div>

        <motion.div 
          className="absolute bottom-[5vh] left-[50%] -translate-x-1/2 text-center w-full px-4"
        >
          <p className="text-zinc-500 mb-6 font-mono text-sm md:text-base">
            End of scrollable area. Safe area insets applied.
          </p>
          <a href="/" className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors hover:scale-105 active:scale-95 transform">
            Return to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
