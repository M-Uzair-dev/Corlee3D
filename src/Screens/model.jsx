import { useMemo, useRef, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import "./model.css";

// Material control defaults
const DEFAULT_CONTROLS = {
  roughness: 1.0,
  metalness: 0.0,
  brightness: 1.15,
  ambientLight: 1.18,
  directionalLight: 1.43
};

// Enable Three.js caching
THREE.Cache.enabled = true;

// Create a global texture loader and cache
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

// Preload texture function
const preloadTexture = async (url) => {
  if (!url || textureCache.has(url)) return textureCache.get(url);
  
  return new Promise((resolve) => {
    textureLoader.load(url, (texture) => {
      // Remove sRGB encoding since we're using WebGL 2.0's built-in color management
      texture.colorSpace = "srgb";
      textureCache.set(url, texture);
      resolve(texture);
    });
  });
};

// Texture cleanup function
const cleanupTexture = (url) => {
  const texture = textureCache.get(url);
  if (texture) {
    texture.dispose();
    textureCache.delete(url);
  }
};

const TexturedModel = ({ gltf, textureUrl, scale, modelUrl, textureScale = [2, 2], materialControls }) => {
  const modelRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!textureUrl) return;

    let isSubscribed = true;

    const loadTexture = async () => {
      try {
        // Check cache first
        if (textureCache.has(textureUrl)) {
          if (isSubscribed) {
            setTexture(textureCache.get(textureUrl));
          }
          return;
        }

        // Load texture if not in cache
        const newTexture = await preloadTexture(textureUrl);
        if (isSubscribed) {
        setTexture(newTexture);
        }
      } catch (error) {
        console.error("Error loading texture:", error);
      }
    };

    loadTexture();

    return () => {
      isSubscribed = false;
    };
  }, [textureUrl]);

  const material = useMemo(() => {
    if (!texture) return null;

    const textureClone = texture.clone();
    
    textureClone.wrapS = textureClone.wrapT = THREE.RepeatWrapping;
    textureClone.repeat.set(textureScale[0], textureScale[1]);
    textureClone.magFilter = THREE.LinearFilter;
    textureClone.minFilter = THREE.LinearMipmapLinearFilter;
    textureClone.generateMipmaps = true;
    textureClone.needsUpdate = true;

    const mat = new THREE.MeshStandardMaterial({
      map: textureClone,
      roughness: materialControls.roughness,
      metalness: materialControls.metalness,
      envMapIntensity: 1.0,
      color: new THREE.Color(materialControls.brightness, materialControls.brightness, materialControls.brightness)
    });

    return mat;
  }, [texture, textureScale, modelUrl, materialControls]);

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

const NonTexturedModel = ({ gltf, scale, modelUrl }) => {
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

const Scene = ({ modelUrl, textureUrl, scale, onLoaded, textureScale, materialControls }) => {
  const gltf = useGLTF(modelUrl, true);

  useEffect(() => {
    if (gltf) onLoaded?.();
  }, [gltf, onLoaded]);

  return (
    <>
      <ambientLight intensity={materialControls.ambientLight} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={materialControls.directionalLight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />
      <spotLight
        position={[0, 5, 5]}
        intensity={0.5}
        angle={0.3}
        penumbra={0.5}
        castShadow
      />
      {textureUrl ? (
        <TexturedModel
          gltf={gltf}
          textureUrl={textureUrl}
          scale={scale}
          modelUrl={modelUrl}
          textureScale={textureScale}
          materialControls={materialControls}
        />
      ) : (
        <NonTexturedModel
          gltf={gltf}
          scale={scale}
          modelUrl={modelUrl}
        />
      )}
    </>
  );
};

const FabricModel = ({ textureUrl, modelUrl, scale, loadingText, otherModels = [], otherTextures = [], textureScale = [2, 2] }) => {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [materialControls] = useState(DEFAULT_CONTROLS);
  const preloaded = useRef(new Set());

  // Preload models and textures
  useEffect(() => {
    const preloadAll = async () => {
      // Preload current model and texture
    if (!preloaded.current.has(modelUrl)) {
      useGLTF.preload(modelUrl);
      preloaded.current.add(modelUrl);
    }
    if (textureUrl && !preloaded.current.has(textureUrl)) {
        await preloadTexture(textureUrl);
      preloaded.current.add(textureUrl);
    }

      // Preload other models and textures in the background
      Promise.all([
        ...otherModels.map(model => {
          if (!preloaded.current.has(model)) {
            preloaded.current.add(model);
            return useGLTF.preload(model);
          }
          return Promise.resolve();
        }),
        ...otherTextures.map(texture => {
          if (texture && !preloaded.current.has(texture)) {
            preloaded.current.add(texture);
            return preloadTexture(texture);
          }
          return Promise.resolve();
        })
      ]).catch(console.error);
    };

    preloadAll();

    // Cleanup function
    return () => {
      if (textureUrl) {
        cleanupTexture(textureUrl);
      }
      otherTextures.forEach(texture => {
        if (texture) {
          cleanupTexture(texture);
        }
      });
    };
  }, [modelUrl, textureUrl, otherModels, otherTextures]);

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
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            depth: true
          }}
        >
          <Scene
            modelUrl={modelUrl}
            textureUrl={textureUrl}
            scale={scale}
            onLoaded={() => setInitialLoaded(true)}
            textureScale={textureScale}
            materialControls={materialControls}
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
