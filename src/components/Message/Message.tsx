// message.ts
export enum MessageType {  // ADD 'export' here!
  Text,
  Audio,
}

export class TextData {
  text: string;
  files: File[];
  constructor(text:string,files?:File[])
  {
    this.text = text;
    this.files = files;
  }
   
}

export class AudioData {
  audio: Blob;
  duration: number;
  constructor (audio:Blob,duration:number){
    this.audio = audio;
    this.duration = duration
  }
}

export default class Message {
    public owner: string;
    public mtype: MessageType;
    public data: TextData | AudioData ;
    
    constructor(owner: string, mtype: MessageType, data: TextData | AudioData ) {
      this.owner = owner;
      this.mtype = mtype;
      this.data = data;
    }
}