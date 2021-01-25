import React from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import SceneComp from './SceneComp';

const onSceneReady = scene => {
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    // This targets the camera to scene origin
    const canvas = scene.getEngine().getRenderingCanvas();
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    

    //TUTAJ ZNAJDUJE SIĘ ZAŁADOWANIE OBIEKTU GLTF vvvvvvvvvv
    BABYLON.SceneLoader.Append('model/', 'mutant2.gltf', scene, function(scene){
        scene.createDefaultCameraOrLight(true, true, true);
        // scene.activeCamera.alpha += Math.PI;
    })

    scene.registerBeforeRender(function() {
        let mesh = scene.getMeshByName("__root__");
        if (mesh){
            mesh.rotationQuaternion = null;
            mesh.rotation.y -= 0.02
        }
    })
}

/*
 * Will run on every frame render
 */
const onRender = scene => {
  
}

const BabylonPage = () => (
    <SceneComp antialias onSceneReady={onSceneReady} onRender={onRender} id='my-canvas' />
);

export default BabylonPage;
