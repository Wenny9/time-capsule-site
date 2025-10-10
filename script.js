// ---------- GSAP 基础 ----------
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  
    // 进入每个场景：标题淡入、文本上浮、背景视差
    document.querySelectorAll('.scene').forEach((sec) => {
      // 1) 文本容器：兼容 .text / .hero-inner
      const textEl = sec.querySelector('.text, .hero-inner');
      if (textEl) {
        gsap.fromTo(
          textEl,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: sec, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        );
      }
  
      // 2) 标题：兼容 .title / .hero-title
      const titleEl = sec.querySelector('.title, .hero-title');
      if (titleEl) {
        gsap.to(titleEl, {
          opacity: 1, y: 0, duration: 0.8, delay: 0.05,
          scrollTrigger: { trigger: sec, start: 'top 72%', toggleActions: 'play none none reverse' }
        });
      }
  
      // 3) 背景视差
      const bg = sec.querySelector('.bg');
      if (bg) {
        gsap.to(bg, {
          scale: 1.0, yPercent: -6, autoAlpha: 1,
          scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });
  }
  
  
  // ---------- 顶部进度条 ----------
  const bar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();
  
  // ---------- 音频逻辑（需用户触发） ----------
  const ambient   = document.getElementById('ambient');
  const voiceover = document.getElementById('voiceover');
  const audioToggle = document.getElementById('audio-toggle');
  let audioEnabled = false;
  
  if (audioToggle && ambient && voiceover) {
    audioToggle.addEventListener('click', async () => {
      if (!audioEnabled) {
        try {
          await ambient.play(); // 开启环境音
          audioEnabled = true;
          audioToggle.textContent = 'Audio On';
        } catch (e) {
          // 有些浏览器仍需交互，忽略
        }
      } else {
        ambient.pause();
        voiceover.pause();
        audioEnabled = false;
        audioToggle.textContent = 'Enable Audio';
      }
    });
  
    // 进入某个场景时自动切换对应旁白（已开启音频）
    document.querySelectorAll('.scene').forEach((sec) => {
      const voice = sec.dataset && sec.dataset.voice;
      if (!voice) return;
      if (!window.ScrollTrigger) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        onEnter: () => {
          if (!audioEnabled) return;
          if (voiceover.src.includes(voice) && !voiceover.paused) return;
          voiceover.src = voice;
          voiceover.currentTime = 0;
          voiceover.play().catch(()=>{});
        }
      });
    });
  
    const ambientBtn = document.getElementById('ambient-play');
    if (ambientBtn) {
      ambientBtn.addEventListener('click', () => { if (audioEnabled) ambient.play(); });
    }
  }
  
  // ---------- gallery 页面：视频弹窗 ----------
  document.addEventListener('DOMContentLoaded', () => {
    const cards    = document.querySelectorAll('.item[data-video]');
    const modalEl  = document.getElementById('videoModal');
    const videoEl  = document.getElementById('storyVideo');
    const closeEl  = document.getElementById('closeModal');
  
    // 若不是 gallery 或缺元素，直接退出
    if (!cards.length || !modalEl || !videoEl || !closeEl) return;
  
    const openModal = (src) => {
      videoEl.src = src;
      modalEl.classList.remove('hidden');
      // 用户点击触发，自动播放更稳
      videoEl.play().catch(()=>{});
    };
  
    const closeModal = () => {
      try { videoEl.pause(); } catch {}
      videoEl.removeAttribute('src');
      videoEl.load();
      modalEl.classList.add('hidden');
    };
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-video');
        if (src) openModal(src);
      });
    });
  
    closeEl.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) closeModal(); });
  });

  // 让背景图加载完成后再淡入，避免白屏
document.querySelectorAll('.scene .bg').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded')); // 即使失败也不白屏
    }
  });
  