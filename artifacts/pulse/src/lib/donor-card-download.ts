type DonorCardDetails = {
  name?: string | null;
  donorId: string;
  bloodType?: string | null;
  district?: string | null;
  nextEligibleDate?: string | null;
  status?: string | null;
};

const CARD_WIDTH = 720;
const CARD_HEIGHT = 400;
const CARD_RADIUS = 24;

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawCalendarIcon(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.strokeStyle = '#00d4ff';
  context.lineWidth = 2;
  roundedRect(context, x, y + 3, 18, 17, 3);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y + 8);
  context.lineTo(x + 18, y + 8);
  context.moveTo(x + 5, y);
  context.lineTo(x + 5, y + 6);
  context.moveTo(x + 13, y);
  context.lineTo(x + 13, y + 6);
  context.stroke();
  context.restore();
}

function drawShieldIcon(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.strokeStyle = '#00d4ff';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x + 9, y);
  context.lineTo(x + 17, y + 3);
  context.lineTo(x + 16, y + 11);
  context.quadraticCurveTo(x + 14, y + 17, x + 9, y + 20);
  context.quadraticCurveTo(x + 4, y + 17, x + 2, y + 11);
  context.lineTo(x + 1, y + 3);
  context.closePath();
  context.stroke();
  context.restore();
}

function fitText(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string {
  if (context.measureText(value).width <= maxWidth) return value;
  let shortened = value;
  while (shortened.length > 1 && context.measureText(`${shortened}…`).width > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return `${shortened}…`;
}

export async function downloadDonorCardPng(details: DonorCardDetails): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('Donor card downloads are only available in a web browser.');
  }

  const pixelRatio =
    typeof window === 'undefined'
      ? 2
      : Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH * pixelRatio;
  canvas.height = CARD_HEIGHT * pixelRatio;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not prepare the donor card image.');
  context.scale(pixelRatio, pixelRatio);

  const primary = '#e74c3c';
  const card = '#0b0f16';
  const foreground = '#f5f7fa';
  const muted = '#8b94a3';
  const border = '#1c2430';

  roundedRect(context, 1, 1, CARD_WIDTH - 2, CARD_HEIGHT - 2, CARD_RADIUS);
  context.fillStyle = card;
  context.fill();
  context.strokeStyle = primary;
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = primary;
  context.font = '700 18px Inter, Arial, sans-serif';
  context.letterSpacing = '2px';
  context.fillText('PULSE DONOR', 48, 67);
  context.letterSpacing = '0px';

  context.fillStyle = foreground;
  context.font = '700 36px "Space Grotesk", Inter, Arial, sans-serif';
  context.fillText(fitText(context, details.name || 'Donor', 490), 48, 116);

  context.fillStyle = muted;
  context.font = '16px Inter, Arial, sans-serif';
  context.fillText(
    `${details.donorId} · ${details.district || 'District not set'}`,
    48,
    145,
  );

  roundedRect(context, 604, 43, 68, 68, 12);
  context.fillStyle = primary;
  context.fill();
  context.fillStyle = '#ffffff';
  context.font = '700 24px "Space Grotesk", Inter, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(details.bloodType || '?', 638, 77);
  context.textAlign = 'start';
  context.textBaseline = 'alphabetic';

  context.fillStyle = border;
  context.fillRect(48, 181, CARD_WIDTH - 96, 1);

  drawCalendarIcon(context, 49, 211);
  context.fillStyle = foreground;
  context.font = '500 18px Inter, Arial, sans-serif';
  context.fillText(`Next eligible: ${formatDate(details.nextEligibleDate)}`, 80, 228);

  drawShieldIcon(context, 49, 260);
  context.fillText(`Status: ${details.status || 'active'}`, 80, 278);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('Could not create the donor card PNG.'));
    }, 'image/png');
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeId = details.donorId.replace(/[^a-z0-9-_]/gi, '-');
  link.href = url;
  link.download = `pulse-donor-card-${safeId || 'donor'}.png`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}