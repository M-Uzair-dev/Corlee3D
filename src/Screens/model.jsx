import { useMemo, useRef, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import "./model.css";
import { normalizeCloudFrontUrl } from "../util";
import { handleApiError } from "../util/errorHandler";

THREE.Cache.enabled = true;

// Split Model into Textured and NonTextured variants to avoid conditional hooks
const TexturedModel = ({ gltf, textureUrl, scale, tileSize, modelUrl }) => {
  const [hasTextureError, setHasTextureError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const normalizedTextureUrl = useMemo(() => {
    try {
      // Try to use a proxy if direct access fails
      const url = normalizeCloudFrontUrl(textureUrl);
      if (retryCount > 0) {
        // Add timestamp to bypass cache
        return `${url}?t=${Date.now()}`;
      }
      return url;
    } catch (error) {
      console.error("Error normalizing texture URL:", error);
      return textureUrl;
    }
  }, [textureUrl, retryCount]);

  const texture = useTexture(
    normalizedTextureUrl,
    (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      texture.colorSpace = "srgb-linear";
      texture.crossOrigin = "anonymous";
    },
    (error) => {
      console.error("Error loading texture:", error);
      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        return;
      }
      setHasTextureError(true);
      handleApiError(error, "Failed to load model texture");
    }
  );

  const modelRef = useRef();
  const materialRef = useRef();

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
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) child.material = material;
    });
    return cloned;
  }, [gltf, material]);

  useEffect(
    () => () => {
      material.dispose();
      texture.dispose();
    },
    [texture]
  );

  if (hasTextureError || modelError) {
    return (
      <Center key={modelUrl}>
        <mesh scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" roughness={0.8} metalness={0.2} />
        </mesh>
      </Center>
    );
  }

  return (
    <Center key={modelUrl}>
      <primitive ref={modelRef} object={clonedScene} scale={scale} />
    </Center>
  );
};

const NonTexturedModel = ({ gltf, scale, tileSize, modelUrl }) => {
  const [modelError, setModelError] = useState(false);

  const modelRef = useRef();
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "gray" }),
    []
  );

  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) child.material = material;
    });
    return cloned;
  }, [gltf, material]);

  if (modelError) {
    return (
      <Center key={modelUrl}>
        <mesh scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </Center>
    );
  }

  return (
    <Center key={modelUrl}>
      <primitive ref={modelRef} object={clonedScene} scale={scale} />
    </Center>
  );
};

const Scene = ({ modelUrl, textureUrl, scale, onLoaded }) => {
  const gltf = useGLTF(modelUrl, true);

  useEffect(() => {
    if (gltf) onLoaded?.();
  }, [gltf, onLoaded]);

  const tileSize = useMemo(
    () => (modelUrl.includes("jacket") ? 500 : 0.1),
    [modelUrl]
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1.2} // Increased from 1.0
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <spotLight
        position={[0, 5, 5]}
        intensity={0.8}
        angle={0.3}
        penumbra={0.5}
        castShadow
      />
      {textureUrl ? (
        <TexturedModel
          gltf={gltf}
          textureUrl={textureUrl}
          scale={scale}
          tileSize={tileSize}
          modelUrl={modelUrl}
        />
      ) : (
        <NonTexturedModel
          gltf={gltf}
          scale={scale}
          tileSize={tileSize}
          modelUrl={modelUrl}
        />
      )}
    </>
  );
};

const FabricModel = ({ textureUrl, modelUrl, scale, loadingText }) => {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const preloaded = useRef(new Set());

  useEffect(() => {
    if (!preloaded.current.has(modelUrl)) {
      useGLTF.preload(modelUrl);
      preloaded.current.add(modelUrl);
    }
    if (textureUrl && !preloaded.current.has(textureUrl)) {
      useTexture.preload(textureUrl);
      preloaded.current.add(textureUrl);
    }
  }, [modelUrl, textureUrl]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Suspense
        fallback={
          <div className="loading-container">
            <div className="spinner-in-model">
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
          gl={{ antialias: true }}
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
            maxDistance={4}
            enablePan={true}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default FabricModel;
