/**
 * Plays an audio Blob
 * @param audioBlob - The audio data as a Blob
 * @param onEnded - Optional callback when audio finishes playing
 * @returns A promise that resolves when audio starts playing, or rejects on error
 */
export function playAudioBlob(
  audioBlob: Blob, 
  onEnded?: () => void
): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    try {
      // Create object URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create audio element
      const audio = new Audio(audioUrl);
      
      // Set up event listeners
      audio.onloadeddata = () => {
        audio.play()
          .then(() => {
            resolve(audio);
          })
          .catch((playError) => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error(`Failed to play audio: ${playError.message}`));
          });
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error(`Audio loading error: ${error}`));
      };
      
      // Clean up when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (onEnded) onEnded();
      };
      
    } catch (error) {
      reject(new Error(`Failed to create audio: ${error}`));
    }
  });
}