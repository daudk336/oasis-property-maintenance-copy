import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// ---- world constants ----
const FIELD_W = 120;
const FIELD_D = 90;
const TEX_W = 1024;
const TEX_H = Math.round((TEX_W * FIELD_D) / FIELD_W);
const STRIPE = 3;

const HOUSE_XS = [-30, 0, 30];
const HOUSE_Z = -21; // house centers
const YARD = { hw: 11, hd: 7, cz: -6 }; // each front yard: x±hw around house, z cz±hd
const ROAD_Z = 8;

// Inward spiral waypoints in local yard coords (like really mowing a lawn)
function buildSpiral(hw, hd) {
  let x0 = -hw, x1 = hw, z0 = -hd, z1 = hd;
  const pts = [[x0, z0]];
  while (x1 - x0 > 2 * STRIPE && z1 - z0 > 2 * STRIPE) {
    pts.push([x1, z0]);
    pts.push([x1, z1]);
    x1 -= STRIPE;
    pts.push([x0, z1]);
    z1 -= STRIPE;
    z0 += STRIPE;
    pts.push([x0, z0]);
    x0 += STRIPE;
  }
  pts.push([(x0 + x1) / 2, (z0 + z1) / 2]);
  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, lens, total: lens[lens.length - 1] };
}

function spiralAt(spiral, dist) {
  const { pts, lens, total } = spiral;
  const d = dist % total;
  let i = 1;
  while (i < lens.length - 1 && lens[i] < d) i++;
  const segLen = lens[i] - lens[i - 1] || 1;
  const f = (d - lens[i - 1]) / segLen;
  return {
    x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f,
    z: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f,
    seg: i,
  };
}

function grassNoise(ctx, x, y, w, h, count) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(46,140,60,0.5)" : "rgba(110,200,110,0.5)";
    ctx.fillRect(x + Math.random() * w, y + Math.random() * h, 2, 3 + Math.random() * 3);
  }
}

function paintFreshGrass(ctx) {
  ctx.fillStyle = "#4cae52";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grassNoise(ctx, 0, 0, TEX_W, TEX_H, 9000);
}

function buildMowerGuy(shirtColor, capColor) {
  const group = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xe8b48a });
  const shirt = new THREE.MeshStandardMaterial({ color: shirtColor });
  const pants = new THREE.MeshStandardMaterial({ color: 0x33415c });
  const cap = new THREE.MeshStandardMaterial({ color: capColor });
  const red = new THREE.MeshStandardMaterial({ color: 0xd64545 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x22262b });
  const grey = new THREE.MeshStandardMaterial({ color: 0x8a929c });

  const mower = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.7), red);
  deck.position.y = 0.5;
  mower.add(deck);
  const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.35, 12), dark);
  engine.position.set(0, 0.85, 0.1);
  mower.add(engine);
  const wheels = [];
  [[-0.62, 0.75], [0.62, 0.75], [-0.62, -0.75], [0.62, -0.75]].forEach(([wx, wz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 14), dark);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.28, wz);
    mower.add(wheel);
    wheels.push(wheel);
  });
  [-0.45, 0.45].forEach((hx) => {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.9, 8), grey);
    bar.position.set(hx, 1.05, -1.05);
    bar.rotation.x = Math.PI / 3.2;
    mower.add(bar);
  });
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8), grey);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, 1.55, -1.85);
  mower.add(crossbar);
  mower.position.z = 1.5;
  group.add(mower);

  const guy = new THREE.Group();
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  [legL, legR].forEach((leg, idx) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 1.0, 8), pants);
    mesh.position.y = -0.5;
    leg.add(mesh);
    leg.position.set(idx === 0 ? -0.22 : 0.22, 1.0, 0);
    guy.add(leg);
  });
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 1.05, 10), shirt);
  torso.position.y = 1.55;
  guy.add(torso);
  [-0.42, 0.42].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.95, 8), shirt);
    arm.position.set(ax, 1.75, 0.42);
    arm.rotation.x = -Math.PI / 2.6;
    guy.add(arm);
  });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 12), skin);
  head.position.y = 2.4;
  guy.add(head);
  const capTop = new THREE.Mesh(new THREE.SphereGeometry(0.31, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.2), cap);
  capTop.position.y = 2.48;
  guy.add(capTop);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.32), cap);
  brim.position.set(0, 2.5, 0.32);
  guy.add(brim);
  guy.position.z = -0.9;
  group.add(guy);

  group.userData = { legL, legR, wheels };
  return group;
}

