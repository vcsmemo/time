import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Location } from '../lib/locations';

interface TimeZoneGlobeProps {
  locations: Location[];
  selectedLocationId: string | null;
  onLocationSelect: (locationId: string) => void;
  className?: string;
}

export default function TimeZoneGlobe({
  locations,
  selectedLocationId,
  onLocationSelect,
  className = ''
}: TimeZoneGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const markersRef = useRef<Record<string, THREE.Mesh>>({});
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  
  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create Earth globe with texture
    const textureLoader = new THREE.TextureLoader();
    
    // Set up globe sphere
    const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x97c2fc,
      transparent: true,
      opacity: 0.8,
      wireframe: false
    });
    
    const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(globe);
    globeRef.current = globe;
    
    // Add wireframe for time zones (24 sections)
    const timeZoneLines = new THREE.Object3D();
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
    
    // Draw longitude lines (24 time zone lines, every 15 degrees)
    for (let i = 0; i < 24; i++) {
      const longitudeAngle = (i * 15) * (Math.PI / 180);
      const points = [];
      for (let j = 0; j <= 180; j++) {
        const latitudeAngle = (j - 90) * (Math.PI / 180);
        const x = 1.52 * Math.cos(longitudeAngle) * Math.cos(latitudeAngle);
        const y = 1.52 * Math.sin(latitudeAngle);
        const z = 1.52 * Math.sin(longitudeAngle) * Math.cos(latitudeAngle);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, linesMaterial);
      timeZoneLines.add(line);
    }
    
    // Draw equator
    const equatorPoints = [];
    for (let i = 0; i <= 360; i++) {
      const angle = i * (Math.PI / 180);
      const x = 1.52 * Math.cos(angle);
      const z = 1.52 * Math.sin(angle);
      equatorPoints.push(new THREE.Vector3(x, 0, z));
    }
    const equatorGeometry = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equator = new THREE.Line(equatorGeometry, new THREE.LineBasicMaterial({ color: 0x666666 }));
    timeZoneLines.add(equator);
    
    scene.add(timeZoneLines);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (globeRef.current && !isDragging) {
        globeRef.current.rotation.y += 0.002; // Slow continuous rotation
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isDragging]);
  
  // Add location markers
  useEffect(() => {
    if (!sceneRef.current || !globeRef.current) return;
    
    // Clear old markers
    Object.values(markersRef.current).forEach(marker => {
      if (sceneRef.current) sceneRef.current.remove(marker);
    });
    markersRef.current = {};
    
    // Add new markers for each location
    locations.forEach(location => {
      const { coordinates } = location;
      
      // Convert flat map coordinates (x: 0-1, y: 0-1) to spherical coordinates
      // Assuming x=0 is -180° longitude, x=1 is +180° longitude, y=0 is +90° latitude (North), y=1 is -90° latitude (South)
      const longitude = (coordinates.x * 360 - 180) * (Math.PI / 180);
      const latitude = ((0.5 - coordinates.y) * 180) * (Math.PI / 180);
      
      // Create a marker
      const isSelected = location.id === selectedLocationId;
      const markerGeometry = new THREE.SphereGeometry(isSelected ? 0.04 : 0.03, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color: isSelected ? 0xff4500 : 0xffff00
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Calculate position on the sphere
      const radius = 1.52; // Slightly larger than the globe radius
      marker.position.x = radius * Math.cos(latitude) * Math.cos(longitude);
      marker.position.y = radius * Math.sin(latitude);
      marker.position.z = radius * Math.cos(latitude) * Math.sin(longitude);
      
      // Add to scene and store reference
      if (sceneRef.current) {
        sceneRef.current.add(marker);
        markersRef.current[location.id] = marker;
      }
    });
  }, [locations, selectedLocationId]);
  
  // Handle mouse interactions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      setLastMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && globeRef.current) {
        const deltaX = event.clientX - lastMousePosition.x;
        const deltaY = event.clientY - lastMousePosition.y;
        
        globeRef.current.rotation.y += deltaX * 0.01;
        globeRef.current.rotation.x += deltaY * 0.01;
        
        setLastMousePosition({
          x: event.clientX,
          y: event.clientY
        });
      }
      
      // Update mouse position for raycaster
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleClick = (event: MouseEvent) => {
      if (!isDragging && cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        // Check for intersections with location markers
        const markerMeshes = Object.entries(markersRef.current).map(([id, mesh]) => {
          return { id, mesh };
        });
        
        const intersects = raycasterRef.current.intersectObjects(
          markerMeshes.map(item => item.mesh)
        );
        
        if (intersects.length > 0 && sceneRef.current) {
          const clickedMarker = markerMeshes.find(item => 
            item.mesh === intersects[0].object
          );
          
          if (clickedMarker) {
            onLocationSelect(clickedMarker.id);
          }
        }
      }
    };
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };
    
    // Add event listeners
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listeners
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
        containerRef.current.removeEventListener('click', handleClick);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging, onLocationSelect]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[400px] ${className}`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Time zone globe will be mounted here */}
    </div>
  );
}