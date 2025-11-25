// Audio system using Web Audio API for procedural sound generation
const AudioSystem = {
    context: null,
    initialized: false,
    lastFootstepTime: 0,
    footstepInterval: 250, // ms between footsteps

    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    },

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Footstep sound - short noise burst
    playFootstep() {
        if (!this.initialized) return;

        const now = Date.now();
        if (now - this.lastFootstepTime < this.footstepInterval) return;
        this.lastFootstepTime = now;

        const ctx = this.context;
        const duration = 0.05;
        const time = ctx.currentTime;

        // Create noise
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Filter for a softer sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialDecayTo = 0.01;
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(time);
        noise.stop(time + duration);
    },

    // Jump sound - rising tone
    playJump() {
        if (!this.initialized) return;

        const ctx = this.context;
        const time = ctx.currentTime;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(500, time + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
    },

    // Landing sound - low thud
    playLand() {
        if (!this.initialized) return;

        const ctx = this.context;
        const time = ctx.currentTime;
        const duration = 0.1;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
    },

    // Collect sound - pleasant chime
    playCollect() {
        if (!this.initialized) return;

        const ctx = this.context;
        const time = ctx.currentTime;

        // Play a nice chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const gain = ctx.createGain();
            const startTime = time + index * 0.03;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    },

    // Win sound - triumphant fanfare
    playWin() {
        if (!this.initialized) return;

        const ctx = this.context;
        const time = ctx.currentTime;

        // Ascending arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 to G5

        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;

            const gain = ctx.createGain();
            const startTime = time + index * 0.1;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }
};
