// Entry point
import { SurgicalSafetyEngine } from './engine.js';

// Initialize the system
window.SurgicalSafetyEngine = new SurgicalSafetyEngine();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting Surgical Safety System...');
        if (window.SurgicalSafetyEngine) {
            await window.SurgicalSafetyEngine.init();
            console.log('✅ Surgical Safety System ready');
        }
    } catch (error) {
        console.error('❌ System initialization error:', error);
    }
});

console.log('🏥 Surgical Safety Engine loaded - Focus: NO OBJECTS LEFT IN PATIENT');

