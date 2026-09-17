// ==========================================================================
// TEMPLEOS ILLUMINATI 3D ENGINE (ALL-SEEING EYE & PYRAMID OF PROVIDENCE)
// Rendu fil de fer 3D temps réel de la Pyramide tronquée avec l'Œil d'Horus
// qui suit la souris ou pivote à 60 FPS en VGA 16 couleurs.
// ==========================================================================

class Illuminati3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.angleX = 15;
    this.angleY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mode = 'pyramid'; // 'pyramid' ou 'cross'

    // Sommets de la Pyramide tronquée Illuminati (Base 4 points, Sommet tronqué 4 points, Cime volante 1 point)
    // Coordonnées X, Y, Z
    this.pyramidVertices = [
      // Base carrée
      [-1.2, -0.9, -1.2], [ 1.2, -0.9, -1.2], [ 1.2, -0.9,  1.2], [-1.2, -0.9,  1.2],
      // Étage supérieur tronqué (niveau maçonnique)
      [-0.45, 0.25, -0.45], [ 0.45, 0.25, -0.45], [ 0.45, 0.25,  0.45], [-0.45, 0.25,  0.45],
      // Pierre de faîte flottante (Cap-stone avec l'Œil)
      [-0.32, 0.45, -0.32], [ 0.32, 0.45, -0.32], [ 0.32, 0.45,  0.32], [-0.32, 0.45,  0.32],
      // Sommet pointu de la pierre de faîte
      [ 0.0, 0.95,  0.0],
      // Centre de l'Œil de la Providence (Point de repère pour la pupille)
      [ 0.0, 0.62, 0.35]
    ];

    // Arêtes de liaison de la Pyramide
    this.pyramidEdges = [
      // Base
      [0, 1], [1, 2], [2, 3], [3, 0],
      // Piliers vers troncature
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Anneau de troncature
      [4, 5], [5, 6], [6, 7], [7, 4],
      // Base pierre de faîte flottante
      [8, 9], [9, 10], [10, 11], [11, 8],
      // Arêtes vers le sommet
      [8, 12], [9, 12], [10, 12], [11, 12]
    ];

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 140;
    this.canvas.height = 120;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      this.mouseY = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
    });

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
    const distance = 3.4;
    const fov = 48;
    const z = p[2] + distance;
    const x = (p[0] / z) * fov + this.canvas.width / 2;
    const y = (-p[1] / z) * fov + this.canvas.height / 2 + 5;
    return [x, y, z];
  }

  draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Rotation automatique + influence de la souris
    this.angleY += 1.4;
    const effAngleX = this.angleX + this.mouseY * 20;
    const effAngleY = this.angleY + this.mouseX * 25;

    const projected = [];
    for (const v of this.pyramidVertices) {
      let p = this.rotateX(v, effAngleX);
      p = this.rotateY(p, effAngleY);
      projected.push(this.project(p));
    }

    // Rayons sacrés dorés émanant de la cime
    const apex = projected[12];
    this.ctx.strokeStyle = 'rgba(255, 255, 85, 0.25)';
    this.ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(apex[0], apex[1]);
      this.ctx.lineTo(apex[0] + Math.cos(a + this.angleY * 0.05) * 25, apex[1] + Math.sin(a + this.angleY * 0.05) * 20);
      this.ctx.stroke();
    }

    // Arêtes de la Pyramide en Vert Dollar / Jaune VGA
    this.ctx.strokeStyle = '#55ff55';
    this.ctx.lineWidth = 1.6;

    for (const [sIdx, eIdx] of this.pyramidEdges) {
      const p1 = projected[sIdx];
      const p2 = projected[eIdx];

      this.ctx.beginPath();
      this.ctx.moveTo(p1[0], p1[1]);
      this.ctx.lineTo(p2[0], p2[1]);
      this.ctx.stroke();
    }

    // Pierre de faîte en Or Maçonnique
    this.ctx.strokeStyle = '#ffff55';
    this.ctx.lineWidth = 2.0;
    const capEdges = [[8,9],[9,10],[10,11],[11,8],[8,12],[9,12],[10,12],[11,12]];
    for (const [s, e] of capEdges) {
      const p1 = projected[s];
      const p2 = projected[e];
      this.ctx.beginPath();
      this.ctx.moveTo(p1[0], p1[1]);
      this.ctx.lineTo(p2[0], p2[1]);
      this.ctx.stroke();
    }

    // L'Œil qui voit tout (Eye of Providence)
    const eyeCenter = projected[13];
    // Forme d'amande de l'œil
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.ellipse(eyeCenter[0], eyeCenter[1], 8, 4.5, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Iris / Pupille qui regarde vers la souris
    const pupilOffX = Math.max(-3, Math.min(3, this.mouseX * 3));
    const pupilOffY = Math.max(-1.5, Math.min(1.5, this.mouseY * 1.5));
    this.ctx.fillStyle = '#55ffff';
    this.ctx.beginPath();
    this.ctx.arc(eyeCenter[0] + pupilOffX, eyeCenter[1] + pupilOffY, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#aa0000';
    this.ctx.beginPath();
    this.ctx.arc(eyeCenter[0] + pupilOffX, eyeCenter[1] + pupilOffY, 1.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

window.Illuminati3DViewer = Illuminati3DViewer;
