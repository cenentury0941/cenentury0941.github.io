var choices = [ "Rock" , "Paper" , "Scissors" ];
var tally = 1 ;

var computer_score = 0;
var player_score = 0;

var disabled = false; 

function Play(choice)
{
    disabled = true;

    var computer_value = Math.floor(Math.random() * 3) ;

    var playerChoice = Number(choice);
    var computerChoice = computer_value; 

    console.log(playerChoice);

    if( !( playerChoice === 0 ) )
    {
        document.getElementById("rb").classList.add("desel");
    }

    
    if( !( playerChoice === 1 ) )
    {
        document.getElementById("pb").classList.add("desel");
    }

    
    if( !( playerChoice === 2 ) )
    {
        document.getElementById("sb").classList.add("desel");
    }

    if( computerChoice === playerChoice )
    {

    }
    else if( (computer_value === 0 && playerChoice === 2) || (computer_value === 1 && playerChoice === 0) || ( computerChoice === 2 && playerChoice === 1 ) )
    {
        computer_score += 1 ;
    }
    else 
    {
        player_score += 1 ;
    }

    if( computerChoice === 0 )
    {
        document.getElementById("bot").className = "BotRock" ;
    }

    if( computerChoice === 1 )
    {
        document.getElementById("bot").className = "BotPap" ;
    }

    if( computerChoice === 2 )
    {
        document.getElementById("bot").className = "BotSic" ;
    }

    document.getElementById("playarea").style.animationName = "RevealBot" + tally ;
    tally += 1;
    tally %= 2 ;

    setTimeout( () => {

        document.getElementById("ps").innerHTML = player_score;
        document.getElementById("cs").innerHTML = computer_score;

        document.getElementById("rb").classList.remove("desel");
        document.getElementById("pb").classList.remove("desel");
        document.getElementById("sb").classList.remove("desel");

        disabled = false;

    } , 5000 );

}