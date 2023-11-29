/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
    FunctionComponent,
    useEffect,
    useCallback,
    useState,
  } from 'react';
  
  import {SafeAreaView, View, Button, ViewProps, StatusBar} from 'react-native';
  
  import {EngineView, useEngine} from '@babylonjs/react-native';
  import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
  import {Camera} from '@babylonjs/core/Cameras/camera';
  import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
  import {Color4} from '@babylonjs/core'
  import '@babylonjs/loaders/glTF';
  import {Scene} from '@babylonjs/core/scene';
  import {WebXRSessionManager, WebXRTrackingState} from '@babylonjs/core/XR';
  
  const SceneComponent= (props) => {
    const engine = useEngine();
    const [camera, setCamera] = useState();
    const [xrSession, setXrSession] = useState();
    const [trackingState, setTrackingState] = useState();
    const [scene, setScene] = useState();
  
    const onToggleXr = useCallback(() => {
      (async () => {
        if (xrSession) {
          await xrSession.exitXRAsync();
        } else {
          if (scene !== undefined) {
        
            const xr = await scene.createDefaultXRExperienceAsync({
              disableDefaultUI: true,
              disableTeleportation: true,
            });
            const session = await xr.baseExperience.enterXRAsync(
              'immersive-ar',
              'unbounded',
              xr.renderTarget,
            );
            setXrSession(session);
            session.onXRSessionEnded.add(() => {
              setXrSession(undefined);
              setTrackingState(undefined);
            });
  
            setTrackingState(xr.baseExperience.camera.trackingState);
            xr.baseExperience.camera.onTrackingStateChanged.add(
              newTrackingState => {
                setTrackingState(newTrackingState);
              },
            );
          }
        }
      })();
    }, [scene, xrSession]);
  
    useEffect(() => {
      if (engine) {

        const url =
          'https://hesh-configurator-3d.s3.ap-south-1.amazonaws.com/models/sofa_chair.glb';
        SceneLoader.LoadAsync(url, undefined, engine).then(loadScene => {
          setScene(loadScene);
          loadScene.createDefaultCameraOrLight(true, undefined, true);
          (loadScene.activeCamera).alpha += Math.PI;
          (loadScene.activeCamera).radius = 10;
          setCamera(loadScene.activeCamera);
        });

      
      }
    }, [engine]);
  
    return (
      <>
        <View style={props.style}>
          <Button
            title={xrSession ? 'Stop AR' : 'Start AR'}
            onPress={onToggleXr}
          />
          <View style={{flex: 1}}>
            <EngineView camera={camera}  />
          </View>
        </View>
      </>
    );
  };
  

  export default SceneComponent;