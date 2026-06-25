"use client";
import * as React from 'react';
import AFRAME from 'aframe';
import '@ucl-nuee/robot-loader/robotRegistry.js';
import '@ucl-nuee/robot-loader/robotLoader.js';
import '@ucl-nuee/robot-loader/stillObjects.js';
import '@ucl-nuee/robot-loader/ikWorker.js';
import '@ucl-nuee/robot-loader/jointMoveTo.js';
import '@ucl-nuee/robot-loader/reflectWorkerJoints.js';
import '@ucl-nuee/robot-loader/reflectJointLimits.js';
import '@ucl-nuee/robot-loader/reflectCollision.js';
import '@ucl-nuee/robot-loader/armMotionUI.js';
import '@ucl-nuee/robot-loader/vrControllerThumbMenu.js';
import '@ucl-nuee/robot-loader/axesFrame.js';
import '@ucl-nuee/robot-loader/attachToAnother.js';
import '@ucl-nuee/robot-loader/baseMover.js';
import '@ucl-nuee/robot-loader/ChangeOpacity.js';
import '@ucl-nuee/robot-loader/fingerCloser.js';
import '@ucl-nuee/robot-loader/ignoreCollision.js';
import '@ucl-nuee/ik-cd-worker/IkWorkerParamsComponents.js';

function toSchema (obj, separator='; ') {
  if (typeof obj !== 'object' || obj === null) {
    return String(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => toSchema(v, ',')).join(', ');
  }
  return Object.entries(obj)
    .map(([key, value]) => `${key}: `+toSchema(value,','))
    .join(separator);
};

