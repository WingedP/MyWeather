import React,{useState,useEffect} from 'react'
import Moment from 'react-moment';
import Clock from 'react-clock';
import '../src/App.css';


export default function App() {
const [error, setError] = useState();
const [locationToggle, setLocationToggle] = useState(false);
const [clockTime, setClockTime] = useState({datez: new Date()});
const rightNow = clockTime.datez.toLocaleTimeString()
let [locationDetail, setLocationDetail]= useState({});
let [weather,setWeather]=useState();
let [nasaResult, setNasaResult]=useState();

let timeOfDay

let [query, setQuery] = useState('');

if (clockTime.datez.getHours() < 12) {timeOfDay = "morning"
} else if (clockTime.datez.getHours() >= 12 && clockTime.datez.getHours() < 16) {timeOfDay = "afternoon"} 
else if (clockTime.datez.getHours() >= 16 && clockTime.datez.getHours() < 19) {timeOfDay = "evening"} 
else {   timeOfDay = "night"} 

const search = evt  =>{
     let getSearchedLocationCurrentWeather = async()=>{
    console.log("u running?")
    let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&apikey=${process.env.REACT_APP_APIKEY}&units=metric`);
    let result = await data.json();
    console.log("search result", result)
    setLocationDetail(result);
    setWeather(result.weather);
    // setQuery('');
    setLocationToggle(true)} 
  if (evt.key === "Enter")  {getSearchedLocationCurrentWeather()}
};


let addClockTime = ()=>{setInterval(() => setClockTime({ datez: new Date() }), 1000);}

let getLocation=()=>{
  let handleError = error => {setError(error.message)};
  let handleSuccess= position => {
    getCurrentWeather(position.coords.latitude, position.coords.longitude);
  };
  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  
}
let getCurrentWeather=async(lat,lon)=>{
  let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&apikey=${process.env.REACT_APP_APIKEY}&units=metric`);
  let result = await data.json();
  setLocationDetail(result);
  setWeather(result.weather)

};

// let getFiveDaysForecast = async(lat,lon)=>{
//   let data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&apikey=${process.env.REACT_APP_APIKEY}&units=metric`);
//   let result = await data.json();
//   setFiveDaysForecast(result)
// } 

let getNasaPic = async()=>{
  let data = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_APIKEY}`);
  let result = await data.json();
  setNasaResult(result);
}

useEffect(()=>{getLocation(); getNasaPic(); addClockTime()},[])
console.log("locationDetail", locationDetail);
console.log("weather", weather);
// console.log("nasa result:",nasaResult )
// console.log("fiveDaysForecast", fiveDaysForecast)
// console.log("nasa img", nasaResult.url)

if(!weather || !locationDetail || !nasaResult) return(<div>loading</div>)
  return (

<div className="weatherapp">
<div className="bgimg-container"><img className="bgimg" src="/images/firewatch.jpg"></img>
</div>
<div className="weatherapp-inner">





<div className="weather-section">

<div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="   Any location!"
            onChange={e =>setQuery(e.target.value)} value={query} onKeyPress={search}

          />
        </div>

{locationToggle === false ? <button className="btn-location"> <i class="fas fa-map-marker-alt"></i> Your Location:</button> :
  <button className="btn-location"> <i class="fas fa-search-location"></i> Searched location: </button>}

<div className="locationwrapper">
<div className="location fontChange">  {locationDetail.name}, {locationDetail.sys.country}</div>
{locationToggle === true ?  
<button className="back-btn"><i class="fas fa-map-marker-alt"></i></button>
: '' }
</div>
  

<div className="datewrapper">
<Clock value={clockTime.datez}/>
<div><div className="date fontChange2"><Moment format="D MMM YYYY" withTitle>{new Date()}</Moment></div>
<div className="date fontChange2">{timeOfDay}</div>
<div className="date fontChange2">{rightNow}</div></div>
</div>


<div>
  <div className="temp fontChange">  {locationDetail.main.temp}°C
  <div>
  <img className="weatherIcon" src ={`http://openweathermap.org/img/w/${weather && weather[0].icon}.png`}/>
  <div className="description fontChange">{weather[0].description}</div>
  </div>

  </div>

  </div>

<div className="weather-others"><div className="">Feel like: {locationDetail.main.feels_like}°C</div>
<div>Humidity: {locationDetail.main.humidity}</div></div>





</div>

<div className="nasa-section">

<div className="nasa-section-title">
  <div>  Astronomy Picture </div>
<div> of the day</div>
<span className="copyright">©NASA
</span>
 </div>  

{ <div className="nasa-img-wrapper">
<img className="nasa-img" src ={nasaResult.url}/>
</div>  || <iframe id="ytplayer" type="text/html" 
// width="640" 
//height="360"
  // src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  src ={nasaResult.url}
  frameborder="0"></iframe> }






  <div className="nasa-description">{nasaResult.explanation}</div>
  </div>

  </div> </div>
  )
}
