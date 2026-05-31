gsap.registerPlugin(ScrollTrigger);

const heroScroll = document.getElementById('heroScroll');
const heroWrap = document.getElementById('heroWrap');
const heroPin = document.getElementById('heroPin');
const heroStage = document.getElementById('heroStage');
const heroVideoShell = document.getElementById('heroVideoShell');
const heroIntro = document.getElementById('heroIntro');
const heroDim = document.querySelector('.hero__dim');
const siteHeader = document.getElementById('siteHeader');
const aboutText = document.getElementById('aboutText');
const heroCopiesEl = document.getElementById('heroCopies');
const copies = gsap.utils.toArray('.hero__copy');
const video = document.getElementById('heroVideo');
const worldVideo = document.getElementById('worldVideo');

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let copyCycleStarted = false;
let copyCycleTimeline = null;
let copyIndex = 0;
let copyTransitionTween = null;
let copyStopTween = null;
const COPY_HOLD_TIME = 3.5;
const COPY_FADE = 0.55;
const COPY_VISIBLE_OPACITY = 0.8;
const COPY_HOLD = 0.22;
let heroMainTimeline = null;
let lastHeaderMode = '';
let heroStartClipPath = '';

function heroGrowEnd() {
  return isPcViewport() ? 0.65 : 0.58;
}

function heroTimelineTotal() {
  return heroGrowEnd() + COPY_HOLD;
}

function getFullscreenAt() {
  const total = heroMainTimeline?.duration() || heroTimelineTotal();
  return heroGrowEnd() / total;
}

function keepCopiesVisible() {
  heroPin?.classList.add('is-copies-on', 'is-hero-expanded');
  heroVideoShell?.classList.add('is-copies-on', 'is-expanded');
}

function killCopyTweens() {
  gsap.killTweensOf([heroCopiesEl, ...copies]);
}

function getHeroSizes() {
  const vw = window.innerWidth;

  if (vw <= 480) {
    return { stage1: { width: 275, height: 420, radius: 30 } };
  }

  if (vw <= 800) {
    return { stage1: { width: 600, height: 360, radius: 60 } };
  }

  const contentMax = vw - 128;

  return {
    stage1: {
      width: Math.min(1000, contentMax),
      height: 600,
      radius: 60,
    },
  };
}

function getHeroGap() {
  const vw = window.innerWidth;
  if (vw <= 480) return 12;
  if (vw <= 800) return 16;
  return 20;
}

function measureHeroVideoTop() {
  if (!heroPin) return 400;

  const textEl = heroIntro?.querySelector('.hero__text') || heroIntro;
  if (!textEl) return 400;

  const pinRect = heroPin.getBoundingClientRect();
  const textRect = textEl.getBoundingClientRect();

  return Math.max(0, textRect.bottom - pinRect.top + getHeroGap());
}

function getClipInset() {
  const { stage1 } = getHeroSizes();
  const videoTop = measureHeroVideoTop();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return {
    top: videoTop,
    right: Math.max(0, (vw - stage1.width) / 2),
    bottom: Math.max(0, vh - videoTop - stage1.height),
    left: Math.max(0, (vw - stage1.width) / 2),
    radius: stage1.radius,
  };
}

function clipPathFromInset({ top, right, bottom, left, radius }) {
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
}

function isPcViewport() {
  return window.innerWidth > 800;
}

function isCopyModeActive() {
  return copyCycleStarted || Boolean(heroPin?.classList.contains('is-copies-on'));
}

function setCopyInstant(index) {
  copyIndex = index;
  copies.forEach((c, i) => {
    const on = i === index;
    c.classList.toggle('is-active', on);
    gsap.set(c, {
      opacity: on ? COPY_VISIBLE_OPACITY : 0,
      visibility: on ? 'visible' : 'hidden',
    });
  });
}

