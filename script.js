document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const locationInput = document.getElementById("locationInput").value.trim();

    // ✅ Validate input format
    const coords = locationInput.split(",");
    if (coords.length !== 2) {
        alert("Please enter coordinates in the format: latitude,longitude");
        return;
    }

    const latitude = parseFloat(coords[0].trim());
    const longitude = parseFloat(coords[1].trim());

    if (isNaN(latitude) || isNaN(longitude)) {
        alert("Invalid coordinates! Please enter numeric values.");
        return;
    }

    button.textContent = "Calling Drone...";
    button.disabled = true;

    // ✅ Send Coordinates to Backend
    fetch('https://aerocall.onrender.com/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '+918075539951', latitude, longitude }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Server Response:", data);
        button.textContent = "Drone Called!";
        button.style.backgroundColor = "#007bff"; // Blue on success
    })
    .catch(error => {
        console.error("❌ Error sending SMS:", error);
        button.textContent = "Try Again";
        button.disabled = false;
        button.style.backgroundColor = "#dc3545"; // Red on error
    });
});
