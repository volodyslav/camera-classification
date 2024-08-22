document.addEventListener("DOMContentLoaded", () => {
   const videoMain = document.querySelector("#videoMain");
   const canvasMain = document.querySelector("#canvasMain");
   const pictureBtn = document.querySelector("#take-picture");
   const image = document.querySelector("#photo");

    //environment - rear , user - front camera
    const constaints = {
        video: { facingMode: "user"  },
        audio: false
    }

    navigator.mediaDevices.getUserMedia(constaints)
        .then(steam => {
             videoMain.srcObject = steam;
             videoMain.play();
        })
        .catch(err => {
            console.error("Error getting user media", err);
        })    

    pictureBtn.addEventListener('click', () => {
        canvasMain.width = videoMain.videoWidth;
        canvasMain.height = videoMain.videoHeight;
        // Draw the current frame from the video onto the canvas
        const context = canvasMain.getContext('2d');
        context.drawImage(videoMain, 0, 0, canvasMain.width, canvasMain.height);
        
        // Convert the canvas content to a data URL (base64 string)
        const dataURL = canvasMain.toDataURL('image/png');
        
        // Set the img element source to the captured photo
        image.src = dataURL;
        });


});