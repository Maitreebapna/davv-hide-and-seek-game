// DAVV Takshashila Parisar - Hide & Seek Game Constants

export const MAP_WIDTH = 3200;
export const MAP_HEIGHT = 2400;

export const FRIENDS_LIST = [
  { id: 'maitree', name: 'Maitree', color: '#3b82f6', hair: '#1e293b', quote: "Arey yaar main toh chup hi raha tha!", favSpot: 'ich' },
  { id: 'akshita', name: 'Akshita', color: '#ec4899', hair: '#475569', quote: "How did you spot me behind the ICH counter?!", favSpot: 'ich' },
  { id: 'iti', name: 'Iti', color: '#8b5cf6', hair: '#0f172a', quote: "I was literally in the Central Library pillar shadow!", favSpot: 'library' },
  { id: 'jassi', name: 'Jassi', color: '#f59e0b', hair: '#18181b', quote: "Bro I ran so fast, my stamina ran out!", favSpot: 'sports' },
  { id: 'animesh', name: 'Animesh', color: '#10b981', hair: '#334155', quote: "Engine sound gave you away, I was about to jump!", favSpot: 'scsit' },
  { id: 'mradul', name: 'Mradul', color: '#06b6d4', hair: '#1e293b', quote: "Calculated 98% stealth probability... still got tagged!", favSpot: 'ims' },
  { id: 'anirudh', name: 'Anirudh', color: '#e11d48', hair: '#27272a', quote: "Was just enjoying a cold coffee at ICH!", favSpot: 'ich' },
  { id: 'chinmay', name: 'Chinmay', color: '#f97316', hair: '#3f3f46', quote: "Bicycle is too silent! Completely unfair advantage haha!", favSpot: 'vigyan' },
  { id: 'gourav', name: 'Gourav', color: '#14b8a6', hair: '#111827', quote: "Caught red-handed behind SCSIT computer lab!", favSpot: 'scsit' },
  { id: 'lakshya', name: 'Lakshya', color: '#6366f1', hair: '#374151', quote: "My sprint missed reaching cover by 2 meters!", favSpot: 'library' },
  { id: 'arpan', name: 'Arpan', color: '#84cc16', hair: '#1c1917', quote: "Next round I am picking the Motorcycle as Denner!", favSpot: 'ims' },
  { id: 'bhavik', name: 'Bhavik', color: '#a855f7', hair: '#292524', quote: "I thought nobody checks the Sports Pavilion bleachers!", favSpot: 'sports' }
];

export const VEHICLES = {
  car: {
    id: 'car',
    name: 'Dr. Driving Sedan',
    icon: '🚗',
    maxSpeed: 8.2,
    reverseMaxSpeed: 3.5,
    accel: 0.16,
    brakeForce: 0.28,
    friction: 0.982,
    turnSpeed: 0.048,
    length: 54,
    width: 26,
    soundRadius: 320, // loud engine
    stealthFactor: 'Low (Loud Engine)',
    agility: 'Medium',
    desc: 'High top speed & twin headlights, but loud engine alerts friends from far away.',
    hornType: 'car'
  },
  motorcycle: {
    id: 'motorcycle',
    name: 'Campus Motorcycle',
    icon: '🏍️',
    maxSpeed: 7.4,
    reverseMaxSpeed: 2.0,
    accel: 0.24,
    brakeForce: 0.32,
    friction: 0.975,
    turnSpeed: 0.072,
    length: 36,
    width: 14,
    soundRadius: 180, // medium sound
    stealthFactor: 'Medium',
    agility: 'Very High',
    desc: 'Nimble and quick acceleration. Can squeeze through tight campus walkways.',
    hornType: 'motorcycle'
  },
  bicycle: {
    id: 'bicycle',
    name: 'Stealth Bicycle',
    icon: '🚲',
    maxSpeed: 4.8,
    reverseMaxSpeed: 1.5,
    accel: 0.12,
    brakeForce: 0.22,
    friction: 0.965,
    turnSpeed: 0.088,
    length: 30,
    width: 10,
    soundRadius: 55, // ultra quiet
    stealthFactor: 'Ultra High (Silent)',
    agility: 'Maximum',
    desc: 'Nearly silent stealth approach! Sneak up on hiders before they can react.',
    hornType: 'bell'
  }
};

