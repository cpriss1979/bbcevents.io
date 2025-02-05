document.addEventListener("DOMContentLoaded", loadEvents);

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
    let eventDate = new Date(year, month - 1, day);
    if (eventDate.getMonth() !== month - 1 || eventDate.getDate() !== day) {
        alert("Invalid date. Please check your inputs.");
        return;
    }

    let event = { name, date: eventDate.toISOString() };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    // Reset inputs
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
        let eventDate = new Date(event.date).toLocaleDateString();

        let li = document.createElement("li");
        li.innerHTML = `
            <span class="event-name">${event.name}</span>
            <span class="event-date">Date: ${eventDate}</span>
            <span class="time-remaining">${timeRemaining} remaining</span>
            <button onclick="editEvent(${index})">✏️ Edit</button>
            <button onclick="deleteEvent(${index})">❌ Delete</button>
        `;
        eventList.appendChild(li);
    });
}

function editEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let event = events[index];
    let eventDate = new Date(event.date);
    let eventList = document.getElementById("eventList");
    let li = eventList.children[index];

    li.innerHTML = `
        <div class="edit-row"><label>Event Name:</label><input type="text" id="editName" value="${event.name}"></div>
        <div class="edit-row"><label>Month:</label><input type="number" id="editMonth" value="${eventDate.getMonth() + 1}" min="1" max="12"></div>
        <div class="edit-row"><label>Day:</label><input type="number" id="editDay" value="${eventDate.getDate()}" min="1" max="31"></div>
        <div class="edit-row"><label>Year:</label><input type="number" id="editYear" value="${eventDate.getFullYear()}" min="2022"></div>
        <button onclick="saveEvent(${index})">💾 Save</button>
        <button onclick="loadEvents()">❌ Cancel</button>
    `;
}

function saveEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let newName = document.getElementById("editName").value;
    let newMonth = parseInt(document.getElementById("editMonth").value);
    let newDay = parseInt(document.getElementById("editDay").value);
    let newYear = parseInt(document.getElementById("editYear").value);

    // Validate inputs
    if (!newName || !newMonth || !newDay || !newYear) {
        alert("Please enter a valid name and date.");
        return;
    }

    let newDate = new Date(newYear, newMonth - 1, newDay);
    if (newDate.getMonth() !== newMonth - 1 || newDate.getDate() !== newDay) {
        alert("Invalid date. Please check your inputs.");
        return;
    }

    // Update event in localStorage
    events[index] = { name: newName, date: newDate.toISOString() };
    localStorage.setItem("events", JSON.stringify(events));

    loadEvents();
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
