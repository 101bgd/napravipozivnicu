// The SDK is already in the server-rendered <head>. Only the manual unit is lazy.
export function initializeAds() {
  const placement = document.querySelector('.ad-placement:not([hidden])');
  const unit = placement?.querySelector('ins.adsbygoogle');
  if (!unit || unit.dataset.adRequested) return;
  const config = JSON.parse(document.querySelector('#adsense-config').textContent);
  if (!/^ca-pub-\d{16}$/.test(config.publisherId)) return;
  const script = [...document.head.querySelectorAll('script[src]')].find(element => element.src === `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`);
  if (!script) { placement.hidden = true; return; }
  unit.dataset.adRequested = 'pending';
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    let timeout;
    const cleanup = () => { clearTimeout(timeout); statusObserver.disconnect(); script.removeEventListener('error', cancel); };
    const cancel = () => { cleanup(); unit.dataset.adRequested = 'canceled'; placement.hidden = true; };
    const statusObserver = new MutationObserver(() => {
      if (!['filled', 'unfilled'].includes(unit.dataset.adStatus)) return;
      cleanup();
      if (unit.dataset.adStatus === 'unfilled') placement.hidden = true;
    });
    statusObserver.observe(unit, { attributes: true, attributeFilter: ['data-ad-status'] });
    script.addEventListener('error', cancel, { once: true });
    timeout = setTimeout(cancel, 20_000);
    try {
      unit.dataset.adRequested = 'true';
      // Google's queue works whether the async SDK has loaded yet or not.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { cancel(); }
  }, { rootMargin: '300px 0px' });
  observer.observe(placement);
}
