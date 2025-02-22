import { useMemo, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import { TailSpin } from "react-loader-spinner";

// Model component that applies the custom texture material
const Model = ({ gltf, texture, scale, desiredTileSize }) => {
  const modelRef = useRef();

  // Create a shared material with the custom texture
  const material = useMemo(() => {
    // Clone to compute size for proper texture repeat
    const cloned = gltf.scene.clone();
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(size.x / desiredTileSize, size.y / desiredTileSize);
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.0,
    });
  }, [gltf, texture, desiredTileSize]);

  // Clone the scene and apply the custom material
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
      }
    });
    return cloned;
  }, [gltf, material]);

  return (
    <Center key={gltf} cacheKey={gltf}>
      <primitive ref={modelRef} object={clonedScene} scale={scale} />
    </Center>
  );
};

// Scene component that calls the hooks inside the Canvas context
const Scene = ({ modelUrl, imageUrl, scale }) => {
  const gltf = useGLTF(modelUrl);
  const texture = useTexture(imageUrl);

  const desiredTileSize = useMemo(() => {
    if (modelUrl === "/models/shirt/scene.gltf") return 55;
    if (modelUrl === "/models/jacket/scene.gltf") return 1;
    return 0.2;
  }, [modelUrl]);

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[2, 5, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-radius={4}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <circleGeometry args={[0.7, 64]} />
        <meshBasicMaterial
          color="#000"
          transparent
          opacity={0.15}
          depthWrite={false}
        >
          <canvasTexture
            attach="map"
            image={(() => {
              const canvas = document.createElement("canvas");
              canvas.width = 256;
              canvas.height = 256;
              const ctx = canvas.getContext("2d");
              ctx.filter = "blur(12px)";
              const gradient = ctx.createRadialGradient(
                128,
                128,
                0,
                128,
                128,
                128
              );
              gradient.addColorStop(0, "rgba(0,0,0,0.4)");
              gradient.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 256, 256);
              return canvas;
            })()}
          />
        </meshBasicMaterial>
      </mesh>
      <Model
        gltf={gltf}
        texture={texture}
        scale={[scale, scale, scale]}
        desiredTileSize={desiredTileSize}
      />
    </>
  );
};

// FabricModel now only sets up the Canvas and Suspense, deferring asset loading to Scene
const FabricModel = ({
  imageUrl,
  modelUrl,
  scale,
  othermodels,
  otherimages,
}) => {
  useEffect(() => {
    // Preload all available 3D models
    othermodels.forEach((url) => {
      useGLTF.preload(url);
    });

    // Preload all available textures
    const textureLoader = new THREE.TextureLoader();
    otherimages.forEach((url) => {
      textureLoader.load(url);
    });
  }, [othermodels, otherimages]);
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
              gap: "10px",
            }}
          >
            <TailSpin
              height="60"
              width="60"
              color="#000"
              ariaLabel="tail-spin-loading"
              radius="0.1"
              style={{ scale: 0.3 }}
            />
            Loading...
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.2, 3], fov: 45 }}
          gl={{ antialias: true }}
          onCreated={({ gl, scene }) => {
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.background = new THREE.Color("#ffffff");
          }}
        >
          <Scene modelUrl={modelUrl} imageUrl={imageUrl} scale={scale} />
          <OrbitControls
            enableZoom
            enableRotate
            enablePan={false}
            minDistance={1}
            maxDistance={3}
            target={[0, 0, 0]}
            dampingFactor={0.1}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default FabricModel;
