// Detection logic for Roboflow and COCO-SSD
import { CONFIG, SURGICAL_MAPPING, COCO_MAPPING, COCO_CLASSES } from './config.js';
import { createInstrumentId, getSurgicalInfo, captureVideoFrame } from './utils.js';

export class DetectionService {
    constructor() {
        this.usingFallback = false;
        this.cocoModel = null;
    }

    async testConnection() {
        const response = await fetch(`${CONFIG.modelEndpoint}?api_key=${CONFIG.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: CONFIG.testImage
        });
        if (!response.ok) throw new Error(`API test failed: ${response.status}`);
    }

    async initializeFallback() {
        if (typeof cocoSsd !== 'undefined') {
            this.cocoModel = await cocoSsd.load();
            this.usingFallback = true;
            return true;
        }
        return false;
    }

    async detect(videoElement) {
        try {
            return this.usingFallback 
                ? await this.detectWithCOCO(videoElement)
                : await this.detectWithRoboflow(videoElement);
        } catch (error) {
            console.error('Detection error:', error);
            if (!this.usingFallback && this.cocoModel) {
                this.usingFallback = true;
                return await this.detectWithCOCO(videoElement);
            }
            return [];
        }
    }

    async detectWithRoboflow(videoElement) {
        const frameBase64 = captureVideoFrame(videoElement);
        const response = await fetch(`${CONFIG.modelEndpoint}?api_key=${CONFIG.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: frameBase64
        });

        if (!response.ok) throw new Error(`Roboflow API error: ${response.status}`);
        
        const result = await response.json();
        return this.processRoboflowDetections(result);
    }

    async detectWithCOCO(videoElement) {
        const predictions = await this.cocoModel.detect(videoElement);
        return predictions
            .filter(pred => COCO_CLASSES.includes(pred.class))
            .map(pred => this.processCOCODetection(pred));
    }

    createInstrumentData(type, confidence, source) {
        const surgicalInfo = getSurgicalInfo(type);
        return {
            id: createInstrumentId(type),
            type,
            name: surgicalInfo.name,
            icon: surgicalInfo.icon,
            critical: surgicalInfo.critical,
            confidence,
            source,
            timestamp: Date.now()
        };
    }

    processRoboflowDetections(result) {
        if (!result.predictions || !Array.isArray(result.predictions)) return [];
        return result.predictions.map(pred => 
            this.createInstrumentData(pred.class.toLowerCase(), pred.confidence, 'roboflow')
        );
    }

    processCOCODetection(pred) {
        const mappedType = COCO_MAPPING[pred.class] || 'forceps';
        return this.createInstrumentData(mappedType, pred.score, 'coco-fallback');
    }
}

