import { storage, ref, getDownloadURL, uploadBytesResumable, listAll } from './firebase';

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

export { listModels };