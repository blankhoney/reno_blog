import { Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { Language } from "../lib/i18n";
import type { ProjectOrbitGraph, ProjectOrbitNode } from "../lib/project-orbit";

type Props = {
  graph: ProjectOrbitGraph;
  language: Language;
};

const sectionColors: Record<ProjectOrbitNode["section"], string> = {
  library: "#f59e0b",
  notes: "#10b981",
  projects: "#38bdf8",
  writing: "#a78bfa",
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = () => setReducedMotion(query.matches);
    query.addEventListener("change", listener);

    return () => query.removeEventListener("change", listener);
  }, []);

  return reducedMotion;
}

function OrbitNode({ node }: { node: ProjectOrbitNode }) {
  const color = sectionColors[node.section];

  return (
    <mesh
      aria-label={node.title}
      onClick={() => {
        window.location.href = node.url;
      }}
      position={node.position}
      scale={node.section === "projects" ? 1.15 : 0.8}
    >
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function OrbitScene({ graph, reducedMotion }: { graph: ProjectOrbitGraph; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMap = useMemo(() => new Map(graph.nodes.map((node) => [node.key, node])), [graph.nodes]);

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={1.8} />
      <pointLight intensity={2.4} position={[3, 4, 5]} />
      <group ref={groupRef}>
        {graph.edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) {
            return null;
          }

          return (
            <Line
              color="#94a3b8"
              key={`${edge.from}-${edge.to}`}
              lineWidth={1.4}
              points={[from.position, to.position]}
              transparent
              opacity={0.72}
            />
          );
        })}
        {graph.nodes.map((node) => (
          <OrbitNode key={node.key} node={node} />
        ))}
      </group>
      <OrbitControls
        enableDamping={!reducedMotion}
        enablePan={false}
        maxDistance={8}
        minDistance={3}
      />
    </>
  );
}

export default function ProjectOrbit({ graph, language }: Props) {
  const reducedMotion = useReducedMotion();
  const fallback = language === "zh" ? "当前浏览器不支持 WebGL。" : "WebGL is not available in this browser.";

  return (
    <div className="project-orbit-canvas" data-project-orbit>
      <Canvas
        camera={{ fov: 48, position: [0, 2.4, 6] }}
        dpr={[1, 1.6]}
        fallback={<p>{fallback}</p>}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <OrbitScene graph={graph} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