// A tidy suburban house: body, clean gable roof (triangular prism), porch details
function buildHouse(scene, cx, wallColor, roofColor, doorColor) {
  const house = new THREE.Group();
  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor });
  const roofMat = new THREE.MeshStandardMaterial({ color: roofColor });
  const doorMat = new THREE.MeshStandardMaterial({ color: doorColor });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xbfe3f2 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const W = 12, H = 4.5, D = 9;
  const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), wallMat);
  body.position.y = H / 2;
  house.add(body);

  // gable roof — triangular prism with the gable facing the street
  const tri = new THREE.Shape();
  tri.moveTo(-W / 2 - 0.7, 0);
  tri.lineTo(W / 2 + 0.7, 0);
  tri.lineTo(0, 3.2);
  tri.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(tri, { depth: D + 1, bevelEnabled: false });
  roofGeo.translate(0, 0, -(D + 1) / 2);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = H;
  house.add(roof);

  // door + step
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.2), doorMat);
  door.position.set(0, 1.4, D / 2 + 0.05);
  house.add(door);
  const step = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1), whiteMat);
  step.position.set(0, 0.12, D / 2 + 0.6);
  house.add(step);

  // windows with white frames
  [-3.6, 3.6].forEach((wx) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.9, 0.14), whiteMat);
    frame.position.set(wx, 2.4, D / 2 + 0.02);
    house.add(frame);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 0.15), glassMat);
    glass.position.set(wx, 2.4, D / 2 + 0.07);
    house.add(glass);
  });

  // front path from door to the sidewalk
  const path = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.06, ROAD_Z - 5.5 - (HOUSE_Z + D / 2)),
    new THREE.MeshStandardMaterial({ color: 0xd9d2c4 })
  );
  path.position.set(cx, 0.03, (HOUSE_Z + D / 2 + ROAD_Z - 5.5) / 2);
  scene.add(path);

  // mailbox by the street
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 6), new THREE.MeshStandardMaterial({ color: 0x6b4a2f }));
  post.position.set(cx + 2, 0.55, ROAD_Z - 5.2);
  scene.add(post);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.45), doorMat);
  box.position.set(cx + 2, 1.25, ROAD_Z - 5.2);
  scene.add(box);

  house.position.set(cx, 0, HOUSE_Z);
  scene.add(house);
}

function buildRoad(scene) {
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(FIELD_W, 7),
    new THREE.MeshStandardMaterial({ color: 0x5c6470 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.02, ROAD_Z);
  scene.add(road);

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xe8e4d8 });
  for (let x = -56; x <= 56; x += 8) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.35), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(x, 0.03, ROAD_Z);
    scene.add(dash);
  }

  const walkMat = new THREE.MeshStandardMaterial({ color: 0xcfc9bd });
  [ROAD_Z - 4.6, ROAD_Z + 4.6].forEach((z) => {
    const walk = new THREE.Mesh(new THREE.PlaneGeometry(FIELD_W, 2), walkMat);
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(0, 0.025, z);
    scene.add(walk);
  });
}

function buildTrees(scene) {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5636 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2fa84f });
  const crowns = [];
  [[-46, -18], [46, -16], [-15, -19], [15, -19], [-48, 18], [48, 20], [-24, 20], [26, 20]].forEach(([x, z], i) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 3, 8), trunkMat);
    trunk.position.y = 1.5;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(2 + (i % 3) * 0.5, 12, 10), leafMat);
    crown.position.y = 4;
    crown.scale.y = 1.15;
    tree.add(trunk, crown);
    tree.position.set(x, 0, z);
    scene.add(tree);
    crowns.push(crown);
  });
  return crowns;
}

