import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js';

window.scrollTo(0, 0);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#stl_model'),
})

const canvasContainer = document.querySelector('#stl_model');
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
camera.updateProjectionMatrix();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight/1.5);
camera.aspect = window.innerWidth / (window.innerHeight / 1.5);
camera.updateProjectionMatrix();

camera.position.x = -14.711182575911309;
camera.position.y = 17.33496404762849;
camera.position.z = 16.073784580717042;


scene.background = new THREE.Color('#212529');


const light = new THREE.DirectionalLight(0xffffff,5);
const light_2 = new THREE.DirectionalLight(0xffffff,3);
const light_3 = new THREE.DirectionalLight(0xffffff,3);
const light_4 = new THREE.DirectionalLight(0xffffff,3);
const light_5 = new THREE.DirectionalLight(0xffffff,3);

const light_under = new THREE.AmbientLight(0xffffff,1);

const rgb_light = new THREE.DirectionalLight(0xffffff,1);

let help_light = new THREE.DirectionalLightHelper(light);
let help_light_2 = new THREE.DirectionalLightHelper(light_2);
let help_light_3 = new THREE.DirectionalLightHelper(light_3);
let help_light_4 = new THREE.DirectionalLightHelper(light_4);
let help_light_5 = new THREE.DirectionalLightHelper(light_5);

//scene.add(help_light);
//scene.add(help_light_2);
//scene.add(help_light_3);
//scene.add(help_light_4);
//scene.add(help_light_5);

scene.add(light);
scene.add(light_2);
scene.add(light_3);
scene.add(light_4);
scene.add(light_5);
scene.add(light_under);

let hue = 0;



light.position.set(3,10,10);
light_2.position.set(0, 0, -20);
light_3.position.set(0, 0, 15);
light_4.position.set(-20,5,0);
light_5.position.set(25,5,0);
light_under.position.set(4,-10, -1);

rgb_light.position.set(0,3,0);

const controls = new OrbitControls(camera,renderer.domElement);
controls.enableZoom = false;

scene.add(rgb_light);

const loader = new GLTFLoader();

let keyboard;
let mixer;

loader.load(
    '/public/final.gltf',
    function(gltf) {
        keyboard = gltf.scene;
        mixer = new THREE.AnimationMixer(keyboard);
        const clips = gltf.animations;
        clips.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;
            action.paused = true;
        });

        keyboard.position.set(0,0,0);
        console.log('Model loaded:', gltf); 
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error('An error occurred:', error);
    }
);


function animateLightColor() {
    hue += 0.001;
    if (hue > 1) hue = 0; 

   
    const color = new THREE.Color();
    color.setHSL(hue, 1, 0.5);
    rgb_light.color.set(color);
}

function playAnimation() {
    if (mixer) {
        mixer._actions.forEach(action => {
            action.paused = false;
            action.play();
        });
    }
}

let clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate);
    if(mixer)
    {
        mixer.update(clock.getDelta()); 
    }

    controls.update();
    playAnimation();
    animateLightColor();
    renderer.render(scene,camera);
}

function onWindowResize() {
    const canvasContainer = document.querySelector('#stl_model');
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
}


window.addEventListener('resize', onWindowResize);

onWindowResize();

animate();
