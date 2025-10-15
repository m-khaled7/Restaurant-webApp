import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  rating?: number;
}

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel   implements AfterViewInit, OnDestroy{
   // --- static slides (replace with your data) ---
  slides: Slide[] = [
    { id: 's1', title: 'Paneer Chilli', price: 100, rating: 4.9, image: 'https://picsum.photos/seed/paneer/800/600' },
    { id: 's2', title: 'Pav Bhaji', price: 80, rating: 4.6, image: 'https://picsum.photos/seed/pav/800/600' },
    { id: 's3', title: 'Hyderabadi Biryani', price: 120, rating: 4.5, image: 'https://picsum.photos/seed/biryani/800/600' },
    { id: 's4', title: 'Veg Noodles', price: 70, rating: 4.3, image: 'https://picsum.photos/seed/noodles/800/600' },
    { id: 's5', title: 'Grilled Sandwich', price: 60, rating: 4.4, image: 'https://picsum.photos/seed/sandwich/800/600' },
    { id: 's6', title: 'Grilled Sandwich', price: 60, rating: 4.4, image: 'https://picsum.photos/seed/sandwich/800/600' },
    { id: 's7', title: 'Grilled Sandwich', price: 60, rating: 4.4, image: 'https://picsum.photos/seed/sandwich/800/600' },
    { id: 's8', title: 'Grilled Sandwich', price: 60, rating: 4.4, image: 'https://picsum.photos/seed/sandwich/800/600' },
    { id: 's9', title: 'Grilled Sandwich', price: 60, rating: 4.4, image: 'https://picsum.photos/seed/sandwich/800/600' }
  ];

  // --- clones / runtime state ---
  displaySlides: Slide[] = []; 
  cloneCount = 0; // equals slidesPerView
  slidesPerView = 3; 
  private autoplayIntervalMs = 3500;
  private autoplayTimer: any = null;
  private isHovered = false;

  // index into displaySlides
  currentIndex = 0;

  // transition control
  transitioning = true;

  // touch / swipe
  private pointerDown = false;
  private startX = 0;
  private currentTranslate = 0;
  private prevTranslate = 0;
  private animationFrameId: number | null = null;
  private swipeThreshold = 50; // pixels to trigger slide change

  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;

  constructor(private ngZone: NgZone, private hostRef: ElementRef) {
    this.updateSlidesPerView();
    this.setupDisplaySlides();
  }

  ngAfterViewInit(): void {
    // start at the first real slide (after clones)
    this.resetToStartPosition();
    this.startAutoplay();
    // listen for window resize to update breakpoints
    window.addEventListener('resize', this.onResize);
    // transitionend listener to handle clone-jump
    this.track.nativeElement.addEventListener('transitionend', this.onTransitionEnd);
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    window.removeEventListener('resize', this.onResize);
    this.track.nativeElement.removeEventListener('transitionend', this.onTransitionEnd);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  // --- breakpoints: 1 / 2 / 3 ---
  private onResize = () => {
    const prev = this.slidesPerView;
    this.updateSlidesPerView();
    if (prev !== this.slidesPerView) {
      // rebuild clones and adjust currentIndex proportionally
      const realIndex = this.getRealIndex(); // 0..n-1
      this.setupDisplaySlides();
      // set currentIndex to new clone offset + realIndex
      this.currentIndex = this.cloneCount + realIndex;
      this.setTransition(false);
      this.updateTrackTransform();
      // small delay to re-enable transitions
      requestAnimationFrame(() => this.setTransition(true));
    }
  };

  private updateSlidesPerView() {
    const w = window.innerWidth;
    if (w < 640) this.slidesPerView = 1;
    else if (w < 1024) this.slidesPerView = 2;
    else this.slidesPerView = 3; // desktop
    this.cloneCount = this.slidesPerView;
  }

  private setupDisplaySlides() {
    // clones: last N at start, first N at end
    const n = this.slidesPerView;
    const frontClones = this.slides.slice(-n);
    const endClones = this.slides.slice(0, n);
    this.displaySlides = [...frontClones, ...this.slides, ...endClones];
    // ensure currentIndex stays valid
    this.currentIndex = n;
  }

  private resetToStartPosition() {
    this.setTransition(false);
    this.updateTrackTransform();
    // re-enable smoothly
    requestAnimationFrame(() => this.setTransition(true));
  }

  // --- transform helpers ---
  private updateTrackTransform() {
    const percent = (this.currentIndex * (100 / this.displaySlides.length));
    // We set transform using translateX by percentage of viewport width per slide.
    // Since each slide has min-width: calc(100% / slidesPerView), we calculate translateX by index * (100 / slidesPerView)%
    const slidePct = 100 / this.slidesPerView;
    const tx = -(this.currentIndex * slidePct);
    this.track.nativeElement.style.transform = `translateX(${tx}%)`;
  }

  private setTransition(enable: boolean) {
    this.transitioning = enable;
    this.track.nativeElement.style.transition = enable ? 'transform 480ms cubic-bezier(.22,.9,.29,1)' : 'none';
  }

  // --- navigation ---
  next() {
    if (this.transitioning === false) this.setTransition(true);
    this.currentIndex++;
    this.updateTrackTransform();
  }

  prev() {
    if (this.transitioning === false) this.setTransition(true);
    this.currentIndex--;
    this.updateTrackTransform();
  }

  // calculate real index (0..slides.length-1)
  getRealIndex(): number {
    const n = this.cloneCount;
    const len = this.slides.length;
    let idx = (this.currentIndex - n) % len;
    if (idx < 0) idx += len;
    return idx;
  }

  // --- handle transition end for clone jump ---
  private onTransitionEnd = () => {
    const n = this.cloneCount;
    const len = this.slides.length;
    // if moved past end clones
    if (this.currentIndex >= len + n) {
      // jump back to the first real slide
      this.setTransition(false);
      this.currentIndex = n;
      this.updateTrackTransform();
      // re-enable transition next frame
      requestAnimationFrame(() => this.setTransition(true));
    }
    // if moved before start clones
    if (this.currentIndex < n) {
      this.setTransition(false);
      this.currentIndex = len + n - 1;
      this.updateTrackTransform();
      requestAnimationFrame(() => this.setTransition(true));
    }
  };

  // --- autoplay ---
  private startAutoplay() {
    this.stopAutoplay();
    this.ngZone.runOutsideAngular(() => {
      this.autoplayTimer = setInterval(() => {
        if (!this.isHovered) {
          this.ngZone.run(() => this.next());
        }
      }, this.autoplayIntervalMs);
    });
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }



  // --- swipe / touch handlers ---
  onPointerDown(event: PointerEvent) {
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.pointerDown = true;
    this.startX = event.clientX;
    this.prevTranslate = this.getCurrentTranslatePx();
    this.stopAutoplay();
    this.setTransition(false);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.pointerDown) return;
    const dx = event.clientX - this.startX;
    const viewportW = this.viewport.nativeElement.offsetWidth;
    const pxTranslate = this.prevTranslate + dx;
    // convert px to percentage translate
    const slidePct = 100 / this.slidesPerView;
    const pxPerPercent = viewportW / (100 / slidePct); // how many px == 1%
    const percent = pxTranslate / pxPerPercent;
    this.track.nativeElement.style.transform = `translateX(${percent}%)`;
    this.currentTranslate = pxTranslate;
  }

  onPointerUp(event: PointerEvent) {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    const dx = event.clientX - this.startX;
    // determine threshold
    if (Math.abs(dx) > this.swipeThreshold) {
      if (dx < 0) this.next();
      else this.prev();
    } else {
      // snap back to current index
      this.setTransition(true);
      this.updateTrackTransform();
    }
    // resume autoplay
    this.startAutoplay();
  }

  // utility: approximate current translate in px based on currentIndex
  private getCurrentTranslatePx(): number {
    // compute current translate px corresponding to currentIndex
    const viewportW = this.viewport.nativeElement.offsetWidth;
    const slidePct = 100 / this.slidesPerView;
    const txPct = -(this.currentIndex * slidePct);
    const px = (txPct / 100) * viewportW;
    return px;
  }

  // keyboard navigation
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.prev();
    if (e.key === 'ArrowRight') this.next();
  }

}
