
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const geometry = new THREE.BoxGeometry(); 
const material = new THREE.MeshDepthMaterial( {displacementScale:2} );
for(let i=0; i<10; i++){
    
    for(let j=0; j<10; j++){
        const cube = new THREE.Mesh( geometry, material );
        cube.position.z = i
        cube.position.x = j
        cube.rotation.y = i
        scene.add( cube );
    }
}

camera.position.z = 5;
camera.position.y = 0.8;
camera.rotation.y = -0.8;

function animate() { 
    requestAnimationFrame( animate ); 
    renderer.render( scene, camera ); 
    camera.position.z -= 0.01
}
animate();
