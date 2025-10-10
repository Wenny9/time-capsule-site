// ---------- GSAP ----------
gsap.registerPlugin(ScrollTrigger);

// 文本入场 & 轻微视差
document.querySelectorAll('.scene').forEach((sec) => {
  const text = sec.querySelector('.text');
  if (text) {
    gsap.fromTo(text, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: sec, start: 'top 70%', toggleActions: 'play none none reverse' }
    });
  }
  const bg = sec.querySelector('.bg');
  if (bg) {
    gsap.to(bg, {
      scale: 1.0, yPercent: -6, autoAlpha: 1,
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
});

// 顶部进度条
const bar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
  bar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

// ---------- 音频开关 ----------
const ambient = document.getElementById('ambient');
const voiceover = document.getElementById('voiceover');
let audioEnabled = false;

const audioToggle = document.getElementById('audio-toggle');
if (audioToggle) {
  audioToggle.addEventListener('click', async () => {
    if (!audioEnabled) {
      try {
        if (ambient) await ambient.play();
        audioEnabled = true;
        audioToggle.textContent = 'Audio On';
      } catch (e) {}
    } else {
      if (ambient) ambient.pause();
      if (voiceover) voiceover.pause();
      audioEnabled = false;
      audioToggle.textContent = 'Enable Audio';
    }
  });
}

// ---------- gallery 视频弹窗 ----------
const items = document.querySelectorAll('.item');
const modal = document.getElementById('videoModal');
const video = document.getElementById('storyVideo');
const closeBtn = document.getElementById('closeModal');

if (items.length && modal && video && closeBtn) {
  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.video;
      video.src = src || '';
      modal.classList.remove('hidden');
      video.play().catch(()=>{});
    });
  });

  closeBtn.addEventListener('click', () => {
    video.pause();
    modal.classList.add('hidden');
    video.src = "";
  });
}
