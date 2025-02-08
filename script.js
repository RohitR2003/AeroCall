const DEBUG_MODE = true; // Set to true for debugging, false for real API calls

document.getElementById("callDroneBtn").addEventListener("click", function () {
    const button = this;
    const drone = document.getElementById("drone");

    button.textContent = "Calling...";
    button.disabled = true;

    if (DEBUG_MODE) {
        console.log("Debug mode ON: Forcing success response");

        setTimeout(() => {
            button.textContent = "Drone Called!";
            button.style.backgroundColor = "#007bff"; // Change color to blue
            drone.classList.add("drone-fly");
        }, 1000); // Simulate delay

        return;
    }

    // Real API call if DEBUG_MODE is false
    fetch('http://localhost:3000/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: '+918138044516',
            message: 'Drone has been called!',
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            button.textContent = "Drone Called!";
            button.style.backgroundColor = "#007bff"; // Change color to blue
            drone.classList.add("drone-fly");
        })
        .catch(error => {
            console.error("Error sending SMS:", error);
            button.textContent = "Try Again";
            button.disabled = false;
            button.style.backgroundColor = "#dc3545"; // Change to red on error
        });
});
