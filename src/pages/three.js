import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import PanelComponent from '../components/panel';

const ThreePage = () => {
    const refDiv = useRef(null);
    const [fpsState, setFpsState] = useState(0);
    const [progressState, setProgressState] = useState(0);

    const [, setCookie] = useCookies(['ThreeJS']);
    const history = useHistory();
    var interval;
    var fpsArray = [];
    var resolution = {width: window.innerWidth, height: window.innerHeight};

    var loadStart = performance.now();

    useEffect(() => {
        // console.log("Load Start: ", loadStart);
        if(refDiv.current) {
            
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
            refDiv.current.appendChild(renderer.domElement);
            
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
                var loadEnd = performance.now();
                // console.log("Load Time: ", loadEnd - loadStart);
                animate();
                let then = 0;
                let fps;
                function refreshLoop() {
                    window.requestAnimationFrame(function(now) {
                        now *= 0.001;
                        const deltaTime = now - then;
                        then = now;
                        fps = (1 / deltaTime); 
                        refreshLoop();
                    });
                }

                refreshLoop();

                setInterval(() => {
                    fpsArray.push(fps);
                    setFpsState(fps.toFixed(3));
                    setProgressState(fpsArray.length);
                }, 100);
                setTimeout(()=>{
                    setCookie('ThreeJS', {loadTime: loadEnd - loadStart, fps: fpsArray, resolution});
                    setCookie('Info', {
                        geometries: renderer.info.memory.geometries, 
                        textures: renderer.info.memory.textures, 
                        triangles: renderer.info.render.triangles, 
                    });
                    history.push('/babylon-js');
                }, 10000);
                
                // console.log( renderer.info );
            })
            // camera.position.z = 5;
            
            window.addEventListener('resize', function(event){
                const { innerWidth, innerHeight } = window;
                renderer.setSize( innerWidth, innerHeight );
                camera.aspect = innerWidth / innerHeight;
                camera.updateProjectionMatrix();
                // eslint-disable-next-line react-hooks/exhaustive-deps
                resolution = {width: innerWidth, height: innerHeight}

                // console.log(resolution)
            });
            return () => {
                clearInterval(interval);
            }

        }

    }, [refDiv]);


    return (
        <>
            <div ref={refDiv} />
            <PanelComponent fps={fpsState} progress={progressState} />
        </>
    );
};

export default ThreePage;