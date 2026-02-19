export  function fixLongName(filename: string, maxLength: number = 20): string {
  if (filename.length <= maxLength) {
    return filename;
  }
  
  const lastDotIndex = filename.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    return filename.substring(0, maxLength - 3) + '...';
  }
  
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);
  
  const availableLength = maxLength - extension.length - 3;
  
  if (availableLength <= 0) {
    return '...' + extension.substring(extension.length - maxLength + 3);
  }
  
  const startLength = Math.ceil(availableLength / 2);
  const endLength = Math.floor(availableLength / 2);
  
  const startPart = name.substring(0, startLength);
  const endPart = name.substring(name.length - endLength);
  
  return startPart + '...' + endPart + extension;
}


 export const fixLongType = (type:string)=>{
        let t = type.split('/')[1]?.toUpperCase() || 'FILE';
        if(t.length > 20){
            return fixLongName(type); 
        }else{
            return t ;
        }
    }