function transitionCopy(nextIndex) {
  if (nextIndex === copyIndex || !copies.length) return;

  copyTransitionTween?.kill();

  if (prefersReducedMotion) {
    setCopyInstant(nextIndex);
    return;
  }

  const current = copies[copyIndex];
  const next = copies[nextIndex];

  next.classList.add('is-active');
  gsap.set(next, { visibility: 'visible', opacity: 0 });

  copyTransitionTween = gsap
    .timeline({
      onComplete: () => {
        current.classList.remove('is-active');
        copyIndex = nextIndex;
        copyTransitionTween = null;
      },
    })
    .to(current, { opacity: 0, duration: COPY_FADE, ease: 'power2.inOut' })
    .set(current, { visibility: 'hidden' })
    .to(
      next,
      { opacity: COPY_VISIBLE_OPACITY, duration: COPY_FADE, ease: 'power2.inOut' },
      `-=${COPY_FADE * 0.35}`
    );
}

function buildCopyCycleTimeline() {
  const tl = gsap.timeline({ repeat: -1, paused: true });

  copies.forEach((_, i) => {
    const nextIndex = (i + 1) % copies.length;
    tl.to({}, { duration: COPY_HOLD_TIME });
    tl.call(() => transitionCopy(nextIndex));
  });

  return tl;
}

function fadeInFirstCopy() {
  if (!copies.length) return;

  killCopyTweens();
  copies.forEach((c) => c.classList.remove('is-active'));
  copies[0].classList.add('is-active');
  setCopyInstant(0);
  if (heroCopiesEl) gsap.set(heroCopiesEl, { opacity: 1 });
}

function resetHeroCopies() {
  copyTransitionTween?.kill();
  copyTransitionTween = null;
  copyStopTween?.kill();
  copyStopTween = null;
  copyCycleTimeline?.kill();
  copyCycleTimeline = null;
  killCopyTweens();

  copyCycleStarted = false;
  copyIndex = 0;
  heroPin?.classList.remove('is-copies-on', 'is-hero-expanded');
  heroVideoShell?.classList.remove('is-copies-on', 'is-expanded');
  copies.forEach((c) => {
    c.classList.remove('is-active');
    gsap.set(c, { clearProps: 'opacity,visibility' });
  });
  if (heroCopiesEl) gsap.set(heroCopiesEl, { clearProps: 'opacity' });
  if (heroDim) gsap.set(heroDim, { clearProps: 'opacity' });
}

function cacheHeroStartClip() {
  heroStartClipPath = clipPathFromInset(getClipInset());
}

function syncHeroStartClipCss() {
  cacheHeroStartClip();
  heroScroll?.style.setProperty('--hero-start-clip', heroStartClipPath);
}

function setupHeroShellStatic() {
  if (!heroVideoShell) return;

  gsap.set(heroVideoShell, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  });
  gsap.set(heroStage, { visibility: 'visible', autoAlpha: 1 });
  gsap.set(heroIntro, { visibility: 'visible', y: 0 });
  gsap.set(heroDim, { opacity: 0 });
}

function isPastHeroSection() {
  return heroScroll && heroScroll.getBoundingClientRect().bottom <= 0;
}

function isHeroAtStart(progress) {
  return (
    !isPastHeroSection() &&
    (window.scrollY <= 2 || progress <= 0.02)
  );
}

function setHeroAtStart(on) {
  if (!heroScroll || !heroVideoShell) return;

  heroScroll.classList.toggle('is-at-start', on);

  if (on) {
    if (heroIntro) heroIntro.style.opacity = '1';
    syncHeroStartClipCss();
    gsap.killTweensOf([heroVideoShell, heroIntro]);
    gsap.set(heroVideoShell, { clearProps: 'clipPath' });
    gsap.set(heroIntro, { clearProps: 'opacity' });
    heroVideoShell.style.clipPath = heroStartClipPath;
    return;
  }

  heroVideoShell.style.removeProperty('clip-path');
  if (heroIntro) heroIntro.style.removeProperty('opacity');
}

