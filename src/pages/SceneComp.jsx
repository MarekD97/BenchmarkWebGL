import { Engine, Scene } from '@babylonjs/core'
import React, { useEffect, useRef, useState } from 'react'
import {useCookies} from 'react-cookie';
import { useHistory } from 'react-router-dom';
import PanelComponent from '../components/panel';

const SceneComp = (props) => {

    const [fpsState, setFpsState] = useState(0);
    const [progressState, setProgressState] = useState(0);
    
    const reactCanvas = useRef(null);
    const [, setCookie] = useCookies(['BabylonJS']);
    const history = useHistory();
    
    const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;
    
    var loadEnd, loadTime, fps = 0;

    var resolution = {width: window.innerWidth, height: window.innerHeight};
    var loadStart = performance.now();

    var resultsBabylon = [];

    useEffect(() => {
        // console.log("Load Start: " + loadStart);
        if (reactCanvas.current) {
            
            const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);

            const scene = new Scene(engine, sceneOptions);
            if (scene.isReady()) {
                props.onSceneReady(scene)
            } else {
                scene.onReadyObservable.addOnce(scene => props.onSceneReady(scene));
            }

            //Tutaj dokonujemy pomiaru czasu załadowania i mierzymy fps
            scene.executeWhenReady(() => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                loadEnd = performance.now();
                // console.log("Load End: " + loadEnd);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                loadTime = loadEnd - loadStart;
                // console.log("Load Time: " + loadTime);
                setInterval(function(){
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    fps = engine.getFps();
                    setFpsState(fps.toFixed(3));
                    setProgressState(resultsBabylon.length);
                    resultsBabylon.push(fps);
                }, 100);
                setTimeout(()=>{
                    setCookie('BabylonJS', {loadTime, fps: resultsBabylon, resolution});
                    history.push('/results');
                }, 10000);
            })

            engine.runRenderLoop(() => {
                if (typeof onRender === 'function') {
                    onRender(scene);
                }
                scene.render();
            })

            const resize = () => {
                scene.getEngine().resize();
                // eslint-disable-next-line react-hooks/exhaustive-deps
                resolution = {width: reactCanvas.innerWidth, height: reactCanvas.innerHeight}
            }
            if (window) {
                window.addEventListener('resize', resize);
            }
            return () => {
                scene.getEngine().dispose();
                if (window) {
                    window.removeEventListener('resize', resize);
                }
            }
        }
    }, [reactCanvas]);
    return (
        <>
            <canvas ref={reactCanvas} {...rest} style={{
                margin: '0 0 -4px 0',
                width: '100%',
                height: '100vh'}} />
            <PanelComponent fps={fpsState} progress={progressState} />
        </>
    );
}

export default SceneComp;