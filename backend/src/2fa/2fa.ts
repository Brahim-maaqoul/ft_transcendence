import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function getOtpAuthUrl(secret: string, nickname: string): string {
  return authenticator.keyuri(nickname, 'ft_transcendence', secret);
}

export function verifyTFA(secret: string, code: string): boolean {
  return authenticator.verify({ secret, token: code });
}

export async function getQrCode(secret: any, otpauthurl: any) {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(otpauthurl, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({ qrcode: data, secret: secret });
      }
    });
  });
}
