import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

function SelectCamera() {
    const { scene } = useThree();
    const [cameraNames, setCameraNames] = useState([]);

    useEffect(() => {
        // Traverse the scene to find all cameras
        const cameras = [];
        scene.traverse((object) => {
            if (object.isCamera) {
                cameras.push(object.name || 'Unnamed Camera');
            }
        });

        // Update the state with the camera names
        setCameraNames(cameras);
    }, [scene]);

    return (
        <div className="sidebar">
            <h3>Camera Names</h3>
            <ul>
                {cameraNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
}

async function compressAndExportGLTF(gltf, fileName) {
    const exporter = new GLTFExporter();
    const options = {
        binary: true,
        dracoOptions: {
            compressionLevel: 10
        }
    };

    return new Promise((resolve, reject) => {
        exporter.parse(gltf.scene, (result) => {
            const blob = new Blob([result], { type: 'application/octet-stream' });
            saveAs(blob, fileName);
            resolve(blob);
        }, options);
    });
}

function Scene({ modelPath, onModelLoaded }) {
    const gltf = useLoader(GLTFLoader, modelPath, loader => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        loader.setDRACOLoader(dracoLoader);
    });

    useEffect(() => {
        if (gltf) {
            onModelLoaded(gltf);
        }
    }, [gltf, onModelLoaded]);

    return <primitive object={gltf.scene} />;
}

export default function Compression({ modelPath, onExport }) {
    const gltfRef = useRef();

    const handleModelLoaded = (gltf) => {
        gltfRef.current = gltf;
    };

    const handleExportClick = async () => {
        if (gltfRef.current) {
            try {
                const compressedBlob = await compressAndExportGLTF(gltfRef.current, "model_compressed.glb");
                console.log("Compressed Model Size (bytes): ", compressedBlob.size);
            } catch (error) {
                console.error("Error during compression and export:", error);
            }
        }
    };

    useEffect(() => {
        if (onExport) {
            onExport(handleExportClick);
        }
    }, [onExport]);

    return (
        <>
            {modelPath && <Scene modelPath={modelPath} onModelLoaded={handleModelLoaded} />}
        </>
    );
}
