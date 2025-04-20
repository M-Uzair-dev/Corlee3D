import { useMemo, useRef, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import "./model.css";

THREE.Cache.enabled = true;

// Split Model into Textured and NonTextured variants to avoid conditional hooks
const TexturedModel = ({ gltf, textureUrl, scale, tileSize, modelUrl }) => {
  const [texture, setTexture] = useState(null);
  const modelRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    if (!textureUrl) return;

    const loadTexture = async () => {
      try {
        // Create a new image element
        const img = new Image();
        img.crossOrigin = "anonymous"; // Enable CORS

        // Create a promise to handle the image loading
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = (error) => reject(error);
        });

        // Set the source and wait for it to load
        img.src = textureUrl;
        const loadedImg = await loadPromise;

        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        canvas.width = loadedImg.width;
        canvas.height = loadedImg.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(loadedImg, 0, 0);

        // Create a new texture from the canvas
        const newTexture = new THREE.Texture(canvas);
        newTexture.needsUpdate = true;
        newTexture.encoding = THREE.sRGBEncoding;
        newTexture.colorSpace = "srgb-linear";

        setTexture(newTexture);
      } catch (error) {
        console.error("Error loading texture:", error);
        // Fallback to a default texture or handle the error as needed
      }
    };

    loadTexture();

    // Cleanup
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [textureUrl]);

  const { material, size } = useMemo(() => {
    if (!texture) return { material: null, size: new THREE.Vector3() };

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.0,
    });
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.repeat.set(size.x / tileSize, size.y / tileSize);
    mat.map.needsUpdate = true;

    return { material: mat, size };
  }, [gltf, texture, tileSize]);

  const clonedScene = useMemo(() => {
    if (!material) return gltf.scene.clone();

    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) child.material = material;
    });
    return cloned;
  }, [gltf, material]);

  return (
    <Center key={modelUrl}>
      <primitive ref={modelRef} object={clonedScene} scale={scale} />
    </Center>
  );
};

const NonTexturedModel = ({ gltf, scale, tileSize, modelUrl }) => {
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
