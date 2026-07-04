/* ===== Mobile nav toggle ===== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> navLinks.classList.remove('open'));
  });
}

/* ===== Scroll reveal ===== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ===== Project card 3D tilt ===== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.card').forEach(card=>{
  if(reduceMotion) return;
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = x - r.width/2;
    const cy = y - r.height/2;
    const rx = (cy / r.height) * -8;
    const ry = (cx / r.width) * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ===== ID card on lanyard — draggable pendulum ===== */
(function initLanyard(){
  const lanyard = document.getElementById('lanyard');
  const clip = document.querySelector('.lanyard-clip');
  if(!lanyard || !clip) return;

  let angle = 0;          // current rotation, degrees
  let angularVel = 0;      // degrees per frame
  let dragging = false;
  let rafId = null;
  const MAX_ANGLE = 42;
  const STIFFNESS = 0.06;
  const DAMPING = 0.90;

  function pivotPoint(){
    const r = clip.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  }

  function angleFromPointer(clientX, clientY){
    const p = pivotPoint();
    const dx = clientX - p.x;
    const dy = clientY - p.y;
    let deg = Math.atan2(dx, dy) * (180/Math.PI);
    return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, deg));
  }

  function applyAngle(deg){
    lanyard.style.transform = `rotate(${deg}deg)`;
  }

  function stepSpring(){
    const accel = (-angle * STIFFNESS);
    angularVel = (angularVel + accel) * DAMPING;
    angle += angularVel;
    applyAngle(angle);
    if(Math.abs(angle) > 0.05 || Math.abs(angularVel) > 0.05){
      rafId = requestAnimationFrame(stepSpring);
    } else {
      angle = 0; angularVel = 0;
      applyAngle(0);
      rafId = null;
    }
  }

  function onPointerDown(e){
    if(reduceMotion) return;
    dragging = true;
    lanyard.classList.add('dragging');
    if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    lanyard.setPointerCapture && lanyard.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e){
    if(!dragging) return;
    const prevAngle = angle;
    angle = angleFromPointer(e.clientX, e.clientY);
    angularVel = angle - prevAngle;
    applyAngle(angle);
  }

  function onPointerUp(){
    if(!dragging) return;
    dragging = false;
    lanyard.classList.remove('dragging');
    if(!rafId) rafId = requestAnimationFrame(stepSpring);
  }

  lanyard.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // gentle idle sway so it reads as "hanging" even before interaction
  if(!reduceMotion){
    let t = 0;
    function idleSway(){
      if(!dragging && rafId === null){
        t += 0.012;
        applyAngle(Math.sin(t) * 2.2);
      }
      requestAnimationFrame(idleSway);
    }
    requestAnimationFrame(idleSway);
  }
})();

/* ===== Three.js hero node-graph ===== */
(function initHeroGraph(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas || typeof THREE === 'undefined') return;

  const heroSection = document.querySelector('.hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, width/height, 0.1, 1000);
  camera.position.z = 42;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const NODE_COUNT = window.innerWidth < 760 ? 18 : 34;
  const RADIUS = 26;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.32, 12, 12);
  const nodeMatMain = new THREE.MeshBasicMaterial({color:0x4fd1c5});
  const nodeMatAlt = new THREE.MeshBasicMaterial({color:0xf2a65a});

  const group = new THREE.Group();
  scene.add(group);

  for(let i=0;i<NODE_COUNT;i++){
    const isAlt = i % 6 === 0;
    const mesh = new THREE.Mesh(nodeGeo, isAlt ? nodeMatAlt : nodeMatMain);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random()*2)-1);
    const r = RADIUS * (0.55 + Math.random()*0.5);
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.6,
      r * Math.cos(phi)
    );
    mesh.userData.velocity = new THREE.Vector3(
      (Math.random()-0.5)*0.01,
      (Math.random()-0.5)*0.01,
      (Math.random()-0.5)*0.01
    );
    group.add(mesh);
    nodes.push(mesh);
  }

  // connector lines between nearby nodes
  const lineMat = new THREE.LineBasicMaterial({color:0x2a5f5a, transparent:true, opacity:0.35});
  let lineSegments;
  function buildLines(){
    if(lineSegments){ group.remove(lineSegments); lineSegments.geometry.dispose(); }
    const positions = [];
    const maxDist = 14;
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if(d < maxDist){
          positions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
          positions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineSegments = new THREE.LineSegments(geo, lineMat);
    group.add(lineSegments);
  }
  buildLines();

  let frame = 0;
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function animate(){
    frame++;
    if(!reduceMotion){
      group.rotation.y += 0.0016;
      group.rotation.x += (mouseY*0.3 - group.rotation.x) * 0.02;
      group.rotation.y += (mouseX*0.15) * 0.01;

      if(frame % 3 === 0){
        nodes.forEach(n=>{
          n.position.add(n.userData.velocity);
          if(n.position.length() > RADIUS*1.15 || n.position.length() < RADIUS*0.4){
            n.userData.velocity.multiplyScalar(-1);
          }
        });
        buildLines();
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', ()=>{
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
})();
