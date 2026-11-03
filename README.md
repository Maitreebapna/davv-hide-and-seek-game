# 🚗 DAVV Campus 2D Hide & Seek (Dr. Driving Edition)

A high-performance 2D driving simulation and hide-and-seek game set in the real-world spatial layout of **DAVV Takshashila Parisar (UTD), Khandwa Road, Indore**.

Built with pure HTML5 Canvas, modern JavaScript (ES Modules), Web Audio API, and Dr. Driving mechanical physics.

---

## 🕹️ How to Open & Run in VS Code

### Option 1: Using the Built-in Server (Recommended)
1. Open this folder in **VS Code**:
   ```powershell
   code "C:\Users\maitree\.gemini\antigravity\scratch\davv-hide-and-seek"
   ```
2. Open the integrated terminal (`Ctrl + ~` or `Terminal -> New Terminal`).
3. Run:
   ```bash
   node server.js
   ```
   *(or `npm start`)*
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Option 2: Using VS Code "Live Server" Extension
1. Install the **Live Server** extension by Ritwick Dey in VS Code if you haven't already.
2. Right-click `index.html` in the file explorer and click **"Open with Live Server"**.

---

## 👥 Friends Roster (12 Players)
* **Maitree**
* **Akshita**
* **Iti**
* **Jassi**
* **Animesh**
* **Mradul**
* **Anirudh**
* **Chinmay**
* **Gourav**
* **Lakshya**
* **Arpan**
* **Bhavik**

In the **Lobby Screen**, you can select **any friend** from this list to be the **Denner**! The other 11 friends will automatically become the autonomous hiders.

---

## 🚘 Denner Vehicles & Equipment

Before the countdown starts, the Denner selects their search vehicle:

| Vehicle | Speed | Sound / Stealth Profile | Special Advantage |
| :--- | :--- | :--- | :--- |
| **🚗 Dr. Driving Sedan** | 180 km/h (Fastest) | Loud Engine • High Alert | Dual headlights, high top speed, Dr. Driving PRND mechanics |
| **🏍️ Campus Motorcycle** | 140 km/h | Medium Sound | High agility, rapid acceleration, can cut through sidewalks |
| **🚲 Stealth Bicycle** | 70 km/h | Ultra Silent (Stealth Master) | Sneaks up on friends before they hear you coming! Ting-ting bell |

---

## 🎮 Gameplay Flow

### 1. 10-Second Countdown (`10... 9... 8... 1, GO!`)
* The Denner's screen is dimmed at **Gate 1 (Khandwa Road Main Gate)**.
* The 11 other friends immediately scatter and sprint across campus to hide:
  * Behind **Indian Coffee House (ICH)** outdoor tables and back counter.
  * In the **SCSIT** bicycle shed, courtyard, and computer lab porch.
  * Behind the thick columns and archives of **DAVV Central Library**.
  * Around the **Vigyan Bhawan** central roundabout fountain and gardens.
  * In the **IMS & IIPS** faculty car parking bays.
  * Inside the **Sports Complex** spectator bleachers.

### 2. The Seeking Phase
* **Driving Controls**:
  * `W` or `Up Arrow`: Accelerator (Gas)
  * `S` or `Down Arrow`: Brake / Reverse
  * `A` / `D` or `Left / Right Arrows`: Steer
  * `P`, `R`, `N`, `D`: Automatic transmission gears (for Car)
  * `H`: Honk Horn / Ring Bicycle Bell
  * `Spacebar`: **Tag Nearby Friend**
  * **On-Screen Mobile HUD**: Interactive rotatable steering wheel dial, textured gas & brake pedals, and gear shifter.
* **Autonomous Hider AI**:
  * Friends stay low in cover.
  * If they hear the engine roaring or see headlights getting close (< 15 meters), they **panic and sprint** to another corner shouting *"Bhago bhago!"* or *"Denner aa gaya!"*
  * Honking your horn startles them and reveals their position!
* **Tagging Friends**:
  * Get within range (~50px) and hit `[SPACEBAR]` or click the glowing `[🎯 TAG FRIEND]` button.
  * The caught friend plays their custom catch dialogue, and their status marks as **`✓ OUT`**.
* **Caught players**:
  * Each caught friend joins the visible **Out queue** on the right side of the screen, making it clear who is out and in what order they were caught.
* **Outdoor hiding spots**:
  * Friends hide only at outdoor spots around campus, never inside building collision areas. The Denner can reach and tag them without entering a building.

### 3. Victory Screen
* The last hider still uncaught wins the round. The game ends as soon as only one hider remains, and the victory screen names them.
* If the Denner catches every hider before the round ends, the Denner wins. The victory screen also shows the elapsed time.

---

## 📍 DAVV Campus Spatial Layout

```
                  [Gate 1: Khandwa Road Main Entrance]
                                   │
                                   ▼
      ┌─────────────────────────────────────────────────────────────┐
      │  SCSIT & Data Science Labs      Indian Coffee House (ICH)   │
      │  (Bike sheds, computer labs)    (Patio tables & counter)    │
      ├─────────────────────────────────────────────────────────────┤
      │  DAVV Central Library           Vigyan Bhawan Roundabout    │
      │  (Pillars, reading lawns)       (Central Fountain Hub)      │
      ├─────────────────────────────────────────────────────────────┤
      │  Sports Complex Grounds         IMS & IIPS Complex          │
      │  (Running oval & bleachers)     (Management quadrangle)     │
      └─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Architecture & Tech Stack
* **Language:** Modern ECMAScript 2022 (Modular ES Modules)
* **Rendering:** HTML5 Canvas 2D with smooth camera tracking & particle lighting
* **Physics:** Custom kinematic Ackermann steering, inertia, drift friction, and AABB building collision
* **Audio:** 100% Procedural Web Audio API (real-time engine oscillator scaling, dual-tone car horn, bicycle bell chime, victory chords)
* **Zero Dependencies:** Runs instantly with native browser support and Node.js built-ins.
