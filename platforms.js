// platforms.js
// Generates a full platformer level filling the 5000×2000 world.
// Player physics: jumpPower 15, gravity 0.475 → max jump height ≈ 237px, horizontal reach ≈ 280px
// Platforms are spaced so every jump is reachable.

function createPlatforms(world) {
  const W = world.width;   // 5000
  const H = world.height;  // 2000

  // ── Ground ──────────────────────────────────────────────────────────
  const platforms = [
    { x: 0, y: H - 40, w: W, h: 40 },  // full-width ground
  ];

  // ── Helper: add a platform ──────────────────────────────────────────
  function add(x, y, w, h) {
    platforms.push({ x, y, w: w || 120, h: h || 16 });
  }

  // ====================================================================
  //  ZONE 1 — Starting Area (x: 0–1000)
  //  Gentle introduction, short hops, wide platforms
  // ====================================================================

  // Low tier — easy first jumps off the ground
  add(80,   H - 120,  160, 18);
  add(300,  H - 140,  140, 18);
  add(500,  H - 160,  180, 20);
  add(740,  H - 130,  160, 18);
  add(940,  H - 150,  140, 18);

  // Mid tier — stepping up
  add(60,   H - 260,  130, 16);
  add(240,  H - 280,  120, 16);
  add(420,  H - 310,  150, 18);
  add(620,  H - 280,  140, 16);
  add(820,  H - 320,  130, 16);

  // Upper tier
  add(100,  H - 420,  110, 16);
  add(280,  H - 450,  140, 16);
  add(480,  H - 480,  120, 16);
  add(680,  H - 450,  130, 16);
  add(880,  H - 490,  110, 16);

  // High tier — rewarding exploration
  add(160,  H - 600,  100, 14);
  add(340,  H - 630,  120, 14);
  add(560,  H - 650,  100, 14);
  add(760,  H - 620,  120, 14);
  add(940,  H - 660,  100, 14);

  // Very high — near ceiling zone 1
  add(200,  H - 780,  90, 14);
  add(400,  H - 810,  110, 14);
  add(620,  H - 830,  100, 14);
  add(840,  H - 800,  90, 14);

  // ====================================================================
  //  ZONE 2 — Forest Canopy (x: 1000–2200)
  //  Denser layout, varied widths, some small tricky platforms
  // ====================================================================

  // Ground level extensions (broken ground)
  add(1050, H - 110,  200, 18);
  add(1320, H - 130,  160, 18);
  add(1540, H - 100,  220, 20);
  add(1820, H - 120,  180, 18);
  add(2050, H - 140,  160, 18);

  // Low-mid
  add(1020, H - 220,  140, 16);
  add(1220, H - 250,  120, 16);
  add(1400, H - 210,  160, 18);
  add(1600, H - 260,  130, 16);
  add(1800, H - 230,  150, 16);
  add(2000, H - 270,  120, 16);

  // Mid
  add(1060, H - 370,  120, 16);
  add(1240, H - 400,  100, 14);
  add(1420, H - 370,  140, 16);
  add(1600, H - 410,  110, 14);
  add(1780, H - 380,  130, 16);
  add(1960, H - 420,  100, 14);
  add(2120, H - 390,  120, 16);

  // Upper-mid
  add(1040, H - 530,  110, 14);
  add(1220, H - 560,  90,  14);
  add(1400, H - 540,  120, 14);
  add(1580, H - 570,  100, 14);
  add(1760, H - 550,  110, 14);
  add(1940, H - 580,  90,  14);
  add(2100, H - 550,  100, 14);

  // High
  add(1080, H - 700,  100, 14);
  add(1260, H - 730,  80,  14);
  add(1440, H - 710,  110, 14);
  add(1640, H - 740,  90,  14);
  add(1840, H - 720,  100, 14);
  add(2040, H - 750,  80,  14);

  // Very high — canopy tops
  add(1120, H - 870,  90, 14);
  add(1320, H - 900,  100, 14);
  add(1520, H - 880,  80,  14);
  add(1720, H - 910,  100, 14);
  add(1920, H - 890,  90,  14);
  add(2100, H - 920,  80,  14);

  // ====================================================================
  //  ZONE 3 — Mountain Ascent (x: 2200–3400)
  //  More vertical, staircase patterns, tighter jumps
  // ====================================================================

  // Ground fragments
  add(2250, H - 100,  180, 18);
  add(2500, H - 120,  160, 18);
  add(2720, H - 110,  200, 20);
  add(2980, H - 130,  180, 18);
  add(3220, H - 100,  160, 18);

  // Staircase up (left side of zone)
  add(2240, H - 200,  130, 16);
  add(2320, H - 310,  110, 14);
  add(2420, H - 420,  120, 14);
  add(2500, H - 530,  100, 14);
  add(2560, H - 640,  110, 14);
  add(2620, H - 750,  100, 14);
  add(2680, H - 860,  90,  14);

  // Parallel path (right side of zone)
  add(2800, H - 220,  140, 16);
  add(2900, H - 340,  120, 16);
  add(3000, H - 460,  110, 14);
  add(3100, H - 560,  100, 14);
  add(3180, H - 670,  120, 14);
  add(3260, H - 780,  100, 14);
  add(3340, H - 880,  90,  14);

  // Cross-bridges between staircases
  add(2700, H - 350,  100, 14);
  add(2750, H - 500,  90,  14);
  add(2850, H - 620,  100, 14);
  add(2950, H - 740,  80,  14);
  add(3050, H - 850,  90,  14);

  // Floating mid-zone platforms
  add(2400, H - 250,  100, 14);
  add(2600, H - 280,  120, 14);
  add(2900, H - 180,  140, 16);
  add(3100, H - 250,  110, 14);
  add(3300, H - 300,  130, 16);

  // ====================================================================
  //  ZONE 4 — Sky Fortress (x: 3400–4400)
  //  High-altitude platforms, wider gaps, reward skilled play
  // ====================================================================

  // Ground level (sparse)
  add(3420, H - 110,  200, 18);
  add(3700, H - 130,  180, 18);
  add(3960, H - 100,  220, 20);
  add(4240, H - 120,  160, 18);

  // Low platforms
  add(3440, H - 230,  140, 16);
  add(3640, H - 260,  120, 16);
  add(3840, H - 230,  140, 16);
  add(4040, H - 270,  110, 14);
  add(4240, H - 240,  130, 16);

  // Mid tier
  add(3460, H - 390,  130, 16);
  add(3660, H - 420,  110, 14);
  add(3850, H - 400,  120, 16);
  add(4050, H - 430,  100, 14);
  add(4250, H - 410,  130, 16);

  // Upper tier
  add(3480, H - 560,  110, 14);
  add(3680, H - 590,  100, 14);
  add(3870, H - 570,  120, 14);
  add(4060, H - 600,  90,  14);
  add(4260, H - 580,  110, 14);

  // High sky platforms
  add(3500, H - 730,  100, 14);
  add(3700, H - 760,  90,  14);
  add(3900, H - 740,  100, 14);
  add(4100, H - 770,  80,  14);
  add(4300, H - 750,  100, 14);

  // Very high — fortress ramparts
  add(3520, H - 900,  90, 14);
  add(3720, H - 930,  80, 14);
  add(3920, H - 910,  100, 14);
  add(4120, H - 940,  80,  14);
  add(4320, H - 920,  90,  14);

  // ====================================================================
  //  ZONE 5 — Final Challenge (x: 4400–5000)
  //  Dense, vertical gauntlet to the top
  // ====================================================================

  // Ground
  add(4420, H - 110,  160, 18);
  add(4640, H - 130,  180, 18);
  add(4860, H - 100,  140, 18);

  // Rising staircase
  add(4400, H - 220,  130, 16);
  add(4500, H - 330,  120, 14);
  add(4580, H - 440,  110, 14);
  add(4660, H - 550,  100, 14);
  add(4740, H - 660,  110, 14);
  add(4800, H - 770,  100, 14);
  add(4860, H - 880,  90,  14);

  // Parallel path right
  add(4620, H - 250,  110, 14);
  add(4720, H - 370,  100, 14);
  add(4800, H - 490,  110, 14);
  add(4870, H - 600,  100, 14);

  // Summit platforms — near the top of the world
  add(4440, H - 1000, 120, 14);
  add(4600, H - 1040, 100, 14);
  add(4760, H - 1020, 110, 14);
  add(4900, H - 1060, 100, 14);

  // Connector bridges between zones (fill horizontal gaps)
  // Zone 1→2
  add(960,  H - 180,  100, 14);
  add(980,  H - 350,  80,  14);
  add(960,  H - 520,  90,  14);
  add(980,  H - 690,  80,  14);

  // Zone 2→3
  add(2160, H - 200,  100, 14);
  add(2180, H - 380,  80,  14);
  add(2160, H - 560,  90,  14);
  add(2180, H - 740,  80,  14);

  // Zone 3→4
  add(3360, H - 200,  100, 14);
  add(3380, H - 400,  80,  14);
  add(3360, H - 600,  90,  14);
  add(3380, H - 800,  80,  14);

  // Zone 4→5
  add(4360, H - 180,  100, 14);
  add(4380, H - 380,  80,  14);
  add(4360, H - 580,  90,  14);
  add(4380, H - 780,  80,  14);

  // ── Scattered bonus platforms (fill remaining empty pockets) ────────
  // Low scattered
  add(150,  H - 180,  80,  12);
  add(580,  H - 200,  70,  12);
  add(1150, H - 170,  90,  12);
  add(1700, H - 180,  80,  12);
  add(2350, H - 170,  70,  12);
  add(3550, H - 180,  80,  12);
  add(4500, H - 170,  70,  12);

  // Mid scattered
  add(350,  H - 360,  70,  12);
  add(720,  H - 380,  80,  12);
  add(1140, H - 340,  70,  12);
  add(1680, H - 350,  80,  12);
  add(2150, H - 340,  70,  12);
  add(3150, H - 380,  80,  12);
  add(4150, H - 360,  70,  12);

  // High scattered
  add(260,  H - 540,  60,  12);
  add(700,  H - 560,  70,  12);
  add(1180, H - 630,  60,  12);
  add(1660, H - 640,  70,  12);
  add(2280, H - 580,  60,  12);
  add(3180, H - 570,  70,  12);
  add(4180, H - 530,  60,  12);

  return platforms;
}