setTimeout(
    () => {
        document.getElementById("init").style.animationName = "hideTitleBack";
        document.getElementById("init").style.animationIterationCount = 1;
    } ,
    2500
);



var characters = {}
var char_api = "https://gateway.marvel.com:443/v1/public/events/29/characters";
var public_key = "b501936f0cdd8d3278fc9ec70db1ad7a";
var private_key = "7c686a1135c99ae7bb45811c5a31f01c4f9d108c";
var ts = "1";

function initialiseHeros()
{
    for( var i = 0 ; i < 6 ; i++ )
    {
        var name = characters[i].name;
        var ico_url = characters[i].thumbnail.path + "." + characters[i].thumbnail.extension ;

        document.getElementById("hero"+i).innerHTML = "<h4>"+name+"</h4>";
        document.getElementById("icon"+i).style.backgroundImage = "url("+ico_url+")" ;
    }
}

async function getCharacters()
{

    var tohash = ts + private_key + public_key ;

    let hash = md5(tohash);
    console.log(hash);

    char_api += "?ts=1&apikey=" + public_key + "&hash=" + hash + "&limit=6" + "&offset=" + Math.floor(Math.random()*100) ;

    const response = await fetch(char_api);
    const jsonData = await response.json();
    console.log(jsonData);

    characters = jsonData.data.results;
    console.log(characters);

    initialiseHeros();

}

getCharacters();