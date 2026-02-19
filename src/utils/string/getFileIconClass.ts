
const getFileIconClass = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) return 'image';
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'document';
  if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) return 'audio';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
  return 'generic';
};
export default getFileIconClass;

