const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getKey = async () =>
  crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.cryptorKey!.padEnd(32, '0').slice(0, 32)),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt'],
  );

/** 加密 */
export const encrypt = async (data: any) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const buf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await getKey(),
    encoder.encode(JSON.stringify(data)),
  );
  return Buffer.concat([Buffer.from(iv), Buffer.from(buf)]).toString('base64');
};

/** 解密 */
export const decrypt = async <T>(data: string): Promise<T> => {
  const buf = Buffer.from(data, 'base64');
  const dec = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: buf.subarray(0, 12) },
    await getKey(),
    buf.subarray(12),
  );
  return JSON.parse(decoder.decode(dec));
};
