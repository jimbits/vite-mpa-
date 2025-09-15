export function useDarkMode() {
  //  create a state var
  // Apply theme to <html>
  /*  
useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
  */
  // Sync across tabs
  /*   useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setIsDark(e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return {
    isDark,
    toggle: () => setIsDark((prev) => !prev),
    setDark: () => setIsDark(true),
    setLight: () => setIsDark(false),
  }; */
}
