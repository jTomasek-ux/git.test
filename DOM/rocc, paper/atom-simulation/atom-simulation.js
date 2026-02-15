// Atom Simulation Engine
class AtomSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.atoms = {
            hydrogen: { symbol: 'H', atomicNumber: 1, electrons: 1, protons: 1, neutrons: 0, name: 'Hydrogen' },
            helium: { symbol: 'He', atomicNumber: 2, electrons: 2, protons: 2, neutrons: 2, name: 'Helium' },
            lithium: { symbol: 'Li', atomicNumber: 3, electrons: 3, protons: 3, neutrons: 4, name: 'Lithium' },
            carbon: { symbol: 'C', atomicNumber: 6, electrons: 6, protons: 6, neutrons: 6, name: 'Carbon' },
            nitrogen: { symbol: 'N', atomicNumber: 7, electrons: 7, protons: 7, neutrons: 7, name: 'Nitrogen' },
            oxygen: { symbol: 'O', atomicNumber: 8, electrons: 8, protons: 8, neutrons: 8, name: 'Oxygen' },
            neon: { symbol: 'Ne', atomicNumber: 10, electrons: 10, protons: 10, neutrons: 10, name: 'Neon' },
            sodium: { symbol: 'Na', atomicNumber: 11, electrons: 11, protons: 11, neutrons: 12, name: 'Sodium' }
        };
        
        this.currentAtom = 'hydrogen';
        this.electrons = [];
        this.animationSpeed = 1;
        this.isPaused = false;
        this.showOrbits = true;
        this.showNucleus = true;
        this.animationId = null;
        this.time = 0;
        
        this.setupEventListeners();
        this.initializeElectrons();
        this.animate();
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(800, window.innerWidth - 80);
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    setupEventListeners() {
        document.getElementById('atom-select').addEventListener('change', (e) => {
            this.currentAtom = e.target.value;
            this.initializeElectrons();
            this.updateAtomInfo();
        });
        
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = `${this.animationSpeed.toFixed(1)}x`;
        });
        
        document.getElementById('show-orbits').addEventListener('change', (e) => {
            this.showOrbits = e.target.checked;
        });
        
        document.getElementById('show-nucleus').addEventListener('change', (e) => {
            this.showNucleus = e.target.checked;
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            document.getElementById('pause-btn').textContent = this.isPaused ? 'Resume' : 'Pause';
            if (!this.isPaused) {
                this.animate();
            }
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.time = 0;
            this.initializeElectrons();
        });
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.initializeElectrons();
        });
    }
    
    initializeElectrons() {
        const atom = this.atoms[this.currentAtom];
        const electronCount = atom.electrons;
        this.electrons = [];
        
        // Calculate electron shells based on electron configuration
        const shells = this.calculateElectronShells(electronCount);
        
        let electronIndex = 0;
        shells.forEach((shellElectrons, shellIndex) => {
            const shellRadius = 80 + (shellIndex * 60);
            const angleStep = (2 * Math.PI) / shellElectrons;
            
            for (let i = 0; i < shellElectrons; i++) {
                const baseAngle = i * angleStep;
                const orbitRadius = shellRadius;
                const speed = 0.02 + (shellIndex * 0.005); // Different speeds for different shells
                
                this.electrons.push({
                    shell: shellIndex,
                    orbitRadius: orbitRadius,
                    baseAngle: baseAngle,
                    speed: speed,
                    angle: baseAngle,
                    size: 4 + (shellIndex * 0.5)
                });
                electronIndex++;
            }
        });
    }
    
    calculateElectronShells(electronCount) {
        // Simplified electron shell configuration
        // Shell capacity: 2, 8, 8, 18, 18, 32...
        const shells = [];
        let remaining = electronCount;
        const shellCapacities = [2, 8, 8, 18, 18, 32];
        
        for (let i = 0; i < shellCapacities.length && remaining > 0; i++) {
            const capacity = shellCapacities[i];
            const electronsInShell = Math.min(remaining, capacity);
            shells.push(electronsInShell);
            remaining -= electronsInShell;
        }
        
        return shells;
    }
    
    updateAtomInfo() {
        const atom = this.atoms[this.currentAtom];
        document.getElementById('element-name').textContent = atom.name;
        document.getElementById('element-symbol').textContent = atom.symbol;
        document.getElementById('atomic-number').textContent = atom.atomicNumber;
        document.getElementById('electron-count').textContent = atom.electrons;
        document.getElementById('proton-count').textContent = atom.protons;
        document.getElementById('neutron-count').textContent = atom.neutrons;
    }
    
    drawNucleus() {
        if (!this.showNucleus) return;
        
        const atom = this.atoms[this.currentAtom];
        const nucleusSize = 15 + (atom.protons + atom.neutrons) * 0.5;
        
        // Draw nucleus glow
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, nucleusSize * 2
        );
        gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 150, 150, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 200, 200, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, nucleusSize * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw nucleus
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, nucleusSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw nucleus border
        this.ctx.strokeStyle = '#ff4757';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawOrbits() {
        if (!this.showOrbits) return;
        
        const uniqueShells = new Set(this.electrons.map(e => e.shell));
        
        uniqueShells.forEach(shell => {
            const shellElectrons = this.electrons.filter(e => e.shell === shell);
            if (shellElectrons.length === 0) return;
            
            const radius = shellElectrons[0].orbitRadius;
            const opacity = 0.2 - (shell * 0.02);
            
            this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }
    
    drawElectrons() {
        this.electrons.forEach((electron, index) => {
            if (!this.isPaused) {
                electron.angle += electron.speed * this.animationSpeed;
            }
            
            const x = this.centerX + Math.cos(electron.angle) * electron.orbitRadius;
            const y = this.centerY + Math.sin(electron.angle) * electron.orbitRadius;
            
            // Draw electron glow
            const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, electron.size * 3);
            glowGradient.addColorStop(0, 'rgba(100, 200, 255, 0.6)');
            glowGradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, electron.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw electron
            this.ctx.fillStyle = '#64c8ff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, electron.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw electron border
            this.ctx.strokeStyle = '#4da6ff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Draw trail effect
            const trailLength = 5;
            for (let i = 1; i <= trailLength; i++) {
                const trailAngle = electron.angle - (i * 0.1);
                const trailX = this.centerX + Math.cos(trailAngle) * electron.orbitRadius;
                const trailY = this.centerY + Math.sin(trailAngle) * electron.orbitRadius;
                const opacity = 0.2 * (1 - i / trailLength);
                
                this.ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, electron.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw orbits
        this.drawOrbits();
        
        // Draw nucleus
        this.drawNucleus();
        
        // Draw electrons
        this.drawElectrons();
        
        // Draw center point
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    animate() {
        if (this.isPaused) return;
        
        this.draw();
        this.time += 0.016 * this.animationSpeed;
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new AtomSimulation('atom-canvas');
    simulation.updateAtomInfo();
});
