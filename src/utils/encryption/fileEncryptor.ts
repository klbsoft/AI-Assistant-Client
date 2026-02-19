import * as crypto from 'crypto';
import { Readable, Transform } from 'stream';
import { promisify } from 'util';
import * as stream from 'stream';

const pipeline = promisify(stream.pipeline);

export async function encryptLargeFile(
  file: File, 
  password: string
): Promise<{ iv: string; encryptedChunks: Uint8Array[] }> {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, 'salt', 32);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // Convert File to stream
  const fileStream = new Readable({
    read() {
      file.arrayBuffer().then(arrayBuffer => {
        this.push(Buffer.from(arrayBuffer));
        this.push(null); // End stream
      });
    }
  });
  
  const chunks: Uint8Array[] = [];
  
  await pipeline(
    fileStream,
    cipher,
    new Transform({
      transform(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    })
  );
  
  return {
    iv: iv.toString('hex'),
    encryptedChunks: chunks
  };
}