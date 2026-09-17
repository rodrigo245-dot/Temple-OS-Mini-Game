// ==========================================================================
// TEMPLEOS 3D ASCII WIREFRAME ENGINE (TERRY A. DAVIS 3D SIMULATION)
// Rendu fil de fer 3D temps réel projeté en ASCII / Canvas
// ==========================================================================

class Temple3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;
    this.model = 'cross'; // 'cross' ou 'elephant'

    // Sommets de la Croix 3D (X, Y, Z)
    this.crossVertices = [
      // Poutre verticale
      [-0.4, -1.2, -0.3], [ 0.4, -1.2, -0.3], [ 0.4,  1.2, -0.3], [-0.4,  1.2, -0.3],
      [-0.4, -1.2,  0.3], [ 0.4, -1.2,  0.3], [ 0.4,  1.2,  0.3], [-0.4,  1.2,  0.3],
      // Poutre horizontale
      [-1.1,  0.1, -0.3], [ 1.1,  0.1, -0.3], [ 1.1,  0.7, -0.3], [-1.1,  0.7, -0.3],
      [-1.1,  0.1,  0.3], [ 1.1,  0.1,  0.3], [ 1.1,  0.7,  0.3], [-1.1,  0.7,  0.3]
    ];

    this.crossEdges = [
      // Tronc vertical
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7],
      // Bras horizontal
      [8,9], [9,10], [10,11], [11,8],
      [12,13], [13,14], [14,15], [15,12],
      [8,12], [9,13], [10,14], [11,15]
    ];

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 130;
    this.canvas.height = 110;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.animate();
  }

  rotateX(p, angle) {
    const rad = angle * Math.PI / 180;
    const cosa = Math.cos(rad);
    const sina = Math.sin(rad);
    const y = p[1] * cosa - p[2] * sina;
    const z = p[1] * sina + p[2] * cosa;
    return [p[0], y, z];
  }

  rotateY(p, angle) {
    const rad = angle * Math.PI / 180;
    const cosa = Math.cos(rad);
    const sina = Math.sin(rad);
    const x = p[0] * cosa + p[2] * sina;
    const z = -p[0] * sina + p[2] * cosa;
    return [x, p[1], z];
  }

  project(p) {
    const distance = 3.2;
    const fov = 45;
    const z = p[2] + distance;
    const x = (p[0] / z) * fov + this.canvas.width / 2;
    const y = (-p[1] / z) * fov + this.canvas.height / 2;
    return [x, y];
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Rotation
    this.angleX += 1.2;
    this.angleY += 1.8;

    const projected = [];
    for (const v of this.crossVertices) {
      let p = this.rotateX(v, this.angleX);
      p = this.rotateY(p, this.angleY);
      projected.push(this.project(p));
    }

    // Dessin fil de fer en vert/jaune TempleOS
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 1.5;

    for (const [startIdx, endIdx] of this.crossEdges) {
      const p1 = projected[startIdx];
      const p2 = projected[endIdx];

      this.ctx.beginPath();
      this.ctx.moveTo(p1[0], p1[1]);
      this.ctx.lineTo(p2[0], p2[1]);
      this.ctx.stroke();
    }

    // Affichage des sommets comme des points lumineux
    this.ctx.fillStyle = '#55ffff';
    for (const p of projected) {
      this.ctx.fillRect(p[0] - 1.5, p[1] - 1.5, 3, 3);
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

window.Temple3DViewer = Temple3DViewer;
