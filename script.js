document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const latitude = document.getElementById("latitudeInput").value.trim();
    const longitude = document.getElementById("longitudeInput").value.trim();

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        alert("Please enter valid latitude and longitude!");
        return;
    }

    button.textContent = "Calling Drone...";
    button.disabled = true;

    // ✅ Send Coordinates to Backend
    fetch('https://aerocall.onrender.com/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '+918138044516', latitude, longitude }),
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
