document.getElementById('inputGroupFile04').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
   document.getElementById('originalImage').style.display='none'
   document.getElementById('compressedImage').style.display='none'
    const file = event.target.files[0];
    
    const reader = new FileReader();
    const originalSpinner = document.getElementById('originalSpinner');

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            document.getElementById('originalImage').src = img.src;
            document.getElementById('originalImage').style.display='initial'
            document.getElementById('originalSize').textContent = `Size: ${(file.size / 1024).toFixed(2)} KB`;

          
            document.getElementById('compressedImage').src = '';
            document.getElementById('compressedSize').textContent = '';
            document.getElementById('downloadLink').style.display = 'none';

           
            originalSpinner.style.display = 'none';
        }

       
        originalSpinner.style.display = 'block';
    }

    reader.readAsDataURL(file);
}

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

    compressedSpinner.style.display = 'block'; // Show spinner

    try {
        const quality = 0.9; // Initial quality
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
        
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = compressedImageUrl;
        downloadLink.download ='compressed-image.jpg';
        downloadLink.style.display = 'block';
        
        downloadLink.textContent = 'Download Compressed Image';
    } catch (error) {
        console.error('Error during compression:', error);
        alert('An error occurred during image compression. Please try again.');
    } finally {
        compressedSpinner.style.display = 'none';
    }
}

