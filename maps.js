
//get the url parameters from the form in the main.html page
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const street = urlParams.get('street');
const city = urlParams.get('cityName');
const zip = urlParams.get('zip');

let directionsService;
let directionsDisplay;
var mode;
var condition = 0;
var condition2 = 0;

geocode();
function geocode(){
	var location = street + city + zip + "CA";
	axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
		params:{
			address: location,
			key: "AIzaSyDYYa94FmysOl_EXLVy0rC1Fht0B-B608A"
		}
	})
	.then(function(response){
		var lat = response.data.results[0].geometry.location.lat;
		var lng = response.data.results[0].geometry.location.lng;

		initMap(lat,lng);

		console.log(response);
	})
	.catch(function(error){
		//alert("Invalid address!!");
	})
}

function initMap(lat,lng){

	var options = {
		zoom: 12,
		center: {lat:38.5613,lng:-121.4241},
	}

	const map = new google.maps.Map(document.getElementById("map"), options);

			
	var start = new google.maps.LatLng(lat,lng);
	//var s = new google.maps.LatLng(38.546719,-121.355614);
	var end = new google.maps.LatLng(38.5613,-121.4241);
	//using directions api
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);

	var btn = document.getElementById("driving");
	var btn2 = document.getElementById("transit");
	var btn3 = document.getElementById("walking");
	var btn4 = document.getElementById("biking");

	if (typeof x == 'undefined'){
		mode = google.maps.TravelMode.DRIVING;
		calculateRoute(start,end, mode);
		calculateDistance(start,end,'DRIVING',condition);
	} 
	btn.onclick = function(){
		mode = google.maps.TravelMode.DRIVING;
		calculateRoute(start,end, 'DRIVING');

		//calculate distance
		//calculateDistance(start,end,mode);
	}

	btn2.onclick = function(){
		mode = google.maps.TravelMode.TRANSIT;
		calculateRoute(start,end, mode);
		//calculateDistance(start,end,'TRANSIT');
	}

	btn3.onclick = function(){
		mode = google.maps.TravelMode.WALKING;
		calculateRoute(start,end, mode);
		//calculateDistance(start,end,'WALKING');
	}

	btn4.onclick = function(){
		mode = google.maps.TravelMode.BICYCLING;
		calculateRoute(start,end,mode);
		//calculateDistance(start,end,'BICYCLING');
	}

	function inside(start,end){
		if(document.getElementById("flexRadioDefault1").checked){
			document.getElementById("com2").innerHTML = "Sac RT(Preferred)";
			document.getElementById("cost2").innerHTML = "No cost: covered in registration";
			document.getElementById("carbon2").innerHTML = "No emission";
			calculateDistance2(start,end,'TRANSIT');
		} else if(document.getElementById("flexRadioDefault2").checked){
			document.getElementById("com2").innerHTML = "Car(Preferred)";
			calculateDistance2(start,end,'DRIVING');
		} else if(document.getElementById("flexRadioDefault3").checked){
			document.getElementById("com2").innerHTML = "Ride Share(Preferred)";
			calculateDistance2(start,end,'DRIVING');
		} else{
			document.getElementById("com2").innerHTML = "Bike/Scooter(Preferred)";
			document.getElementById("cost2").innerHTML = "No cost: if owned";
			document.getElementById("carbon2").innerHTML = "No emission";
			calculateDistance2(start,end,'BICYCLING');
		}
	}

	document.getElementById("rt").onclick = function(){
		document.getElementById("exampleModalLabel").innerHTML = "Sacramento Railway Transit";
		document.getElementById("com1").innerHTML = "Sac RT";
		document.getElementById("cost1").innerHTML = "No cost: covered in registration";
		document.getElementById("carbon1").innerHTML = "No emission";

		document.getElementById("initPara").innerHTML = "<span style='font-size:large'>Sacramento Regional Transit operates 76 light rail vehicle, 205 buses, and 23 shuttle vans throughout Sacramento. They are very popular for their low carbon emission. Sac RT provides student discount to Sac State students. Ride unlimited rides with Sac State one card. The nearest station to the University is University/65th Street station.</span></br></br><span style='font-size:x-large;'>How does SAC RT compares with your mode of transport:</span>";
		document.getElementById("additional").innerHTML = "<span>Visit <a href='https://www.csus.edu/administration-business-affairs/onecard/'>Sac State</a> website to get your on card and enjoy unlimited RT rides.</span></br><span>Visit <a href='https:www.sacrt.com'>Sacramento Regional Transit</a> website for additional information.</span>";
		calculateDistance(start,end,'TRANSIT');
		inside(start,end);
	}

	document.getElementById("rideShare").onclick = function(){
		condition = 1;
		document.getElementById("exampleModalLabel").innerHTML = "Ride Share";
		document.getElementById("com1").innerHTML = "Ride Share";

		document.getElementById("initPara").innerHTML = "<span style='font-size:large'>Carpooling is a great way to reduce carbon footprint and hundreds of Hornets carpool everyday to their college. Uber and Lyft are some of the most famous carpool apps but you can always carpool with your friends to save money and our environment.</span></br></br><span style='font-size:x-large;'>How does ride sharing compares with your mode of transport:</span>";
		document.getElementById("additional").innerHTML = "<span>Visit <a href='https://www.uber.com/'>Uber</a> or <a href='https://www.lyft.com/'>Lyft</a> website to get started.</span></br></span>";
		calculateDistance(start,end,'DRIVING',condition);
		inside(start,end);
	}

	document.getElementById("bike").onclick = function(){
		document.getElementById("exampleModalLabel").innerHTML = "Bike/Scooter";
		document.getElementById("com1").innerHTML = "Bike/Scooter";
		document.getElementById("cost1").innerHTML = "No cost: if owned";
		document.getElementById("carbon1").innerHTML = "No emission";

		document.getElementById("initPara").innerHTML = "<span style='font-size:large'>If you live within a reasonable distance, bike/scooters are the most preferred mode of transport in every aspect. There are bike racks and lockers around the campus for your bike safetly. Third part bike/scotter services like Jump and Lyft are also popular among students.</span></br></br><span style='font-size:x-large;'>How does Bike/Scooters compares with your mode of transport:</span>";
		document.getElementById("additional").innerHTML = "<span>Visit Sac State <a href='https://www.csus.edu/parking-transportation/alternative-transportation/bicycles.html'>bicycle</a> page for additional information.</span></br></span>";

		calculateDistance(start,end,'BICYCLING');
		inside(start,end);
	}

	document.getElementById("car").onclick = function(){
		condition2 = 1;
		document.getElementById("exampleModalLabel").innerHTML = "Car";
		document.getElementById("com1").innerHTML = "Car";

		document.getElementById("initPara").innerHTML = "<span style='font-size:large'>Single occupency vehicles are the most preferred way of transport among the Hornets. However they can be a stress to our environment and your pocket. Cost includes parking, insurance, and gas for your car. If you still prefer it, Sac State has world class parking structures around the campus.</span></br></br><span style='font-size:x-large;'>How does a car compares with your mode of transport:</span>";
		document.getElementById("additional").innerHTML = "<span>Get the latest parking <a href='https://www.csus.edu/parking-transportation/parking/permit-pricing.html'>prices</a> in Sac State website</span></br><span>Visit <a href='https://www.csus.edu/parking-transportation/visitor-information/'>visitor information</a> for additional informations like parking structure.</span>";

		calculateDistance(start,end,'DRIVING');

		inside(start,end);
	}


}

