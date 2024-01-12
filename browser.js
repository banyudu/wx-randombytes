'use strict'

// limit of Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
const MAX_BYTES = 65536

// Node supports requesting up to this number of bytes
// https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
const MAX_UINT32 = 4294967295

// function oldBrowser () {
//   throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
// }

// const _global = typeof globalThis !== 'undefined' ? globalThis : global
// const crypto = _global.crypto || _global.msCrypto

// if (crypto && crypto.getRandomValues) {
//   module.exports = randomBytes
// } else {
//   module.exports = oldBrowser
// }

module.exports = randomBytes

function getRandomValues (arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * 256)
  }
  return arr
}

function randomBytes (size, cb) {
  console.log('randomBytes.size: ', size)
  size = 32 // hardcode to 32 bytes for now
  // phantomjs needs to throw
  if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

  const bytes = Buffer.allocUnsafe(size)

  if (size > 0) { // getRandomValues fails on IE if size == 0
    if (size > MAX_BYTES) { // this is the max bytes crypto.getRandomValues
      // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      for (let generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice automatically checks if the end is past the end of
        // the buffer so we don't have to here
        getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
      }
    } else {
      getRandomValues(bytes)
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}