function App() {
  const deg90 = Math.PI/2;
  const deg80 = 80.0/180*Math.PI;
  const deg45 = Math.PI/4;
  const deg22 = Math.PI/8;
  const deg10 = 10.0/180*Math.PI;
  const sin15 = Math.sin(Math.PI/12);
  const cos15 = Math.cos(Math.PI/12);
  const menuSchemaR = toSchema({items: ['g1r-unitree-r-arm',
                                        'ur5e',
                                        'g1l-unitree-l-arm',
                                        'ray'],
                                laser: false});
  const menuSchemaL = toSchema({items: ['g1r-unitree-r-arm',
                                        'ur5e',
                                        'g1l-unitree-l-arm',
                                        'ray'],
                                laser: false});
  return (
    <a-scene xr-mode-ui="XRMode: xr"
      cd-worker-log-timing="timing: true"
      cd-worker-log-collision="logCollision: true"
    >
      <a-entity camera position="-0.5 1.2 1.2"
      		wasd-controls="acceleration: 20; fly: true"
                look-controls></a-entity>
      <a-entity id="robot-registry"
                robot-registry >
        <a-entity right-controller
                  laser-controls="hand: right"
                  thumbstick-menu={menuSchemaR}
                  target-selector="id: g1r-unitree-r-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
        <a-entity left-controller
                  laser-controls="hand: left"
                  thumbstick-menu={menuSchemaL}
                  target-selector="id: g1l-unitree-l-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
      </a-entity>
      <a-plane id="ur5e"
               position="-1.0 0.0 -0.5" rotation="-90 0 -90"
               width="0.04" height="0.04" color="blue"
               robot-loader="model: ur5e"
               ik-worker={`0, ${-deg90}, ${deg90}, 0, ${deg90}, 0`}
               exact_solution="exact: false"
               reflect-worker-joints
               reflect-collision="color: orange"
               reflect-joint-limits
               joint-limit-keep-moving-mask="mask: 0, 0, 0, 1, 1, 1"
               arm-motion-ui
               base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
               joint-desirable={toSchema({gain: {2:10},
                                          upper: {1:0, 2:deg80, 3:0},
			                  lower: {1:deg10, 2:deg10, 3:0}})}
               joint-desirable-vlimit="all: 0.5"
      />
      <a-box id="unitree-g1-torso"
             position="0 0 -0.5" rotation="-90 0 90"
             width="0.1" height="0.1" depth="0.005" color="red"
             base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
      >
        <a-plane id="g1r-unitree-r-arm"
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-right"
                 ik-worker={`${0}, ${-deg22}, ${0}, ${0}, ${0}, 0, 0`}
                 joint-move-to={`${0}, ${deg22}, ${0}, ${0}, ${0}, 0, 0`}
                 exact_solution_slrm="exact: false"
                 joint-desirable={toSchema({gain: {0:20,1:20,3:40},
                                            upper: {0:0.382,1:-0.785,3:1.396},
				            lower: {0:0.382,1:-0.785,3:0.0}})}
                 joint-desirable-vlimit="all: 2.0"
                 reflect-collision="color: yellow"
                 ignore-collision="other:ur5e; data: 0/0, 1/0, 0/1"
                 joint-limit-keep-moving-mask="mask: 0, 0, 0, 0, 1, 1, 1"
                 reflect-joint-limits
                 arm-motion-ui
                 set-end-effector-pose={
                   toSchema({position: [0.1, 0.0, 0.0],
                             quaternion: [0, 0, sin15, cos15]})}
                 attach-opacity-recursively="opacity: 0.5"
                 send-base-coord
        >
          <a-circle id="g1rt-unitree-r-thumb"
                    robot-loader="model: g1-right-thumb"
                    attach-to-another="to: g1r-unitree-r-arm;event: a,b,x,y"
                    ik-worker="0, -0.79, -0.79"
                    joint-move-to="0, -0.79, -0.79"
                    finger-closer2="stationaryJoints: 0; closeMax: -45"
                    radius="0.003" color="gray"
                    ignore-collision="other:g1r-unitree-r-arm; data: 0/6, 0/7, 0/8, 1/7, 1/8"
                    reflect-collision="color: yellow"
          />
          <a-circle id="g1ri-unitree-r-index"
                    robot-loader="model: g1-right-index"
                    attach-to-another="to: g1r-unitree-r-arm;event: a,b,x,y"
                    ik-worker="0, 0"
                    finger-closer2
                    radius="0.003" color="gray"
                    ignore-collision__a="other:g1r-unitree-r-arm; data: 0/6, 0/7, 0/8"
                    ignore-collision__t="other:g1rt-unitree-r-thumb; data: 0/0, 1/0"
                    reflect-collision="color: yellow"
          />
          <a-circle id="g1rm-unitree-r-middle"
                    robot-loader="model: g1-right-middle"
                    attach-to-another="to: g1r-unitree-r-arm;event: a,b,x,y"
                    ik-worker="0, 0"
                    finger-closer2
                    radius="0.003" color="gray"
                    ignore-collision__a="other:g1r-unitree-r-arm; data: 0/6, 0/7, 0/8"
                    ignore-collision__t="other:g1rt-unitree-r-thumb; data: 0/0, 1/0"
                    reflect-collision="color: yellow"
          />
        <a-plane id="g1l-unitree-l-arm"
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-left"
                 ik-worker={`${-deg22}, ${deg45}, ${0}, ${0}, ${0}, 0, 0`}
                 joint-move-to={`${0}, ${-deg22}, ${0}, ${0}, ${0}, 0, 0`}
                 exact_solution="exact: false"
                 joint-desirable={
                   toSchema({gain: {0:20,1:20,3:40},
                             upper: {0: -0.382,1: 0.785,3: 1.396},
			     lower: {0: -0.382,1: 0.785,3: 0.0}})}
                 joint-desirable-vlimit="all: 2.0"
                 ignore-collision___a="other:g1r-unitree-r-arm; data: 0/1, 0/0, 1/0"
                 /* ignore-collision___b="other:ur5e; data: 0/0, 1/0, 0/1" */
                 reflect-collision="color: yellow"
                 joint-limit-keep-moving-mask="mask: 0, 0, 0, 0, 1, 1, 1"
                 reflect-joint-limits
                 arm-motion-ui
                 set-end-effector-pose={`position: 0.1 0.0 0.0`}
                 send-base-coord
                 /* change-original-color-recursively="color: azure" */
                 attach-opacity-recursively="opacity: 0.5"
        >
          <a-circle id="g1lt-unitree-l-thumb"
                    robot-loader="model: g1-left-thumb"
                    attach-to-another="to: g1l-unitree-l-arm;event: a,b,x,y"
                    ik-worker="0, 0.79, 0.79"
                    finger-closer2={
                      toSchema({stationaryJoints: 0,
                                closeMax: 45,
                                closeEvent: 'xbuttondown',
                                closeStopEvent: 'xbuttonup',
                                openEvent: 'ybuttondown',
                                openStopEvent: 'ybuttonup'})}
                    radius="0.003" color="gray"
                    ignore-collision="other:g1l-unitree-l-arm; data: 0/6, 0/7, 0/8, 1/7, 1/8"
                    reflect-collision="color: yellow"
          />
            <a-circle id="g1li-unitree-l-index"
                      robot-loader="model: g1-left-index"
                      attach-to-another="to: g1l-unitree-l-arm;event: a,b,x,y"
                      ik-worker="0, 0"
                      finger-closer2={
                        toSchema({closeMax: -45,
                                  closeEvent: 'xbuttondown',
				  closeStopEvent: 'xbuttonup',
				  openEvent: 'ybuttondown',
				  openStopEvent: 'ybuttonup'})}
                      radius="0.003" color="gray"
                      ignore-collision__a="other:g1l-unitree-l-arm; data: 0/6, 0/7, 0/8"
                      ignore-collision__t="other:g1lt-unitree-l-thumb; data: 0/0, 1/0"
                      reflect-collision="color: yellow"
            />
            <a-circle id="g1lm-unitree-l-middle"
                      robot-loader="model: g1-left-middle"
                      attach-to-another="to: g1l-unitree-l-arm;event: a,b,x,y"
                      ik-worker="0, 0"
                      finger-closer2={
                        toSchema({closeMax: -45,
                                  closeEvent: 'xbuttondown',
                                  closeStopEvent: 'xbuttonup',
                                  openEvent: 'ybuttondown',
                                  openStopEvent: 'ybuttonup'})}
                      radius="0.003" color="gray"
                      ignore-collision__a="other:g1l-unitree-l-arm; data: 0/6, 0/7, 0/8"
                      ignore-collision__t="other:g1lt-unitree-l-thumb; data: 0/0, 1/0"
                      reflect-collision="color: yellow"
            />
        </a-plane>
        </a-plane>
      </a-box>
      <a-entity id="table1"
               position="-1.0 0.0 -0.5" rotation="-90 0 -90"
               still-objects="model: table"
               ik-worker
               ignore-collision__u="other:ur5e; data: 0/0"
               ignore-collision__r="other:g1r-unitree-r-arm; data: 0/0"
               ignore-collision__l="other:g1l-unitree-l-arm; data: 0/0"
      >
      </a-entity>
    </a-scene>
  );
}

AFRAME.registerComponent('set-end-effector-pose', {
  schema : {
    position: {type: 'vec3', default: {x:0, y:0, z:0}},
    quaternion: {type: 'vec4', default: {x:0, y:0, z:0, w:1}},
  },
  update: function () {
    const send_ee_pose = () => {
      if (this.el.workerRef?.current) {
        this.el.workerRef.current.postMessage({
          type: 'set_end_effector_pose',
          endEffectorPoint: [this.data.position.x,
			     this.data.position.y,
			     this.data.position.z],
          endEffectorQuaternion: [this.data.quaternion.x,
                                  this.data.quaternion.y,
                                  this.data.quaternion.z,
                                  this.data.quaternion.w],
        });
      }
    };
    if (this.el.ikWorkerReady) {
      send_ee_pose();
    } else {
      this.el.addEventListener('ik-worker-ready', send_ee_pose, {once: true});
    }
  }
});

export default App;