// Key Landmark positions & Hiding Spots across DAVV Takshashila Parisar
export const LANDMARKS = [
  {
    id: 'gate1',
    name: 'Gate 1 (Khandwa Road Main Gate)',
    x: 2750,
    y: 360,
    width: 180,
    height: 120,
    type: 'gate',
    color: '#334155'
  },
  {
    id: 'ich',
    name: 'Indian Coffee House (ICH)',
    x: 2200,
    y: 680,
    width: 260,
    height: 180,
    type: 'building',
    roofColor: '#b45309',
    labelColor: '#fef08a',
    hasPatio: true
  },
  {
    id: 'scsit',
    name: 'SCSIT & Data Science Labs',
    x: 1380,
    y: 580,
    width: 380,
    height: 240,
    type: 'building',
    roofColor: '#1e3a8a',
    labelColor: '#bfdbfe'
  },
  {
    id: 'vigyan',
    name: 'Vigyan Bhawan & Roundabout',
    x: 1950,
    y: 1250,
    width: 320,
    height: 220,
    type: 'building',
    roofColor: '#065f46',
    labelColor: '#a7f3d0',
    hasRoundabout: true
  },
  {
    id: 'library',
    name: 'DAVV Central Library',
    x: 1100,
    y: 1220,
    width: 340,
    height: 230,
    type: 'building',
    roofColor: '#581c87',
    labelColor: '#e9d5ff'
  },
  {
    id: 'ims',
    name: 'IMS & IIPS Academic Complex',
    x: 2150,
    y: 1860,
    width: 440,
    height: 260,
    type: 'building',
    roofColor: '#831843',
    labelColor: '#fbcfe8'
  },
  {
    id: 'sports',
    name: 'Sports Complex & Pavilion Grounds',
    x: 650,
    y: 1620,
    width: 500,
    height: 380,
    type: 'ground',
    roofColor: '#15803d',
    labelColor: '#bbf7d0'
  }
];

// Rich predefined hiding spot coordinates
export const HIDING_SPOTS = [
  // Indian Coffee House (ICH) Spots
  { id: 'ich_umbrella1', zone: 'ich', x: 2120, y: 730, name: 'ICH Umbrella Table #1', cover: 0.85 },
  { id: 'ich_umbrella2', zone: 'ich', x: 2140, y: 810, name: 'ICH Umbrella Table #2', cover: 0.80 },
  { id: 'ich_counter_back', zone: 'ich', x: 2420, y: 640, name: 'Behind ICH Dosa Kitchen', cover: 0.95 },
  { id: 'ich_alley', zone: 'ich', x: 2380, y: 880, name: 'ICH Back Alleyway', cover: 0.90 },

  // SCSIT Spots
  { id: 'scsit_bike_shed', zone: 'scsit', x: 1630, y: 520, name: 'SCSIT Outdoor Bike Parking', cover: 0.90 },
  { id: 'scsit_courtyard', zone: 'scsit', x: 1630, y: 690, name: 'SCSIT Outdoor Courtyard', cover: 0.85 },
  { id: 'scsit_pillar', zone: 'scsit', x: 1780, y: 690, name: 'SCSIT East Wing Walkway', cover: 0.92 },
  { id: 'scsit_trees', zone: 'scsit', x: 1280, y: 780, name: 'SCSIT Gulmohar Trees', cover: 0.75 },

  // Vigyan Bhawan Spots
  { id: 'vigyan_fountain', zone: 'vigyan', x: 1950, y: 1120, name: 'Vigyan Bhawan Fountain Hedge', cover: 0.80 },
  { id: 'vigyan_portico', zone: 'vigyan', x: 1900, y: 1380, name: 'Vigyan Bhawan Pillar Arcade', cover: 0.90 },
  { id: 'vigyan_bushes', zone: 'vigyan', x: 2220, y: 1320, name: 'Vigyan Bhawan Flower Garden', cover: 0.75 },

  // Central Library Spots
  { id: 'lib_pillars', zone: 'library', x: 860, y: 1160, name: 'Library Outdoor Entrance Garden', cover: 0.92 },
  { id: 'lib_back', zone: 'library', x: 1140, y: 1470, name: 'Behind Central Library Archives', cover: 0.95 },
  { id: 'lib_cycle_stand', zone: 'library', x: 1460, y: 1220, name: 'Library Bicycle Shed', cover: 0.82 },

  // IMS & IIPS Spots
  { id: 'ims_car_bay', zone: 'ims', x: 1880, y: 1780, name: 'IMS Outdoor Faculty Parking', cover: 0.88 },
  { id: 'ims_quadrangle', zone: 'ims', x: 2430, y: 1920, name: 'IIPS Outdoor Courtyard', cover: 0.85 },
  { id: 'ims_corridor', zone: 'ims', x: 2520, y: 2020, name: 'IMS East Wing Corridor', cover: 0.90 },

  // Sports Complex & Pavilion Spots
  { id: 'sports_bleachers', zone: 'sports', x: 700, y: 1480, name: 'Outdoor Sports Bleachers', cover: 0.94 },
  { id: 'sports_goalpost', zone: 'sports', x: 420, y: 1720, name: 'Football Goalpost Net', cover: 0.70 },
  { id: 'sports_pavilion', zone: 'sports', x: 880, y: 1900, name: 'Cricket Pavilion Boundary Hedge', cover: 0.88 }
];

// Spectator Zone (where caught friends go to stand/sit and watch)
export const SPECTATOR_ZONE = {
  name: 'ICH Patio & Spectator Area',
  x: 2110,
  y: 770,
  radius: 90
};
