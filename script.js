// 进度条（可留）
const bar = document.getElementById('progress-bar');
function updateProgress() {
  const t = window.scrollY || document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  bar && (bar.style.width = Math.min(100, Math.max(0, (t / h) * 100)) + '%');
}
window.addEventListener('scroll', updateProgress); updateProgress();

// 音频开关（可留）
const ambient = document.getElementById('ambient');
const voiceover = document.getElementById('voiceover');
const audioToggle = document.getElementById('audio-toggle');
let audioEnabled = false;
audioToggle && audioToggle.addEventListener('click', async () => {
  if (!audioEnabled) {
    try { await ambient.play(); audioEnabled = true; audioToggle.textContent = 'Audio On'; } catch(e){}
  } else {
    ambient && ambient.pause(); voiceover && voiceover.pause();
    audioEnabled = false; audioToggle.textContent = 'Enable Audio';
  }
});

// gallery 页面的视频弹窗
const items = document.querySelectorAll('.item');
const modal = document.getElementById('videoModal');
const video = document.getElementById('storyVideo');
const closeBtn = document.getElementById('closeModal');

if (items.length && modal && video && closeBtn) {
  items.forEach(it => {
    it.addEventListener('click', () => {
      const src = it.dataset.video;
      if (!src) return;
      video.src = src;
      modal.classList.remove('hidden');
      video.play().catch(()=>{});
    });
  });
  closeBtn.addEventListener('click', () => {
    video.pause(); modal.classList.add('hidden'); video.src = "";
  });
}
