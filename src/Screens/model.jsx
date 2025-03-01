import { useMemo, useRef, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import { TailSpin } from "react-loader-spinner";
import "./model.css";

// Enable Three.js caching system for textures and GLB files
THREE.Cache.enabled = true;

const Model = ({ gltf, texture, scale, tileSize, modelUrl }) => {
  const modelRef = useRef();
  const materialRef = useRef();

  // Optimized material creation with cached calculations
  const { material, size } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const mat = new THREE.MeshStandardMaterial({
      map: texture.clone(),
      roughness: 0.9,
      metalness: 0.0,
    });

    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.repeat.set(size.x / tileSize, size.y / tileSize);
    mat.map.needsUpdate = true;

    return { material: mat, size };
  }, [gltf, texture, tileSize]);

  // Efficient scene cloning with material application
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.geometry.computeBoundingBox();
      }
    });
    return cloned;
  }, [gltf, material]);

  // Cleanup materials on unmount
  useEffect(
    () => () => {
      materialRef.current?.dispose();
      texture.dispose();
    },
    [texture]
  );

  return (
    <Center key={modelUrl}>
      <primitive ref={modelRef} object={clonedScene} scale={scale} />
    </Center>
  );
};

const Scene = ({ modelUrl, textureUrl, scale, onLoaded }) => {
  const gltf = useGLTF(modelUrl, true);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (gltf && texture) {
      onLoaded?.();
    }
  }, [gltf, texture, onLoaded]);

  const tileSize = useMemo(() => {
    if (modelUrl.includes("jacket")) return 500;
    return 0.1;
  }, [modelUrl]);

  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.7} />

      {/* Directional light as key light */}
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Point light for fill */}
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Spot light for subtle highlight */}
      <spotLight
        position={[0, 5, 5]}
        intensity={0.8}
        angle={0.3}
        penumbra={0.5}
        castShadow
      />

      <Model
        gltf={gltf}
        texture={texture}
        scale={scale}
        tileSize={tileSize}
        modelUrl={modelUrl}
      />
    </>
  );
};

const FabricModel = ({
  textureUrl,
  modelUrl,
  scale,
  otherModels,
  otherTextures,
  loadingText,
}) => {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const preloaded = useRef(new Set());

  // Immediate preloading of initial assets
  useEffect(() => {
    if (!preloaded.current.has(modelUrl)) {
      useGLTF.preload(modelUrl);
      preloaded.current.add(modelUrl);
    }
    if (!preloaded.current.has(textureUrl)) {
      useTexture.preload(textureUrl);
      preloaded.current.add(textureUrl);
    }
  }, [modelUrl, textureUrl]);

  // Background preloading of other assets
  useEffect(() => {
    if (!initialLoaded) return;

    const preload = async () => {
      for (const url of otherModels) {
        if (!preloaded.current.has(url)) {
          useGLTF.preload(url);
          preloaded.current.add(url);
        }
      }
      for (const url of otherTextures) {
        if (!preloaded.current.has(url)) {
          useTexture.preload(url);
          preloaded.current.add(url);
        }
      }
    };

    requestIdleCallback(preload);
  }, [initialLoaded, otherModels, otherTextures]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Suspense
        fallback={
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              color: "#000",
              fontSize: "24px",
              backdropFilter: "blur(5px)",
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            <p style={{ fontSize: "17px" }}>{loadingText}</p>
          </div>
        }
      >
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0.2, 3], fov: 45 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.autoClear = false;
          }}
        >
          <Scene
            modelUrl={modelUrl}
            textureUrl={textureUrl}
            scale={scale}
            onLoaded={() => setInitialLoaded(true)}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            minDistance={1}
            maxDistance={3}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default FabricModel;
