let gas = false;
let coal = false;
let wood = false;
let elec = false;

const lowGas = 0.018029 / 2;
const medGas = 0.018029;
const highGas = 0.018029 * 1.5;
const lowCoal = 0.3019 / 2;
const medCoal = 0.3019;
const highCoal = 0.3019 * 1.5;
const lowWood = 0.165 / 2;
const medWood = 0.165;
const highWood = 0.165 * 1.5;
const lowElec = 0.3369 / 2;
const medElec = 0.3369;
const highElec = 0.3369 * 1.5;

const busFactor = 0.12525;
const carFactor = 0.27201;
const trainFactor = 0.03652;
const airFactor = 0.22927;

const userForm = document.getElementById("co2Form")
const ctx = document.getElementById("myChart");
const resUlt = document.getElementById("result");
const pResult = document.getElementById("personalResult");

function timerFunc() {
	location.reload();
};

function eventHandler(submitEvent) {
	try {
		submitEvent.preventDefault();
		const numChecks = (document.querySelectorAll('input[type="checkbox"]:checked').length);
		const formData = new FormData(userForm);
		const userEntry = Object.fromEntries(formData);
		let e = document.getElementById("energyUsage");
		let value = e.value;
		userEntry.energyUsage = value;
		// Extract values
		const busMiles = userEntry.busTravel;
		const carMiles = userEntry.carTravel;
		const trainMiles = userEntry.trainTravel;
		const airMiles = userEntry.airTravel;
		if (userEntry.gasHeat !== undefined) {
			gas = true;
		}
		if (userEntry.coalHeat !== undefined) {
			coal = true;
		}
		if (userEntry.woodHeat !== undefined) {
			wood = true;
		}
		if (userEntry.elecHeat !== undefined) {
			elec = true;
		}
		//// Calculate average CO2 emmission.
		// TravelCO2 = (busMiles* factor) +
		//(carMiles* factor) +
		//(trainMiles* factor) +
		//(airMiles* factor)
		const travelCO2 = (busMiles * busFactor) + (carMiles * carFactor) + (trainMiles * trainFactor) + (airMiles * (airFactor / 365));

		// HomeCO2 = if energyUseage == low -> if gas == true -> lowgasenergy / number of elements +
				// etc 
		let homeCO2 = 0;		
		if(userEntry.energyUsage == 'l'){
			if(gas == true){ homeCO2 += lowGas/numChecks; }
			if(coal == true){ homeCO2 += lowCoal/numChecks; }
			if(wood == true){ homeCO2 += lowWood/numChecks; }
			if(elec == true){ homeCO2 += lowElec/numChecks; }
			homeCO2 += lowElec;
		} else if(userEntry.energyUsage == 'm'){
			if(gas == true){ homeCO2 += medGas/numChecks; }
			if(coal == true){ homeCO2 += medCoal/numChecks; }
			if(wood == true){ homeCO2 += medWood/numChecks; }
			if(elec == true){ homeCO2 += medElec/numChecks; }
			homeCO2 += lowElec;
		} else if(userEntry.energyUsage == 'h'){
			if(gas == true){ homeCO2 += highGas/numChecks; }
			if(coal == true){ homeCO2 += highCoal/numChecks; }
			if(wood == true){ homeCO2 += highWood/numChecks; }
			if(elec == true){ homeCO2 += highElec/numChecks; }
			homeCO2 += lowElec;
		} else{
			// return error
			console.error(`Error Message: error with form input.`);
		}

		// TotalCO2 = TravelCO2 + HomeCO2
		let name = userEntry.userName;
		const total = homeCO2 + travelCO2;	
		const totalCO2 = parseFloat(total.toFixed(2));
		console.log(totalCO2);
		// Send emmission data to form.
		//fetch('https://group-project-w2z0.onrender.com/sendForm',{
		fetch('http://localhost:8080/sendForm',{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({totalCO2, name}),
		});
		setTimeout(timerFunc, 3000);
	} catch (error) {
		console.error(error.message);
	}
}

userForm.addEventListener('submit', eventHandler);


// =================== CHART.JS =============================
async function getData() {// create 'comments' elements from API object

	const daTa = {};
	const naMes = [];
	const footPrints = [];

	try {

		// TODO: CHANGE TO RENDER 'SERVER URL' WHEN DEPLOYED
		//const response = await fetch("https://group-project-w2z0.onrender.com/readForm");// localhost
		const response = await fetch("http://localhost:8080/readForm");// localhost
		// const response = await fetch("");
		// TODO: FIX ERROR HERE!!!
		const userData = await response.json();// json() convert string to JS object

		// TODO: create object with two arrays, username and footprints
		for (let i = 0; i < userData.length; i++) {
			// console.log(userData[i]);
			// daTa.names=userData[i].username;
			// daTa.footPrints= Math.ceil(Number(userData[i].totalco2));
			naMes[i] = userData[i].username;
			// footPrints[i] = Math.ceil(Number(userData[i].totalco2));
			footPrints[i] = Number(userData[i].totalco2);
		}
		daTa.names = naMes;
		daTa.footprints = footPrints;
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: daTa.names,
				datasets: [{
					label: 'kg C02 Tracker',
					data: daTa.footprints,
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
		resUlt.innerText=userData[19].totalco2;	
		pResult.innerText=userData[19].username + "'s Result";
		// console.log(userData);
		userForm.reset();

	} catch (error) {
		console.error(error);
	}
}

getData();