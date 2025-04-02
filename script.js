const DEBUG_MODE = false; // Set to true for debugging, false for real API calls

document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const drone = document.getElementById("drone");

    button.textContent = "Getting Location...";
    button.disabled = true;

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        button.textContent = "Call Drone";
        button.disabled = false;
        return;
    }

    // ✅ Request high-accuracy location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy; // Accuracy in meters

            console.log("📍 Accurate Location Retrieved:", { latitude, longitude, accuracy });

            // ✅ Ask user to confirm location
            const confirmLocation = confirm(
                `Your location is:\nLatitude: ${latitude}\nLongitude: ${longitude}\nAccuracy: ±${accuracy} meters\n\nIs this correct?`
            );

            if (!confirmLocation) {
                button.textContent = "Call Drone";
                button.disabled = false;
                return;
            }

            button.textContent = "Calling Drone...";

            if (DEBUG_MODE) {
                console.log("Debug mode ON: Simulating location send", { latitude, longitude });
                setTimeout(() => {
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff"; // Blue color
                    drone.classList.add("drone-fly");
                }, 1000);
                return;
            }

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
                    console.log("✅ Server Response:", data);
                    button.textContent = "Drone Called!";
                    button.style.backgroundColor = "#007bff";
                    drone.classList.add("drone-fly");
                })
                .catch(error => {
                    console.error("❌ Error sending SMS:", error);
                    button.textContent = "Try Again";
                    button.disabled = false;
                    button.style.backgroundColor = "#dc3545";
                });
        },
        (error) => {
            console.error("❌ Geolocation error:", error);
            alert("Failed to get location. Please enable location services and try again.");
            button.textContent = "Call Drone";
            button.disabled = false;
        },
        {
            enableHighAccuracy: true, // ✅ Forces GPS for better accuracy
            timeout: 25000, // ⏳ Increased timeout for better results
            maximumAge: 0 // 🔄 Forces fresh GPS data
        }
    );
});
