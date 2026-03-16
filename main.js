const statusBanner = document.getElementById('statusBanner');
const checkoutButtons = document.querySelectorAll('.checkout-btn');
const soundToggle = document.getElementById('soundToggle');
const heroAmbience = document.getElementById('heroAmbience');

const setStatus = (type, message) => {
  if (!statusBanner) return;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.textContent = message;
};

const clearStatus = () => {
  if (!statusBanner) return;
  statusBanner.className = 'status-banner';
  statusBanner.textContent = '';
};

const applyStatusFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  if (status === 'success') {
    setStatus('success', 'Payment successful. Welcome to the Echoes ecosystem.');
  } else if (status === 'cancel') {
    setStatus('error', 'Checkout cancelled. You can secure your package when ready.');
  } else {
    clearStatus();
  }
};

const startCheckout = async (button) => {
  const plan = button.dataset.plan;
  const originalLabel = button.textContent;

  checkoutButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn === button) btn.textContent = 'Redirecting...';
  });

  clearStatus();

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Failed to create checkout session.');
    if (!payload.url) throw new Error('Checkout URL missing from server response.');

    window.location.assign(payload.url);
  } catch (error) {
    setStatus('error', error.message || 'Unexpected checkout error.');
    checkoutButtons.forEach((btn) => {
      btn.disabled = false;
      btn.textContent = btn === button ? originalLabel : btn.textContent;
    });
  }
};

const setupAtmosphereAudio = () => {
  if (!soundToggle || !heroAmbience) return;

  const setAudioUi = (enabled) => {
    soundToggle.setAttribute('aria-pressed', String(enabled));
    soundToggle.textContent = enabled ? 'Disable Atmosphere Sound' : 'Enable Atmosphere Sound';
  };

  setAudioUi(false);

  soundToggle.addEventListener('click', async () => {
    const shouldEnable = soundToggle.getAttribute('aria-pressed') !== 'true';

    try {
      if (shouldEnable) {
        heroAmbience.volume = 0.35;
        await heroAmbience.play();
        setAudioUi(true);
      } else {
        heroAmbience.pause();
        heroAmbience.currentTime = 0;
        setAudioUi(false);
      }
    } catch (error) {
      setStatus('error', 'Unable to start ambience audio in this browser session.');
      setAudioUi(false);
    }
  });
};

checkoutButtons.forEach((button) => {
  button.addEventListener('click', () => startCheckout(button));
});

const observers = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

observers.forEach((element) => observer.observe(element));

window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.add('intro-ready'));
});

setupAtmosphereAudio();
applyStatusFromQuery();
