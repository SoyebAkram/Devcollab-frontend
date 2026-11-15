import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);
  const location = useLocation();

  // Route অনুযায়ী ৩ডি অ্যানিমেশন ম্যাপিং
  const getMode = (path) => {
    if (path.includes('kanban')) return 'kanban';
    if (path.includes('bugs')) return 'radar';
    if (path.includes('projects')) return 'git';
    return 'team'; // Default: Dashboard Team Mesh
  };

  const mode = getMode(location.pathname);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 26);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Nordic Glacier Color Palette
    const primaryColor = 0x38BDF8;   // Electric Ice Cyan
    const secondaryColor = 0x0EA5E9; // Azure Sky
    const accentCol = 0x60A5FA;

    // 1. Git Commit Tree (Projects Page)
    const gitGroup = new THREE.Group();
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, -4, 0),
      new THREE.Vector3(-9, -2, 2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(9, 2, -2),
      new THREE.Vector3(18, 4, 0)
    ]);
    const mainMesh = new THREE.Mesh(
      new THREE.TubeGeometry(mainCurve, 64, 0.25, 8, false),
      new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.75 })
    );
    gitGroup.add(mainMesh);

    const featCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9, -2, 2),
      new THREE.Vector3(-4, 5, 6),
      new THREE.Vector3(3, 6, 4),
      new THREE.Vector3(9, 2, -2)
    ]);
    const featMesh = new THREE.Mesh(
      new THREE.TubeGeometry(featCurve, 64, 0.2, 8, false),
      new THREE.MeshBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0.65 })
    );
    gitGroup.add(featMesh);

    const bugCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(4, -5, -4),
      new THREE.Vector3(12, -3, -2),
      new THREE.Vector3(18, 4, 0)
    ]);
    const bugMesh = new THREE.Mesh(
      new THREE.TubeGeometry(bugCurve, 64, 0.18, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x10B981, transparent: true, opacity: 0.6 })
    );
    gitGroup.add(bugMesh);

    const commits = [
      new THREE.Vector3(-18, -4, 0),
      new THREE.Vector3(-9, -2, 2),
      new THREE.Vector3(-4, 5, 6),
      new THREE.Vector3(3, 6, 4),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(4, -5, -4),
      new THREE.Vector3(9, 2, -2),
      new THREE.Vector3(18, 4, 0)
    ];
    const commitSpheres = [];
    commits.forEach((pos, i) => {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? primaryColor : secondaryColor, transparent: true, opacity: 0.9 })
      );
      s.position.copy(pos);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.08, 8, 24),
        new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.4 })
      );
      ring.rotation.x = Math.PI / 2.5;
      s.add(ring);
      gitGroup.add(s);
      commitSpheres.push(s);
    });

    const packetCount = 40;
    const packetGeo = new THREE.BufferGeometry();
    const packetPos = new Float32Array(packetCount * 3);
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
    const packets = new THREE.Points(
      packetGeo,
      new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.9, transparent: true, opacity: 0.95 })
    );
    gitGroup.add(packets);
    scene.add(gitGroup);

    // 2. Kanban Pipeline (Kanban Board Page)
    const kanbanGroup = new THREE.Group();
    const pillars = [-13, -4.5, 4.5, 13];
    pillars.forEach((x, idx) => {
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 22, 16),
        new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.35 })
      );
      p.position.set(x, 0, -4);
      kanbanGroup.add(p);

      for (let r = 0; r < 2; r++) {
        const card = new THREE.Mesh(
          new THREE.BoxGeometry(4.2, 2.6, 0.4),
          new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true, transparent: true, opacity: 0.55 })
        );
        card.position.set(x, 4 - r * 5.5, -4);
        card.userData = { baseY: 4 - r * 5.5, phase: idx + r };
        kanbanGroup.add(card);
      }
    });

    const sprintRing = new THREE.Mesh(
      new THREE.TorusGeometry(18, 0.18, 12, 80),
      new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.3 })
    );
    sprintRing.rotation.x = Math.PI / 2.2;
    sprintRing.position.y = -6;
    kanbanGroup.add(sprintRing);
    scene.add(kanbanGroup);

    // 3. Bug Radar (Bug Tracker Page)
    const radarGroup = new THREE.Group();
    for (let r = 4; r <= 16; r += 4) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.08, r, 64),
        new THREE.MeshBasicMaterial({ color: primaryColor, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.position.y = -4;
      radarGroup.add(ring);
    }
    const radarBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 16, 0.1, 32, 1, false, 0, Math.PI / 3),
      new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    radarBeam.rotation.x = Math.PI / 2.4;
    radarBeam.position.y = -4;
    radarGroup.add(radarBeam);

    const bugMeshes = [];
    [
      new THREE.Vector3(-7, 1, 2),
      new THREE.Vector3(8, -1, -3),
      new THREE.Vector3(-3, 5, -2),
      new THREE.Vector3(6, 4, 3)
    ].forEach((pos, i) => {
      const b = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.85, 0),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xF43F5E : 0x10B981, wireframe: true, transparent: true, opacity: 0.85 })
      );
      b.position.copy(pos);
      radarGroup.add(b);
      bugMeshes.push(b);
    });
    scene.add(radarGroup);

    // 4. Team Dev Mesh (Dashboard Page)
    const teamGroup = new THREE.Group();
    const coreHub = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.5, 1),
      new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true, transparent: true, opacity: 0.65 })
    );
    teamGroup.add(coreHub);

    const teamSats = [];
    [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((ang, i) => {
      const sat = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.3, 0),
        new THREE.MeshBasicMaterial({ color: i === 0 ? primaryColor : (i === 1 ? secondaryColor : accentCol), wireframe: true, transparent: true, opacity: 0.85 })
      );
      teamGroup.add(sat);
      teamSats.push({ sat, ang });
    });
    scene.add(teamGroup);

    // Mouse movement parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentMode = modeRef.current;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 3 + 3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      gitGroup.visible = currentMode === 'git';
      kanbanGroup.visible = currentMode === 'kanban';
      radarGroup.visible = currentMode === 'radar';
      teamGroup.visible = currentMode === 'team';

      if (gitGroup.visible) {
        gitGroup.rotation.y = elapsed * 0.08 + mouseX * 0.2;
        commitSpheres.forEach((cs, idx) => {
          cs.children[0].rotation.z = elapsed * (idx % 2 === 0 ? 1 : -1) * 0.8;
        });
        const pos = packets.geometry.attributes.position;
        for (let i = 0; i < packetCount; i++) {
          const t = ((elapsed * 0.16 + i / packetCount) % 1);
          let pt = (i % 3 === 0 ? mainCurve : (i % 3 === 1 ? featCurve : bugCurve)).getPoint(t);
          pos.setXYZ(i, pt.x, pt.y, pt.z);
        }
        pos.needsUpdate = true;
      }

      if (kanbanGroup.visible) {
        kanbanGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.15 + mouseX * 0.2;
        kanbanGroup.children.forEach((c) => {
          if (c.userData && c.userData.baseY !== undefined) {
            c.position.y = c.userData.baseY + Math.sin(elapsed * 2 + c.userData.phase) * 0.4;
          }
        });
      }

      if (radarGroup.visible) {
        radarGroup.rotation.y = mouseX * 0.3;
        radarBeam.rotation.z = -elapsed * 1.4;
        bugMeshes.forEach((bm) => {
          bm.rotation.x = elapsed * 0.8;
          bm.rotation.y = elapsed * 0.6;
        });
      }

      if (teamGroup.visible) {
        coreHub.rotation.y = elapsed * 0.4;
        teamSats.forEach((ts) => {
          const ang = ts.ang + elapsed * 0.35;
          ts.sat.position.set(Math.cos(ang) * 12, Math.sin(ang * 2) * 2, Math.sin(ang) * 8.5);
          ts.sat.rotation.x = elapsed * 1.2;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}