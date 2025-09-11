// Utilitaires de détection navigateur et compatibilité

export const detectBrowser = () => {
  if (typeof window === 'undefined') return { isSafari: false, isChrome: false, isFirefox: false };
  
  const userAgent = navigator.userAgent;
  
  return {
    isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
    isChrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
    isFirefox: /firefox/i.test(userAgent),
    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    isIOS: /ipad|iphone|ipod/.test(userAgent)
  };
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