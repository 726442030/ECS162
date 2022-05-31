import './App.css';
import React, { useState, useEffect } from 'react';
import MonthPicker from './MonthPicker';
import Chart from 'chart.js/auto';
import { Bar } from "react-chartjs-2";
import {sendPostRequest} from './AJAX.jsx';

function App() {
  const [buttonPushed, updateButtonPushed] = useState(false);
  const [date, setDate] = useState({month: 4, year: 2020});
  function buttonMoreAction() {
    updateButtonPushed(true);
  }

  function buttonLessAction() {
    updateButtonPushed(false);
  }

  function TimeDecider() {
    

    function yearChange(newYear) {
      let m = date.month;
      setDate({year: newYear, month: m });
    
    }

    function monthChange(newMonth){
      let y = date.year;
      setDate({month: newMonth, year: y});
    }

    return (
        <MonthPicker  
          // props 
          date = {date}
          yearFun = {yearChange}
          monthFun = {monthChange}
          />
    );
  }
  
  if (buttonPushed) {
    return ( 
  <div className="body">
    <header>
      <h1>Water storage in California reservoirs</h1>
    </header>
    
    <main>
     <div className="topSide">
     <div className="leftSide">
      <p>
      California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
      </p>
      <p>
California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
      </p>
      <button onClick={buttonLessAction}>See less</button>
  </div>
<div className="rightSide">     
<img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
"/>
  <p className="Caption">
Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
    </p>
  </div>
  </div>
  <div className="downSide">
    <WaterDisplay chooseDate={date}/>
    <div className="nonChart">
      <p>
Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
      </p>
      <p id="TableCaption">Change month:</p>
      <TimeDecider />
    </div>
  </div>    
  </main>
</div>      
)
  } else return ( 
  <div className="body">
    <header>
      <h1>Water storage in California reservoirs</h1>
    </header>
    
    <main>
     <div className="topSide">
     <div className="leftSide">
      <p>
      California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
      </p>
      <p>
California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
      </p>
      <button id="seeM" onClick={buttonMoreAction}>See more</button>
  </div>
<div className="rightSide">     
<img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
"/>
Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
  </div> 
  </div>
  </main>
</div>      
);
}

function WaterChart (props) {
   const nicknames = new Map();
  nicknames.set(0, 'Shasta');
  nicknames.set(1, 'Ororville');
  nicknames.set(2, 'Trinity Lake');
  nicknames.set(3, 'New Melones');
  nicknames.set(4, 'San Luis');
  nicknames.set(5, 'Don Pedro');
  nicknames.set(6, 'Berryessa');

   if (props.waterInfor) {
    let n = props.waterInfor.length;
    console.log(props.waterInfor);

    // objects containing row values
    let CapacityObj = {data: [], backgroundColor: ["lightblue"], type: 'bar', order: 2,}
    let CurrentObj = {data: [], backgroundColor: ["rgb(66,145,152)"], type: 'bar', order: 1,}
    let labels = [];
     CapacityObj.data.push(4552000);
     CapacityObj.data.push(3537577);
     CapacityObj.data.push(2447650);
     CapacityObj.data.push(2400000);
     CapacityObj.data.push(2041000);
     CapacityObj.data.push(2030000);
     CapacityObj.data.push(1602000);
    for (let i=0; i<n; i++) {
      CurrentObj.data.push(props.waterInfor[i].value);
      labels.push(nicknames.get(i));
    }

    let userData = {};
  userData.labels = labels;
  userData.datasets = [CapacityObj, CurrentObj];
     
     let options = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  plugins: {
    legend: {
      display: false,
    },
  },
  
  type: 'bar',
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
      beginAtZero: false,
      
    },
    y: {
      grid: {
        display: false
      },
      stacked: false,
    }
  }
};
     return (
        <div id="chart-container">
          <Bar id="chartAttribute" options={options} data={userData} />
        </div>
      )
 }
}

function WaterDisplay (props) {
  const [water, setWater] = useState([]);
  let data = props.chooseDate;
  console.log(data.year, data.month, "time");

  useEffect(initialize,[data]);

  function initialize () {
  
    (async function () {
      sendPostRequest("/query/getWaterData", data)
        .then( function (response) {
          console.log("Response recieved", response);
          setWater(response);
        })
        .catch( function(err) {
          console.log("POST request error",err);
        });
  }) ();
  
}

  // will re-render once state variable schools changes
  if (water) {
  return (
    <div className="TheChart">
      <WaterChart waterInfor={water}> </WaterChart>
    </div>
  )
  } else {
    return (<p>
      loading...
    </p>);
  }
}

export default App;