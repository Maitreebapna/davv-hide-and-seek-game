// Friends AI: Friendly, easy to find, and fun to catch!
import { HIDING_SPOTS, SPECTATOR_ZONE } from './constants.js';
import { sound } from './audio.js';

export class HiderAgent {
  constructor(friendData, startX = 2700, startY = 380) {
    this.id = friendData.id;
    this.name = friendData.name;
    this.color = friendData.color;
    this.hair = friendData.hair;
    this.quote = friendData.quote;
    this.favZone = friendData.favSpot;

    this.x = startX;
    this.y = startY;
    this.angle = Math.random() * Math.PI * 2;
    this.state = 'hiding';

    this.targetX = startX;
    this.targetY = startY;
    this.speed = 1.4; // Relaxed speed so anyone can catch them easily

    this.isCaught = false;
    this.caughtTime = null;
    this.radius = 14;

    this.speech = '';
    this.speechTimer = 0;

    this.assignHidingSpot();
  }

  assignHidingSpot() {
    const matching = HIDING_SPOTS.filter(s => s.zone === this.favZone);
    const chosen = matching.length > 0
      ? matching[Math.floor(Math.random() * matching.length)]
      : HIDING_SPOTS[Math.floor(Math.random() * HIDING_SPOTS.length)];

    this.targetX = chosen.x + (Math.random() - 0.5) * 30;
    this.targetY = chosen.y + (Math.random() - 0.5) * 30;
  }

  say(msg, ms = 2500) {
    this.speech = msg;
    this.speechTimer = Date.now() + ms;
  }

  tag() {
    if (this.isCaught) return false;
    this.isCaught = true;
    this.state = 'caught';
    this.caughtTime = Date.now();
    this.say(this.quote, 3500);
    sound.playCatch();

    // After 2 seconds, walk over to the Indian Coffee House to relax
    setTimeout(() => {
      this.state = 'spectating';
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 45;
      this.targetX = SPECTATOR_ZONE.x + Math.cos(angle) * dist;
      this.targetY = SPECTATOR_ZONE.y + Math.sin(angle) * dist;
    }, 2000);

    return true;
  }

  update(vehicle, campusMap) {
    if (this.speechTimer > 0 && Date.now() > this.speechTimer) {
      this.speech = '';
      this.speechTimer = 0;
    }

    // 1. Initial 10-second scatter to hiding spot
    if (this.state === 'countdown_scatter') {
      this.moveTowards(this.targetX, this.targetY, 4.0);
      if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 15) {
        this.state = 'hiding';
      }
      return;
    }

    // 2. Walking to Indian Coffee House once caught
    if (this.state === 'spectating') {
      this.moveTowards(this.targetX, this.targetY, 1.2);
      return;
    }

    if (this.state === 'caught') return;

    // 3. Gentle reaction if car gets very close
    const distToCar = Math.hypot(vehicle.x - this.x, vehicle.y - this.y);
    if (distToCar < 120 && Math.abs(vehicle.speed) > 1.5) {
      if (this.state !== 'jogging') {
        this.state = 'jogging';
        this.say('Arey bhago!', 1500);
        // Jog slightly away
        const angleAway = Math.atan2(this.y - vehicle.y, this.x - vehicle.x);
        this.targetX = this.x + Math.cos(angleAway) * 140;
        this.targetY = this.y + Math.sin(angleAway) * 140;
      }
    }

    if (this.state === 'jogging') {
      this.moveTowards(this.targetX, this.targetY, 1.6);
      if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 20 || distToCar > 220) {
        this.state = 'hiding';
      }
    }
  }

  moveTowards(tx, ty, spd) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) return;

    this.angle = Math.atan2(dy, dx);
    this.x += Math.cos(this.angle) * spd;
    this.y += Math.sin(this.angle) * spd;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(1, 3, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = this.hair;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.isCaught ? `${this.name} (Out)` : this.name, 0, -14);
    ctx.shadowBlur = 0;

    // Speech bubble
    if (this.speech) {
      const w = ctx.measureText(this.speech).width + 14;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -38, w, 20, 6);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(this.speech, 0, -24);
    }

    ctx.restore();
  }
}