function buildClouds(scene) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: false });
  const clouds = [];
  for (let i = 0; i < 4; i++) {
    const cloud = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(2 + Math.random() * 1.5, 10, 8), mat);
      puff.position.set(j * 2.6 - 2.6, Math.random() * 0.6, Math.random() * 1.5);
      puff.scale.y = 0.55;
      cloud.add(puff);
    }
    cloud.position.set(-55 + i * 30, 21 + (i % 2) * 4, -34 - i * 3);
    scene.add(cloud);
    clouds.push(cloud);
  }
  return clouds;
}

export default function MowingBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      return; // no WebGL — silently skip the background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaee2ff);
    scene.fog = new THREE.Fog(0xaee2ff, 90, 150);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 32, 46);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7ec850, 1.35));
    const sun = new THREE.DirectionalLight(0xfff8e0, 1.6);
    sun.position.set(18, 30, 12);
    scene.add(sun);

    // lawn with paintable texture
    const texCanvas = document.createElement("canvas");
    texCanvas.width = TEX_W;
    texCanvas.height = TEX_H;
    const ctx = texCanvas.getContext("2d");
    paintFreshGrass(ctx);
    const texture = new THREE.CanvasTexture(texCanvas);
    const lawn = new THREE.Mesh(
      new THREE.PlaneGeometry(FIELD_W, FIELD_D),
      new THREE.MeshStandardMaterial({ map: texture })
    );
    lawn.rotation.x = -Math.PI / 2;
    scene.add(lawn);

    buildRoad(scene);
    const houseColors = [
      [0xfff6e0, 0xe0533a, 0x1fa06d],
      [0xeaf4ff, 0x3d5a80, 0xf58a2e],
      [0xfdeecd, 0x6faa3e, 0x2b4a8f],
    ];
    HOUSE_XS.forEach((cx, i) => buildHouse(scene, cx, ...houseColors[i]));
    const crowns = buildTrees(scene);
    const clouds = buildClouds(scene);

    // one mowing guy per yard, each on his own spiral
    const spiral = buildSpiral(YARD.hw, YARD.hd);
    const guyStyles = [
      [0x2e7d5f, 0xd64545],
      [0x3a6ea5, 0xf5a623],
      [0xc46a2b, 0x33415c],
    ];
    const guys = HOUSE_XS.map((cx, i) => {
      const group = buildMowerGuy(...guyStyles[i]);
      scene.add(group);
      return {
        group,
        cx,
        dist: spiral.total * (i * 0.37),
        paintedDist: spiral.total * (i * 0.37),
        speed: [4.2, 3.7, 4.6][i],
        laps: 0,
        prev: null,
      };
    });

    // world -> texture pixels
    const px = (x) => ((x + FIELD_W / 2) / FIELD_W) * TEX_W;
    const py = (z) => ((z + FIELD_D / 2) / FIELD_D) * TEX_H;
    const stripePx = (STRIPE / FIELD_D) * TEX_H + 3;

    const regrowYard = (cx) => {
      const x = px(cx - YARD.hw - 1.5);
      const y = py(YARD.cz - YARD.hd - 1.5);
      const w = px(cx + YARD.hw + 1.5) - x;
      const h = py(YARD.cz + YARD.hd + 1.5) - y;
      ctx.fillStyle = "#4cae52";
      ctx.fillRect(x, y, w, h);
      grassNoise(ctx, x, y, w, h, 700);
    };

    const paintTrail = (g) => {
      let changed = false;
      while (g.paintedDist < g.dist) {
        const next = Math.min(g.paintedDist + 1.0, g.dist);
        const a = spiralAt(spiral, g.paintedDist);
        const b = spiralAt(spiral, next);
        if (Math.hypot(b.x - a.x, b.z - a.z) < 3) {
          ctx.strokeStyle = a.seg % 2 === 0 ? "#95dd8b" : "#82d078";
          ctx.lineWidth = stripePx;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(px(g.cx + a.x), py(YARD.cz + a.z));
          ctx.lineTo(px(g.cx + b.x), py(YARD.cz + b.z));
          ctx.stroke();
          changed = true;
        }
        g.paintedDist = next;
      }
      return changed;
    };

    // grass clippings shared pool
    const CLIP_N = 60;
    const clipPos = new Float32Array(CLIP_N * 3);
    const clipVel = [];
    for (let i = 0; i < CLIP_N; i++) {
      clipPos[i * 3 + 1] = -5;
      clipVel.push({ vx: 0, vy: 0, vz: 0, life: 0 });
    }
    const clipGeo = new THREE.BufferGeometry();
    clipGeo.setAttribute("position", new THREE.BufferAttribute(clipPos, 3));
    const clippings = new THREE.Points(clipGeo, new THREE.PointsMaterial({ color: 0x8fe07a, size: 0.22 }));
    scene.add(clippings);
    let clipIdx = 0;
    let frame = 0;

    const clock = new THREE.Clock();
    let raf;
    let scrollT = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollT = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      frame++;
      let texChanged = false;

      guys.forEach((g, gi) => {
        g.dist += g.speed * dt;
        const lap = Math.floor(g.dist / spiral.total);
        if (lap > g.laps) {
          g.laps = lap;
          regrowYard(g.cx);
          g.paintedDist = g.dist;
          texChanged = true;
        }
        if (paintTrail(g)) texChanged = true;

        const local = spiralAt(spiral, g.dist);
        const wx = g.cx + local.x;
        const wz = YARD.cz + local.z;
        const dx = g.prev ? wx - g.prev.x : 0;
        const dz = g.prev ? wz - g.prev.z : 0;
        g.prev = { x: wx, z: wz };
        g.group.position.set(wx, Math.abs(Math.sin(g.dist * 6.4)) * 0.05, wz);
        if (Math.hypot(dx, dz) > 0.0001) {
          const heading = Math.atan2(dx, dz);
          let delta = heading - g.group.rotation.y;
          while (delta > Math.PI) delta -= Math.PI * 2;
          while (delta < -Math.PI) delta += Math.PI * 2;
          g.group.rotation.y += delta * Math.min(dt * 8, 1);
        }
        const { legL, legR, wheels } = g.group.userData;
        const swing = Math.sin(g.dist * 3.2) * 0.45;
        legL.rotation.x = swing;
        legR.rotation.x = -swing;
        wheels.forEach((w) => (w.rotation.x += g.speed * dt * 3.5));

        // spawn a clipping behind this guy every few frames
        if (frame % 3 === gi) {
          clipIdx = (clipIdx + 1) % CLIP_N;
          const v = clipVel[clipIdx];
          v.vx = (Math.random() - 0.5) * 2;
          v.vy = 2 + Math.random() * 2;
          v.vz = (Math.random() - 0.5) * 2;
          v.life = 1;
          clipPos[clipIdx * 3] = wx + Math.sin(g.group.rotation.y) * 1.5;
          clipPos[clipIdx * 3 + 1] = 0.4;
          clipPos[clipIdx * 3 + 2] = wz + Math.cos(g.group.rotation.y) * 1.5;
        }
      });

      if (texChanged) texture.needsUpdate = true;

      for (let i = 0; i < CLIP_N; i++) {
        const c = clipVel[i];
        if (c.life > 0) {
          c.life -= dt * 1.4;
          c.vy -= 9 * dt;
          clipPos[i * 3] += c.vx * dt;
          clipPos[i * 3 + 1] = Math.max(clipPos[i * 3 + 1] + c.vy * dt, 0.05);
          clipPos[i * 3 + 2] += c.vz * dt;
        } else {
          clipPos[i * 3 + 1] = -5;
        }
      }
      clipGeo.attributes.position.needsUpdate = true;

      crowns.forEach((c, i) => (c.rotation.z = Math.sin(t * 0.6 + i) * 0.04));
      clouds.forEach((c, i) => {
        c.position.x += dt * (0.4 + i * 0.12);
        if (c.position.x > 65) c.position.x = -65;
      });

      camera.position.y += (32 - scrollT * 10 - camera.position.y) * 0.05;
      camera.position.z += (46 - scrollT * 8 - camera.position.z) * 0.05;
      camera.lookAt(0, 0, -6 + scrollT * 5);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      texture.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
  );
}