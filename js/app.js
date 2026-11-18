// Interatividade da Landing Page "Claude para Abogados"
document.addEventListener('DOMContentLoaded', () => {
  // 1. Contador regressivo de 15 minutos
  const timerElements = document.querySelectorAll('.font-mono-ui.text-3xl.font-semibold.tabular-nums.text-gold');
  let timeLeft = 15 * 60; // 15 minutos em segundos

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const formatted = `${minutes}:${seconds}`;

    timerElements.forEach(el => {
      el.textContent = formatted;
    });

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      timeLeft = 15 * 60; // reinicia ciclo
    }
  }

  if (timerElements.length > 0) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 2. Notificação dinâmica de compra recente
  const toast = document.querySelector('div[role="status"]');
  if (toast) {
    const buyers = [
      { name: 'Javier Navarro', country: 'Madrid', time: 'hace 3 minutos' },
      { name: 'Dra. Carmen Morales', country: 'Barcelona', time: 'hace 5 minutos' },
      { name: 'Carlos Fernández', country: 'Valencia', time: 'hace 2 minutos' },
      { name: 'Abg. Lucía Romero', country: 'Sevilla', time: 'hace 7 minutos' },
      { name: 'David Moreno', country: 'Bilbao', time: 'hace 4 minutos' },
      { name: 'Elena Iglesias', country: 'Zaragoza', time: 'hace 1 minuto' }
    ];

    let buyerIndex = 0;
    const nameEl = toast.querySelector('.font-medium:first-child');
    const countryEl = toast.querySelector('.font-medium:last-child');
    const timeEl = toast.querySelector('.text-\\[10px\\].text-muted-foreground');
    const closeBtn = toast.querySelector('button[aria-label="Cerrar notificación"]');

    let isDismissed = false;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isDismissed = true;
        hideToast();
      });
    }

    function showToast() {
      if (isDismissed) return;
      const b = buyers[buyerIndex];
      if (nameEl) nameEl.textContent = b.name;
      if (countryEl) countryEl.textContent = b.country;
      if (timeEl) timeEl.textContent = b.time;

      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
      toast.style.pointerEvents = 'auto';

      setTimeout(hideToast, 4500);
      buyerIndex = (buyerIndex + 1) % buyers.length;
    }

    function hideToast() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-120%)';
      toast.style.pointerEvents = 'none';
    }

    // Exibir primeiro toast após 3 segundos, e a cada 9 segundos
    setTimeout(() => {
      showToast();
      setInterval(showToast, 9000);
    }, 3000);
  }

  // 3. Rolagem suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4. Integração Hotmart Checkout com Fallback Inteligente
  const directCheckoutUrl = 'https://pay.hotmart.com/J108539720K';
  const checkoutButtons = document.querySelectorAll('a.hotmart-fb, a.hotmart__button-checkout, a[href*="pay.hotmart.com"]');

  function fallbackToDirect() {
    checkoutButtons.forEach(btn => {
      btn.href = directCheckoutUrl;
      btn.classList.remove('hotmart-fb', 'hotmart__button-checkout');
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    });
  }

  // Se o script da Hotmart falhar ao carregar ou for bloqueado por adblocker:
  if (window.__hotmartFailed) {
    fallbackToDirect();
  }

  // Em telas pequenas / mobile (onde o widget não abre popup por design da Hotmart):
  const isMobile = window.innerWidth <= 600 || /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    fallbackToDirect();
  } else {
    // No desktop: se o popup do Fancybox não abrir em até 600ms após o clique, redireciona para o checkout direto
    checkoutButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const popupOpen = document.querySelector('.fancybox-container, .fancybox-is-open, iframe[src*="hotmart.com"]');
          if (!popupOpen) {
            window.open(directCheckoutUrl, '_blank') || (window.location.href = directCheckoutUrl);
          }
        }, 600);
      });
    });
  }
});
