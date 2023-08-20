var settings = {
    workplace_id: "",
    user_id: "",
    api_key: "",
    min_hours_today: 5,
    min_hours_a_week: 25,
};

function getStartOfTheDay(date) {
    date = new Date(date);
    date.setUTCHours(0,0,0,0);
    return date.toISOString();
}

function getStartOfTheWeek(date) {
    date = new Date(date);
    var day = date.getDay() || 7; // Get current day number, converting Sun. to 7
    var monday = new Date(date.setDate(date.getDate() - day + 1));
    return getStartOfTheDay(monday);
}

async function loadTimeEntries(
    settings,
    {
        today = false,
        thisWeek = false,
    }
) {
    if (today) {
        var startTime = getStartOfTheDay(new Date());
    }
    if (thisWeek) {
        var startTime = getStartOfTheWeek(new Date());
    }

    var url = `https://api.clockify.me/api/v1/workspaces/${settings.workplace_id}/user/${settings.user_id}/time-entries?page-size=1000&start=${startTime}`;
    var req = new Request(url);
    req.headers = {"x-api-key": settings.api_key};
    var timeEntries = await req.loadJSON();
    return timeEntries;
}

function calcEntriesDuration(timeEntries) {
    var totalDuration = 0;
    for (const timeEntry of timeEntries) {
        var start = new Date(timeEntry.timeInterval.start);
        var end_string = timeEntry.timeInterval.end;
        var end = end_string == null ? new Date() : new Date(end_string);
        totalDuration += end - start;
    }
    return (totalDuration / (1000 * 60 * 60)).toFixed(1); // ms to hours
}

var timeEntriesThisWeek = await loadTimeEntries(settings, {thisWeek: true});
var durationThisWeek = calcEntriesDuration(timeEntriesThisWeek);

var timeEntriesToday = await loadTimeEntries(settings, {today: true});
log(timeEntriesToday);
var durationToday = calcEntriesDuration(timeEntriesToday);
log(durationToday);


// Create the widget
var w = new ListWidget()
w.backgroundColor = new Color("#1c1c1e")
w.setPadding(13, 13, 13, 13)

t = w.addText("Work hours");
t.textColor = Color.white();
t.font = new Font("Avenir-Heavy", 18);
w.addSpacer(30);

var text = "Today: " + durationToday.toString() + "h";
if (durationToday >= settings.min_hours_today) {
    text = "🌟" + text;
}
t = w.addText(text)
t.textColor = Color.white()
t.font = new Font("Avenir-Heavy", 13)

var text = "This week: " + durationThisWeek.toString() + "h";
if (durationThisWeek >= settings.min_hours_a_week) {
    text = "🌟" + text;
}
t = w.addText(text)
t.textColor = Color.white()
t.font = new Font("Avenir-Heavy", 13)

Script.setWidget(w)
Script.complete()
