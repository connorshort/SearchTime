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

var secondsChecked=false;
var bothTimeZones=false;

document.getElementById("utcDate").innerHTML="test";
setInterval(update, 1000);

function update(){
    getTime()
    var checkSecs=document.getElementById("checkSeconds");
    var checkBoth=document.getElementById("checkBoth");
    secondsChecked=checkSecs.checked;
    bothTimeZones=checkBoth.checked;
    document.getElementById("utcDate").innerHTML=stringDate(utcDate);
    document.getElementById("utcTime").innerHTML=stringTime(utcDate);
    document.getElementById("pstDate").innerHTML=stringDate(pstDate);
    document.getElementById("pstTime").innerHTML=stringTime(pstDate);
    document.getElementById("estDate").innerHTML=stringDate(estDate);
    document.getElementById("estTime").innerHTML=stringTime(estDate);
    updateSearches();
}

function updateSearches(){
    document.getElementById("daySearch").innerHTML=stringSearch(24);
    document.getElementById("sevenDaySearch").innerHTML=stringSearch(24 * 7);
}

function getTime(){
    utcDate=new Date()
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
        if(hour>12){
            hour=hour-12;
            ampm=" PM"
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
    update()
}
