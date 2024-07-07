import * as THREE from './threejs/three.module.js'
import { DragControls } from './DragControls.js'

// Canvas
const canvas = document.querySelector('#threeBlanket')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Texture Loader
const texture = new THREE.TextureLoader()

// Scene
const scene = new THREE.Scene()

// Create Record Jacket Components
// Textures
// const jacketface_texture = texture.load('../images/imaginarydeadlines-jacket-front.png');
// const jacketback_texture = texture.load('../images/imaginarydeadlines-jacket-back.png');
// Geometry

const weatherblanket = new THREE.Group()

const barPairs = []

for (let i = 0; i < dayNum; i++) {
    barPairs.push('barPair' + i)
    barPairs[i] = new THREE.Group()
    const width = 14
    const low = weatherData[i]['MIN']
    const high = weatherData[i]['MAX']
    const precip = weatherData[i]['PRCP']
    const lowColor = heatColorScale(low)
    const highColor = heatColorScale(high)
    const heatHeight = high-low
    const rainHeight = precip
    const positionX = ((-(dayNum * ((sizes.width/dayNum) * 1.5)) / 2) + (i * ((sizes.width/dayNum) * 1.5)))
    const positionZ = 0;
    const heatMidpoint = 10000
    // const date = (props.weatherData[i][0]).toLocaleString('default', { month: 'long' })

    const heatBarGeo = new THREE.PlaneGeometry(width, heatHeight)
    const rainBarGeo = new THREE.PlaneGeometry(width, rainHeight)

    // Materials
    const heatBarMat = new THREE.MeshBasicMaterial({ color: highColor })
    const rainBarMat = new THREE.MeshBasicMaterial({ color: 'blue' })

    // Meshes
    const heatBar = new THREE.Mesh(heatBarGeo, heatBarMat)
    const rainBar = new THREE.Mesh(rainBarGeo, rainBarMat)

    // Position Bars
    heatBar.position.set(positionX, heatMidpoint, positionZ)
    heatBar.rotation.y += Math.PI
    rainBar.position.set(positionX, ((rainHeight - 500)/2) - 800, positionZ)

    // Group Bar Pairs
    barPairs[i].add(heatBar)
    if (rainHeight > 0) {
        barPairs[i].add(rainBar)
    }

    // Group Bars
    weatherblanket.add(barPairs[i])
};

// Add to Scene
scene.add(weatherblanket)

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0, 0);


console.log(window.innerHeight, window.innerWidth)
console.log(weatherblanket.children)

function onPointerMove( event ) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;

    raycaster.setFromCamera(pointer, camera);

    let intersects = raycaster.intersectObject(weatherblanket.children[0]);

    if (intersects.length > 0) {
        console.log(intersects)
        let object = intersects[0].object;
        object.material.color.set( Math.random() * 0xffffff );
    }
}

    console.log(barPairs[1], barPairs[5])
// // Create Vinyl
// const vinylfront_texture = texture.load('../images/imaginarylp-side1.png')
// const vinyl_bump = texture.load('../images/vinyl-bump.png')
// const vinyl_geo = new THREE.CylinderGeometry(150, 150, 2, 64, 3)
// const vinyl_mat = new THREE.MeshBasicMaterial({ map: vinylfront_texture })
// vinyl_mat.transparent = true
// const vinyl_matb = new THREE.MeshPhongMaterial({ bumpMap: vinyl_bump })
// const vinyl = new THREE.Mesh(vinyl_geo, vinyl_mat, vinyl_matb)

// vinyl.position.set(100, 0, -1.5)
// vinyl.rotation.x = Math.PI / 2

// scene.add(vinyl)

// Camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 1, 10000)
camera.position.z = 10000
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

// Controls
// const controls = new DragControls(weatherblanket, camera, renderer.domElement)
// controls.enableDamping = true

// controls.addEventListener( 'dragstart', function ( event ) {
// 	event.object.material.emissive.set( 0xaaaaaa );
// } )

// controls.addEventListener( 'dragend', function ( event ) {
// 	event.object.material.emissive.set( 0x000000 );
// } )

// Fit-Screen
function resize() {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    // you must pass false here or three.js sadly fights the browser
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    for (let i = 0; i < dayNum; i++) {
        const barWidth = (width/dayNum)/3.2
        barPairs[i].scale.set(barWidth, height*100)
        barPairs[i].position.x = (-(dayNum * barWidth) / 2) + barWidth
        barPairs[i].position.y = 200
        if (barPairs[i][1]) {
            barPairs[i][1].scale.y = (height * .3) / 5
        }
    }
}
  
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas, {box: 'content-box'});

// Fullscreen support, including safari
function fullscreen() {
  
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    }
    else {
        if(document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }

    }
}

// window.addEventListener('dblclick', fullscreen)

function render() {
    if (resize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.position.y = canvas.clientHeight * .5
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

window.addEventListener('pointermove', onPointerMove);
window.requestAnimationFrame(render);

    // Call tick again on the next frame
    // window.requestAnimationFrame(tick)


// "12 Inch Vinyl Record EP" (https://skfb.ly/6Z8zV) by finnddot is licensed 
// under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).