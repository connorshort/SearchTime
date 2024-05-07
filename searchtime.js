const estOffset= 4 * 60 * 60 * 1000;
const pstOffset= 7* 60 * 60 * 1000;
const day= 24 * 60 * 60 * 1000;
const hour= 60 * 60 * 1000;
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var currentTime;

var utcDate;
var pstDate;
var estDate;
var utcTime;

// 0 is PST, 1 is EST, 2 is UTC
var searchZone = 2;
// 0 is 24 hour, 1 is 12 Hour
var timeFormat=0;
// 0 is current time, 1 is custom date/time, 2 is epoch time
var mainTime=0;

var secondsChecked=false;
var bothTimeZones=false;

const queryString = window.location.search;

setInterval(update, 1000);

function initialize(){
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('epoch')){
        console.log('epoch selected');
        const epochParam = urlParams.get('epoch');
        console.log(epochParam);
        document.getElementById('entered-epoch').value=epochParam;
        document.getElementById('epoch-custom-zone').value='UTC';
        epochTime();
    }
    update();
}

function update(){
    getTime()
    var checkSecs=document.getElementById("checkSeconds");
    var checkBoth=document.getElementById("checkBoth");
    secondsChecked=checkSecs.checked;
    bothTimeZones=checkBoth.checked;
    document.getElementById("utc-date").innerHTML=stringDate(utcDate);
    document.getElementById("utc-time").innerHTML=stringTime(utcDate);
    document.getElementById("pst-date").innerHTML=stringDate(pstDate);
    document.getElementById("pst-time").innerHTML=stringTime(pstDate);
    document.getElementById("est-date").innerHTML=stringDate(estDate);
    document.getElementById("est-time").innerHTML=stringTime(estDate);
    updateSearches();
}

function updateSearches(){
    document.getElementById("daySearch").innerHTML=stringSearch(24);
    document.getElementById("sevenDaySearch").innerHTML=stringSearch(24 * 7);
    let multiplier=1;
    let customSearchUnit=document.getElementById('custom-unit').value;
    if(customSearchUnit=='Day'){
        multiplier=24;
    }
    let customSearchTime=parseInt(document.getElementById('custom-search-time').value);
    document.getElementById("custom-search").innerHTML=stringSearch(multiplier*customSearchTime);
}

function getTime(){
    utcDate=new Date()
    if(mainTime != 0){
        let diffTZ = utcDate.getTimezoneOffset();
        if(mainTime==1){
            enteredTime=document.getElementById('entered-time').value;
            enteredDate=document.getElementById('entered-date').value;
            customTimeString=enteredDate + "T" + enteredTime + ":00";
            utcDate=new Date(Date.parse(customTimeString) - (diffTZ*60*1000));
            customZone=document.getElementById('custom-zone').value;
        }
        else if(mainTime==2){
            enteredEpoch=document.getElementById('entered-epoch').value;
            enteredEpoch=enteredEpoch.replace(".", "");
            if(enteredEpoch.length==10){
                enteredEpoch=enteredEpoch + "000";
            }
            else if(enteredEpoch.length>=16){
                enteredEpoch = enteredEpoch.slice(0,13);
            }
            epochNum=parseInt(enteredEpoch);
            utcDate=new Date(epochNum);
            customZone=document.getElementById('epoch-custom-zone').value;
        }
        if(customZone=='PST'){
            utcDate=new Date(utcDate.getTime() + pstOffset)
        }
        else if(customZone=='EST'){
            utcDate=new Date(utcDate.getTime() + estOffset)
        }
    }
    utcTime=utcDate.getTime();
    pstDate=new Date(utcTime-pstOffset);
    estDate=new Date(utcTime-estOffset);
}

function stringDate(d){
    let month = months[d.getUTCMonth()];
    let year = d.getUTCFullYear();
    let day = d.getUTCDate();
    return month + " " + day + ", " + year;
}