function resetHeroToStart() {
  resetHeroCopies();
  setHeroAtStart(true);
  lastHeaderMode = '';
  setHeaderMode('top');
}

function startCopyCycle() {
  if (!copies.length) return;

  keepCopiesVisible();

  if (copyCycleStarted) return;

  copyCycleStarted = true;
  fadeInFirstCopy();

  if (copies.length <= 1) return;

  copyCycleTimeline = buildCopyCycleTimeline();
  copyCycleTimeline.play(0);
}

function setHeaderMode(mode) {
  if (!siteHeader || mode === lastHeaderMode) return;
  lastHeaderMode = mode;

  siteHeader.classList.remove('is-dark', 'is-glass', 'is-top', 'is-over-video');

  if (mode === 'glass') {
    siteHeader.classList.add('is-glass');
  } else if (mode === 'glass-video') {
    siteHeader.classList.add('is-glass', 'is-over-video');
  } else {
    siteHeader.classList.add('is-top');
  }
}

/** 맨 위 = is-at-start / 히어로 안 = syncHeroUI / 히어로 밖 = glass(검은 글자) */
function syncHeroUI(progress) {
  if (isPastHeroSection()) {
    setHeaderMode('glass');
    return;
  }

  const fullAt = getFullscreenAt();

  if (isHeroAtStart(progress)) {
    resetHeroToStart();
    return;
  }

  setHeroAtStart(false);

  if (progress >= fullAt - 0.005) {
    startCopyCycle();
    setHeaderMode('glass-video');
    return;
  }

  if (isCopyModeActive()) {
    resetHeroCopies();
  }
  setHeaderMode('top');
}

function updateOnScroll() {
  if (!heroScroll) return;

  if (isPastHeroSection()) {
    setHeaderMode('glass');
    return;
  }

  const progress = heroMainTimeline?.scrollTrigger?.progress ?? 0;

  if (isHeroAtStart(progress)) {
    resetHeroToStart();
    return;
  }

  syncHeroUI(progress);
}

function refreshHeaderState() {
  updateOnScroll();
}

function primeHeroShell() {
  heroPin?.classList.remove('is-copies-on', 'is-hero-expanded');
  heroVideoShell?.classList.remove('is-expanded', 'is-copies-on');

  gsap.set(heroVideoShell, {
    clearProps: 'position,top,left,width,height,zIndex,transform,clipPath',
  });

  if (heroStage) {
    gsap.set(heroStage, { clearProps: 'opacity,visibility,autoAlpha' });
  }

  if (heroIntro) {
    gsap.set(heroIntro, { clearProps: 'opacity,visibility,autoAlpha,y' });
  }

  if (heroDim) {
    gsap.set(heroDim, { clearProps: 'opacity' });
  }
}

function layoutHeroAtStart() {
  setupHeroShellStatic();
  setHeroAtStart(true);
}

function markHeroLayoutReady() {
  heroScroll?.classList.add('is-layout-ready');
}

function buildHeroScrollTimeline() {
  const growEnd = heroGrowEnd();
  cacheHeroStartClip();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        syncHeroStartClipCss();
        if (isPastHeroSection()) {
          setHeaderMode('glass');
          return;
        }
        syncHeroUI(self?.progress ?? 0);
      },
      onUpdate: (self) => syncHeroUI(self.progress),
      onLeave: () => {
        setHeroAtStart(false);
        resetHeroCopies();
        setHeaderMode('glass');
      },
      onEnterBack: (self) => {
        syncHeroUI(self.progress);
      },
    },
  });

  tl.fromTo(
    heroVideoShell,
    { clipPath: heroStartClipPath },
    {
      clipPath: 'inset(0px 0px 0px 0px round 0px)',
      duration: growEnd,
      ease: 'power2.inOut',
      immediateRender: false,
    },
    0
  );

  if (heroIntro) {
    tl.to(heroIntro, { opacity: 0, duration: growEnd, ease: 'power2.inOut' }, 0);
  }

  tl.to({}, { duration: COPY_HOLD }, growEnd);

  return tl;
}

