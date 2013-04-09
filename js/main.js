function tip_opts(html, placement){
    return {
        html: html,
        placement: placement,
        trigger: 'manual'
    };
}

$(function(){
    $.cookie.defaults.expires = 30;
    var score = $.cookie('penney_score');
    if(score){
        score = score.split(',');
        $('#wins').text(parseInt(score[0]));
        $('#losses').text(parseInt(score[1]));
    }
    window.gamestate = 1;

    setInterval(function(){
        // game loop
        if($('#explanation').is(':not(:visible)') && (parseInt($('#wins').text()) > 9 || parseInt($('#losses').text()) > 19)) {
            $('#teaser').hide();
            $('#explanation').show().effect('highlight');
        }
        if(window.gamestate == 1){
            // player is calling flips
        } else if(window.gamestate == 2){
            // computer is calling flips
            if($('#me1').val() == '???'){
                if($('#you2').val() == 'Heads'){
                    $('#me1').val('Tails').effect('highlight');
                } else {
                    $('#me1').val('Heads').effect('highlight');
                }
            } else if($('#me2').val() == '???'){
                $('#me2').val($('#you1').val()).effect('highlight');
            } else if($('#me3').val() == '???'){
                $('#me3').val($('#you2').val()).effect('highlight');
            } else {
                window.gamestate = 3;
            }
        } else if(window.gamestate == 3){
            // flipping
            var flip = (Math.random() < 0.5 ? 'Heads' : 'Tails');
            $('#flips').append('<span>' + flip + '</span> ');
            $('#flips span:last').effect('highlight');
            if($('#you select:not(.hit):first').val() == flip){
                $('#you select:not(.hit):first').addClass('hit');
                if($('#you select:not(.hit)').length == 0) window.gamestate = 4; // you just won!
            } else {
                $('#you select').removeClass('hit');
                // re-check, because the first TWO might be valid
                if($('#you2').val() == flip && $('#you1').val() == $('#flips span:last').prev().text()){
                    $('#you1, #you2').addClass('hit');
                } else {
                    // re-check, because the first one MIGHT be valid
                    if($('#you1').val() == flip) $('#you1').addClass('hit');
                }
            }
            if($('#me input:not(.hit):first').val() == flip){
                $('#me input:not(.hit):first').addClass('hit');
                if($('#me input:not(.hit)').length == 0) window.gamestate = 5; // I just won!
            } else {
                $('#me input').removeClass('hit');
                // re-check, because the first TWO might be valid
                if($('#me2').val() == flip && $('#me1').val() == $('#flips span:last').prev().text()){
                    $('#me1, #me2').addClass('hit');
                } else {
                    // re-check, because the first one MIGHT be valid
                    if($('#me1').val() == flip) $('#me1').addClass('hit');
                }
            }
        } else if(window.gamestate == 4){
            // human wins
            $('#wins').text(parseInt($('#wins').text()) + 1).closest('p').effect('highlight');
            $.cookie('penney_score', $('#wins').text() + ',' + $('#losses').text());
            alert("You won! But pick some more coins and I'll get you next time!");
            $('#you select, #lets_play').attr('disabled', false).attr('readonly', false).removeClass('hit');
            $('#me input').val('???').removeClass('hit');
            window.gamestate = 1;
        } else if(window.gamestate == 5){
            // computer wins
            $('#losses').text(parseInt($('#losses').text()) + 1).closest('p').effect('highlight');
            $.cookie('penney_score', $('#wins').text() + ',' + $('#losses').text());
            alert("I won! Pick some more coins and let's play again.");
            $('#you select, #lets_play').attr('disabled', false).attr('readonly', false).removeClass('hit');
            $('#me input').val('???').removeClass('hit');
            window.gamestate = 1;
        }
    }, 1000);

    $('#lets_play').on('click', function(){
        $('#you select').attr('readonly', true);
        $('#me input').val('???');
        $('#flips').html('');
        $(this).attr('disabled', true);
        window.gamestate = 2;
    });
});
