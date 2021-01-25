import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import React, { Component } from "react";
import * as THREE from "three";

class ThreePage extends Component {
    constructor(props) {
        super(props);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.fpsCounter = null;
        this.timeout = null;
        this.state = {
            data: {
                loadTime: null,
                fps: [{
                    time: null,
                    threeJS: null
                }]
            },
            timer: 0
        }
    }
    updateData(data) {
        this.setState({data: data});
    }
    updateTimer() {
        this.setState({timer: this.state.timer + 1});
    }
    handleRedirect() {
        this.props.history.push({
            pathname: '/results',
            data: this.state.data
        });
    }
    componentDidMount() {
        var startTime = performance.now();
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
        );
        camera.position.set(0, 1, 5);

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor( 0x33334D, 1 );
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(renderer.domElement);

        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // var cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);
        const light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
        light.position.set(0, 0.5, 0);
        scene.add( light );
            
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('model/mutant2.gltf', (gltf) => {
            const root = gltf.scene;
            scene.add(root);

            var animate = function() {
                requestAnimationFrame(animate);
        
                root.rotation.y += 0.01;
                // cube.rotation.x += 0.01;
                // cube.rotation.y += 0.01;
        
                renderer.render(scene, camera);
            };
            var endTime = performance.now();
            console.log('1', endTime-startTime);
            this.updateData({...this.state.data, loadTime: endTime-startTime});
            animate();
        })

        // camera.position.z = 5;
        
        var resolution = {width: window.innerWidth, height: window.innerHeight}
        window.addEventListener('resize', function(event){
            const { innerWidth, innerHeight } = window;
            renderer.setSize( innerWidth, innerHeight );
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            resolution = {width: innerWidth, height: innerHeight}
            console.log(resolution)
        });

        let then = 0;
        var fps;
        function refreshLoop() {
            window.requestAnimationFrame(function(now) {
                now *= 0.001;
                const deltaTime = now - then;
                then = now;
                fps = 1 / deltaTime; 
                // console.log(fps); 
                refreshLoop();
            });
        }

        refreshLoop();

        this.fpsCounter = setInterval(() => {
            this.updateTimer();
            this.updateData({...this.state.data, fps: [...this.state.data.fps, {time: this.state.timer/10, threeJS: fps}]});
        }, 100)
        this.timeout = setTimeout(()=>{
            
            this.handleRedirect();
        }, 3000);
    }
    componentWillUnmount() {
        clearInterval(this.fpsCounter);
        clearTimeout(this.timeout);
    }

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

export default ThreePage;