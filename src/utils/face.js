import * as faceapi from 'face-api.js';

const MODEL_URL = '/models'

export const loadModels = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadAgeGenderModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)
}

const expressionScoreMap = {
    happy: 1,
    neutral: 0.5,
    sad: -0.5,
    angry: -1,
    fearful: -1,
    disgusted: -1,
    surprised: 0.5
}

export const getExpressionScore = (expressions) => {
    const expressionScore = Object.entries(expressions).reduce((acc, cur) => acc + expressionScoreMap[cur[0]] * cur[1], 0);
    return expressionScore;
};

export const faceAnalysis = async (image) => {
    let img;
    if (typeof image === 'string' && image.includes('http')) {
        img = await faceapi.fetchImage(image);
    } else if (typeof image === 'string' && image.includes('base64')) {
        img = new Image();
        img.src = image;
        await new Promise((resolve) => img.onload = resolve);
    } else {
        img = new Image();
        img.src = URL.createObjectURL(image);
        await new Promise((resolve) => img.onload = resolve);
    }
    const result = await faceapi.detectSingleFace(img).withAgeAndGender().withFaceExpressions();
    if (!result) return null;
    const lamda = 0.7;
    result.score = result.detection.score * lamda + getExpressionScore(result.expressions) * (1 - lamda);
    return result;
};

export default faceapi;