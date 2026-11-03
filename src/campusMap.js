// DAVV Takshashila Parisar (UTD) 2D Spatial Map Renderer & Collider System
import { MAP_WIDTH, MAP_HEIGHT, LANDMARKS, HIDING_SPOTS, SPECTATOR_ZONE } from './constants.js';

export class CampusMap {
  constructor() {
    this.roads = [
      // Main Entrance Spine (Gate 1 past ICH to Vigyan Bhawan)
      { x1: 2750, y1: 360, x2: 2150, y2: 450, width: 85 },
      { x1: 2150, y1: 450, x2: 2150, y2: 1100, width: 80 },
      // North Avenue (Passing SCSIT)
      { x1: 2150, y1: 450, x2: 1200, y2: 450, width: 75 },
      { x1: 1200, y1: 450, x2: 1200, y2: 1100, width: 70 },
      // Central Library Crossroad
      { x1: 1200, y1: 1100, x2: 1950, y2: 1100, width: 75 },
      // Vigyan Bhawan to IMS & IIPS Spine
      { x1: 1950, y1: 1400, x2: 1950, y2: 2000, width: 80 },
      { x1: 1950, y1: 2000, x2: 2600, y2: 2000, width: 75 },
      // Sports Ground Access Road
      { x1: 1200, y1: 1100, x2: 650, y2: 1100, width: 70 },
      { x1: 650, y1: 1100, x2: 650, y2: 2100, width: 75 },
      // South Connector (Sports to IMS)
      { x1: 650, y1: 2100, x2: 1950, y2: 2100, width: 70 }
    ];

    // Building Collision Boxes [x, y, w, h]
    this.colliders = [
      // Gate Cabins
      { x: 2660, y: 300, w: 60, h: 40, label: 'Guard Cabin' },
      { x: 2840, y: 300, w: 60, h: 40, label: 'Gate Post' },
      // Indian Coffee House (ICH) Main Building
      { x: 2200, y: 620, w: 260, h: 160, label: 'Indian Coffee House' },
      // SCSIT Building Wings
      { x: 1380, y: 550, w: 380, h: 220, label: 'SCSIT & Data Science' },
      // Vigyan Bhawan Conference Hall
      { x: 1950, y: 1250, w: 320, h: 200, label: 'Vigyan Bhawan' },
      // DAVV Central Library
      { x: 1100, y: 1220, w: 340, h: 220, label: 'Central Library' },
      // IMS & IIPS Complex
      { x: 2150, y: 1840, w: 420, h: 240, label: 'IMS & IIPS' },
      // Sports Pavilion Shed
      { x: 580, y: 1420, w: 140, h: 70, label: 'Sports Pavilion' }
    ];

    // Campus trees for visual aesthetics and cover
    this.trees = [];
    this.generateCampusTrees();
  }

  generateCampusTrees() {
    // Deterministic placement along roads and around lawns
    const treeSeeds = [
      // ICH Garden trees
      { x: 2080, y: 640, r: 24, type: 'gulmohar' },
      { x: 2090, y: 790, r: 22, type: 'neem' },
      { x: 2160, y: 920, r: 26, type: 'peepal' },
      { x: 2480, y: 620, r: 20, type: 'neem' },
      { x: 2490, y: 820, r: 24, type: 'gulmohar' },

      // SCSIT Surroundings
      { x: 1320, y: 460, r: 25, type: 'neem' },
      { x: 1780, y: 460, r: 22, type: 'gulmohar' },
      { x: 1280, y: 680, r: 28, type: 'peepal' },
      { x: 1820, y: 800, r: 25, type: 'neem' },

      // Vigyan Bhawan Roundabout & Gardens
      { x: 1840, y: 1040, r: 22, type: 'gulmohar' },
      { x: 2060, y: 1040, r: 24, type: 'gulmohar' },
      { x: 1840, y: 1460, r: 26, type: 'neem' },
      { x: 2320, y: 1220, r: 24, type: 'peepal' },

      // Central Library Garden
      { x: 1020, y: 1120, r: 26, type: 'neem' },
      { x: 1480, y: 1140, r: 24, type: 'peepal' },
      { x: 1040, y: 1480, r: 28, type: 'gulmohar' },
      { x: 1460, y: 1480, r: 22, type: 'neem' },

      // IMS & IIPS Lawns
      { x: 2040, y: 1740, r: 24, type: 'gulmohar' },
      { x: 2620, y: 1760, r: 26, type: 'peepal' },
      { x: 2020, y: 2120, r: 22, type: 'neem' },
      { x: 2620, y: 2120, r: 25, type: 'gulmohar' },

      // Sports Ground Edge
      { x: 420, y: 1420, r: 28, type: 'neem' },
      { x: 880, y: 1420, r: 26, type: 'peepal' },
      { x: 400, y: 1960, r: 30, type: 'neem' },
      { x: 920, y: 1960, r: 28, type: 'gulmohar' }
    ];

    // Add extra roadside avenue trees
    for (let y = 500; y <= 1000; y += 120) {
      treeSeeds.push({ x: 2100, y: y, r: 18, type: 'neem' });
    }
    for (let x = 1300; x <= 1800; x += 130) {
      treeSeeds.push({ x: x, y: 400, r: 18, type: 'gulmohar' });
    }
    for (let y = 1450; y <= 1900; y += 120) {
      treeSeeds.push({ x: 1900, y: y, r: 19, type: 'peepal' });
    }

    this.trees = treeSeeds;
  }

