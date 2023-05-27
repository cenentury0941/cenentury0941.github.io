setTimeout(
    () => {
        document.getElementById("init").style.animationName = "hideTitleBack";
        document.getElementById("init").style.animationIterationCount = 1;
    } ,
    2500
);

setTimeout(
    () => {
        document.getElementById("titlebg").remove();
        document.getElementById("init").remove();
    },
    7000
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



function Angle2Points( start_x , start_y , end_x , end_y )
{
    return Math.atan2(end_y - start_y, end_x - start_x) * 180 / Math.PI;
}

function Distance2Points( start_x , start_y , end_x , end_y )
{
    return Math.sqrt( Math.pow( start_x-end_x , 2 ) + Math.pow( start_y-end_y , 2) );
}

var mapIsRotating = true;
var mapAngle = 0;

function rotateMap()
{

    if( mapIsRotating )
    {

    var map = document.getElementById("rotmap");

    map.style.transform = "translateY(-20%) rotateX(45deg) rotateZ("+mapAngle+"deg)" ;

    mapAngle += 6;
    // mapAngle %= 360;
    }

    setTimeout( rotateMap , 1000 );

}

function pauseMapRotation()
{    
    var map = document.getElementById("rotmap");
    map.style.transitionTimingFunction = "linear";
    map.style.transitionDuration = "0.5s";
    mapIsRotating = false;
}

function resumeMapRotation()
{
    var map = document.getElementById("rotmap");
    map.style.transitionTimingFunction = "linear";
    map.style.transitionDuration = "1s";
    mapIsRotating = true;
}

function focusMapOnThanos()
{

    var map = document.getElementById("rotmap");
    var angle = (Angle2Points( 50 , 50 , ThanosX , 100-ThanosY )+90);
    console.log( angle );
    map.style.transform = "translateY(-20%) rotateX(45deg) rotateZ("+angle+"deg)" ;
    mapAngle = angle;
}



var ThanosX = 0;
var ThanosY = 0;
var ThanosStartPosition = 0 ;
var Right = true;
var TargetWorld = 0 ;
var CurrentTarget = 0 ;
var Path = [];


function plotPath()
{

    TargetWorld = infinity_stones[ Math.floor( Math.random()*infinity_stones.length ) ];

    var visited = new Set();
    var pending = [];

    Path = [];

    for( var i = 0 ; i < starcount ; i++ )
    {
        Path[i] = {};
        Path[i].distance = 100000 ;
    }

    Path[TargetWorld].distance = 0 ;
    
    visited.add(TargetWorld);
    
    for(var neigh of Adjacency[TargetWorld].entries())
    {
        
        if( neigh[1] != undefined )
        {
        //console.log( neigh[1] );
        var star = neigh[0] ;
        var distance = neigh[1] ;

        Path[star].next = TargetWorld;
        Path[star].distance = distance;

        pending.push( neigh );
        }
    }

    //console.log( "Pending" );
    //console.log( pending.forEach( item => console.log(item) ) );

    while( visited.size < starcount )
    {

        var current = pending.shift();
        var star = current[0] ;
        var distance = current[1] ;
        //console.log( "current : " + star + " | " + distance );
        

        for(var neigh of Adjacency[star].entries())
        {
            
            var nextStar = neigh[0] ;
            var nextDistance = neigh[1] ;
            
            if( nextDistance == undefined )
            {
                continue;
            }

            if( visited.has(nextStar) )
            {
                continue;
            }

            if( Path[nextStar].distance > distance+nextDistance )
            {
                Path[nextStar].next = star;
                Path[nextStar].distance = distance+nextDistance;    
            }

            pending.push( neigh );
        }

        visited.add(star);

    }

    //console.log( Path );
    
}

function createThanos()
{
    var Thanos = document.createElement("div");
    Thanos.className = "Thanos";

    var current_star =  Math.floor( Math.random()*50 ) ;
    var start_star = star_map[current_star] ;
    
    ThanosStartPosition = start_star;

    ThanosX = start_star.x ;
    ThanosY = start_star.y ;

    Thanos.style.left = ThanosX + "%";
    Thanos.style.top = ThanosY + "%";

    Thanos.id = "Thanos";
    document.getElementById("rotmap").appendChild( Thanos );

    pauseMapRotation();
    focusMapOnThanos();

    plotPath();

    CurrentTarget = Path[current_star].next;




    while( current_star != TargetWorld )
    {
        //console.log( document.getElementById("star"+current_star) );
        document.getElementById("star"+current_star).className = "star star_highlight";

        let s1 = current_star;
        let s2 = Path[current_star].next;




        if( s1 < s2 )
        {
            document.getElementById("L"+s1+"|"+s2).className = "starlink starlink_highlight";
            console.log( "Link : " + document.getElementById("L"+s1+"|"+s2).className );
        }
        else{
            document.getElementById("L"+s2+"|"+s1).className = "starlink starlink_highlight";
            console.log( "Link : " + document.getElementById("L"+s2+"|"+s1).className );
        }

        current_star = Path[current_star].next ;
    }


    var msg = 'WARNING! Thanos is on the move!';
    window.parent.sendMessage( msg , "Important" );

    setTimeout( moveThanos , 10 );

}

function destroyThanos()
{

    var ThanosElem = document.getElementById("Thanos");

    if( ThanosElem == undefined )
    {
        return false;
    }

    if( CurrentTarget == undefined )
    {
        
        var acquired_stone = infinity_stones_names[TargetWorld];
 
        var msg = 'Thanos obtained the '+acquired_stone+' stone!';
        window.parent.sendMessage( msg , "SuperImportant" );
    
        var new_infinity_stones = []
        for( var stone of infinity_stones )
        {
            if( stone == TargetWorld )
            {
                continue;
            }
            new_infinity_stones.push(stone);
        }
        infinity_stones = new_infinity_stones;


        document.getElementById( "star"+TargetWorld ).className="star";
    }




    for( var i = 0 ; i < starcount ; i++ ){
        if( infinity_stones.includes(i) )
        {
            continue;
        }
        document.getElementById("star"+i).className = "star";
    }

    var links = document.getElementsByClassName("starlink");
    for( var elem of links )
    {
        elem.className = "starlink";
    }

    document.getElementById("Thanos").remove();
    resumeMapRotation();
    setTimeout( createThanos , 15000 );

    return true;

}

window.globalDestroyThanos = function(ico_id){
    let destroyed = destroyThanos();
    if(destroyed)
    {
        window.parent.sendMessage( "Thanos has been stopped!" , "Info" );
    }
    document.getElementById(ico_id).style.opacity = 1;
}

function moveThanos()
{
    
    var Thanos = document.getElementById("Thanos");

    if( Thanos == undefined )
    {
        return;
    }

    let targetX = star_map[CurrentTarget].x;
    let targetY = star_map[CurrentTarget].y;
    
    // if( ThanosX < targetX )
    // {
    //     ThanosX += 0.2 ;
    // }
    // else if( ThanosX > targetX )
    // {
    //     ThanosX -= 0.2 ;
    // }

    
    // if( ThanosY < targetY )
    // {
    //     ThanosY += 0.2 ;
    // }
    // else if( ThanosY > targetY )
    // {
    //     ThanosY -= 0.2 ;
    // }

    ThanosX += ( targetX - ThanosX )*0.2;
    ThanosY += ( targetY - ThanosY )*0.2;

    Thanos.style.left = ThanosX + "%";
    Thanos.style.top = ThanosY + "%";

    let distance = Distance2Points( ThanosX , ThanosY , targetX , targetY );

    if( distance <= 0.39 )
    {
        CurrentTarget = Path[CurrentTarget].next;

        if( CurrentTarget == undefined )
        {
            setTimeout( destroyThanos , 10 );
            return;
        }

    }
    focusMapOnThanos();
    setTimeout( moveThanos , 500 );

}












var starcount = 100 ;
var star_map = [];
var star_links = {};
var long_distance_limit = 5 ;
var max_distance = 20;
var short_distance = 10;
var radial_size = 30;
var graph = [];
var infinity_stones = [ 80,82,86,90,95,98 ];
var infinity_stones_names = [];
var infinity_stones_desc = [];

infinity_stones_names[infinity_stones[0]] = "Power" ;
infinity_stones_names[infinity_stones[1]] = "Space" ;
infinity_stones_names[infinity_stones[2]] = "Reality" ;
infinity_stones_names[infinity_stones[3]] = "Soul" ;
infinity_stones_names[infinity_stones[4]] = "Time" ;
infinity_stones_names[infinity_stones[5]] = "Mind" ;

var infinity_stone_names = []
infinity_stone_names[0] = "Power" ;
infinity_stone_names[1] = "Space" ;
infinity_stone_names[2] = "Reality" ;
infinity_stone_names[3] = "Soul" ;
infinity_stone_names[4] = "Time" ;
infinity_stone_names[5] = "Mind" ;

infinity_stones_desc[0] = "The Power Stone is an incredible power source, it increases the user's physical abilities and allows it to manipulate energy, which, when used at full potential, has enough power to obliterate an entire planet when unleashed." ;
infinity_stones_desc[1] = "The Tesseract is named for its cube-like appearance and is capable of controlling space itself, providing the user instant access to any location throughout the universe if used correctly." ;
infinity_stones_desc[2] = "The Aether appears as a dark, red, viscous liquid. It acts as a symbiotic force, capable of being absorbed into the body of a living host, giving the user the ability to warp reality at will, granting that person immense strength, durability, powers, and subjective influence over the universe." ;
infinity_stones_desc[3] = "According to Wong's ancient texts, the Soul Stone could prove to be the greatest threat out of all the Infinity Stones.[32] Gamora knew of the location of the Soul Stone from a map she found to its whereabouts (which she burnt) but kept this a secret from Thanos." ;
infinity_stones_desc[4] = "The Eye of Agamotto is an ancient artifact, a pendant created by Agamotto, the first Sorcerer Supreme, presumably to contain and harness the power of the green Time Stone contained inside." ;
infinity_stones_desc[5] = "The Scepter was a weapon that utilized the yellow Mind Stone housed inside a blue computer module, which also masked the stone's presence." ;


function showStoneDetails(stone)
{
    document.getElementById("Stone_Name").innerHTML = infinity_stone_names[stone] + " Stone";
    document.getElementById("Stone_Desc").innerHTML = infinity_stones_desc[stone];
    document.getElementById("Stone_Img").style.background = 'url("../thantrack23/assets/images/stones/'+infinity_stone_names[stone]+'.gif")';
    document.getElementById("Stone_Img").style.backgroundSize = "cover";
    document.getElementById("Stone_Img").style.backgroundPosition = "center";
}



var Adjacency = [];

for( var i = 0 ; i < starcount ; i++ )
{
    Adjacency[i] = [];
}



function generateStarMap()
{
    for( var i = 0 ; i < starcount ; i++ )
    {
        var star = document.createElement("div");
        star.className = "star" ;
        star.id = "star"+i;

        switch( i )
        {
            case infinity_stones[0]:
                star.className += " power";
                break;
                
            case infinity_stones[1]:
                star.className += " space";
                break;
                
            case infinity_stones[2]:
                star.className += " reality";
                break;
                
            case infinity_stones[3]:
                star.className += " soul";
                break;
                
            case infinity_stones[4]:
                star.className += " time";
                break;
                
            case infinity_stones[5]:
                star.className += " mind";
                break;
        }

        let offset = 1000 ;

        var min_size = 0 ;
        var max_size = radial_size ;

        if( i > 70 )
        {
            min_size = radial_size * 0.8;
            max_size = radial_size;
        }
        else{
            min_size = 0;
            max_size = radial_size * 0.8;
        }

        while( offset > max_size || offset < min_size )
        {
        
        var top = Math.floor(Math.random()*100);
        var left = Math.floor(Math.random()*100);

        offset = Math.sqrt( Math.pow( 50-top , 2 ) + Math.pow( 50-left , 2) );
        //console.log( offset );
        }

        star.style.left = left + "%";
        star.style.top = top + "%";
        document.getElementById("rotmap").appendChild(star); 
        
        star_map[i] = { x: left , y:top };
        //console.log(star_map[i]);
    }

    for( var start = 0 ; start < starcount-1 ; start++ )
    {
        var distance_limit = max_distance ;

        for( var end = start+1 ; end < starcount ; end++ )
        {
            let start_x = star_map[start].x;
            let start_y = star_map[start].y;

            let end_x = star_map[end].x;
            let end_y = star_map[end].y;

            let distance = Distance2Points( start_x , start_y , end_x , end_y );


            if( distance <= distance_limit )
            {

                if( distance > short_distance )
                {
                    distance_limit = short_distance;
                }

                if( infinity_stones.includes(end) || infinity_stones.includes(start) )
                {
                    Adjacency[start][end] = 1000;
                    Adjacency[end][start] = 1000;
                }
                else{
                    Adjacency[start][end] = distance;
                    Adjacency[end][start] = distance;
                }

                
                var starlink = document.createElement("div");
                starlink.className = "starlink" ;
                starlink.style.width = distance + "%" ;
                starlink.style.position = "absolute";
                starlink.style.left =  (start_x) + "%" ;
                starlink.style.top =  (start_y) + "%" ;
                starlink.id="L"+start+"|"+end;
                var angleDeg = Angle2Points( start_x , start_y , end_x , end_y );

                starlink.style.transform = "translateX(3px) rotateZ("+angleDeg+"deg)" ;
                //console.log(angleDeg);
                
                document.getElementById("rotmap").appendChild( starlink );
            }

        }
    }

    console.log(Adjacency);
    rotateMap();
    setTimeout( createThanos , 20000 );

}






async function getCharacters()
{

    var tohash = ts + private_key + public_key ;

    let hash = md5(tohash);
    console.log(hash);

    char_api += "?ts=1&apikey=" + public_key + "&hash=" + hash + "&limit=6" + "&offset=" + Math.floor(Math.random()*39) ;

    const response = await fetch(char_api);
    const jsonData = await response.json();
    console.log(jsonData);

    characters = jsonData.data.results;
    console.log(characters);

    initialiseHeros();

}




function hideStones()
{
    document.getElementById("Stone_Box").style.display = "none";
}

function showStones()
{
    document.getElementById("Stone_Box").style.display = "flex";
}













getCharacters();

setTimeout( 
    generateStarMap , 5000 );