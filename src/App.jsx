import { Canvas ,useThree} from '@react-three/fiber';
import './App.css';
import CustomGizmoHelper from './CustomGizmoHelper.jsx';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper.jsx';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Stats } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useState, useRef, useEffect } from 'react';
import ColorPickerGrid from './ColorPicker.jsx';
import OrthographicCameraWithHelper from './OrthographicCameraWithHelper.jsx';
import CameraNamesList from './CameraNamesList.jsx';
import TraverseForCamera from './TraverseforCamera.jsx';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from "firebase/app";
import {getStorage } from "firebase/storage";
import { Html } from '@react-three/drei';

const firebaseConfig = {
  apiKey: "AIzaSyBUsbX0lNGuDwn_sDkqy4djrDJpdL3Qr5g",
  authDomain: "twojs-bdb50.firebaseapp.com",
  projectId: "twojs-bdb50",
  storageBucket: "twojs-bdb50.appspot.com",
  messagingSenderId: "667804797365",
  appId: "1:667804797365:web:0abfa39c37ece6f5bef1fc",
  measurementId: "G-MRTQCCHDXN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'models');

const listModels = async () => {
  const modelsRef = ref(storage, 'models'); // Change 'models' to your folder name
  try {
    const res = await listAll(modelsRef);
    const modelPromises = res.items.map(item => getDownloadURL(item).then(url => ({ name: item.name, url })));
    const models = await Promise.all(modelPromises);
    return models;
  } catch (error) {
    console.error("Error listing models:", error);
  }
};


export default function App() {
  const [backgroundColor, setBackgroundColor] = useState('#3b3b3b');
  const [gridColor, setGridColor] = useState('#ffffff');
  const gridHelperRef = useRef(null);
  const [cameraNames, setCameraNames] = useState({});
  const [activeCamera, setActiveCamera] = useState('defaults'); // State to track active camera
  const [modelUrls, setModelUrls] = useState([]);
  const [selectedModelUrl, setSelectedModelUrl] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      const modelList = await listModels();
      setModelUrls(modelList);
    };

    fetchModels();
  }, []);

  const handleModelChange = (event) => {
    const url = event.target.value;
    setSelectedModelUrl(url);
  };

   // Use selected model URL if available

   useEffect(() => {
    if (selectedModelUrl) {
      setIsLoadingModel(true);
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);
      loader.load(selectedModelUrl, 
        (gltf) => {
          setGltf(gltf);
          setIsLoadingModel(false);
        },
        undefined,
        (error) => {
          console.error('An error occurred while loading the model:', error);
          setIsLoadingModel(false);
        }
      );
    }
  }, [selectedModelUrl]);
  return (
    <>
      <ColorPickerGrid setBackgroundColor={setBackgroundColor} setGridColor={setGridColor} gridHelperRef={gridHelperRef} />
      <CameraNamesList cameraNames={cameraNames} setCameraNames={setCameraNames} setActiveCamera={setActiveCamera}  position={'absolute'} />
      <div className="model-selector">
        <label htmlFor="model-select">Select a model:</label>
        <select id="model-select" onChange={handleModelChange}>
        <option value="">Select a model</option>
          {modelUrls.map(model => (
          <option key={model.url} value={model.url}>
          {model.name}
        </option>
          ))}
        </select>
      </div>
      <Canvas camera={{ position: [0, 3, 10]}}>
          <ambientLight />
          <CustomGizmoHelper orbitConrols={activeCamera}/>
          {gltf && <primitive object={gltf.scene} />}
      <TraverseForCamera setCameraNames={setCameraNames} />
      {isLoadingModel ? <Html><div>Loading...</div></Html> : gltf && <primitive object={gltf.scene} />}
      <PerspectiveCameraWithHelper 
        name="PerspectiveCamera1" 
        visible={cameraNames} 
        active={activeCamera}
        position={[0, 1.3, 0]} 
        far={10} 
      />
      <OrthographicCameraWithHelper 
        name="OrthographicCamera1" 
        visible={cameraNames} 
        active={activeCamera}
        position={[0, 0, 5]} 
        far={16}
      />

      <gridHelper args={[20, 20, '0xff0000', setGridColor]} />
      <Stats />
    </Canvas>
    </>
  );
}