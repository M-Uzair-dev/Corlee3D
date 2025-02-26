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

  // Clone the scene and apply the custom material without shadow settings
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        // Removed shadow settings for faster loading
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

// Scene component with simplified lighting and no floor/shadow
const Scene = ({ modelUrl, imageUrl, scale }) => {
  const gltf = useGLTF(modelUrl, "/draco-gltf/");
  const texture = useTexture(imageUrl);

  const desiredTileSize = useMemo(() => {
    if (modelUrl === "/models/shirt/scene.gltf") return 55;
    if (modelUrl === "/models/jacket/scene.gltf") return 1;
    return 0.2;
  }, [modelUrl]);

  return (
    <>
      <ambientLight intensity={1.0} />
      {/* Removed directional light, floor, and shadow for faster loading */}
      <Model
        gltf={gltf}
        texture={texture}
        scale={[scale, scale, scale]}
        desiredTileSize={desiredTileSize}
      />
    </>
  );
};

// FabricModel now only sets up the Canvas and Suspense
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
      useGLTF.preload(url, "/draco-gltf/");
    });

    // Preload all available textures
    const textureLoader = new THREE.TextureLoader();
    otherimages.forEach((url) => {
      textureLoader.load(url);
    });
  }, [othermodels, otherimages]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
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
          camera={{ position: [0, 0.2, 3], fov: 45 }}
          gl={{ antialias: true }}
          onCreated={({ gl, scene }) => {
            scene.background = new THREE.Color("rgb(239, 239, 239)");
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
