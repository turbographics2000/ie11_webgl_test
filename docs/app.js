if(!Detector.webgl) Detector.addGetWebGLMessage();

// -------------------------
// 設定
// -------------------------
//カメラサイズ
var w  = window.innerWidth;
var h = window.innerHeight;
var aspect = w / h;
//カメラ上下角度
var fov    = 60;
//これよりカメラに近い領域はレンダリングしない
var near   = 1;
//これよりカメラから遠い領域はレンダリングしない
var far    = 1000000;
//シーン
var scene = new THREE.Scene();
//カメラ
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 300);
//レンダラー
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

//ライト
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 150, 0);
scene.add(directionalLight);

var STATS_ENABLED = false;
var stats;
var effect;
var model;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var loader = new THREE.JSONLoader();

init();
animate();

function init(){
    loader.load('obj.json', (geometry, materials) => {
        var wireframe = new THREE.WireframeGeometry(geometry);
        var lineMat= new THREE.LineBasicMaterial({
            //モデルの色
            color: 0x000000
        });
        var model = new THREE.LineSegments(wireframe, lineMat);
        model.material.depthTest = false;
        model.material.transparent = true;
        //透過
        model.material.opacity = 0.3;
        //モデルの大きさ
        model.scale.x = 100;
        model.scale.y = 100;
        model.scale.z = 100;

        scene.add(model);
        var rot = (function(){
            //回転
            requestAnimationFrame(arguments.callee);
            model.rotation.y += 0.005;
            effect.render(scene, camera);
        })();
    });

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;

    effect = new THREE.ParallaxBarrierEffect(renderer);
    effect.setSize(width, height);

    if(STATS_ENABLED){
        stats = new Stats();
        container.appendChild(stats.dom);
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(){
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    var w  = window.innerWidth;
    var h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event){
    mouseX = (event.clientX - windowHalfX) / 5;
    mouseY = (event.clientY - windowHalfY) / 5;
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render(){
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (- mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);
    effect.render(scene, camera);
    if(STATS_ENABLED) stats.update();
}
