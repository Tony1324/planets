import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import {PointerLockControls} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();

camera.position.z = 4
camera.position.y = 1

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );


//lights
const dirLight = new THREE.DirectionalLight( 0xffffff, 0.2, 0 );
dirLight.position.set( 1, 1, 0 ).normalize();
dirLight.castShadow = true;
scene.add( dirLight );

const ambientLight = new THREE.AmbientLight( 0xcccccc ); // soft white light
scene.add( ambientLight );

scene.fog = new THREE.Fog(0x000000, 0.1, 8);

var pointerControls = new PointerLockControls(camera, document.body);

pointerControls.addEventListener('lock',()=>{
    document.querySelector("#menu").style.display="none"
})

pointerControls.addEventListener('unlock',()=>{
    document.querySelector("#menu").style.display="flex"
})


var isForward = false
var isBackward = false
var isLeft = false
var isRight = false
var isPushing = false
var isPulling = false

window.addEventListener("mousedown", (e)=>{
    if(e.which == 3){
        isPulling = true
    }else{
        isPushing = true
    }
})

window.addEventListener("mouseup", (e)=>{
    if(e.which == 3){
        isPulling = false
    }else{
        isPushing = false
    }
})

window.addEventListener("contextmenu", (e)=>{e.preventDefault()})

window.addEventListener("keydown", (e)=>{
    if(e.code == "KeyW"){
        isForward = true
    }else if(e.code == "KeyS"){
        isBackward = true
    }else if(e.code == "KeyA"){
        isLeft = true
    }else if(e.code == "KeyD"){
        isRight = true
    }
})

window.addEventListener("keyup", (e)=>{
    if(e.code == "KeyW"){
        isForward = false
    }else if(e.code == "KeyS"){
        isBackward = false
    }else if(e.code == "KeyA"){
        isLeft = false
    }else if(e.code == "KeyD"){
        isRight = false
    }
})

document.querySelector("#start-btn").addEventListener("click", ()=>{
    pointerControls.connect()
    pointerControls.lock()
})

document.addEventListener("keypress", (e)=>{
    if(pointerControls.isLocked){
        if(e.code == "Space"){
            let pos = pointerControls.getObject().position.clone()
            let direction = pointerControls.getObject().getWorldDirection()
            pos.x += Math.sin(direction.x)
            pos.y += Math.sin(direction.y)
            pos.z += Math.sin(direction.z)

            planets.push(new Planet(pos, {x:0,y:0,z:0},0.4))
        }
    }
})

let gravity = 30
 
let dt = 10

let isWireframe = true

class Planet {
    constructor(pos,vel,size){
        let geometry = new THREE.IcosahedronGeometry(size,10); 
        let material = new THREE.MeshLambertMaterial({wireframe:isWireframe});
    
        this.radius = size
        this.object = new THREE.Mesh( geometry, material );
        this.mass = Math.pow(size,3)*Math.PI*4/3*2
        this.velocity = new THREE.Vector3(0, 0, 0);
        Object.assign(this.velocity, vel)
        this.acceleration = new THREE.Vector3( 0, 0, 0);

        Object.assign(this.object.position,pos)
        scene.add(this.object)
    }

    move(){
        this.velocity.add(this.acceleration)
        let v = this.velocity.clone()
        v.multiplyScalar(1/dt)
        this.object.position.add(v)
    }

    physics(){
        this.acceleration = new THREE.Vector3( 0, 0, 0 )
        for(let planet of planets){
            if(planet != this){
                let dist = this.object.position.distanceTo(planet.object.position)
                let planetPos = planet.object.position.clone()
                planetPos.sub(this.object.position)
                planetPos.normalize()
                let direction = planetPos.clone()
                planetPos.multiplyScalar(planet.mass)
                planetPos.multiplyScalar(gravity/1000000)
                let force = planetPos.divideScalar(dist*dist)
                this.acceleration.add(force)


                if(dist < (planet.radius + this.radius)){
                    let correction = (this.radius + planet.radius) - dist
                    correction /= 2

                    let dir = direction.clone()
                    dir.multiplyScalar(correction)

                    planet.object.position.add(dir)
                    dir.multiplyScalar(-1)
                    this.object.position.add(dir)
                    

                    let v1 = direction.dot(this.velocity)
                    let v2 = direction.dot(planet.velocity)

                    let totalMass = this.mass + planet.mass


                    direction.multiplyScalar((v1 - v2))
                    let f1 = direction.clone()
                    f1.multiplyScalar(planet.mass/totalMass * 2)
                    this.velocity.sub(f1)
                    let f2 = direction.clone()
                    f1.multiplyScalar(this.mass/totalMass * 2)
                    planet.velocity.add(direction)

                }
            }
        }
    }
}

