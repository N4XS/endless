// Utilitaires de détection navigateur et compatibilité

export const detectBrowser = () => {
  if (typeof window === 'undefined') return { 
    isSafari: false, 
    isChrome: false, 
    isFirefox: false, 
    isMobile: false, 
    isIOS: false,
    isSafariMobile: false,
    supportsPopups: false
  };
  
  const userAgent = navigator.userAgent;
  const isSafari = /safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent);
  const isIOS = /ipad|iphone|ipod/.test(userAgent.toLowerCase());
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSafariMobile = isSafari && isIOS;
  
  // Test popup support (Safari mobile often blocks them)
  const supportsPopups = (() => {
    try {
      const popup = window.open('', '_blank', 'width=1,height=1');
      if (popup) {
        popup.close();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  })();
  
  return {
    isSafari,
    isChrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
    isFirefox: /firefox/i.test(userAgent),
    isMobile,
    isIOS,
    isSafariMobile,
    supportsPopups
  };
};

// Storage compatibility for Safari
export const testStorageCompatibility = () => {
  const tests = {
    localStorage: false,
    sessionStorage: false,
    cookies: false
  };
  
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    tests.localStorage = true;
  } catch {}
  
  try {
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    tests.sessionStorage = true;
  } catch {}
  
  try {
    document.cookie = 'test=test; path=/';
    tests.cookies = document.cookie.indexOf('test=test') > -1;
    document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch {}
  
  return tests;
};

export const getImageOptimizations = () => {
  const { isSafari, isIOS } = detectBrowser();
  
  return {
    // Safari a des problèmes avec le lazy loading natif
    useLazyLoading: !isSafari,
    // iOS Safari a des limites de mémoire strictes
    useWebP: !isIOS,
    // Safari préfère des transitions plus simples
    useComplexAnimations: !isSafari,
    // Optimisations spécifiques Safari
    safariOptimizations: isSafari ? {
      imageRendering: 'auto' as const,
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
      WebkitImageSmoothing: true
    } : {}
  };
};

export const supportsFeature = {
  lazyLoading: typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype,
  webP: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  },
  backdropFilter: CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
};