function stringTime(d){
    ampm="";
    let seconds="";
    let hour = d.getUTCHours();
    let minutes = d.getUTCMinutes();
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(timeFormat==1){
        ampm=" AM";
        if (hour==12){
            ampm= " PM";
        }
        if (hour==0){
            hour=12;
        }
        if(hour>12){
            hour=hour-12;
            ampm=" PM";
        }
    }
    if(secondsChecked){
        secondInt=d.getSeconds()
        let extra="";
        if(secondInt<10){
            extra="0";
        }
        seconds=":" + extra + d.getSeconds();
    }
    return hour + ":" + minutes + seconds +  ampm ;
}

function stringSearch(timeInHours){
    let searchTime=timeInHours * hour;
    let offset=0;
    let zoneText= "UTC";
    let firstZoneText="";
    if(searchZone==0){
        offset=pstOffset;
        zoneText="PST";
    }
    if(searchZone==1){
        offset=estOffset;
        zoneText="EST";
    }
    if(bothTimeZones){
        firstZoneText= " " + zoneText;
    }
    let firstDate=new Date(utcTime-offset-searchTime);
    let secondDate=new Date(utcTime-offset);
    return stringDate(firstDate) + " " + stringTime(firstDate) + firstZoneText + " to " + stringDate(secondDate) + " " + stringTime(secondDate) + " " + zoneText;
    
}

function switchSearch(zone){
    if(zone==0){
        document.getElementById("SearchPST").classList.add("active");
        document.getElementById("SearchEST").classList.remove("active");
        document.getElementById("SearchUTC").classList.remove("active");
    }
    if(zone==1){
        document.getElementById("SearchPST").classList.remove("active");
        document.getElementById("SearchEST").classList.add("active");
        document.getElementById("SearchUTC").classList.remove("active");
    }
    if(zone==2){
        document.getElementById("SearchPST").classList.remove("active");
        document.getElementById("SearchEST").classList.remove("active");
        document.getElementById("SearchUTC").classList.add("active");
    }
    searchZone=zone;
    update()
}

function switchFormat(format){
    if(format==0){
        document.getElementById("24Hour").classList.add("active");
        document.getElementById("12Hour").classList.remove("active");
    }
    if(format==1){
        document.getElementById("24Hour").classList.remove("active");
        document.getElementById("12Hour").classList.add("active");
    }
    timeFormat=format;
    update();
}

function currentTime(){
    document.getElementById("current-time").classList.add("active");
    document.getElementById("custom-time").classList.remove("active");
    document.getElementById("time-box").style.display='none';
    document.getElementById("epoch-time").classList.remove("active");
    document.getElementById("epoch-box").style.display='none';
    mainTime=0;
    update();
}

function customTime(){
    document.getElementById("custom-time").classList.add("active");
    document.getElementById("current-time").classList.remove("active");
    document.getElementById("epoch-time").classList.remove("active");
    document.getElementById("time-box").style.display='inline-block';
    document.getElementById("epoch-box").style.display='none';
    mainTime=1;
    update();
}

function epochTime(){
    document.getElementById("current-time").classList.remove("active");
    document.getElementById("custom-time").classList.remove("active");
    document.getElementById("epoch-time").classList.add("active");
    document.getElementById("time-box").style.display='none';
    document.getElementById("epoch-box").style.display='inline-block';
    mainTime=2;
    update();
}

function copyClock(selection){
    let copyDate;
    let copyTime;
    if(selection=='PST'){
        copyDate=document.getElementById('pst-date');
        copyTime=document.getElementById('pst-time');
    }
    else if(selection=='EST'){
        copyDate=document.getElementById('est-date');
        copyTime=document.getElementById('est-time');
    }
    else{
        copyDate=document.getElementById('utc-date');
        copyTime=document.getElementById('utc-time');
    }
    navigator.clipboard.writeText(copyDate.innerHTML + " " + copyTime.innerHTML + " " + selection);
}

function copySearch(selection){
    let copySearch;
    if(selection=='day'){
        copySearch=document.getElementById('daySearch');
    }
    else if(selection=='week'){
        copySearch=document.getElementById('sevenDaySearch');
    }
    else{
        copySearch=document.getElementById('custom-search')
    }
    
    navigator.clipboard.writeText(copySearch.innerHTML);
}