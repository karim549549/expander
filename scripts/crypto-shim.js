// Ensure global crypto is available for libraries that reference an unscoped `crypto` identifier
try {
  const nodeCrypto = require('crypto');
  if (!global.crypto) {
    global.crypto = nodeCrypto;
  }
  if (!globalThis.crypto) {
    globalThis.crypto = nodeCrypto;
  }
} catch (e) {
  // ignore
}