function calculateDistance(start, end, mode, condition){

	var service = new google.maps.DistanceMatrixService();
	let request = {
		origins: [start],
		destinations: [end],
		travelMode: mode,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: false,
		avoidTolls: false,
	};

	service.getDistanceMatrix(request, function(response, status){
		if(status = 'OK'){
			console.log((response.rows[0].elements[0].distance.value)/1609.34);
			var distance = (response.rows[0].elements[0].distance.value)/1609.34;
			var duration = response.rows[0].elements[0].duration.text;
		
			//display distance

			document.getElementById("distance1").innerHTML = Math.round(distance*10)/10 + " miles";
			document.getElementById("time1").innerHTML = duration;

			var noOfDays = document.getElementById("formGroupExampleInput3").value;
			var co2Emission = ((8887/24)*distance)*noOfDays;

			//cost for ride sharing
			var cost = noOfDays*(distance * 2);

			if (condition == 1){
				document.getElementById("cost1").innerHTML = "$"+Math.round(cost*10)/10+"/week";
				document.getElementById("carbon1").innerHTML = Math.round(co2Emission*10)/10+"grams/week(approx)";
			} 

			if(condition2 == 1){
				var parking = 178/16;
				var gas = ((distance / 24)*3.181)*noOfDays;
				var insurancePerWeek = 120/4;

				var totalCarCost = parking + gas + insurancePerWeek;

				document.getElementById("cost1").innerHTML = "$"+Math.round(totalCarCost*10)/10+"/week(approx)";
				document.getElementById("carbon1").innerHTML = Math.round(co2Emission*10)/10+"grams/week(approx)";
			}

		} else {
			window.alert(status);
			window.location.href = "project.html";
		}
	});
}

function calculateDistance2(start, end, mode){

	var service = new google.maps.DistanceMatrixService();
	let request = {
		origins: [start],
		destinations: [end],
		travelMode: mode,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: false,
		avoidTolls: false,
	};

	service.getDistanceMatrix(request, function(response, status){
		if(status = 'OK'){
			console.log((response.rows[0].elements[0].distance.value)/1609.34);
			var distance = (response.rows[0].elements[0].distance.value)/1609.34;
			var duration = response.rows[0].elements[0].duration.text;

			document.getElementById("distance2").innerHTML = Math.round(distance*10)/10 + " miles";
			document.getElementById("time2").innerHTML = duration;

			var insurance = document.getElementById("formGroupExampleInput").value;
			var mpg = document.getElementById("formGroupExampleInput2").value;
			var noOfDays = document.getElementById("formGroupExampleInput3").value;
			var co2Emission = ((8887/mpg)*distance)*noOfDays;

		    var co2Emission2 = ((8887/24)*distance)*noOfDays;

			//cost for ride sharing
			var cost = noOfDays*(distance * 2);
			if(document.getElementById("flexRadioDefault3").checked){
				document.getElementById("cost2").innerHTML = "$"+Math.round(cost*10)/10+"/week";
				document.getElementById("carbon2").innerHTML = Math.round(co2Emission2*10)/10+"grams/week";
			}

			if(document.getElementById("flexRadioDefault2").checked){
				var parking = 178/16;
				var gas = ((distance / mpg)*3.181)*noOfDays;
				var insurancePerWeek = insurance/4;

				var totalCarCost = parking + gas + insurancePerWeek;

				document.getElementById("cost2").innerHTML = "$"+Math.round(totalCarCost*10)/10+"/week";
				document.getElementById("carbon2").innerHTML = Math.round(co2Emission*10)/10+"grams/week";
			}
			
		} else {
			window.alert(status);
			window.location.href = "project.html";
		}
	});
}

function calculateRoute(start, end, mode){
	
	let request = {
		origin: start,
		destination: end,
		travelMode: mode
	};
	directionsService.route(request, function(response, status){
		if(status = 'OK'){
			console.log(response);
			directionsDisplay.setDirections(response);
		} else {
			window.location.href = "project.html";
		}
	});
}
