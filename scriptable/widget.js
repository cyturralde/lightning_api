// Import the file manager
const fm = FileManager.iCloud()

// Define your API key
const apiKey = 'your_opencage_api_key';

// Path to your data file
const path = fm.documentsDirectory() + "/truck_data.json"

// Read the file
let data = fm.readString(path)

// Parse the JSON
let json = JSON.parse(data)

// Create the widget
let widget = new ListWidget()
widget.backgroundColor = new Color("#1A1A1A")

// Add the title to the widget
let title = widget.addText("your_truck_name") // Change your truck name here
title.centerAlignText()
title.font = Font.boldSystemFont(24)
title.textColor = Color.white()

// Add the image to the widget
let imagePath = fm.documentsDirectory() + "/ford_truck.png"
let image = fm.readImage(imagePath)
let imageView = widget.addImage(image)
imageView.centerAlignImage()

// Calculate the battery level icon index
let batteryIndex = Math.min(Math.floor(json.vehicle.vehicleDetails.batteryChargeLevel.value / 12.5), 7)

// Create a parent stack
let parentStack = widget.addStack()
 
parentStack.centerAlignContent()

// Add the battery level icon to the widget
let batteryIconPath = fm.documentsDirectory() + "/battery_" + batteryIndex + ".png"
let batteryIcon = fm.readImage(batteryIconPath)
let batteryStack = parentStack.addStack()
batteryStack.size = new Size(50, 50)
 
batteryStack.addImage(batteryIcon)

// Add the plug status icon to the widget
let plugIconPath = fm.documentsDirectory() + "/" + (json.vehicle.vehicleStatus.plugStatus.value ? "plugged_in.png" : "not_plugged_in.png")
let plugIcon = fm.readImage(plugIconPath)
batteryStack.addImage(plugIcon)

// Check if the vehicle is plugged in
if (json.vehicle.vehicleStatus.plugStatus.value) {
// Add the charging status icon to the widget
let chargingIconPath = fm.documentsDirectory() + "/" + (json.vehicle.vehicleStatus.chargingStatus.value == "ChargingAC" ? "charging.png" : "not_charging.png")
let chargingIcon = fm.readImage(chargingIconPath)
batteryStack.addImage(chargingIcon)
}

parentStack.addSpacer()


// Add the lock status icon to the widget
let lockIconPath = fm.documentsDirectory() + "/" + (json.vehicle.vehicleStatus.lockStatus.value == "LOCKED" ? "locked.png" : "unlocked.png")
let lockIcon = fm.readImage(lockIconPath)
let lockStack = parentStack.addStack()
lockStack.size = new Size(50, 50)
 
lockStack.addImage(lockIcon)

// Add the alarm status icon to the widget
let alarmIconPath = fm.documentsDirectory() + "/" + (json.vehicle.vehicleStatus.alarmStatus.value == "SET" ? "alarm_set.png" : "alarm_off.png")
let alarmIcon = fm.readImage(alarmIconPath)
lockStack.addImage(alarmIcon)

// Create a new stack for the bottom row
let bottomStack = widget.addStack()
bottomStack.layoutHorizontally()

// Add the total mileage to the bottom left
let totalMileage = bottomStack.addText("Total Mileage: " + json.vehicle.vehicleDetails.mileage)
totalMileage.font = Font.systemFont(16)
totalMileage.textColor = Color.white()

// Add a flexible spacer
bottomStack.addSpacer()

// Add the location to the widget


 

// Define the latitude and longitude
const latitude = json.vehicle.vehicleLocation.latitude;
const longitude = json.vehicle.vehicleLocation.longitude;

// Define the API URL
const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

// Create a new request
let request = new Request(apiUrl);

// Send the request and parse the response
let response = await request.loadJSON();

// Extract the city, state, and postal code from the response
let components = response.results[0].components;
let town = components.town;
let city = components.city;
let state = components.state; 
 
// If town is undefined, use city
let displayLocation = town ? town : city;

// Now you can use the displayLocation and state in your widget
let locationText = bottomStack.addText(displayLocation + ", " + state);
locationText.font = Font.systemFont(16);
locationText.textColor = Color.white();

// Add another flexible spacer
bottomStack.addSpacer()

// Add the miles to empty to the bottom right
// Convert kilometers to miles
let distanceToEmptyInKm = json.vehicle.vehicleDetails.batteryChargeLevel.distanceToEmpty;
let distanceToEmptyInMiles = distanceToEmptyInKm * 0.621371;

// Add the miles to empty to the bottom right
let mileage = bottomStack.addText("Miles to Empty: " + distanceToEmptyInMiles.toFixed(2))
mileage.font = Font.systemFont(16)
mileage.textColor = Color.white()

// Display the widget
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}
