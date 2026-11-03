// Game Controller: Super Easy Auto-Catch & Smooth Driving
import { FRIENDS_LIST, VEHICLES } from './constants.js';
import { CampusMap } from './campusMap.js';
import { Vehicle } from './vehicle.js';
import { HiderAgent } from './hiderAI.js';
import { InputManager } from './controls.js';
import { RadarSystem } from './radar.js';
import { sound } from './audio.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.state = 'LOBBY';
    this.dennerId = 'maitree';
    this.vehicleType = 'car';

    this.campusMap = new CampusMap();
    this.vehicle = null;
    this.inputManager = null;
    this.radar = new RadarSystem(170, 120);

    this.friends = [];
    this.outQueue = [];
    this.dennerFriend = null;

    this.countdownSeconds = 10;
    this.countdownTimer = null;
    this.startTime = 0;
    this.elapsedSeconds = 0;
    this.gameTimer = null;
    this.victoryTimer = null;

    this.camera = { x: 2700, y: 360 };

    this.initCanvasResize();
    this.setupLobbyUI();
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initCanvasResize() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  setupLobbyUI() {
    const listContainer = document.getElementById('friends-selection-grid');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    FRIENDS_LIST.forEach(f => {
      const chip = document.createElement('button');
      chip.className = `friend-chip ${f.id === this.dennerId ? 'active' : ''}`;
      chip.textContent = f.name;
      chip.addEventListener('click', () => {
        this.dennerId = f.id;
        document.querySelectorAll('.friend-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.updateDennerDisplay();
      });
      listContainer.appendChild(chip);
    });

    // Vehicle cards
    document.querySelectorAll('.vehicle-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.vehicleType = card.dataset.vehicle;
      });
    });

    // Start Button
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startCountdown());
    }

    // Audio toggle
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const muted = sound.toggleMute();
        muteBtn.textContent = muted ? 'Sound: Off' : 'Sound: On';
      });
    }

    this.updateDennerDisplay();
  }

  updateDennerDisplay() {
    const denner = FRIENDS_LIST.find(f => f.id === this.dennerId) || FRIENDS_LIST[0];
    const el = document.getElementById('denner-label');
    if (el) el.textContent = denner.name;
  }

  startCountdown() {
    clearTimeout(this.victoryTimer);
    sound.init();
    this.state = 'COUNTDOWN';
    this.countdownSeconds = 10;
    this.elapsedSeconds = 0;
    this.outQueue = [];

    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-hud').style.display = 'block';
    document.getElementById('countdown-screen').style.display = 'flex';
    document.getElementById('hud-time').textContent = '00:00';

    this.dennerFriend = FRIENDS_LIST.find(f => f.id === this.dennerId) || FRIENDS_LIST[0];
    this.vehicle = new Vehicle(this.vehicleType, 2700, 360, Math.PI);

    this.inputManager = new InputManager(this.vehicle);
    this.inputManager.onTagCallback = () => this.checkManualTag();

    // Spawn 11 friends at Gate 1
    this.friends = FRIENDS_LIST
      .filter(f => f.id !== this.dennerId)
      .map(f => {
        const agent = new HiderAgent(f, 2680 + (Math.random() - 0.5) * 40, 360 + (Math.random() - 0.5) * 40);
        agent.state = 'countdown_scatter';
        return agent;
      });

    this.updateScoreUI();

    const countDigit = document.getElementById('countdown-digits');
    if (countDigit) countDigit.textContent = '10';
    sound.playCountdownTick(10);

    this.countdownTimer = setInterval(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds > 0) {
        if (countDigit) countDigit.textContent = this.countdownSeconds;
        sound.playCountdownTick(this.countdownSeconds);
      } else {
        clearInterval(this.countdownTimer);
        this.startSeeking();
      }
    }, 1000);
  }

  startSeeking() {
    this.state = 'SEEKING';
    document.getElementById('countdown-screen').style.display = 'none';
    sound.playCountdownGo();
    sound.startEngine(this.vehicleType);

    this.startTime = Date.now();
    this.gameTimer = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      const timerEl = document.getElementById('hud-time');
      if (timerEl) {
        const m = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
        const s = String(this.elapsedSeconds % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
      }
    }, 1000);
  }

  // AUTO-CATCH: Touch or get near friends to catch them!
  checkProximityCatch() {
    if (this.state !== 'SEEKING' || !this.vehicle) return;

    this.friends.forEach(f => {
      if (!f.isCaught) {
        const dist = Math.hypot(f.x - this.vehicle.x, f.y - this.vehicle.y);
        // Generous catch radius (~72px): just drive up to them!
        if (dist < 72) {
          this.catchFriend(f);
        }
      }
    });
  }

  checkManualTag() {
    if (this.state !== 'SEEKING' || !this.vehicle) return;

    this.friends.forEach(f => {
      if (!f.isCaught) {
        const dist = Math.hypot(f.x - this.vehicle.x, f.y - this.vehicle.y);
        if (dist < 85) {
          this.catchFriend(f);
        }
      }
    });
  }

  catchFriend(friend) {
    if (this.state !== 'SEEKING' || friend.isCaught) return;
    friend.tag();
    this.outQueue.push(friend);
    this.updateScoreUI();
    this.showCatchToast(friend);

    const remaining = this.friends.filter(f => !f.isCaught);
    if (remaining.length <= 1) {
      const winner = remaining[0] || this.dennerFriend;
      this.state = 'ENDING';
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      clearInterval(this.gameTimer);
      const minutes = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
      const seconds = String(this.elapsedSeconds % 60).padStart(2, '0');
      document.getElementById('hud-time').textContent = `${minutes}:${seconds}`;
      this.victoryTimer = setTimeout(() => {
        this.triggerVictory(winner, remaining.length === 1);
      }, 1200);
    }
  }

  updateScoreUI() {
    const caught = this.friends.filter(f => f.isCaught).length;
    const scoreEl = document.getElementById('hud-score');
    if (scoreEl) {
      scoreEl.textContent = `${caught} / ${this.friends.length} Caught`;
    }

    const queue = document.getElementById('out-queue');
    const queueCount = document.getElementById('out-queue-count');
    const queueList = document.getElementById('out-queue-list');
    if (queue && queueCount && queueList) {
      queue.style.display = this.outQueue.length ? 'block' : 'none';
      queueCount.textContent = String(this.outQueue.length);
      queueList.replaceChildren(...this.outQueue.map(friend => {
        const row = document.createElement('li');
        row.className = 'out-queue-player';

        const avatar = document.createElement('span');
        avatar.className = 'out-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.style.setProperty('--friend-color', friend.color);

        const name = document.createElement('span');
        name.className = 'out-player-name';
        name.textContent = friend.name;

        const status = document.createElement('span');
        status.className = 'out-player-status';
        status.textContent = 'OUT';

        row.append(avatar, name, status);
        return row;
      }));
    }
  }

  showCatchToast(friend) {
    const toast = document.getElementById('catch-toast');
    if (!toast) return;

    toast.innerHTML = `
      <div class="toast-name">🎉 Caught ${friend.name}!</div>
      <div class="toast-quote">"${friend.quote}"</div>
    `;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  triggerVictory(winner, lastHiderWon) {
    if (this.state === 'VICTORY') return;
    this.state = 'VICTORY';
    sound.stopEngine();
    sound.playVictory();
    clearInterval(this.gameTimer);

    const modal = document.getElementById('victory-screen');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('vic-title').textContent = lastHiderWon ? 'Last Hider Wins!' : 'Denner Wins!';
      document.getElementById('vic-sub').textContent = lastHiderWon
        ? `${winner.name} stayed hidden the longest!`
        : `${winner.name} found every hider!`;
      document.getElementById('vic-winner').textContent = winner.name;
      document.getElementById('vic-time').textContent = `${this.elapsedSeconds} seconds`;
      document.getElementById('vic-denner').textContent = this.dennerFriend.name;
    }

    const againBtn = document.getElementById('btn-play-again');
    if (againBtn) {
      againBtn.onclick = () => {
        modal.style.display = 'none';
        this.startCountdown();
      };
    }

    const cancelBtn = document.getElementById('btn-cancel-game');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        modal.style.display = 'none';
        document.getElementById('game-hud').style.display = 'none';
        document.getElementById('lobby-screen').style.display = 'flex';
        this.state = 'LOBBY';
      };
    }
  }

  gameLoop(timestamp) {
    this.lastFrameTime = timestamp;

    if (this.state === 'COUNTDOWN') {
      this.friends.forEach(f => f.update(this.vehicle, this.campusMap));
    } else if (this.state === 'SEEKING') {
      if (this.inputManager) this.inputManager.update();
      this.friends.forEach(f => f.update(this.vehicle, this.campusMap));
      this.checkProximityCatch();
    }

    // Camera smoothly follows vehicle
    if (this.vehicle) {
      this.camera.x += (this.vehicle.x - this.camera.x) * 0.12;
      this.camera.y += (this.vehicle.y - this.camera.y) * 0.12;
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'LOBBY') {
      const time = Date.now() * 0.0002;
      const camX = 2150 + Math.cos(time) * 150;
      const camY = 650 + Math.sin(time) * 100;

      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(0.9, 0.9);
      this.ctx.translate(-camX, -camY);
      this.campusMap.render(this.ctx, this.camera);
      this.ctx.restore();
      return;
    }

    // In-Game Canvas
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.campusMap.render(this.ctx, this.camera);
    this.friends.forEach(f => f.render(this.ctx));
    if (this.vehicle) this.vehicle.render(this.ctx);

    this.ctx.restore();

    // Minimap Radar
    if (this.state === 'SEEKING' && this.vehicle) {
      this.radar.render(this.ctx, this.vehicle, this.friends);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.davvGame = new Game();
});