  // Check collision between a circle/rectangle and campus obstacles
  checkCollision(x, y, radius = 16) {
    // Map Boundaries
    if (x - radius < 100 || x + radius > MAP_WIDTH - 100 ||
        y - radius < 100 || y + radius > MAP_HEIGHT - 100) {
      return { collided: true, type: 'boundary' };
    }

    // Check buildings
    for (const b of this.colliders) {
      const left = b.x - b.w / 2;
      const right = b.x + b.w / 2;
      const top = b.y - b.h / 2;
      const bottom = b.y + b.h / 2;

      // Circle vs AABB
      const closestX = Math.max(left, Math.min(x, right));
      const closestY = Math.max(top, Math.min(y, bottom));
      const dx = x - closestX;
      const dy = y - closestY;

      if ((dx * dx + dy * dy) < (radius * radius)) {
        return { collided: true, type: 'building', label: b.label };
      }
    }

    // Check tree trunks
    for (const tree of this.trees) {
      const trunkRadius = tree.r * 0.35;
      const dx = x - tree.x;
      const dy = y - tree.y;
      if (dx * dx + dy * dy < (radius + trunkRadius) * (radius + trunkRadius)) {
        return { collided: true, type: 'tree' };
      }
    }

    return { collided: false };
  }

  render(ctx, camera) {
    // 1. Campus Ground Grass / Turf
    ctx.fillStyle = '#466344';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Irregular lawns and planted campus greens break up the paved paths.
    const lawns = [
      [980, 720, 210, 135], [1690, 880, 230, 115], [1480, 1600, 210, 145],
      [2380, 1500, 250, 145], [880, 1880, 175, 115], [2550, 800, 170, 120]
    ];
    lawns.forEach(([x, y, rx, ry]) => {
      ctx.fillStyle = '#52734c';
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Render Sports Complex Oval & Pitch
    this.renderSportsGround(ctx);

    // 3. Render Roads & Intersections
    this.renderRoads(ctx);

    // 4. Render Vigyan Bhawan Central Roundabout & Fountain
    this.renderRoundabout(ctx);

    // 5. Render Buildings & Details (ICH, SCSIT, Library, IMS)
    this.renderBuildings(ctx);

    // 6. Render Campus Trees & Street Decor
    this.renderTrees(ctx);

    // 7. Render Spectator Out Area Marker
    this.renderSpectatorZone(ctx);
  }

  renderRoads(ctx) {
    // Outer curbs / sidewalks
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    this.roads.forEach(r => {
      // Sidewalk / Curb
      ctx.strokeStyle = '#b7b2a5';
      ctx.lineWidth = r.width + 20;
      ctx.beginPath();
      ctx.moveTo(r.x1, r.y1);
      ctx.lineTo(r.x2, r.y2);
      ctx.stroke();

      // Asphalt Road
      ctx.strokeStyle = '#343a3d';
      ctx.lineWidth = r.width;
      ctx.beginPath();
      ctx.moveTo(r.x1, r.y1);
      ctx.lineTo(r.x2, r.y2);
      ctx.stroke();

      // Faded edge markings sit just inside both road shoulders.
      const roadDx = r.x2 - r.x1;
      const roadDy = r.y2 - r.y1;
      const roadLength = Math.hypot(roadDx, roadDy);
      const edgeX = (roadDy / roadLength) * (r.width / 2 - 7);
      const edgeY = (-roadDx / roadLength) * (r.width / 2 - 7);
      ctx.strokeStyle = 'rgba(238, 235, 222, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(r.x1 + edgeX * side, r.y1 + edgeY * side);
        ctx.lineTo(r.x2 + edgeX * side, r.y2 + edgeY * side);
        ctx.stroke();
      }
    });

    // Faded dashed center markings common on campus access roads.
    ctx.strokeStyle = '#e7e0c8';
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 19]);

