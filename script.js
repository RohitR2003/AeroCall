const DEBUG_MODE = false; // Set to true for debugging, false for real API calls

document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const drone = document.getElementById("drone");

    button.textContent = "Getting Location...";
    button.disabled = true;

    // ✅ Step 1: Check Geolocation Support
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        button.textContent = "Call Drone";
        button.disabled = false;
        return;
    }

    // ✅ Step 2: Request High Accuracy Location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = parseFloat(position.coords.latitude.toFixed(6)); // Round to 6 decimal places
            const longitude = parseFloat(position.coords.longitude.toFixed(6));

            console.log("📍 Accurate Location Retrieved:", { latitude, longitude });

            button.textContent = "Calling Drone...";

            // ✅ Step 3: Debug Mode (Simulated Call)
            if (DEBUG_MODE) {
                console.log("Debug mode ON: Simulating location send", { latitude, longitude });
                setTimeout(() => {
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff"; // Blue color
                    drone.classList.add("drone-fly");
                }, 1000);
                return;
            }

            // ✅ Step 4: Send Location to Backend
            fetch('https://aerocall.onrender.com/send-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: '+919847690509',
                    latitude: latitude,
                    longitude: longitude
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("✅ Server Response:", data);
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff"; // Blue color
                    drone.classList.add("drone-fly");
                })
                .catch(error => {
                    console.error("❌ Error sending SMS:", error);
                    button.textContent = "Try Again";
                    button.disabled = false;
                    button.style.backgroundColor = "#dc3545"; // Red on error
                });
        },
        (error) => {
            console.error("❌ Geolocation error:", error);
            alert("Failed to get location. Please enable location services.");
            button.textContent = "Call Drone";
            button.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // ✅ High Accuracy Mode
    );
});
