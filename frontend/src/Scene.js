import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import objFile from "../src/untitled.obj";
import mtlFile from "../src/untitled.mtl";
import materialCarton from "./images/carton.jpg";
import materialBlanc from "./images/blancjpg.jpg";

const Scene = () => {
  const canvasRef = useRef(null);
  const [sceneInitialized, setSceneInitialized] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [boxColor, setBoxColor] = useState("#95c28c");
  const [materialType, setMaterialType] = useState("matte");
  const [selectedTexture, setSelectedTexture] = useState(null);

  useEffect(() => {
    const initializeScene = async () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

      renderer.setSize(window.innerWidth, window.innerHeight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.update();

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: boxColor });
      const cube = new THREE.Mesh(geometry, material);

      scene.add(cube);

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    };

    if (!sceneInitialized) {
      initializeScene();
      setSceneInitialized(true);
    }
  }, [sceneInitialized, boxColor]);

  const toggleBox = () => {
    setIsBoxOpen((prevIsBoxOpen) => !prevIsBoxOpen);
  };

  const handleColorChange = (color) => {
    setBoxColor(color);
    setColorPickerVisible(false);
  };

  const toggleColorPicker = () => {
    setColorPickerVisible(!isColorPickerVisible);
  };

  const handleMaterialTypeChange = (event) => {
    setMaterialType(event.target.value);
  };

  const determineMaterialType = (geometry) => {
    if (geometry instanceof THREE.BoxGeometry) {
      return "brillant";
    } else if (geometry instanceof THREE.SphereGeometry) {
      return "carton";
    } else {
      return "standard";
    }
  };

  return (
    <>
      {isBoxOpen && (
        <div className="box">
          <button onClick={toggleBox}>Fermer la box</button>
        </div>
      )}
      <div className="color-switch">
        <div className="color-picker-container">
          <label htmlFor="colorPicker">Color:</label>
          <input
            type="color"
            id="colorPicker"
            name="colorPicker"
            value={boxColor}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <div className="real-color">
            <input
              type="text"
              value={boxColor}
              readOnly
              onClick={toggleColorPicker}
            />
          </div>
        </div>
        <div className="input-group1">
          <label>Material</label>
          <div className="material-thumbnails">
            <img src={materialCarton} alt="Carton" onClick={() => setMaterialType("carton")} />
            <img src={materialBlanc} alt="Blanc" onClick={() => setMaterialType("blanc")} />
          </div>
        </div>
        <div className="radio-group">
          <label>Material light:</label>
          <div>
            <input
              type="radio"
              id="brillant"
              name="materialType"
              value="brillant"
              checked={materialType === "brillant"}
              onChange={handleMaterialTypeChange}
            />
            <label htmlFor="brillant">Brillant</label>
          </div>
          <div>
            <input
              type="radio"
              id="matte"
              name="materialType"
              value="matte"
              checked={materialType === "matte"}
              onChange={handleMaterialTypeChange}
            />
            <label htmlFor="matte">Matte</label>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="webgl" />
    </>
  );
};

export default Scene;
