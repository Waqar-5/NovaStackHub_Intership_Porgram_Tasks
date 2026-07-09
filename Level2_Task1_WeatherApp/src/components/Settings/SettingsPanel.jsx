import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
export const SettingsPanel = () => {
    const { isSettingsOpen, setSettingsOpen, theme, setTheme, unit, setUnit, animations, setAnimations } = useSettings();
    return (<AnimatePresence>
      {isSettingsOpen && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"/>
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-sm glass-panel bg-background/90 rounded-none rounded-l-3xl z-50 border-l border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
              <button onClick={() => setSettingsOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-muted-foreground"/>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              
              {/* Theme */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 glass-panel hover:bg-white/5 text-foreground'}`}>
                    <Sun className="w-8 h-8"/>
                    <span className="font-medium">Light</span>
                  </button>
                  <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 glass-panel hover:bg-white/5 text-foreground'}`}>
                    <Moon className="w-8 h-8"/>
                    <span className="font-medium">Dark</span>
                  </button>
                </div>
              </div>

              {/* Units */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Measurement Unit</h3>
                <div className="bg-white/5 rounded-xl p-1 flex">
                  <button onClick={() => setUnit('metric')} className={`flex-1 py-2.5 text-center rounded-lg font-medium transition-all ${unit === 'metric' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
                    Celsius (°C)
                  </button>
                  <button onClick={() => setUnit('imperial')} className={`flex-1 py-2.5 text-center rounded-lg font-medium transition-all ${unit === 'imperial' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Animations */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Performance</h3>
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 text-accent rounded-lg">
                      <SparklesIcon />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Visual Effects</div>
                      <div className="text-xs text-muted-foreground">Particles & animations</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={animations} onChange={(e) => setAnimations(e.target.checked)}/>
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

            </div>
          </motion.div>
        </>)}
    </AnimatePresence>);
};
const SparklesIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3"/>
    <path d="M18.5 5.5l-2 2"/>
    <path d="M21 12h-3"/>
    <path d="M18.5 18.5l-2-2"/>
    <path d="M12 21v-3"/>
    <path d="M5.5 18.5l2-2"/>
    <path d="M3 12h3"/>
    <path d="M5.5 5.5l2 2"/>
  </svg>);
