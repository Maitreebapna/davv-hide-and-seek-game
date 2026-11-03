// Clean Minimalist Radar & Minimap System for DAVV Campus
import { MAP_WIDTH, MAP_HEIGHT, LANDMARKS, SPECTATOR_ZONE } from './constants.js';

export class RadarSystem {
  constructor(canvasWidth = 190, canvasHeight = 135) {
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.scaleX = this.w / MAP_WIDTH;
    this.scaleY = this.h / MAP_HEIGHT;
    this.sweepAngle = 0;
  }

  render(ctx, vehicle, friends) {
    let minDistance = Infinity;

    friends.forEach(f => {
      if (!f.isCaught && f.state !== 'spectating') {
        const d = Math.hypot(f.x - vehicle.x, f.y - vehicle.y);
        if (d < minDistance) minDistance = d;
      }
    });

    this.renderMinimap(ctx, vehicle, friends);
    this.renderProximityIndicator(ctx, minDistance);
  }

  renderMinimap(ctx, vehicle, friends) {
    const margin = 16;
    const mx = window.innerWidth - this.w - margin;
    const my = margin;

    ctx.save();
    ctx.translate(mx, my);

    // Clean Dark Map Container
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Subtle Grass Ground
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(3, 3, this.w - 6, this.h - 6, 6);
    ctx.fill();

    // Simplified Building Footprints
    LANDMARKS.forEach(lm => {
      const bx = lm.x * this.scaleX;
      const by = lm.y * this.scaleY;
      const bw = (lm.width || 200) * this.scaleX;
      const bh = (lm.height || 140) * this.scaleY;

      ctx.fillStyle = lm.id === 'ich' ? '#f59e0b' : '#334155';
      ctx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);

      // Clean label
      if (lm.id === 'ich') {
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 7px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ICH', bx, by + 2.5);
      }
    });

    // Spectator Patio Outline
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(SPECTATOR_ZONE.x * this.scaleX, SPECTATOR_ZONE.y * this.scaleY, SPECTATOR_ZONE.radius * this.scaleX, 0, Math.PI * 2);
    ctx.stroke();

    // Caught friends at ICH (small grey dots)
    friends.forEach(f => {
      if (f.isCaught) {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(f.x * this.scaleX, f.y * this.scaleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Denner Vehicle Indicator (Clean triangle)
    const vx = vehicle.x * this.scaleX;
    const vy = vehicle.y * this.scaleY;

    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate(vehicle.angle);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(-4, -3.5);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-4, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Map Header
    ctx.fillStyle = '#64748b';
    ctx.font = '600 8px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CAMPUS MAP', 8, 13);

    ctx.restore();
  }

  renderProximityIndicator(ctx, distance) {
    const width = 180;
    const height = 24;
    const px = window.innerWidth / 2 - width / 2;
    const py = 16;

    ctx.save();
    ctx.translate(px, py);

    // Pill container
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 12);
    ctx.fill();
    ctx.stroke();

    let text = 'Searching...';
    let dotColor = '#64748b';

    if (distance === Infinity) {
      text = 'All friends tagged';
      dotColor = '#10b981';
    } else if (distance < 90) {
      text = 'Very close!';
      dotColor = '#ef4444';
    } else if (distance < 200) {
      text = 'Nearby';
      dotColor = '#f59e0b';
    } else if (distance < 380) {
      text = 'Getting warmer';
      dotColor = '#38bdf8';
    } else {
      text = 'Far away';
      dotColor = '#475569';
    }

    // Status Dot
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(14, height / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Text Label
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text, 26, height / 2 + 3.5);

    ctx.restore();
  }
}
