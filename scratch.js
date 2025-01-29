async function openCamera() {
    try {
        // Check if the browser supports mediaDevices and geolocation
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('MediaDevices API not supported.');
        }
        if (!navigator.geolocation) {
            throw new Error('Geolocation API not supported.');
        }

        // Request camera and geolocation permissions
        await navigator.mediaDevices.getUserMedia({ video: true });
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Open camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('video');
        if (!video) {
            throw new Error('Video element not found.');
        }
        video.srcObject = stream;
        document.getElementById('cameraContainer').style.display = 'block';
        document.getElementById('captureButton').style.display = 'block';
    } catch (error) {
        console.error('Error opening camera or getting geolocation:', error);
        alert('Error opening camera or getting geolocation: ' + error.message);
    }
}

async function captureImageAndLocation() {
    try {
        const video = document.getElementById('video');
        if (!video) {
            throw new Error('Video element not found.');
        }
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get geolocation
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            // Update overlay text with coordinates
            document.getElementById('latitude').textContent = `Latitude: ${latitude}`;
            document.getElementById('longitude').textContent = `Longitude: ${longitude}`;

            // Display the image with overlay
            const imgElement = document.createElement('img');
            imgElement.src = canvas.toDataURL('image/png');
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.objectFit = 'cover';
            document.getElementById('cameraContainer').replaceChild(imgElement, video);

            // Stop video stream after displaying the image
            video.srcObject.getTracks().forEach(track => track.stop());
        }, (error) => {
            console.error('Error getting geolocation:', error);
            alert('Error getting geolocation: ' + error.message);
        });
    } catch (error) {
        console.error('Error capturing image and location:', error);
        alert('Error capturing image and location: ' + error.message);
    }
}

// Event listeners
document.getElementById('openCameraButton').addEventListener('click', openCamera);
document.getElementById('captureButton').addEventListener('click', captureImageAndLocation);