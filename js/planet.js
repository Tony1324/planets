import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

export class Planet {
    constructor(pos,size,resolution){
        let geometry = new THREE.IcosahedronGeometry(size,resolution); 
        let material = new THREE.MeshLambertMaterial({wireframe:true});
        this.object = new THREE.Mesh( geometry, material );
        Object.assign(this.object.position,pos)
        scene.add(this.object)
    }
}

