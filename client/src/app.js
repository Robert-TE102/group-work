let gas = false;
let coal = false;
let wood = false;
let elec = false;

const lowGas = 0.018029/2;
const medGas = 0.018029;
const highGas = 0.018029*1.5;
const lowCoal = 0.3019/2;
const medCoal = 0.3019;
const highCoal = 0.3019*1.5;
const lowWood = 0.165/2;
const medWood = 0.165;
const highWood = 0.165*1.5;
const lowElec = 0.3369/2;
const medElec = 0.3369;
const highElec = 0.3369*1.5;

const busFactor = 0.12525;
const carFactor = 0.27201;
const trainFactor = 0.03652;
const airFactor = 0.22927;

function timerFunc(){
  location.reload();
};

const userForm = document.getElementById("co2Form")

function eventHandler(submitEvent){
  try{
    submitEvent.preventDefault();
    const formData = new FormData(userForm);
    const userEntry = Object.fromEntries(formData);
    let e = document.getElementById("energyUsage");
    let value = e.value;
    userEntry.energyUsage = value;
    console.log(userEntry);
    // Extract values
    const busMiles = userEntry.busTravel;
    const carMiles = userEntry.carTravel;
    const trainMiles = userEntry.trainTravel;
    const airMiles = userEntry.airTravel;
    if (userEntry.gasHeat !== undefined){
        gas = true;
    }
    if (userEntry.coalHeat !== undefined){
        coal = true;
    }
    if (userEntry.woodHeat !== undefined){
        wood = true;
    }
    if (userEntry.elecHeat !== undefined){
        elec = true;
    }

    //// Calculate average CO2 emmission.
    // TravelCO2 = (busMiles* factor) +
                  //(carMiles* factor) +
                  //(trainMiles* factor) +
                  //(airMiles* factor)
const travelCO2 = (busMiles * busFactor) + (carMiles * carFactor) + (trainMiles * trainFactor) + (airMiles * (airFactor/365));
console.log(`Travel CO2: ${travelCO2}`);  
    
    // HomeCO2 = if energyUseage == low -> if gas == true -> lowgasenergy / number of elements +
              // if energyUseage == low -> if coal == true -> lowcoalenergy / number of elements +
              // if energyUseage == low -> if wood == true -> lowwoodenergy / number of elements +
              // if energyUseage == low -> if elec == true -> lowelecenergy / number of elements 
              
              // if energyUseage == med -> if gas == true -> medgasenergy / number of elements +
              // if energyUseage == med -> if coal == true -> medcoalenergy / number of elements +
              // if energyUseage == med -> if wood == true -> medwoodenergy / number of elements +
              // if energyUseage == med -> if elec == true -> medelecenergy / number of elements 
              
              // if energyUseage == high -> if gas == true -> highgasenergy / number of elements +
              // if energyUseage == high -> if coal == true -> highcoalenergy / number of elements +
              // if energyUseage == high -> if wood == true -> highwoodenergy / number of elements +
              // if energyUseage == high -> if elec == true -> highelecenergy / number of elements 
let homeCO2 = 0;
	if(userEntry.energyUsage == 'l'){
		if(gas == true){
			const gasCont = lowGas/numChecks;
			homeCO2 += gasCont;
		}
		if(coal == true){
			const coalCont = lowCoal/numChecks;
			homeCO2 += coalCont;
		}
		if(wood == true){
			const woodCont = lowWood/numChecks;
			homeCO2 += woodCont;
		}
		if(elec == true){
			const elecCont = lowElec/numChecks;
			homeCO2 += elecCont;
		}
    } else if(userEntry.energyUsage == 'm'){
		if(gas == true){
			const gasCont = medGas/numChecks;
			homeCO2 += gasCont;
		}
		if(coal == true){
			const coalCont = medCoal/numChecks;
			homeCO2 += coalCont;
		}
		if(wood == true){
			const woodCont = medWood/numChecks;
			homeCO2 += woodCont;
		}
		if(elec == true){
			const elecCont = medElec/numChecks;
			homeCO2 += elecCont;
		}
    } else if(userEntry.energyUsage == 'h'){
		if(gas == true){
			const gasCont = highGas/numChecks;
			homeCO2 += gasCont;
		}
		if(coal == true){
			const coalCont = highCoal/numChecks;
			homeCO2 += coalCont;
		}
		if(wood == true){
			const woodCont = highWood/numChecks;
			homeCO2 += woodCont;
		}
		if(elec == true){
			const elecCont = highElec/numChecks;
			homeCO2 += elecCont;
		}
    } else{
		// return error
	}

    // TotalCO2 = TravelCO2 + HomeCO2
    const totalCO2 = homeCO2 + travelCO2;
	console.log(`Home CO2: ${homeCO2}`);
	console.log(`Total CO2: ${totalCO2}`);

	// Send emmission data to form.
    // fetch('https://localhost:8080/sendForm',{
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({userEntry}),
    // });
    //setTimeout(timerFunc, 3000);
  } catch(error){
    console.error(error.message);
  }
}

userForm.addEventListener('submit', eventHandler);

const numChecks = (document.querySelectorAll('input[type="checkbox"]:checked').length);

