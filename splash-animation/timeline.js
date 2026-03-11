import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import {
  ornamentRadius,
  assemblyZ,
  ornamentFinalPosition,
  leftStartPosition,
  rightStartPosition,
  capStartPosition,
  leftLiftedPosition,
  rightLiftedPosition,
  capLiftedPosition,
  capFinalPosition,
  leftYawTotal,
  rightYawTotal,
  capPitchTotal,
  groupYawTotal,
  tB0, tB1,
  tC0, tC1,
  tD0, tD1,
  tE0, tE1,
  tF0, tF1,
  tG0, tG1,
  tH0, tH1,
  tI0, tI1,
  tJ0, tJ1,
  tK0, tK1,
  letterCfg,
} from "./config.js";

function reparentPreserveWorld(obj, newParent) {
    obj.updateMatrixWorld(true);
    newParent.updateMatrixWorld(true);

    const worldMatrix = obj.matrixWorld.clone();
    const invParentWorld = new THREE.Matrix4().copy(newParent.matrixWorld).invert();

    obj.parent.remove(obj);
    newParent.add(obj);

    const localMatrix = new THREE.Matrix4().multiplyMatrices(invParentWorld, worldMatrix);
    localMatrix.decompose(obj.position, obj.quaternion, obj.scale);
}

