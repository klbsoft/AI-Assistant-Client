from PIL import Image
import  

# Load and preprocess the image
img = Image.open('image.jpg')
img = img.convert('L')  # Convert to grayscale
img = img.point(lambda x: 0 if x < 128 else 255, '1')  # Binarize

# Use Tesseract to perform OCR
text = pytesseract.image_to_string(img, lang='eng')

# Output the result
if text.strip():
    print(text)
else:
    print("No text found.")
