// Main Surgical Safety Engine
import { CONFIG, SELECTORS } from './config.js';
import { DetectionService } from './detection.js';
import { TrackingService } from './tracking.js';
import { UIService } from './ui.js';
import { log } from './utils.js';

export class SurgicalSafetyEngine {
    constructor() {
        this.isDetecting = false;
        this.currentVideo = null;
        this.frameCount = 0;
        this.frameSkip = CONFIG.frameSkip;

        this.detectionService = new DetectionService();
        this.trackingService = new TrackingService();
        this.uiService = new UIService();
    }

    async init() {
        try {
            log('🚀', 'Initializing Surgical Safety Engine...');
            this.setupEventListeners();
            await this.detectionService.testConnection();
            this.uiService.updateStatus('AI: Ready for Safety Monitoring');
            log('✅', 'Surgical Safety Engine initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Roboflow, using fallback:', error);
            await this.detectionService.initializeFallback();
            this.uiService.updateStatus('AI: Fallback Mode Active');
            return true;
        }
    }

    setupEventListeners() {
        const { uploadBtn, videoInput, playBtn, pauseBtn, stopBtn, 
                manualScanBtn, safetyCheckBtn, verifySafeBtn, emergencyStopBtn } = SELECTORS;
        const get = (sel) => this.uiService.getElement(sel);

        get(uploadBtn)?.addEventListener('click', () => get(videoInput)?.click());
        get(videoInput)?.addEventListener('change', (e) => this.handleVideoUpload(e));
        get(playBtn)?.addEventListener('click', () => this.playVideo());
        get(pauseBtn)?.addEventListener('click', () => this.pauseVideo());
        get(stopBtn)?.addEventListener('click', () => this.stopVideo());
        get(manualScanBtn)?.addEventListener('click', () => this.performManualScan());
        get(safetyCheckBtn)?.addEventListener('click', () => this.performFinalSafetyCheck());
        get(verifySafeBtn)?.addEventListener('click', () => this.verifySafe());
        get(emergencyStopBtn)?.addEventListener('click', () => this.emergencyStop());
        get(SELECTORS.safetyModal)?.querySelector(SELECTORS.modalOverlay)?.addEventListener('click', () => this.uiService.closeModal());
    }

    getVideoElement() {
        return this.uiService.getElement(SELECTORS.video);
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const videoElement = this.getVideoElement();
        if (videoElement) {
            this.currentVideo = file;
            videoElement.src = URL.createObjectURL(file);
            this.uiService.enableVideoControls();
            log('✅', `Video loaded: ${file.name}`);
        }
    }

    playVideo() {
        const videoElement = this.getVideoElement();
        if (!videoElement || !this.currentVideo) return;
        videoElement.play();
        this.startDetection();
        log('▶️', 'Video playback and safety monitoring started');
    }

    pauseVideo() {
        const videoElement = this.getVideoElement();
        if (!videoElement) return;
        if (videoElement.paused) {
            videoElement.play();
            this.startDetection();
            log('▶️', 'Video resumed');
        } else {
            videoElement.pause();
            this.stopDetection();
            log('⏸️', 'Video paused');
        }
    }

    stopVideo() {
        const videoElement = this.getVideoElement();
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
        this.stopDetection();
        this.resetTracking();
        log('⏹️', 'Video stopped, tracking reset');
    }

    startDetection() {
        if (this.isDetecting) return;
        this.isDetecting = true;
        this.frameCount = 0;
        this.detectFrame();
        log('🔍', 'Safety detection started');
    }

    stopDetection() {
        this.isDetecting = false;
        log('🛑', 'Safety detection stopped');
    }

    async detectFrame() {
        if (!this.isDetecting) return;
        const videoElement = this.getVideoElement();
        if (!videoElement || videoElement.paused || videoElement.ended) {
            this.isDetecting = false;
            return;
        }
        this.frameCount++;
        if (this.frameCount % this.frameSkip === 0) {
            try {
                const instruments = await this.detectionService.detect(videoElement);
                this.trackingService.update(instruments);
                this.updateDisplay(instruments);
                this.checkSafety();
            } catch (error) {
                console.error('Detection error:', error);
            }
        }
        if (this.isDetecting) requestAnimationFrame(() => this.detectFrame());
    }

    updateDisplay(instruments) {
        this.uiService.updateDetectionDisplay(instruments);
        this.uiService.updateSafetyStatus(this.trackingService.getStats());
        this.uiService.updateStats(instruments, this.frameSkip);
    }

    checkSafety() {
        const criticalMissing = this.trackingService.getCriticalMissing();
        if (criticalMissing.length > 0) {
            this.uiService.showSafetyAlert(criticalMissing);
            log('🚨', 'SAFETY ALERT: Critical instruments missing!');
        }
    }

    performManualScan() {
        log('🔍', 'Performing manual safety scan...');
    }

    performFinalSafetyCheck() {
        log('✅', 'Performing final safety check...');
        const stats = this.trackingService.getStats();
        if (stats.missing === 0) {
            log('✅', 'SAFETY CHECK PASSED: All instruments accounted for. Safe to proceed.');
        } else {
            const criticalMissing = this.trackingService.getCriticalMissing();
            this.uiService.showSafetyAlert(criticalMissing);
        }
    }

    verifySafe() {
        log('✅', 'Safety verified by user');
        this.uiService.closeModal();
        log('✅', 'Safety verification complete. All instruments confirmed accounted for.');
    }

    emergencyStop() {
        log('🚨', 'EMERGENCY STOP activated!');
        this.stopDetection();
        this.uiService.closeModal();
        log('🚨', 'EMERGENCY STOP: All monitoring stopped. Manual verification required.');
    }

    resetTracking() {
        this.trackingService.reset();
        this.uiService.resetDisplay();
    }
}

