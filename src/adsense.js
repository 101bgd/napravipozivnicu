// Loaded only on production pages with an enabled, validated ad placement.
export function initializeAds() {
  const placement = document.querySelector('.ad-placement:not([hidden])');
  const unit = placement?.querySelector('ins.adsbygoogle');
  if (!unit || unit.dataset.adRequested) return;
  const config = JSON.parse(document.querySelector('#adsense-config').textContent);
  if (!/^ca-pub-\d{16}$/.test(config.publisherId)) return;
  unit.dataset.adRequested = 'pending';
  const hide = () => { placement.hidden = true; };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    const script = document.createElement('script');
    script.async = true; script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
    const cancel = () => {
      clearTimeout(timeout); statusObserver.disconnect();
      script.onload = null; script.onerror = null; script.remove();
      unit.dataset.adRequested = 'canceled'; hide();
    };
    const timeout = setTimeout(cancel, 20_000);
    script.onerror = cancel;
    script.onload = () => {
      clearTimeout(timeout);
      try {
        unit.dataset.adRequested = 'true';
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch { cancel(); }
    };
    const statusObserver = new MutationObserver(() => {
      if (!['filled', 'unfilled'].includes(unit.dataset.adStatus)) return;
      clearTimeout(timeout); statusObserver.disconnect();
      if (unit.dataset.adStatus === 'unfilled') hide();
    });
    statusObserver.observe(unit, { attributes: true, attributeFilter: ['data-ad-status'] });
    document.head.append(script);
  }, { rootMargin: '300px 0px' });
  observer.observe(placement);
}
