class SlideDown extends HTMLElement {
  contentHeight = 0;

  resizeObserver = new ResizeObserver((entries) => {
    if (!this.classList.contains('hidden')) {
      this.contentHeight = entries[0].contentRect.height;
      console.log(`Sliding to ${this.contentHeight}px`);

      if (this.classList.contains('is-opening')) {
        this.style.height = `${this.contentHeight}px`;
      }
    }
  });

  constructor() {
    super();

    this.style.overflowY = 'hidden';
    this.style.display = 'block';

    const duration = this.hasAttribute('transition-duration') ? this.getAttribute('transition-duration') : '0.2s';
    const animationFunc = this.hasAttribute('transition-function') ? this.getAttribute('transition-function') : 'ease-in-out';
    this.style.transition = `height ${duration} ${animationFunc}`;

    if (this.classList.contains('hidden')) {
      this.style.height = '0';
      this.style.display = 'none';
    }

    this.innerHTML = `<div style="overflow: auto">${this.innerHTML}</div>`;
    this.addEventListener('transitionend', this.handleTransitionEnd);
    this.resizeObserver.observe(this.children[0]);
  }

  open() {
    if (this.classList.contains('is-closing')) {
      this.classList.remove('is-closing');
      this.classList.add('is-opening');
      this.style.height = `${this.contentHeight}px`;
    }

    if (this.classList.contains('hidden')) {
      this.classList.remove('hidden');
      this.classList.add('is-opening');
      this.style.height = '0';
      this.style.display = 'block';
      // the resize observer will notice the measuring container is resized, and when that happens, the height will
      // change for the slide down container.
    }
  }

  close() {
    if (this.classList.contains('hidden') || this.classList.contains('is-closing')) {
      return;
    }

    this.classList.remove('is-opening');
    this.classList.add('is-closing');
    this.style.height = `${this.contentHeight}px`;
    requestAnimationFrame(() => this.style.height = '0');
  }

  isOpen() {
    return !this.classList.contains('hidden') && !this.classList.contains('is-closing');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  handleTransitionEnd() {
    if (this.classList.contains('is-closing')) {
      this.classList.remove('is-closing');
      this.classList.add('hidden');
      this.style.display = 'none';
    } else if (this.classList.contains('is-opening')) {
      this.classList.remove('is-opening');
      this.style.removeProperty('height');
    }
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }
}

if ('customElements' in window) {
  customElements.define('slide-down', SlideDown);
}
