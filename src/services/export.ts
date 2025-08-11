import type { Circle } from '../types/circle';
import type { Connection } from '../types/connection';

export interface ExportOptions {
  persistExportMeta: boolean;
  gridCountX: number;
  gridCountY: number;
  blockedConnections: Set<string>;
  maskMeta?: { type: 'diamond'; enabled: boolean; params: { centerI: number; centerJ: number; threshold: number } };
  shapes?: string[];
  isNodeMasked?: (c: Circle) => boolean;
}

export async function downloadSVG(svg: SVGSVGElement, connections: Connection[], opts: ExportOptions): Promise<void> {
  const { persistExportMeta, gridCountX, gridCountY, blockedConnections, maskMeta, shapes, isNodeMasked } = opts;
  // Clonar y limpiar overlays
  const svgClone = svg.cloneNode(true) as SVGSVGElement;
  const overlays = svgClone.querySelectorAll('.conn-overlay');
  overlays.forEach(el => el.parentNode && el.parentNode.removeChild(el));

  // Namespaces
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svgClone.setAttribute('version', '1.1');

  // Metadata
  if (persistExportMeta) {
    const meta: any = {
      blockedConnections: Array.from(blockedConnections),
      grid: { x: gridCountX, y: gridCountY }
    };
    if (maskMeta) meta.mask = maskMeta;
    if (shapes) meta.shapes = shapes;
    const metaEl = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metaEl.setAttribute('id', 'metaballs-meta');
    metaEl.textContent = JSON.stringify(meta);
    svgClone.insertBefore(metaEl, svgClone.firstChild);
  }

  const svgData = new XMLSerializer().serializeToString(svgClone);
  const svgWithXML = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgData;

  const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
  const activeConnectionsCount = connections.filter(c => {
    if (!c || c.isBlocked) return false;
    if (c.from.radius <= 0 || c.to.radius <= 0) return false;
    if (maskMeta?.enabled && isNodeMasked) {
      return !isNodeMasked(c.from) && !isNodeMasked(c.to);
    }
    return true;
  }).length;
  const filename = `metaballs-svg-editor-${gridCountX}x${gridCountY}-${activeConnectionsCount}conn-${timestamp}.svg`;

  try {
    if ('showSaveFilePicker' in window) {
      // @ts-expect-error: File System Access API typing optional
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'SVG files', accept: { 'image/svg+xml': ['.svg'] } }]
      });
      const writable = await fileHandle.createWritable();
      await writable.write(svgWithXML);
      await writable.close();
      console.log('✅ SVG descargado via File System API:', filename);
    } else {
      const blob = new Blob([svgWithXML], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('✅ SVG descargado via método tradicional:', filename);
    }
  } catch (downloadError) {
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgWithXML);
    window.open(dataUrl, '_blank');
    console.log('⚠️ SVG abierto en nueva ventana como fallback');
  }
}