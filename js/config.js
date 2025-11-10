// Configuration and constants
export const CONFIG = {
    apiKey: 'hIcAVCRoi1LpupF0mKJp',
    modelEndpoint: 'https://serverless.roboflow.com/surgery-kqaqg/1',
    frameSkip: 3,
    testImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8B8A'
};

export const SURGICAL_MAPPING = {
    scissors: { name: 'Surgical Scissors', icon: '✂️', critical: true },
    forceps: { name: 'Surgical Forceps', icon: '🔧', critical: true },
    scalpel: { name: 'Scalpel', icon: '🔪', critical: true },
    clamp: { name: 'Hemostatic Clamp', icon: '🔩', critical: true },
    retractor: { name: 'Retractor', icon: '⚙️', critical: false },
    syringe: { name: 'Syringe', icon: '💉', critical: false },
    basin: { name: 'Surgical Basin', icon: '🥣', critical: false }
};

export const COCO_MAPPING = {
    scissors: 'scissors',
    knife: 'scalpel',
    fork: 'forceps',
    spoon: 'retractor',
    bottle: 'syringe',
    cup: 'basin',
    bowl: 'basin'
};

export const COCO_CLASSES = Object.keys(COCO_MAPPING);

export const SELECTORS = {
    video: '#camera-feed',
    videoInput: '#video-file-input',
    uploadBtn: '#upload-video-btn',
    playBtn: '#play-video-btn',
    pauseBtn: '#pause-video-btn',
    stopBtn: '#stop-video-btn',
    manualScanBtn: '#manual-scan-btn',
    safetyCheckBtn: '#safety-check-btn',
    verifySafeBtn: '#verify-safe-btn',
    emergencyStopBtn: '#emergency-stop-btn',
    detectedInstruments: '#detected-instruments',
    totalCount: '#total-count',
    visibleCount: '#visible-count',
    missingCount: '#missing-count',
    safetyPanel: '#safety-panel',
    fpsCounter: '#fps-counter',
    confidenceAvg: '#confidence-avg',
    aiStatus: '#ai-status',
    safetyModal: '#safety-alert-modal',
    modalOverlay: '.modal-overlay',
    missingList: '#missing-instruments-list'
};

