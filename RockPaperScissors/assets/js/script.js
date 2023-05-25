var choices = [ "Rock" , "Paper" , "Scissors" ];
var tally = 1 ;

var computer_score = 0;
var player_score = 0;

var disabled = false; 

function Play(choice)
{
    if( disabled )
    {
        return;
    }

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



    var notif_elem = document.getElementById("notification");
    

    if( computerChoice === playerChoice )
    {
        notif_elem.innerHTML = "Draw" ;
    }
    else if( (computer_value === 0 && playerChoice === 2) || (computer_value === 1 && playerChoice === 0) || ( computerChoice === 2 && playerChoice === 1 ) )
    {
        computer_score += 1 ;
        notif_elem.innerHTML = "CPU Won" ;
    }
    else 
    {
        player_score += 1 ;
        notif_elem.innerHTML = "You Won" ;
    }




    if( computerChoice === 0 )
    {
        document.getElementById("bot_container").style.backgroundImage = "url(https://cenentury0941.github.io/RockPaperScissors/assets/images/rock.gif"+"?a="+Math.random() + ")";
    }

    if( computerChoice === 1 )
    {
        document.getElementById("bot_container").style.backgroundImage =  "url(https://cenentury0941.github.io/RockPaperScissors/assets/images/paper.gif"+"?a="+Math.random() + ")";
    }

    if( computerChoice === 2 )
    {
        document.getElementById("bot_container").style.backgroundImage =  "url(https://cenentury0941.github.io/RockPaperScissors/assets/images/scissors.gif"+"?a="+Math.random() + ")";
    }

    document.getElementById("playarea").style.animationName = "RevealBot" + tally ;
    notif_elem.style.animationName = "showNotif" + tally ;

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