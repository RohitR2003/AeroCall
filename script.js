const DEBUG_MODE = false; // Set to true for debugging, false for real API calls

document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const drone = document.getElementById("drone");

    button.textContent = "Getting Location...";
    button.disabled = true;

    // ✅ Step 1: Get User Location
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        button.textContent = "Call Drone";
        button.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            button.textContent = "Calling Drone...";

            // ✅ Step 2: Simulated or Real API Call
            if (DEBUG_MODE) {
                console.log("Debug mode ON: Simulating location send", { latitude, longitude });
                setTimeout(() => {
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff"; // Blue color
                    drone.classList.add("drone-fly");
                }, 1000);
                return;
            }

            // ✅ Step 3: Send API Request to Backend
            fetch('https://aerocall.onrender.com/send-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: '+918138044516',
                    latitude: latitude,
                    longitude: longitude
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Server response:", data);
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff"; // Blue color
                    drone.classList.add("drone-fly");
                })
                .catch(error => {
                    console.error("Error sending SMS:", error);
                    button.textContent = "Try Again";
                    button.disabled = false;
                    button.style.backgroundColor = "#dc3545"; // Red on error
                });
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert("Failed to get location. Please enable location services.");
            button.textContent = "Call Drone";
            button.disabled = false;
        }
    );
});
