import { Buffer } from 'buffer';

export default {
  encode(str) {
    return Buffer.from(str).toString('base64');
  },
  decode(str) {
    return Buffer.from(str, 'base64').toString();
  }
};
