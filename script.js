document.addEventListener("DOMContentLoaded", loadEvents);

function autoResize(input) {
    input.style.width = "auto"; // Reset width to allow shrinking
    let textLength = input.value.length;
    input.style.width = Math.max(50, textLength * 10) + "px"; // Adjust width dynamically
}

function autoResizeHeight(textarea) {
    textarea.style.height = "auto"; // Reset height to allow shrinking
    textarea.style.height = textarea.scrollHeight + "px"; // Expand to fit content
}

function addEvent() {
    let name = document.getElementById("eventName").value;
    let month = parseInt(document.getElementById("eventMonth").value);
    let day = parseInt(document.getElementById("eventDay").value);
    let year = parseInt(document.getElementById("eventYear").value);

    // Validate inputs
    if (!name || !month || !day || !year) {
        alert("Please enter an event name and a valid date.");
        return;
    }

    // Check if the month, day, and year form a valid date
    let eventDate = new Date(year, month - 1, day);  // Month is 0-based in JavaScript
    if (eventDate.getMonth() !== month - 1 || eventDate.getDate() !== day) {
        alert("Invalid date. Please check your inputs.");
        return;
    }

    let event = { name, date: eventDate.toISOString() };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    // Reset inputs after adding the event
    document.getElementById("eventName").value = "";
    document.getElementById("eventMonth").value = "";
    document.getElementById("eventDay").value = "";
    document.getElementById("eventYear").value = "";

    loadEvents();
}

function loadEvents() {
    let eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    let events = JSON.parse(localStorage.getItem("events")) || [];

    events.forEach((event, index) => {
        let timeRemaining = calculateTimeRemaining(event.date);
        let eventDate = new Date(event.date).toLocaleDateString(); // Format as MM/DD/YYYY

        let li = document.createElement("li");
        li.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-date">Date: ${eventDate}</span>
            <span class="time-remaining">${timeRemaining} remaining</span>
            <button onclick="deleteEvent(${index})">❌</button>
        `;
        eventList.appendChild(li);
    });
}



function calculateTimeRemaining(eventDate) {
    let now = new Date();
    let targetDate = new Date(eventDate);

    let years = targetDate.getFullYear() - now.getFullYear();
    let months = targetDate.getMonth() - now.getMonth();
    let days = targetDate.getDate() - now.getDate();

    if (days < 0) {
        months--;
        let lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) result.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);

    return result.length > 0 ? result.join(", ") : "Today!";
}

function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    loadEvents();
}
