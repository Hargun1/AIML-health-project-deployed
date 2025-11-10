// Utility functions
import { SURGICAL_MAPPING } from './config.js';

export const createInstrumentId = (type) => 
    `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getSurgicalInfo = (className) => 
    SURGICAL_MAPPING[className] || { name: className, icon: '🔧', critical: false };

export const captureVideoFrame = (videoElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
};

export const calculateAvgConfidence = (instruments) => 
    instruments.length > 0 
        ? instruments.reduce((sum, i) => sum + i.confidence, 0) / instruments.length 
        : 0;

export const formatPercent = (value) => Math.round(value * 100) + '%';

export const log = (emoji, message) => console.log(emoji, message);

