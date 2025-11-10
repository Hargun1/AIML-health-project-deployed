// UI update functions
import { SELECTORS } from './config.js';
import { formatPercent, calculateAvgConfidence } from './utils.js';

export class UIService {
    constructor() {
        this.selectors = SELECTORS;
    }

    getElement(id) {
        return document.querySelector(id);
    }

    updateStatus(message) {
        const el = this.getElement(this.selectors.aiStatus);
        if (el) el.textContent = message;
    }

    updateDetectionDisplay(instruments) {
        const container = this.getElement(this.selectors.detectedInstruments);
        if (!container) return;

        if (instruments.length === 0) {
            container.innerHTML = `
                <div class="no-detections">
                    <div class="no-detections-icon">🔍</div>
                    <div class="no-detections-text">Scanning for instruments...</div>
                </div>
            `;
            return;
        }

        container.innerHTML = instruments.map(instrument => `
            <div class="detected-instrument ${instrument.critical ? 'critical' : 'high'}">
                <div class="instrument-icon">${instrument.icon}</div>
                <div class="instrument-name">${instrument.name}</div>
                <div class="instrument-confidence">${formatPercent(instrument.confidence)}</div>
            </div>
        `).join('');
    }

    updateSafetyStatus(stats) {
        const { total, visible, missing } = stats;
        const setText = (sel, val) => { const el = this.getElement(sel); if (el) el.textContent = val; };
        setText(this.selectors.totalCount, total);
        setText(this.selectors.visibleCount, visible);
        setText(this.selectors.missingCount, missing);
        this.getElement(this.selectors.safetyPanel)?.classList.toggle('alert', missing > 0);
    }

    updateStats(instruments, frameSkip) {
        const fpsEl = this.getElement(this.selectors.fpsCounter);
        const confEl = this.getElement(this.selectors.confidenceAvg);
        
        if (fpsEl) fpsEl.textContent = Math.round(1000 / (frameSkip * 33));
        if (confEl && instruments.length > 0) {
            confEl.textContent = formatPercent(calculateAvgConfidence(instruments));
        }
    }

    showSafetyAlert(missingCritical) {
        const listEl = this.getElement(this.selectors.missingList);
        if (listEl) {
            listEl.innerHTML = `
                <h4>Missing Critical Instruments:</h4>
                <ul>
                    ${missingCritical.map(instrument => 
                        `<li>${instrument.icon} ${instrument.name}</li>`
                    ).join('')}
                </ul>
                <p><strong>These instruments were visible earlier in the procedure but are no longer detected.</strong></p>
            `;
        }
        this.showModal();
    }

    showModal() {
        const modal = this.getElement(this.selectors.safetyModal);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = this.getElement(this.selectors.safetyModal);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    resetDisplay() {
        const container = this.getElement(this.selectors.detectedInstruments);
        if (container) {
            container.innerHTML = `
                <div class="no-detections">
                    <div class="no-detections-icon">👁️</div>
                    <div class="no-detections-text">Upload video to start detection</div>
                </div>
            `;
        }
        this.updateSafetyStatus({ total: 0, visible: 0, missing: 0 });
    }

    enableVideoControls() {
        const playBtn = this.getElement(this.selectors.playBtn);
        const pauseBtn = this.getElement(this.selectors.pauseBtn);
        const stopBtn = this.getElement(this.selectors.stopBtn);
        if (playBtn) playBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = false;
    }
}