    this.roads.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(r.x1, r.y1);
      ctx.lineTo(r.x2, r.y2);
      ctx.stroke();
    });
    ctx.setLineDash([]); // Reset dash

    // Pedestrian Zebra Crossings outside ICH and SCSIT
    this.renderZebraCrossing(ctx, 2150, 520, 80, 0);
    this.renderZebraCrossing(ctx, 1600, 450, 75, Math.PI / 2);
    this.renderZebraCrossing(ctx, 1950, 1520, 80, Math.PI / 2);

    // Speed Breakers (Typical Indian campus features with yellow reflective chevrons)
    this.renderSpeedBreaker(ctx, 2350, 410, 80, 0);
    this.renderSpeedBreaker(ctx, 2150, 950, 80, Math.PI / 2);
    this.renderSpeedBreaker(ctx, 1950, 1750, 80, Math.PI / 2);
  }

  renderZebraCrossing(ctx, x, y, width, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#ffffff';
    for (let i = -width / 2 + 6; i <= width / 2 - 6; i += 14) {
      ctx.fillRect(i, -18, 8, 36);
    }
    ctx.restore();
  }

  renderSpeedBreaker(ctx, x, y, width, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-width / 2, -5, width, 10);
    ctx.fillStyle = '#111827';
    for (let i = -width / 2 + 5; i <= width / 2 - 5; i += 16) {
      ctx.fillRect(i, -5, 8, 10);
    }
    ctx.restore();
  }

  renderRoundabout(ctx, time = Date.now()) {
    const rx = 1950;
    const ry = 1100;

    // Road asphalt ring
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 75;
    ctx.beginPath();
    ctx.arc(rx, ry, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Outer curb
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(rx, ry, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Inner island lawn
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(rx, ry, 70, 0, Math.PI * 2);
    ctx.fill();

    // Central decorative fountain
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(rx, ry, 32, 0, Math.PI * 2);
    ctx.fill();

    // Fountain ripple
    const ripple = (time % 2000) / 2000;
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1 - ripple) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rx, ry, 10 + ripple * 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  renderSportsGround(ctx) {
    const gx = 650;
    const gy = 1620;

    // Cricket / Football outfield
    ctx.fillStyle = '#477747';
    ctx.beginPath();
    ctx.ellipse(gx, gy, 230, 170, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Running track oval
    ctx.strokeStyle = '#986b50';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.ellipse(gx, gy, 255, 195, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pitch in center
    ctx.fillStyle = '#b99b6b';
    ctx.fillRect(gx - 30, gy - 70, 60, 140);

    // Boundary and crease lines make the ground read as a real playing field.
    ctx.strokeStyle = 'rgba(239, 235, 218, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(gx - 30, gy - 70, 60, 140);
    ctx.beginPath();
    ctx.moveTo(gx - 30, gy);
    ctx.lineTo(gx + 30, gy);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DAVV SPORTS COMPLEX', gx, gy - 90);
  }

  renderBuildings(ctx) {
    // 1. Indian Coffee House (ICH)
    this.renderICH(ctx);

    // 2. SCSIT
    this.renderSCSIT(ctx);

    // 3. Central Library
    this.renderLibrary(ctx);

    // 4. Vigyan Bhawan
    this.renderVigyanBhawan(ctx);

    // 5. IMS & IIPS
    this.renderIMS(ctx);

    // 6. Gate 1 Khandwa Road Entrance
    this.renderGate1(ctx);
  }

  renderICH(ctx) {
    const x = 2200;
    const y = 620;
    const w = 260;
    const h = 160;

    // Outdoor Red Brick Patio with seating
    ctx.fillStyle = '#7c2d12'; // terracotta brick paving
    ctx.fillRect(x - w / 2 - 70, y - h / 2 - 30, w + 100, h + 80);

    // Patio border
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - w / 2 - 70, y - h / 2 - 30, w + 100, h + 80);

    // Outdoor Umbrella Tables (Popular student hangout spot!)
    const tables = [
      { tx: 2110, ty: 560, color: '#facc15' },
      { tx: 2110, ty: 640, color: '#38bdf8' },
      { tx: 2110, ty: 720, color: '#f43f5e' },
      { tx: 2180, ty: 740, color: '#4ade80' }
    ];

    tables.forEach(t => {
      // Table base
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, 14, 0, Math.PI * 2);
      ctx.fill();

      // Colorful round umbrella
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center cap
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Main ICH Building Roof
    ctx.fillStyle = '#9a3412';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 15;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.shadowBlur = 0;

    // Signboard banner
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - w / 2 + 15, y - 24, w - 30, 48);
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2 + 15, y - 24, w - 30, 48);

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☕ INDIAN COFFEE HOUSE', x, y - 2);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('TAKSHASHILA PARISAR, DAVV', x, y + 16);
  }

  renderSCSIT(ctx) {
    const x = 1380;
    const y = 550;
    const w = 380;
    const h = 220;

    // Building Roof
    ctx.fillStyle = '#c9c1ad';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 18;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.shadowBlur = 0;

    // Architectural inner courtyards / lab wings
    ctx.fillStyle = '#a9a18f';
    ctx.fillRect(x - w / 2 + 30, y - h / 2 + 30, 120, h - 60);
    ctx.fillRect(x + w / 2 - 150, y - h / 2 + 30, 120, h - 60);

    // Repeated shaded windows give the academic blocks a campus facade.
    ctx.fillStyle = '#52646a';
    for (let wx = x - w / 2 + 18; wx <= x + w / 2 - 18; wx += 32) {
      ctx.fillRect(wx, y - h / 2 + 8, 17, 8);
      ctx.fillRect(wx, y + h / 2 - 16, 17, 8);
    }

    // Bike Parking Shed along SCSIT
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - w / 2 - 50, y - 60, 40, 140);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2 - 50, y - 60, 40, 140);

    // SCSIT Title
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCSIT - COMPUTER SCIENCE & IT', x, y - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#bfdbfe';
    ctx.fillText('& DATA SCIENCE LABS', x, y + 14);
  }

  renderLibrary(ctx) {
    const x = 1100;
    const y = 1220;
    const w = 340;
    const h = 220;

    ctx.fillStyle = '#d1c9b8';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 18;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.shadowBlur = 0;

    // Classical entrance colonnade pillars
    ctx.fillStyle = '#e8e1d2';
    for (let px = x - w / 2 + 30; px <= x + w / 2 - 30; px += 35) {
      ctx.beginPath();
      ctx.arc(px, y + h / 2 - 10, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f5d0fe';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DAVV CENTRAL LIBRARY', x, y - 8);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('DIGITAL STUDY HALL & ARCHIVES', x, y + 14);
  }

  renderVigyanBhawan(ctx) {
    const x = 1950;
    const y = 1250;
    const w = 320;
    const h = 200;

    ctx.fillStyle = '#c9c1ad';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 18;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.shadowBlur = 0;

    // Conference Rotunda
    ctx.fillStyle = '#9b8d72';
    ctx.beginPath();
    ctx.arc(x, y - 20, 55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIGYAN BHAWAN', x, y + 45);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('CONVENTION & AUDITORIUM', x, y + 65);
  }

  renderIMS(ctx) {
    const x = 2150;
    const y = 1840;
    const w = 420;
    const h = 240;

    ctx.fillStyle = '#cfc6b4';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 18;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.shadowBlur = 0;

    // Shaded courtyard, covered corridors and repetitive window bays.
    ctx.fillStyle = '#a69a83';
    ctx.fillRect(x - 58, y - 70, 116, 140);
    ctx.fillStyle = '#58666a';
    for (let wx = x - w / 2 + 20; wx <= x + w / 2 - 20; wx += 38) {
      ctx.fillRect(wx, y - h / 2 + 12, 21, 9);
      ctx.fillRect(wx, y + h / 2 - 21, 21, 9);
    }

    // Faculty Car Parking Bays
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (let px = x - w / 2 - 60; px <= x - w / 2 - 20; px += 20) {
      ctx.strokeRect(px, y - 80, 18, 40);
    }

    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IMS & IIPS COMPLEX', x, y - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('MANAGEMENT & PROFESSIONAL STUDIES', x, y + 12);
  }

  renderGate1(ctx) {
    const x = 2750;
    const y = 360;

    // DAVV-style entry piers with a bilingual campus sign.
    ctx.fillStyle = '#b9aa8e';
    ctx.fillRect(x - 104, y - 45, 28, 90);
    ctx.fillRect(x + 76, y - 45, 28, 90);
    ctx.fillStyle = '#ded4be';
    ctx.fillRect(x - 99, y - 38, 18, 76);
    ctx.fillRect(x + 81, y - 38, 18, 76);

    ctx.fillStyle = '#174d3c';
    ctx.fillRect(x - 76, y - 38, 152, 40);
    ctx.strokeStyle = '#d7c69f';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 76, y - 38, 152, 40);

    ctx.fillStyle = '#fff8e7';
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('देवी अहिल्या विश्वविद्यालय', x, y - 14);
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillText('TAKSHASHILA PARISAR • INDORE', x, y - 2);

    // Security booth and raised striped boom barrier.
    ctx.fillStyle = '#d5c9b1';
    ctx.fillRect(x - 32, y + 24, 42, 34);
    ctx.fillStyle = '#71858a';
    ctx.fillRect(x - 25, y + 30, 12, 12);
    ctx.fillRect(x - 8, y + 30, 12, 12);
    ctx.fillStyle = '#d9c99f';
    ctx.fillRect(x + 18, y + 15, 58, 5);
    ctx.fillStyle = '#b44737';
    for (let stripe = x + 24; stripe < x + 76; stripe += 16) {
      ctx.beginPath();
      ctx.moveTo(stripe, y + 15);
      ctx.lineTo(stripe + 7, y + 15);
      ctx.lineTo(stripe + 3, y + 20);
      ctx.lineTo(stripe - 4, y + 20);
      ctx.closePath();
      ctx.fill();
    }
  }

  renderTrees(ctx) {
    for (const t of this.trees) {
      // Natural, layered canopies common to a leafy Indore campus.
      ctx.fillStyle = 'rgba(26, 34, 24, 0.2)';
      ctx.beginPath();
      ctx.arc(t.x + 4, t.y + 4, t.r, 0, Math.PI * 2);
      ctx.fill();

      const foliage = t.type === 'gulmohar' ? '#3d7041' : t.type === 'peepal' ? '#35643b' : '#416d3c';
      ctx.fillStyle = foliage;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(123, 151, 81, 0.42)';
      ctx.beginPath();
      ctx.arc(t.x - t.r * 0.27, t.y - t.r * 0.25, t.r * 0.58, 0, Math.PI * 2);
      ctx.fill();
      if (t.type === 'gulmohar') {
        ctx.fillStyle = '#bd7650';
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.3, t.y - t.r * 0.2, t.r * 0.17, 0, Math.PI * 2);
        ctx.arc(t.x + t.r * 0.32, t.y + t.r * 0.18, t.r * 0.13, 0, Math.PI * 2);
        ctx.fill();
      }

      // Trunk center
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderSpectatorZone(ctx) {
    const sz = SPECTATOR_ZONE;
    // Dotted circle for spectator out zone
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(sz.x, sz.y, sz.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OUT SPECTATOR ZONE (ICH PATIO)', sz.x, sz.y - sz.radius - 8);
  }
}
