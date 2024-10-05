import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js';

import { AnimationMixer } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

let mixer;
let carActionClip;
let clock = new THREE.Clock();
let currentFrame = 0; // Initialize a frame counter
const totalFrames = 250; // Assume 250 frames for the car animation
let isScrolling = false;
let scrollTimeout = null;
let animationActive = false;

window.scrollTo(0, 0);

// Function to save camera position, lookAt direction, and controls.target to local storage
function saveCameraSettings() {
    if (!controls) return; // Vérifiez si controls est initialisé
    const cameraData = {
        position: camera_import.position.toArray(),
        lookAt: new THREE.Vector3().addVectors(camera_import.position, camera_import.getWorldDirection(new THREE.Vector3())).toArray(),
        target: controls.target.toArray() // Sauvegarde de la cible
    };
    console.log("Données de la caméra à sauvegarder : ", cameraData); // Ajoutez ceci pour déboguer
    localStorage.setItem('cameraSettings', JSON.stringify(cameraData));
}




function loadCameraSettings() {
    const savedCameraSettings = JSON.parse(localStorage.getItem('cameraSettings'));
    console.log("Données de la caméra sauvegardées : ", savedCameraSettings); // Ajoutez ceci pour déboguer

    if (savedCameraSettings) {
        if (savedCameraSettings.position && savedCameraSettings.target && savedCameraSettings.lookAt) {
            camera_import.position.fromArray(savedCameraSettings.position);
            
            if (controls) {
                controls.target.fromArray(savedCameraSettings.target);
                controls.update();
            }

            const lookAt = new THREE.Vector3().fromArray(savedCameraSettings.lookAt);
            camera_import.lookAt(lookAt);
        } else {
            console.error("Les paramètres de caméra sauvegardés sont invalides.");
        }
    } else {
        console.warn("Aucun paramètre de caméra sauvegardé trouvé.");
    }
}



window.addEventListener('scroll', () => {
    const trigger = document.getElementById('animation-trigger');
    const bgCanvas = document.getElementById('bg');
    const infoDiv = document.getElementById('info');
    
    const triggerPosition = trigger.getBoundingClientRect().top;

    // Si le déclencheur est dans la vue (ou a été dépassé)
    if (triggerPosition <= 0) {
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.top = '0';

        // Fixe la position du infoDiv aussi
        infoDiv.style.position = 'fixed'; // Changez ici
        infoDiv.style.top = '20px'; // Ajustez selon vos besoins (ajoutez des marges si nécessaire)
    } else {
        bgCanvas.style.position = 'absolute';
        bgCanvas.style.left = '0';
        bgCanvas.style.width = '100%';
        bgCanvas.style.top = 'auto';

        infoDiv.style.position = 'absolute'; // Changez ici si vous voulez le faire revenir à absolu
        infoDiv.style.top = 'auto'; // Réinitialiser la position
    }
});


// Setup scene and camera
const scene = new THREE.Scene();
//let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let camera_import = new THREE.PerspectiveCamera(
    75,                               // fov
    window.innerWidth / window.innerHeight,               // aspect
    0.1,                              // near
    1000                              // far
  );

const cameraData = {
    position: [2.6115845628472982, 23.00771290543952, -17.57358522600678],
    lookAt: [3.1134650905664922, 22.274985067735138, -17.113992088819806],
    target: [19.43136370524337, -1.5485703552026762, -2.1710050582203277]
};

camera_import.position.set(...cameraData.position);
// Faire regarder la caméra vers le point spécifié par lookAt
const lookAtVector = new THREE.Vector3(...cameraData.lookAt);
camera_import.lookAt(lookAtVector);

// OrbitControls
const controls = new OrbitControls(camera_import, renderer.domElement);
controls.target.set(...cameraData.target);
//loadCameraSettings();

camera_import.focus = 10;
camera_import.zoom = 1;
camera_import.filmGauge = 35; // Film Gauge
camera_import.filmOffset = 0; // Film Offset

camera_import.updateProjectionMatrix();



/*

{"position":[2.6115845628472982,23.00771290543952,-17.57358522600678],"lookAt":[3.1134650905664922,22.274985067735138,-17.113992088819806],"target":[19.43136370524337,-1.5485703552026762,-2.1710050582203277]}

*/


//camera.position.setZ(30);
//camera.position.setX(-3);

renderer.render(scene, camera_import);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('public/space.png', function (texture) {
    scene.background = texture; // Set the texture as the background
});


// Load GLTF model (car)
const loader = new GLTFLoader();
loader.load('public/real_scene2.gltf', function (gltf) {
  const car = gltf.scene;
  scene.add(car);

  mixer = new AnimationMixer(car);
  carActionClip = gltf.animations.find(clip => clip.name === 'carAction');
  
  if (carActionClip) {
    mixer.clipAction(carActionClip).play(); 
  } else {
    console.error('carAction animation not found');
  }
}, undefined, function (error) {
  console.error(error);
});

// Function to check if the user has scrolled past the trigger element
function hasScrolledPastTrigger() {
    const triggerElement = document.getElementById('animation-trigger');
    const triggerPosition = triggerElement.getBoundingClientRect().top;

    // Check if the top of the trigger element is above the viewport
    return triggerPosition < 0;
}

// Scroll Event Listener for controlling animation frames
window.addEventListener('scroll', () => {
    if (!hasScrolledPastTrigger()) {
        // If the user hasn't scrolled past the trigger, stop the animation
        animationActive = false;
        return;
    }

    // Now we are beyond the trigger
    animationActive = true;

    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (mixer && carActionClip) {
        const scrollProgress = Math.min(scrollY / maxScroll, 1); // Clamp to 1
        const targetFrame = Math.floor(scrollProgress * totalFrames);

        // Set the animation time based on scroll
        const animationDuration = carActionClip.duration;
        const frameDuration = animationDuration / totalFrames;
        const animationTime = targetFrame * frameDuration;

        // Update the animation time during scroll
        mixer.setTime(animationTime);

        // Mark that we are scrolling
        isScrolling = true;
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // Set a timeout to detect scroll end
        scrollTimeout = setTimeout(() => {
            isScrolling = false; // Stop animation updates
        }, 150); // 150ms after scroll stops, we pause the animation

        renderer.render(scene, camera_import); // Render the scene after updating the animation
        console.log(camera_import);
        controls.update();
    }
});

// Fonction pour ajuster la taille du rendu et la caméra lorsque la fenêtre est redimensionnée
window.addEventListener('resize', () => {
    // Mise à jour des dimensions du renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Mise à jour du ratio d'aspect de la caméra
    camera_import.aspect = window.innerWidth / window.innerHeight;
  
    // Nécessaire après la modification de l'aspect ratio
    camera_import.updateProjectionMatrix();
  
    // Re-rendu de la scène avec les nouvelles dimensions
    renderer.render(scene, camera_import);
  });

// Add event listener to save camera settings when the user moves the camera
//controls.addEventListener('change', saveCameraSettings);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer && isScrolling) {
    mixer.update(delta); // Update the mixer only if scrolling is happening
  }

  controls.update();
  renderer.render(scene, camera_import);
}

animate();