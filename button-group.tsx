import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface CarouselImage {
  id: number;
  name: string;
  url: string;
  depth: number;
}

const INITIAL_IMAGES: CarouselImage[] = [
  { id: 1, name: "Train Set", url: "/images/toy1.jpg", depth: 1.5 },
  { id: 2, name: "Plush Bear", url: "/images/toy2.jpg", depth: 2.5 },
  { id: 3, name: "Blocks", url: "/images/toy3.jpg", depth: 3.5 },
  { id: 4, name: "Puzzle", url: "/images/toy4.jpg", depth: 2.0 },
  { id: 5, name: "Dollhouse", url: "/images/toy5.jpg", depth: 3.0 },
  { id: 6, name: "Rocket", url: "/images/toy6.jpg", depth: 1.0 },
];

interface CarouselItemProps {
  index: number;
  image: CarouselImage;
  carouselAngleRef: React.MutableRefObject<number>;
  radius: number;
  isDragging: boolean;
}

function CarouselItem({
  index,
  image,
  carouselAngleRef,
  radius,
}: CarouselItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const myAngle = useMemo(
    () => index * ((2 * Math.PI) / INITIAL_IMAGES.length),
    [index]
  );

  const [texture] = useTexture([image.url]);

  useFrame(() => {
    if (!meshRef.current) return;
    const angle = carouselAngleRef.current;
    const x = Math.cos(angle + myAngle) * radius;
    const z = Math.sin(angle + myAngle) * radius;
    const y =
      (index % 2 === 0 ? 1 : -1) *
      Math.sin(angle + myAngle) *
      (radius * 0.6);

    meshRef.current.position.set(x, y, z);
    const rotationY = -(angle + myAngle);
    meshRef.current.rotation.y = rotationY;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.95}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface SpatialCarouselProps {
  radius?: number;
}

function SpatialCarouselInner({ radius = 6 }: SpatialCarouselProps) {
  const carouselAngleRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(0);
  const autoRotateRef = useRef(0);
  const isDraggingRef = useRef(false);

  const images = useMemo(() => [...INITIAL_IMAGES], []);

  // Auto-rotation animation
  useFrame((_, delta) => {
    if (!isDraggingRef.current) {
      autoRotateRef.current += delta * 0.15;
      carouselAngleRef.current = autoRotateRef.current;
    }
  });

  const onPointerDown = useCallback(
    (e: THREE.Event & { clientX: number; stopPropagation: () => void }) => {
      (e as any).stopPropagation();
      lastX.current = (e as any).clientX;
      setIsDragging(true);
      isDraggingRef.current = true;
    },
    []
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
  }, []);

  const onPointerMove = useCallback(
    (e: THREE.Event & { clientX: number }) => {
      if (!isDraggingRef.current) return;
      const delta = ((e as any).clientX - lastX.current) * 0.005;
      lastX.current = (e as any).clientX;
      carouselAngleRef.current += delta;
      autoRotateRef.current = carouselAngleRef.current;
    },
    []
  );

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown as any}
      onPointerUp={onPointerUp as any}
      onPointerMove={onPointerMove as any}

    >
      {images.map((image) => {
        const index = image.id - 1;
        return (
          <CarouselItem
            key={index}
            index={index}
            image={image}
            carouselAngleRef={carouselAngleRef}
            radius={radius}
            isDragging={isDragging}
          />
        );
      })}
    </group>
  );
}

export default function SpatialCarousel() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, -10, 5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} />
        <SpatialCarouselInner radius={6} />
      </Canvas>
    </div>
  );
}