function resetAndBuildTimeline(deps) {
    const {
        leftOrnamentPiece,
        rightOrnamentPiece,
        capPiece,
        paperMesh,
        paperMat,
        assemblyGroup,
        letterGroup,
        outlineGroup,
        outlineMats,
        scene,
        leftCurve,
        rightCurve,
        capCurve,
        titleAnchorPosition,
        addLettersToGroup,
        tlRef,
    } = deps;

    let tl = tlRef?.current ?? null;

    function resetSceneState() {
        leftOrnamentPiece.group.position.copy(leftStartPosition);
        rightOrnamentPiece.group.position.copy(rightStartPosition);
        capPiece.mesh.position.copy(capStartPosition);

        leftOrnamentPiece.group.rotation.set(0, 0, 0);
        rightOrnamentPiece.group.rotation.set(0, 0, 0);
        capPiece.mesh.rotation.set(0, 0, 0);

        assemblyGroup.rotation.set(0, 0, 0);

        paperMesh.position.set(0, 0.3 * ornamentRadius, 0);
        paperMat.opacity = 1;

        titleAnchorPosition.set(0, 0, assemblyZ);
        assemblyGroup.position.copy(ornamentFinalPosition);
        letterGroup.position.copy(titleAnchorPosition);
        outlineGroup.position.set(0, 0, 0);
    }

    function ensureDirectSceneParenting() {
        if (leftOrnamentPiece.group.parent !== scene) reparentPreserveWorld(leftOrnamentPiece.group, scene);
        if (rightOrnamentPiece.group.parent !== scene) reparentPreserveWorld(rightOrnamentPiece.group, scene);
        if (capPiece.mesh.parent !== scene) reparentPreserveWorld(capPiece.mesh, scene);
    }

    function resetOutlineOpacity() {
        outlineMats.forEach((m) => {
            m.opacity = 0;
        });
    }

    function addLetterTweens(tl) {
        letterGroup.children.forEach((sprite, index) => {
            const launchTime = letterCfg.sequenceStart + index * letterCfg.launchDelay;
            const mat = sprite.material;

            tl.call(() => {
                sprite.position.set(
                    -titleAnchorPosition.x,
                    -titleAnchorPosition.y,
                    -titleAnchorPosition.z
                );
                sprite.scale.set(letterCfg.startScale, letterCfg.startScale, 1);
                mat.opacity = 0;
            }, [], launchTime);

            tl.to(sprite.position, {
                x: sprite.userData.targetX,
                z: sprite.userData.targetZ,
                duration: letterCfg.flightDuration,
                ease: "power2.inOut"
            }, launchTime);

            tl.to(sprite.scale, {
                x: letterCfg.finalScale * 1.12,
                y: letterCfg.finalScale * 1.12,
                duration: letterCfg.flightDuration * 0.65,
                ease: "back.out(1.7)"
            }, launchTime);

            tl.to(sprite.scale, {
                x: letterCfg.finalScale,
                y: letterCfg.finalScale,
                duration: letterCfg.flightDuration * 0.35,
                ease: "power2.out"
            }, launchTime + letterCfg.flightDuration * 0.65);

            tl.to(mat, {
                opacity: 1,
                duration: Math.min(0.18, letterCfg.flightDuration * 0.25),
                ease: "power1.out"
            }, launchTime);

            const arcState = { t: 0 };
            tl.to(arcState, {
                t: 1,
                duration: letterCfg.flightDuration,
                ease: "none",
                onUpdate: () => {
                    sprite.position.y =
                        letterCfg.baselineY +
                        Math.sin(arcState.t * Math.PI) * sprite.userData.arcHeight;
                }
            }, launchTime);
        });
    }

    function addOutlineTweens(tl) {
        tl.to(outlineMats, {
            opacity: 1,
            duration: (tB1 - tB0),
            ease: "power1.inOut"
        }, tB0);

        tl.to(outlineMats, {
            opacity: 0.35,
            duration: 0.25,
            ease: "power1.out"
        }, tC1 - 0.10);

        tl.to(outlineMats, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out"
        }, 5.2);
    }

    function addLiftTweens(tl) {
        tl.to(leftOrnamentPiece.group.position, {
            x: leftLiftedPosition.x,
            y: leftLiftedPosition.y,
            z: leftLiftedPosition.z,
            duration: (tC1 - tC0),
            ease: "power2.out"
        }, tC0);

        tl.to(rightOrnamentPiece.group.position, {
            x: rightLiftedPosition.x,
            y: rightLiftedPosition.y,
            z: rightLiftedPosition.z,
            duration: (tC1 - tC0),
            ease: "power2.out"
        }, tC0);

        tl.to(capPiece.mesh.position, {
            x: capLiftedPosition.x,
            y: capLiftedPosition.y,
            z: capLiftedPosition.z,
            duration: (tC1 - tC0),
            ease: "power2.out"
        }, tC0);
    }

    function addTravelTweens(tl) {
        const leftU = { u: 0 };
        const rightU = { u: 0 };

        tl.to(leftU, {
            u: 1,
            duration: (tD1 - tD0),
            ease: "power2.inOut",
            onUpdate: () => {
                const p = leftCurve.getPoint(leftU.u);
                leftOrnamentPiece.group.position.copy(p);
            }
        }, tD0);

        tl.to(rightU, {
            u: 1,
            duration: (tD1 - tD0),
            ease: "power2.inOut",
            onUpdate: () => {
                const p = rightCurve.getPoint(rightU.u);
                rightOrnamentPiece.group.position.copy(p);
            }
        }, tD0);

        tl.to(leftOrnamentPiece.group.rotation, {
            y: leftYawTotal,
            duration: (tD1 - tD0),
            ease: "power2.inOut"
        }, tD0);

        tl.to(rightOrnamentPiece.group.rotation, {
            y: rightYawTotal,
            duration: (tD1 - tD0),
            ease: "power2.inOut"
        }, tD0);

        tl.to(capPiece.mesh.position, {
            z: -1 * ornamentRadius,
            duration: (tD1 - tD0),
            ease: "power2.inOut"
        }, tD0);

        tl.to(paperMesh.position, {
            z: -10,
            duration: (tD1 - tD0),
            ease: "power2.inOut"
        }, tD0);

        tl.to(paperMat, {
            opacity: 0,
            duration: (tD1 - tD0),
            ease: "power1.inOut"
        }, tD0);
    }

    function addDropAndCapTweens(tl) {
        tl.to(rightOrnamentPiece.group.position, {
            x: ornamentFinalPosition.x,
            y: ornamentFinalPosition.y,
            z: ornamentFinalPosition.z + 0.03,
            duration: (tE1 - tE0),
            ease: "power2.inOut"
        }, tE0);

        tl.to(leftOrnamentPiece.group.position, {
            x: ornamentFinalPosition.x,
            y: ornamentFinalPosition.y,
            z: ornamentFinalPosition.z + 0.00,
            duration: (tE1 - tE0),
            ease: "power2.inOut"
        }, tE0);

        const capU = { u: 0 };
        tl.to(capU, {
            u: 1,
            duration: (tF1 - tF0),
            ease: "power2.inOut",
            onUpdate: () => {
                const p = capCurve.getPoint(capU.u);
                capPiece.mesh.position.copy(p);
            }
        }, tF0);

        tl.to(capPiece.mesh.rotation, {
            x: capPitchTotal,
            duration: (tG1 - tG0),
            ease: "power2.inOut"
        }, tG0);

        tl.to(capPiece.mesh.position, {
            x: capFinalPosition.x,
            y: capFinalPosition.y,
            z: capFinalPosition.z + 0.06,
            duration: (tH1 - tH0),
            ease: "power2.out"
        }, tH0);

        tl.to(leftOrnamentPiece.group.position, {
            x: ornamentFinalPosition.x,
            y: ornamentFinalPosition.y,
            z: ornamentFinalPosition.z + 0.00,
            duration: 0.001
        }, tI0 - 0.001);
    }

    function addAssemblyTweens(tl) {
        tl.call(() => {
            assemblyGroup.position.copy(titleAnchorPosition);
            letterGroup.position.copy(titleAnchorPosition);
            assemblyGroup.rotation.set(0, 0, 0);

            reparentPreserveWorld(leftOrnamentPiece.group, assemblyGroup);
            reparentPreserveWorld(rightOrnamentPiece.group, assemblyGroup);
            reparentPreserveWorld(capPiece.mesh, assemblyGroup);
        }, [], tI0);

        tl.to(titleAnchorPosition, {
            x: -4.0,
            duration: (tI1 - tI0),
            ease: "power2.inOut",
            onUpdate: () => {
                assemblyGroup.position.copy(titleAnchorPosition);
                letterGroup.position.copy(titleAnchorPosition);
                outlineGroup.position.copy(titleAnchorPosition);
            }
        }, tI0);

        tl.to(assemblyGroup.rotation, {
            y: groupYawTotal,
            duration: (tI1 - tI0),
            ease: "power2.inOut"
        }, tI0);
    }

    function addFinalSpinTweens(tl) {
        tl.to(assemblyGroup.rotation, {
            y: 0,
            duration: (tJ1 - tJ0),
            ease: "power2.inOut"
        }, tJ0);

        tl.to(assemblyGroup.rotation, {
            y: 4 * groupYawTotal,
            duration: (tK1 - tK0),
            ease: "linear"
        }, tK0);
    }

    if (tl) tl.kill();

    resetSceneState();
    addLettersToGroup(letterGroup);
    ensureDirectSceneParenting();
    resetOutlineOpacity();

    tl = gsap.timeline({
        defaults: { overwrite: false },
        duration: 6.0
    });

    addLetterTweens(tl);
    addOutlineTweens(tl);
    addLiftTweens(tl);
    addTravelTweens(tl);
    addDropAndCapTweens(tl);
    addAssemblyTweens(tl);
    addFinalSpinTweens(tl);

    tl.play(0);

    if (tlRef) tlRef.current = tl;
    return tl;
}

export { resetAndBuildTimeline };