let planets = []

planets.push(new Planet({x:0,y:0,z:0}, {x:0,y:0,z:0},1))
planets.push(new Planet({x:1.6,y:0.1,z:0}, {x:0,y:0,z:0.04},0.2))
planets.push(new Planet({x:-3,y:-0.2,z:0}, {x:0,y:0,z:-0.03},0.3))
planets.push(new Planet({x:-3.5,y:-0.2,z:0}, {x:0,y:0,z:-0.015},0.05))
planets.push(new Planet({x:3,y:-0.2,z:3}, {x:-0.02,y:0,z:0.015},0.25))
planets.push(new Planet({x:5,y:0.1,z:0}, {x:-0.02,y:0.001,z:0.02},0.2))

planets.push(new Planet({x:-2,y:-0.2,z:0}, {x:0,y:0.01,z:0.03},0.04))
planets.push(new Planet({x:1,y:0.2,z:1}, {x:0,y:0.01,z:0.03},0.02))
planets.push(new Planet({x:-3,y:0.2,z:0}, {x:0,y:0.01,z:0.03},0.04))
planets.push(new Planet({x:2,y:0.1,z:0}, {x:0,y:0.01,z:0.03},0.03))
planets.push(new Planet({x:-2,y:-0.1,z:2}, {x:0,y:0.01,z:0.03},0.04))

let intersects = []

function animate() { 
    requestAnimationFrame( animate ); 

    intersects[0]?.object.material.color.set( 0xffffff );



    for(let i=0; i<dt; i++){
        for(let planet of planets){
            planet.physics()
        }
        for(let planet of planets){
            planet.move()
        }
    }

    const center = new THREE.Vector2(0, 0)
    raycaster.setFromCamera(center, camera)

    intersects = raycaster.intersectObjects(scene.children)

    intersects[0]?.object.material.color.set( 0x66ff66 );

    if(pointerControls.isLocked){
    if(isPushing || isPulling){
        for(let planet of planets){
            if(planet.object == intersects[0]?.object){

                intersects[0]?.object.material.color.set( 0x00ff00 );
                let direction = pointerControls.getObject().getWorldDirection()
                if(isPulling){
                    planet.velocity.x -= Math.sin(direction.x)/350
                    planet.velocity.y -= Math.sin(direction.y)/350
                    planet.velocity.z -= Math.sin(direction.z)/350
                    planet.velocity.multiplyScalar(0.9)
                }else{
                    planet.velocity.x += Math.sin(direction.x)/350
                    planet.velocity.y += Math.sin(direction.y)/350
                    planet.velocity.z += Math.sin(direction.z)/350
                    planet.velocity.multiplyScalar(0.9)
                }
            }
        }
    }

    if(isForward){
        let direction = pointerControls.getObject().getWorldDirection()
        pointerControls.getObject().position.x += Math.sin(direction.x)/25
        pointerControls.getObject().position.y += Math.sin(direction.y)/25
        pointerControls.getObject().position.z += Math.sin(direction.z)/25
    }
    if(isBackward){
        let direction = pointerControls.getObject().getWorldDirection()
        pointerControls.getObject().position.x -= Math.sin(direction.x)/25
        pointerControls.getObject().position.y -= Math.sin(direction.y)/25
        pointerControls.getObject().position.z -= Math.sin(direction.z)/25
    }

    if(isLeft){
        pointerControls.moveRight(-0.05)
    }

    if(isRight){
        pointerControls.moveRight(0.05)
    }
}

    renderer.render( scene, camera );

}
animate();




//menu options

document.querySelector("#wireframe-btn").addEventListener("click",()=>{
    isWireframe = !isWireframe
    document.querySelector("#wireframe-btn").innerHTML = isWireframe ? "Wireframe on" : "Wireframe off"
    for(let planet of planets){
        planet.object.material.wireframe = isWireframe
    } 
})

document.querySelector("#fog-input").addEventListener("change", (e)=>{

    let fog = parseInt(e.target.value)
    document.querySelector("#fog-input-label").innerHTML = "Fog distance (0 to turn off): " + fog

    scene.fog.far = fog

})

document.querySelector("#gravity-input").addEventListener("change", (e)=>{

    let g = parseInt(e.target.value)
    document.querySelector("#gravity-input-label").innerHTML = "Gravity strength: " + g

    gravity = g

})
