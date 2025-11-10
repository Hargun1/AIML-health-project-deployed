// Instrument tracking logic
export class TrackingService {
    constructor() {
        this.allInstrumentsSeen = new Map();
        this.currentlyVisible = new Map();
        this.missingInstruments = new Map();
    }

    update(currentInstruments) {
        this.currentlyVisible.clear();
        currentInstruments.forEach(instrument => {
            this.currentlyVisible.set(instrument.type, instrument);
            if (!this.allInstrumentsSeen.has(instrument.type)) {
                this.allInstrumentsSeen.set(instrument.type, instrument);
            }
        });

        this.missingInstruments.clear();
        this.allInstrumentsSeen.forEach((instrument, type) => {
            if (!this.currentlyVisible.has(type)) {
                this.missingInstruments.set(type, instrument);
            }
        });
    }

    getCriticalMissing() {
        return Array.from(this.missingInstruments.values())
            .filter(instrument => instrument.critical);
    }

    reset() {
        this.allInstrumentsSeen.clear();
        this.currentlyVisible.clear();
        this.missingInstruments.clear();
    }

    getStats() {
        return {
            total: this.allInstrumentsSeen.size,
            visible: this.currentlyVisible.size,
            missing: this.missingInstruments.size
        };
    }
}

