import { Message } from 'google-protobuf'

export function EncodeStringToBytes(s: string): string {
  const buf = new ArrayBuffer(s.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = s.length; i < strLen; i++) {
    bufView[i] = s.charCodeAt(i)
  }
  return encodeBase64(bufView)
}

export function EncodeMessageToURLComponent(message: Message): string {
  return encodeBase64(message.serializeBinary())
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export interface IDeserializeable<T> {
  deserializeBinary(bytes: Uint8Array): T
}

export function DecodeURLComponentToMessage<T>(
  s: string,
  message: IDeserializeable<T>,
): T {
  const buf = decodeBase64(s)
  return message.deserializeBinary(buf)
}

const base64chars: any = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '/',
]
const base64inv: any = {
  '0': 52,
  '1': 53,
  '2': 54,
  '3': 55,
  '4': 56,
  '5': 57,
  '6': 58,
  '7': 59,
  '8': 60,
  '9': 61,
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7,
  'I': 8,
  'J': 9,
  'K': 10,
  'L': 11,
  'M': 12,
  'N': 13,
  'O': 14,
  'P': 15,
  'Q': 16,
  'R': 17,
  'S': 18,
  'T': 19,
  'U': 20,
  'V': 21,
  'W': 22,
  'X': 23,
  'Y': 24,
  'Z': 25,
  'a': 26,
  'b': 27,
  'c': 28,
  'd': 29,
  'e': 30,
  'f': 31,
  'g': 32,
  'h': 33,
  'i': 34,
  'j': 35,
  'k': 36,
  'l': 37,
  'm': 38,
  'n': 39,
  'o': 40,
  'p': 41,
  'q': 42,
  'r': 43,
  's': 44,
  't': 45,
  'u': 46,
  'v': 47,
  'w': 48,
  'x': 49,
  'y': 50,
  'z': 51,
  '+': 62,
  '/': 63,
}

export function encodeBase64(buf: any) {
  const str = new Array(Math.ceil((buf.length * 4) / 3))
  for (let i = 0; i < buf.length; i += 3) {
    const b0 = buf[i]
    const b1 = buf[i + 1]
    const b2 = buf[i + 2]
    const b3 = buf[i + 3]
    str[(i * 4) / 3] = base64chars[b0 >>> 2]
    str[(i * 4) / 3 + 1] = base64chars[((b0 << 4) & 63) | ((b1 || 0) >>> 4)]
    if (i + 1 < buf.length) {
      str[(i * 4) / 3 + 2] = base64chars[((b1 << 2) & 63) | ((b2 || 0) >>> 6)]
      if (i + 2 < buf.length) {
        str[(i * 4) / 3 + 3] = base64chars[b2 & 63]
      } else {
        return str.join('') + '='
      }
    } else {
      return str.join('') + '=='
    }
  }
  return str.join('')
}

export function decodeBase64(str: any) {
  let pad = 0
  for (let i = str.length - 1; i >= 0; --i) {
    if (str.charAt(i) === '=') {
      ++pad
    } else {
      break
    }
  }
  const buf = new Uint8Array((str.length * 3) / 4 - pad)
  for (let i = 0; i < str.length - pad; i += 4) {
    const c0 = base64inv[str.charAt(i)]
    const c1 = base64inv[str.charAt(i + 1)]
    const c2 = base64inv[str.charAt(i + 2)]
    const c3 = base64inv[str.charAt(i + 3)]
    buf[(i * 3) / 4] = ((c0 << 2) & 255) | (c1 >>> 4)
    if (i + 2 < str.length - pad) {
      buf[(i * 3) / 4 + 1] = ((c1 << 4) & 255) | (c2 >>> 2)
      if (i + 3 < str.length - pad) {
        buf[(i * 3) / 4 + 2] = ((c2 << 6) & 255) | c3
      }
    }
  }
  return buf
}
