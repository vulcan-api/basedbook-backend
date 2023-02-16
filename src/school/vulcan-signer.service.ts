/* 
/*
 Copyright (c) 2020 Capure
 Copyleft 2023 sewe2000
*/
import { Injectable } from '@nestjs/common';
import * as forge from 'node-forge';

@Injectable()
export class VulcanSigner {
  /* Signing code from vulcan-api-js */

  getSignatureValue(values: string, pkey: string): string {
    const messageDigest = forge.md.sha256.create();
    messageDigest.update(values);
    const key = forge.pki
      .privateKeyFromPem(
        '-----BEGIN PRIVATE KEY-----\n' + pkey + '\n-----END PRIVATE KEY-----',
      )
      .sign(messageDigest);
    return Buffer.from(forge.util.binary.raw.decode(key)).toString('base64');
  }
  getDigest(body: string | null): string {
    if (body == null) return '';
    return forge.util.encode64(
      forge.md.sha256.create().update(body).digest().bytes(),
    ); // base64
  }
  getEncodedPath(path: string): string {
    const url = path.match('(api/mobile/.+)');
    if (url == null)
      throw new Error(
        'The URL does not seem correct (does not match `(api/mobile/.+)` regex)',
      );

    return encodeURIComponent(url[0]).toLowerCase();
  }
  getHeadersList(
    body: string | null,
    digest: any,
    canonicalUrl: any,
    timestamp: any,
  ): { headers: string; values: string } {
    const signData = [
      ['vCanonicalUrl', canonicalUrl],
      body == null ? null : ['Digest', digest],
      ['vDate', new Date(timestamp).toUTCString()],
    ].filter((item) => !!item);

    return {
      headers: signData.map((item) => (item ? item[0] : '')).join(' '),
      values: signData.map((item) => (item ? item[1] : '')).join(''),
    };
  }
  getSignatureValues(
    fingerprint: string,
    privateKey: string,
    body: string,
    requestPath: string,
    timestamp: number | string,
  ): { digest: string; canonicalUrl: string; signature: string } {
    const canonicalUrl = this.getEncodedPath(requestPath);
    const digest = this.getDigest(body);
    const { headers, values } = this.getHeadersList(
      body,
      digest,
      canonicalUrl,
      timestamp,
    );
    const signatureValue = this.getSignatureValue(values, privateKey);

    return {
      digest: `SHA-256=${digest}`,
      canonicalUrl: canonicalUrl,
      signature: `keyId="${fingerprint}",headers="${headers}",algorithm="sha256withrsa",signature=Base64(SHA256withRSA(${signatureValue}))`,
    };
  }
}
