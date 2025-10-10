// GSAP
gsap.registerPlugin(ScrollTrigger);

// Intro animations per scene
document.querySelectorAll('.scene').forEach((sec) => {
  const text = sec.querySelector('.text');
  if (text) {
    gsap.fromTo(text, {y:24, opacity:0}, {
      y:0, opacity:1, duration:.9, ease:'power2.out',
      scrollTrigger:{trigger:sec, start:'top 70%', toggleActions:'play none none reverse'}
    });
  }
  const title = sec.querySelector('.title');
  if (title) {
    gsap.to(title, {opacity:1, y:0, duration:.8, delay:.05,
      scrollTrigger:{trigger:sec, start:'top 72%', toggleActions:'play none none reverse'}
    });
  }
  const bg = sec.querySelector('.bg');
  if (bg) {
    gsap.to(bg, {scale:1.0, yPercent:-6, autoAlpha:1,
      scrollTrigger:{trigger:sec, start:'top bottom', end:'bottom top', scrub:true}
    });
  }
});

// Progress bar
const bar = document.getElementById('progress-bar');
function updateProgress(){
  const st = window.scrollY || document.documentElement.scrollTop;
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  bar && (bar.style.width = Math.min(100, Math.max(0, (st/dh)*100)) + '%');
}
window.addEventListener('scroll', updateProgress); updateProgress();

// Audio logic
const ambient = document.getElementById('ambient');
const voiceover = document.getElementById('voiceover');
let audioEnabled = false;
const audioToggle = document.getElementById('audio-toggle');
if (audioToggle){
  audioToggle.addEventListener('click', async () => {
    if (!audioEnabled){
      try { await ambient.play(); audioEnabled = true; audioToggle.textContent = 'Audio On'; }
      catch(e){}
    } else {
      ambient.pause(); voiceover.pause(); audioEnabled = false; audioToggle.textContent = 'Enable Audio';
    }
  });
}

// Gallery modal video (only if exists)
(function(){
  const items = document.querySelectorAll('.item');
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('storyVideo');
  const closeBtn = document.getElementById('closeModal');
  if (!items.length || !modal || !video || !closeBtn) return;

  items.forEach(item=>{
    item.addEventListener('click', ()=>{
      const src = item.dataset.video;
      if (!src) return;
      video.src = src;
      modal.classList.remove('hidden');
      video.play().catch(()=>{});
    });
  });
  closeBtn.addEventListener('click', ()=>{
    video.pause(); modal.classList.add('hidden'); video.src = '';
  });
  modal.addEventListener('click', (e)=>{
    if (e.target === modal){ video.pause(); modal.classList.add('hidden'); video.src = ''; }
  });
})();
