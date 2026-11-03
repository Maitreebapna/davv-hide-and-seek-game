// Simple, Reliable Controls for Keyboard & Touch

export class InputManager {
  constructor(vehicle) {
    this.vehicle = vehicle;
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.onTagCallback = null;
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard listeners
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === 'ArrowUp' || key === 'w') this.keys.up = true;
      if (code === 'ArrowDown' || key === 's') this.keys.down = true;
      if (code === 'ArrowLeft' || key === 'a') this.keys.left = true;
      if (code === 'ArrowRight' || key === 'd') this.keys.right = true;

      // Spacebar for manual tag
      if (code === 'Space') {
        e.preventDefault();
        if (this.onTagCallback) this.onTagCallback();
      }

      // H for Horn
      if (key === 'h') {
        this.vehicle.triggerHorn();
      }

      this.updateVisualButtons();
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === 'ArrowUp' || key === 'w') this.keys.up = false;
      if (code === 'ArrowDown' || key === 's') this.keys.down = false;
      if (code === 'ArrowLeft' || key === 'a') this.keys.left = false;
      if (code === 'ArrowRight' || key === 'd') this.keys.right = false;

      this.updateVisualButtons();
    });

    // On-screen buttons (for mouse or touch)
    const bindBtn = (id, prop) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => { e.preventDefault(); this.keys[prop] = true; this.updateVisualButtons(); };
      const end = (e) => { e.preventDefault(); this.keys[prop] = false; this.updateVisualButtons(); };

      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('mouseleave', end);
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
    };

    bindBtn('btn-up', 'up');
    bindBtn('btn-down', 'down');
    bindBtn('btn-left', 'left');
    bindBtn('btn-right', 'right');

    // Horn Button
    const horn = document.getElementById('btn-horn');
    if (horn) {
      horn.addEventListener('click', () => this.vehicle.triggerHorn());
    }

    // Tag Button
    const tag = document.getElementById('btn-tag');
    if (tag) {
      tag.addEventListener('click', () => {
        if (this.onTagCallback) this.onTagCallback();
      });
    }
  }

  updateVisualButtons() {
    this.setActive('btn-up', this.keys.up);
    this.setActive('btn-down', this.keys.down);
    this.setActive('btn-left', this.keys.left);
    this.setActive('btn-right', this.keys.right);
  }

  setActive(id, active) {
    const el = document.getElementById(id);
    if (el) {
      if (active) el.classList.add('active');
      else el.classList.remove('active');
    }
  }

  update() {
    this.vehicle.update(window.davvGame.campusMap, this.keys);

    // Update Speed Display
    const speedEl = document.getElementById('hud-speed-value');
    if (speedEl) {
      const kmh = Math.round(Math.abs(this.vehicle.speed) * 16);
      speedEl.textContent = `${kmh} km/h`;
    }
  }
}
