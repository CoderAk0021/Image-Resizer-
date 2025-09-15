async function compressImage() {
  document.getElementById('compressedImage').style.display='none'
  const desiredSizeKB = parseFloat(document.getElementById('desiredSize').value);

  const canvas = document.getElementById('canvas');
  const pica = window.pica();
  const compressedSpinner = document.getElementById('compressedSpinner');

  if (isNaN(desiredSizeKB) || desiredSizeKB <= 0) {
      alert("Please enter a valid size in KB.");
      return;
  }

  compressedSpinner.style.display = 'block'; 

  try {
      const quality = 0.9; 
      const resizeCanvas = document.createElement('canvas');
      const ctx = resizeCanvas.getContext('2d');

      // Resize image based on the desired size
      const factor = Math.sqrt(desiredSizeKB * 1024 / canvas.toDataURL('image/jpeg', quality).length);
      resizeCanvas.width = canvas.width * factor;
      resizeCanvas.height = canvas.height * factor;

      await pica.resize(canvas, resizeCanvas);
      const compressedImage = await pica.toBlob(resizeCanvas, 'image/jpeg', quality);
      const compressedImageUrl = URL.createObjectURL(compressedImage);

      const compressedSize = compressedImage.size / 1024;
      document.getElementById('compressedImage').src = compressedImageUrl;
      document.getElementById('compressedImage').style.display='initial'
      document.getElementById('compressedSize').textContent = `Size: ${compressedSize.toFixed(2)} KB`;
      
     
      const fileInput = document.getElementById('inputGroupFile04');
      const originalFile = fileInput.files[0];
      let originalName = originalFile.name;

     
      originalName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";

      const downloadLink = document.getElementById('downloadLink');
      downloadLink.href = compressedImageUrl;
      downloadLink.download = originalName; 
      downloadLink.style.display = 'block';
      
      downloadLink.textContent = 'Download Compressed Image';
  } catch (error) {
      console.error('Error during compression:', error);
      alert('An error occurred during image compression. Please try again.');
  } finally {
      compressedSpinner.style.display = 'none';
  }
}
