import * as faceapi from 'face-api.js';

const MODEL_URL = '/models'

export const loadModels = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadAgeGenderModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)
}

export const faceAnalysis = (image) => {
    return new Promise((resolve, reject) => {
        if (typeof image === 'string' && image.includes('http')) {
            faceapi.fetchImage(image).then(img => {
                return faceapi.detectSingleFace(img).withAgeAndGender().withFaceExpressions();
            }).then(resolve).catch(reject)
        } else if (typeof image === 'string' && image.includes('base64')) {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                faceapi.detectSingleFace(img).withAgeAndGender().withFaceExpressions().then(resolve).catch(reject)
            }
        } else {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
                faceapi.detectSingleFace(img).withAgeAndGender().withFaceExpressions().then(resolve).catch(reject)
            }
        }
    });
}

export default faceapi;