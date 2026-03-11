import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { cfg } from "./config.js";

function withPhase(tl, phaseSpec, callback) {
    callback({
        start: phaseSpec.start,
        duration: phaseSpec.duration,
        end: phaseSpec.start + phaseSpec.duration
    });
}

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
        movingTitlePoint,
        addLettersToGroup,
        tlRef,
    } = deps;

    let tl = tlRef?.current ?? null;

    function resetSceneState() {
        leftOrnamentPiece.group.position.copy(cfg.pts.leftStart);
        rightOrnamentPiece.group.position.copy(cfg.pts.rightStart);
        capPiece.mesh.position.copy(cfg.pts.capStart);

        leftOrnamentPiece.group.rotation.set(0, 0, 0);
        rightOrnamentPiece.group.rotation.set(0, 0, 0);
        capPiece.mesh.rotation.set(0, 0, 0);

        assemblyGroup.rotation.set(0, 0, 0);

        paperMesh.position.set(0, 0.3 * cfg.geom.ornamentRadius, 0);
        paperMat.opacity = 1;

        movingTitlePoint.set(0, 0, cfg.geom.assemblyZ);
        assemblyGroup.position.copy(cfg.pts.ornamentFinal);
        letterGroup.position.copy(movingTitlePoint);
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
            const launchTime = cfg.letters.sequenceStart + index * cfg.letters.launchDelay;
            const mat = sprite.material;

            tl.call(() => {
                sprite.position.set(
                    -movingTitlePoint.x,
                    -movingTitlePoint.y,
                    -movingTitlePoint.z
                );
                sprite.scale.set(cfg.letters.startScale, cfg.letters.startScale, 1);
                mat.opacity = 0;
            }, [], launchTime);

            tl.to(sprite.position, {
                x: sprite.userData.targetX,
                z: sprite.userData.targetZ,
                duration: cfg.letters.flightDuration,
                ease: "power2.inOut"
            }, launchTime);

            tl.to(sprite.scale, {
                x: cfg.letters.finalScale * 1.12,
                y: cfg.letters.finalScale * 1.12,
                duration: cfg.letters.flightDuration * 0.65,
                ease: "back.out(1.7)"
            }, launchTime);

            tl.to(sprite.scale, {
                x: cfg.letters.finalScale,
                y: cfg.letters.finalScale,
                duration: cfg.letters.flightDuration * 0.35,
                ease: "power2.out"
            }, launchTime + cfg.letters.flightDuration * 0.65);

            tl.to(mat, {
                opacity: 1,
                duration: Math.min(0.18, cfg.letters.flightDuration * 0.25),
                ease: "power1.out"
            }, launchTime);

            const arcState = { t: 0 };
            tl.to(arcState, {
                t: 1,
                duration: cfg.letters.flightDuration,
                ease: "none",
                onUpdate: () => {
                    sprite.position.y =
                        cfg.letters.baselineY +
                        Math.sin(arcState.t * Math.PI) * sprite.userData.arcHeight;
                }
            }, launchTime);
        });
    }

    function addOutlineTweens(tl) {
        withPhase(tl, cfg.timeline.revealCutLines, ({ start, duration }) => {
            tl.to(outlineMats, {
                opacity: 1,
                duration,
                ease: "power1.inOut"
            }, start);
        });

        withPhase(tl, cfg.timeline.liftPieces, ({ start, duration }) => {
            tl.to(outlineMats, {
                opacity: 0.35,
                duration: 0.25,
                ease: "power1.out"
            }, start + duration - 0.10);
        });

        tl.to(outlineMats, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out"
        }, cfg.timeline.slideTitleAndAssemble.start + 0.2);
    }

    function addLiftTweens(tl) {
        withPhase(tl, cfg.timeline.liftPieces, ({ start, duration }) => {
            tl.to(leftOrnamentPiece.group.position, {
                x: cfg.pts.leftLifted.x,
                y: cfg.pts.leftLifted.y,
                z: cfg.pts.leftLifted.z,
                duration,
                ease: "power2.out"
            }, start);

            tl.to(rightOrnamentPiece.group.position, {
                x: cfg.pts.rightLifted.x,
                y: cfg.pts.rightLifted.y,
                z: cfg.pts.rightLifted.z,
                duration,
                ease: "power2.out"
            }, start);

            tl.to(capPiece.mesh.position, {
                x: cfg.pts.capLifted.x,
                y: cfg.pts.capLifted.y,
                z: cfg.pts.capLifted.z,
                duration,
                ease: "power2.out"
            }, start);
        });
    }

    function addTravelTweens(tl) {
        const leftU = { u: 0 };
        const rightU = { u: 0 };

        withPhase(tl, cfg.timeline.movePiecesToAssembly, ({ start, duration }) => {
            tl.to(leftU, {
                u: 1,
                duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    const p = leftCurve.getPoint(leftU.u);
                    leftOrnamentPiece.group.position.copy(p);
                }
            }, start);

            tl.to(rightU, {
                u: 1,
                duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    const p = rightCurve.getPoint(rightU.u);
                    rightOrnamentPiece.group.position.copy(p);
                }
            }, start);

            tl.to(leftOrnamentPiece.group.rotation, {
                y: cfg.rot.leftYawTotal,
                duration,
                ease: "power2.inOut"
            }, start);

            tl.to(rightOrnamentPiece.group.rotation, {
                y: cfg.rot.rightYawTotal,
                duration,
                ease: "power2.inOut"
            }, start);

            tl.to(capPiece.mesh.position, {
                z: -1 * cfg.geom.ornamentRadius,
                duration,
                ease: "power2.inOut"
            }, start);

            tl.to(paperMesh.position, {
                z: -10,
                duration,
                ease: "power2.inOut"
            }, start);

            tl.to(paperMat, {
                opacity: 0,
                duration,
                ease: "power1.inOut"
            }, start);
        });
    }

    function addDropAndCapTweens(tl) {
        withPhase(tl, cfg.timeline.settleOrnamentHalves, ({ start, duration }) => {
            tl.to(rightOrnamentPiece.group.position, {
                x: cfg.pts.ornamentFinal.x,
                y: cfg.pts.ornamentFinal.y,
                z: cfg.pts.ornamentFinal.z + 0.03,
                duration,
                ease: "power2.inOut"
            }, start);

            tl.to(leftOrnamentPiece.group.position, {
                x: cfg.pts.ornamentFinal.x,
                y: cfg.pts.ornamentFinal.y,
                z: cfg.pts.ornamentFinal.z + 0.00,
                duration,
                ease: "power2.inOut"
            }, start);
        });

        const capU = { u: 0 };
        withPhase(tl, cfg.timeline.moveCapToAssembly, ({ start, duration }) => {
            tl.to(capU, {
                u: 1,
                duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    const p = capCurve.getPoint(capU.u);
                    capPiece.mesh.position.copy(p);
                }
            }, start);
        });

        withPhase(tl, cfg.timeline.rotateCap, ({ start, duration }) => {
            tl.to(capPiece.mesh.rotation, {
                x: cfg.rot.capPitchTotal,
                duration,
                ease: "power2.inOut"
            }, start);
        });

        withPhase(tl, cfg.timeline.settleCap, ({ start, duration }) => {
            tl.to(capPiece.mesh.position, {
                x: cfg.pts.capFinal.x,
                y: cfg.pts.capFinal.y,
                z: cfg.pts.capFinal.z + 0.06,
                duration,
                ease: "power2.out"
            }, start);
        });

        tl.to(leftOrnamentPiece.group.position, {
            x: cfg.pts.ornamentFinal.x,
            y: cfg.pts.ornamentFinal.y,
            z: cfg.pts.ornamentFinal.z + 0.00,
            duration: 0.001
        }, cfg.timeline.slideTitleAndAssemble.start - 0.001);
    }

    function addAssemblyTweens(tl) {
        withPhase(tl, cfg.timeline.slideTitleAndAssemble, ({ start, duration }) => {
            tl.call(() => {
                assemblyGroup.position.copy(movingTitlePoint);
                letterGroup.position.copy(movingTitlePoint);
                assemblyGroup.rotation.set(0, 0, 0);

                reparentPreserveWorld(leftOrnamentPiece.group, assemblyGroup);
                reparentPreserveWorld(rightOrnamentPiece.group, assemblyGroup);
                reparentPreserveWorld(capPiece.mesh, assemblyGroup);
            }, [], start);

            tl.to(movingTitlePoint, {
                x: -4.0,
                duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    assemblyGroup.position.copy(movingTitlePoint);
                    letterGroup.position.copy(movingTitlePoint);
                    outlineGroup.position.copy(movingTitlePoint);
                }
            }, start);

            tl.to(assemblyGroup.rotation, {
                y: cfg.rot.groupYawTotal,
                duration,
                ease: "power2.inOut"
            }, start);
        });
    }

    function addFinalSpinTweens(tl) {
        withPhase(tl, cfg.timeline.easeSpin, ({ start, duration }) => {
            tl.to(assemblyGroup.rotation, {
                y: 0,
                duration,
                ease: "power2.inOut"
            }, start);
        });

        withPhase(tl, cfg.timeline.infiniteSpin, ({ start, duration }) => {
            const legacyInfiniteSpinDuration = 93.0; // (100.0 - 7.0) from the pre-refactor timeline
            const turns = 4 * (duration / legacyInfiniteSpinDuration);
            tl.to(assemblyGroup.rotation, {
                y: turns * cfg.rot.groupYawTotal,
                duration,
                ease: "linear"
            }, start);
        });
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
