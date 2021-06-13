import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import {PointerLockControls} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//lights
const dirLight = new THREE.DirectionalLight( 0xffffff, 0.2, 0 );
dirLight.position.set( 1, 1, 0 ).normalize();
dirLight.castShadow = true;
scene.add( dirLight );

const ambientLight = new THREE.AmbientLight( 0xcccccc ); // soft white light
scene.add( ambientLight );

scene.fog = new THREE.Fog(0x000000, 1, 8);

var flyControls = new PointerLockControls(camera, document.body);
// flyControls.lookSpeed = 0.1;

class Planet {
    constructor(pos,size,resolution){
        let geometry = new THREE.IcosahedronGeometry(size,resolution); 
        let material = new THREE.MeshLambertMaterial({wireframe:false});
    

        this.object = new THREE.Mesh( geometry, material );
        this.mass = Math.pow(size,3)*Math.PI*4/3
        this.velocity = new THREE.Vector3( Math.random()/100, Math.random()/100, Math.random()/100);
        this.acceleration = new THREE.Vector3( 0, 0, 0);

        Object.assign(this.object.position,pos)
        scene.add(this.object)
    }

    move(){
        this.velocity.add(this.acceleration)
        this.object.position.add(this.velocity)
    }

    gravity(){
        this.acceleration = new THREE.Vector3( 0, 0, 0 )
        for(let planet of planets){
            if(planet != this){
                let dist = this.object.position.distanceTo(planet.object.position)
                let planetPos = planet.object.position.clone()
                planetPos.sub(this.object.position)
                planetPos.normalize()
                planetPos.multiplyScalar(planet.mass)
                planetPos.multiplyScalar(0.00001)
                let force = planetPos.divideScalar(dist*dist)
                this.acceleration.add(force)
                console.log(dist)
            }
        }
    }
}

let planets = []

for(let i=0; i<10; i++){
    planets.push(new Planet({x:Math.random()*10-5,z:Math.random()*10-5,y:Math.random()*10-5},Math.random()*2,10))
}

function animate() { 
    requestAnimationFrame( animate ); 
    renderer.render( scene, camera );

    var delta = clock.getDelta();
    // flyControls.update(delta);

    for(let planet of planets){
        planet.gravity()
    }
    for(let planet of planets){
        planet.move()
    }
    // camera.position.add(camera.getWorldDirection().multiplyScalar(0.01))
}
animate();