function initHeroAnimation() {
  heroMainTimeline?.scrollTrigger?.kill();
  heroMainTimeline?.kill();
  heroMainTimeline = null;
  lastHeaderMode = '';

  primeHeroShell();
  resetHeroCopies();

  if (!heroWrap || !heroVideoShell || prefersReducedMotion) {
    setHeaderMode('glass-video');
    heroPin?.classList.add('is-hero-expanded', 'is-copies-on');
    heroVideoShell?.classList.add('is-expanded', 'is-copies-on');
    if (heroStage) gsap.set(heroStage, { autoAlpha: 0 });
    if (heroDim) gsap.set(heroDim, { opacity: 1 });
    gsap.set(heroVideoShell, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      clipPath: 'inset(0px 0px 0px 0px round 0px)',
    });
    startCopyCycle();
    markHeroLayoutReady();
    return;
  }

  layoutHeroAtStart();
  setHeaderMode('top');
  heroMainTimeline = buildHeroScrollTimeline();
  syncHeroUI(heroMainTimeline.scrollTrigger?.progress ?? 0);
  markHeroLayoutReady();
}

function initAboutReveal() {
  if (!aboutText) return;

  gsap.set(aboutText, { opacity: 0.1 });

  if (prefersReducedMotion) {
    gsap.set(aboutText, { opacity: 1 });
    return;
  }

  gsap.to(aboutText, {
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 90%',
      end: 'top 35%',
      scrub: 0.6,
    },
  });
}

function bindMarqueePause(list, container) {
  if (!list || !container) return;

  const pause = () => { list.style.animationPlayState = 'paused'; };
  const play = () => { list.style.animationPlayState = 'running'; };

  container.addEventListener('mouseenter', pause);
  container.addEventListener('mouseleave', play);
  container.addEventListener('touchstart', pause, { passive: true });
  container.addEventListener('touchend', play, { passive: true });
}

function initTestiRoll() {
  bindMarqueePause(
    document.querySelector('.testi-list'),
    document.querySelector('.testi-roll')
  );
}

function playMutedVideo(el) {
  if (!el) return;
  el.play().catch(() => {
    document.addEventListener('click', () => el.play(), { once: true });
  });
}

function syncWorldVideo() {
  if (!worldVideo) return;

  if (window.innerWidth > 800) {
    playMutedVideo(worldVideo);
  } else {
    worldVideo.pause();
  }
}

if (video) playMutedVideo(video);

let resizeTimer = null;
let lastViewportWidth = window.innerWidth;

function handleViewportChange() {
  const w = window.innerWidth;
  const breakpointCrossed =
    (lastViewportWidth <= 480) !== (w <= 480) ||
    (lastViewportWidth <= 800) !== (w <= 800) ||
    (lastViewportWidth > 800) !== (w > 800);

  lastViewportWidth = w;

  if (breakpointCrossed) {
    initHeroAnimation();
    syncWorldVideo();
    refreshHeaderState();
    return;
  }

  const progress = heroMainTimeline?.scrollTrigger?.progress ?? 0;
  if (isHeroAtStart(progress)) {
    layoutHeroAtStart();
  }
  ScrollTrigger.refresh();
  syncHeroUI(progress);
}

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleViewportChange, 200);
});

let headerTick = false;
window.addEventListener(
  'scroll',
  () => {
    if (headerTick) return;
    headerTick = true;
    requestAnimationFrame(() => {
      updateOnScroll();
      headerTick = false;
    });
  },
  { passive: true }
);

function bootHero() {
  initHeroAnimation();
  initAboutReveal();
  initTestiRoll();
  syncWorldVideo();
  ScrollTrigger.refresh();
  refreshHeaderState();
}

if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    requestAnimationFrame(bootHero);
  });
} else {
  window.addEventListener('load', bootHero, { once: true });
}
