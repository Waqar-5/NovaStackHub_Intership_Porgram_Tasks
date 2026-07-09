import React, { useEffect, useRef } from 'react';
import { CloudSun, Settings, Star, Moon, Sun } from 'lucide-react';
import { SearchBar } from '../Search/Search';
import { useSettings } from '@/hooks/useSettings';
import { useWeather } from '@/hooks/useWeather';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export const Navbar = () => {
    const { theme, setTheme, setSettingsOpen } = useSettings();
    const { setFavoritesOpen } = useWeather();
    const navRef = useRef(null);
    useEffect(() => {
        if (!navRef.current)
            return;
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                gsap.to(navRef.current, { yPercent: -100, duration: 0.3, ease: 'power2.out' });
            }
            else {
                gsap.to(navRef.current, { yPercent: 0, duration: 0.3, ease: 'power2.out', backgroundColor: currentScrollY > 20 ? 'var(--glass-bg)' : 'transparent', backdropFilter: currentScrollY > 20 ? 'blur(12px)' : 'blur(0px)' });
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (<nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent data-[scrolled=true]:border-white/10 px-4 py-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <CloudSun className="w-6 h-6 text-white"/>
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            WeatherLens
          </span>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-foreground" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
          </button>
          
          <button onClick={() => setFavoritesOpen(true)} className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-foreground hidden sm:block" aria-label="View favorite cities">
            <Star className="w-5 h-5"/>
          </button>
          
          <button onClick={() => setSettingsOpen(true)} className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-foreground" aria-label="Open settings">
            <Settings className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </nav>);
};
