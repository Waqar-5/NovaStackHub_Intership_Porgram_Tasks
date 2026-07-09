import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
export const LoadingScreen = () => {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6">
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <CloudSun className="w-24 h-24 text-primary"/>
        </motion.div>
        <div className="relative">
          <h2 className="text-2xl font-semibold tracking-wider text-foreground">
            Synchronizing
          </h2>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}/>
        </div>
      </motion.div>
    </div>);
};
