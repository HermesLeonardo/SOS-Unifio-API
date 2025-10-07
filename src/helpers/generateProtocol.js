function pad(n, width) {
  const s = String(n);
  return s.length >= width ? s : new Array(width - s.length + 1).join('0') + s;
}

function generateProtocol(prefix = 'EMG', id = null) {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const idPart = id
    ? pad(id, 6)
    : Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `${prefix}-${idPart}-${datePart}`;
}

module.exports = { generateProtocol };
