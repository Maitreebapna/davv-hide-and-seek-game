// Super Easy, Butter-Smooth Arcade Vehicle Physics
// Made so intuitive that even a 10-year-old child can drive and reverse effortlessly!

import { VEHICLES } from './constants.js';
import { sound } from './audio.js';

export class Vehicle {
  constructor(vehicleType = 'car', startX = 2700, startY = 360, startAngle = Math.PI) {
    this.type = vehicleType;
    this.config = VEHICLES[vehicleType] || VEHICLES.car;

    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.speed = 0;

    // Easy, responsive arcade numbers
    this.accel = 0.28;
    this.maxSpeed = vehicleType === 'car' ? 7.6 : (vehicleType === 'motorcycle' ? 7.0 : 5.2);
    this.maxReverseSpeed = 4.2; // Immediate, smooth reverse!
    this.friction = 0.93;
    this.turnSpeed = 0.065; // Snappy, effortless rotation

    this.width = this.config.width;
    this.length = this.config.length;
    this.radius = 22;

    this.hornActive = false;
    this.soundWaveRadius = 0;
    this.particles = [];
  }

  triggerHorn() {
    this.hornActive = true;
    this.soundWaveRadius = 15;
    sound.playHorn(this.config.hornType);
  }

  update(campusMap, input) {
    // 1. ROTATION: Works at ANY time (standing still, driving forward, or reversing!)
    if (input.left) {
      this.angle -= this.turnSpeed;
    }
    if (input.right) {
      this.angle += this.turnSpeed;
    }

    // 2. FORWARD & REVERSE: Direct and instant!
    if (input.up) {
      // Forward
      this.speed += this.accel;
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    } else if (input.down) {
      // REVERSE: Instantly backs up without any gear hassle!
      this.speed -= this.accel;
      if (this.speed < -this.maxReverseSpeed) this.speed = -this.maxReverseSpeed;
    } else {
      // Natural rolling stop
      this.speed *= this.friction;
      if (Math.abs(this.speed) < 0.08) this.speed = 0;
    }

    // 3. MOVEMENT WITH WALL-SLIDING (Never gets stuck on buildings/curbs!)
    const stepX = Math.cos(this.angle) * this.speed;
    const stepY = Math.sin(this.angle) * this.speed;

    // Slide X
    const nextX = this.x + stepX;
    const hitX = campusMap.checkCollision(nextX, this.y, this.radius);
    if (!hitX.collided) {
      this.x = nextX;
    } else {
      this.speed *= 0.7; // Gentle bounce
    }

    // Slide Y
    const nextY = this.y + stepY;
    const hitY = campusMap.checkCollision(this.x, nextY, this.radius);
    if (!hitY.collided) {
      this.y = nextY;
    } else {
      this.speed *= 0.7; // Gentle bounce
    }

    // 4. Engine sound
    sound.updateEngine(this.speed, this.maxSpeed, this.type);

    // 5. Expanding Horn Wave
    if (this.hornActive) {
      this.soundWaveRadius += 16;
      if (this.soundWaveRadius > this.config.soundRadius * 1.3) {
        this.hornActive = false;
      }
    }

    // 6. Subtle tire smoke when moving
    if (Math.abs(this.speed) > 2.5 && Math.random() < 0.25) {
      this.particles.push({
        x: this.x - Math.cos(this.angle) * 18,
        y: this.y - Math.sin(this.angle) * 18,
        r: 3 + Math.random() * 3,
        alpha: 0.5
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.r += 0.2;
      p.alpha -= 0.04;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  render(ctx) {
    // Render tire smoke
    for (const p of this.particles) {
      ctx.fillStyle = `rgba(160, 174, 192, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Headlight cone
    const beam = ctx.createRadialGradient(20, 0, 4, 160, 0, 110);
    beam.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(15, -8);
    ctx.lineTo(160, -50);
    ctx.lineTo(160, 50);
    ctx.lineTo(15, 8);
    ctx.closePath();
    ctx.fill();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(-this.length / 2 + 2, -this.width / 2 + 2, this.length, this.width);

    // Vehicle Models
    if (this.type === 'car') {
      const l = this.length;
      const w = this.width;

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-l * 0.32, -w / 2 - 2, 12, 5);
      ctx.fillRect(-l * 0.32, w / 2 - 3, 12, 5);
      ctx.fillRect(l * 0.2, -w / 2 - 2, 12, 5);
      ctx.fillRect(l * 0.2, w / 2 - 3, 12, 5);

      // Body (Red Sedan)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(-l / 2, -w / 2, l, w, 6);
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Windshield & Roof
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(l * 0.05, -w / 2 + 3, 8, w - 6);
      ctx.fillRect(-l * 0.28, -w / 2 + 3, 6, w - 6);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-l * 0.2, -w / 2 + 3, l * 0.25, w - 6);

      // Headlights & Tail Lights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(l / 2 - 2, -w / 2 + 2, 3, 5);
      ctx.fillRect(l / 2 - 2, w / 2 - 7, 3, 5);

      ctx.fillStyle = this.speed < 0 ? '#ffffff' : '#7f1d1d';
      ctx.fillRect(-l / 2 - 1, -w / 2 + 2, 2, 5);
      ctx.fillRect(-l / 2 - 1, w / 2 - 7, 2, 5);
    } else if (this.type === 'motorcycle') {
      const l = this.length;
      const w = this.width;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-l / 2, -2.5, 9, 5);
      ctx.fillRect(l / 2 - 9, -2.5, 9, 5);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-l * 0.2, -w / 2 + 2, l * 0.45, w - 4);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-2, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bicycle
      const l = this.length;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-l / 2, -1.5, 8, 3);
      ctx.fillRect(l / 2 - 8, -1.5, 8, 3);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-l * 0.35, 0);
      ctx.lineTo(l * 0.25, 0);
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(-2, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Expanding Horn Wave
    if (this.hornActive) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.soundWaveRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
