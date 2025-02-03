document.addEventListener("DOMContentLoaded", loadEvents);

function addEvent() {
    let name = document.getElementById("eventName").value;
    let date = document.getElementById("eventDate").value;

    if (!name || !date) {
        alert("Please enter an event name and date.");
        return;
    }

    let event = { name, date };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";

    loadEvents();
}

function loadEvents() {
    let eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    let events = JSON.parse(localStorage.getItem("events")) || [];

    events.forEach((event, index) => {
        let daysRemaining = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

        let li = document.createElement("li");
        li.innerHTML = `${event.name} - ${daysRemaining} days left 
                        <button onclick="deleteEvent(${index})">❌</button>`;
        eventList.appendChild(li);
    });
}

function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    loadEvents();
}
