const $otherJob = $('#other-title');
const $tDesign = $('#design');
const $title = $('#title');
const $tColor = $('#color');
const $activities = $('.activities input');
const $payment = $('#payment');
const $creditCard = $('#credit-card');
const $paypal = $('#paypal');
const $bitcoin = $('#bitcoin');
const $nameInput = $('#name');
const $emailInput = $('#mail');
const $cardNumberInput = $('#cc-num');
const $zipInput = $('#zip');
const $cvvInput = $('#cvv');
const $total = $('<h4></h4>');
$('.activities').append($total);

let totalFee = 0.00;

function addToolTip($input,message){
    $input.prev().children().remove();
    $input.prev().append(`<p> - ${message} </p>`);
}

function removeToolTip($input){
    $input.prev().children().remove();
}

// Validation of each input using regex
function isValidField($input){
    if ($input.attr('id') === 'name'){
        return /^[a-zA-Z\s]+$/.test($input.val());
    }

    if ($input.attr('id') === 'mail'){
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String($input.val()).toLowerCase());
    }

    if ($input.attr('id') === 'cc-num'){
        return /^[1-9][0-9]{12,15}$/.test($input.val());
    }

    if ($input.attr('id') === 'zip'){
        return /^[0-9]{5}$/.test($input.val());
    }

    if ($input.attr('id') === 'cvv'){
        return /^[0-9]{3}$/.test($input.val());
    }
}
// Add and remove required classes
function addRequired($input){
    $input.addClass('required');
    $input.prev().addClass('required');
}

function removeRequired($input){
    $input.removeClass('required');
    $input.prev().removeClass('required');
}

// Regex validation and display message
function createEventListener($input){
    $input.on('change keyup', function(){
        if(!isValidField($input)){
            addRequired($input);
            if($input === $nameInput){
                addToolTip($input, 'Please enter a valid name');
            }

            if($input === $emailInput){
                addToolTip($input, 'Email must contain "@" and end with a domain');
            }

            if($input === $cardNumberInput){
                addToolTip($input, 'Card number must be between 13 to 16 digits');
            }

            if($input === $zipInput){
                addToolTip($input, 'ZIP must be 5 digits');
            }

            if($input === $cvvInput){
                addToolTip($input, 'CVV must be 3 digits');
            }

            if($input.val().length === 0){
                addToolTip($input, "This field cannot be empty.");
            }
        }
        else{
          removeRequired($input);
          removeToolTip($input);
        }
    })
}
// Initiliase the page
function init(){
    createEventListener($nameInput);
    createEventListener($emailInput);
    createEventListener($cardNumberInput);
    createEventListener($zipInput); 
    createEventListener($cvvInput);
    $('#name').focus();
    $otherJob.hide();
    $paypal.hide();
    $bitcoin.hide();
    $('#colors-js-puns').hide();
    $('#payment option[value="select_method"').attr('disabled',true);
    // Show other job text field when 'other' is selected.
    $title.on('change',function(){
        if($(this).val() === 'other'){
            $otherJob.show();
        }
        else{
            $otherJob.hide();
        }
    })
    //Display appropriate fileds when T-shirt design is selected.
    $tDesign.on('change', function() {
        if($(this).val() === 'js puns' || $(this).val() === 'heart js'){
            $('#colors-js-puns').show();
            if($(this).val() === 'js puns'){
                $('#color option').each(function(index, value){
                    if(index <3){
                        $(this).show();  
                    }
                    else{
                        $(this).hide();
                        
                    }
                })
            }
            if($(this).val() === 'heart js'){
                $('#color option').each(function(index, value){
                    if(index >2 ){
                        $(this).show();
                    }
                    else{
                        $(this).hide();
                        
                    }
                })
            }

        }
        else{
            $('#colors-js-puns').hide();
        }
    
    });

    // Disable any activities that crash and compute the total fee
    $activities.on('change', function(e){
        const activityDetails = e.target.parentElement.textContent;
        const startIndex = activityDetails.indexOf('—');
        const lastIndex = activityDetails.indexOf(',');
        //Slice the activity string to get when the activity takes place
        const timeString = activityDetails.slice(startIndex,lastIndex);
        //How much it costs for the current activity
        const currentFee = parseFloat(activityDetails.slice(activityDetails.indexOf('$')+1));
        if(e.target.checked === true){
            totalFee += currentFee;
        }
        else{
            totalFee -= currentFee;
            // total fee cannot be negative
            if(totalFee <0){
                totalFee = 0;
            }
        }
        // Check if a selected activity clashes with others and disable selections.
        $activities.each(function (index, value){
            if(value.checked === false){
                if(value.parentElement.textContent.includes(timeString)){
                    if(e.target.checked === true){
                        value.setAttribute('disabled',true);
                        value.parentElement.classList.add('disabled');
                    }
                    else {
                        value.removeAttribute('disabled');
                        value.parentElement.classList.remove('disabled');
                    }
                }
            }
        })
        $total.text('Total: ' + '$' + totalFee);

        let checked = 0;

        //check if any activity has been selected and display message
        $activities.each(function(){
            if($(this).is(':checked')){
                checked = 1;
            }
        })

        if(checked === 1){
            $('.activities legend').removeClass('required');
            $('.activities legend').children().remove();
        }

        else if(checked === 0){
            $('.activities legend').append('<p> - Please choose one or more activities</p>');
            $('.activities legend').addClass('required');
        }

    });

        // Show the appropriate div for the selected payment method
    $payment.on('change', function(e){
        const $paymentDivs = $('#credit-card, #paypal, #bitcoin');
        $paymentDivs.each(function(index,value){
            if(e.target.value === this.id.replace(/-/," ")){
                $(this).show();
                console.log(e.target.textContent);
            }
            else{
                $(this).hide();
            }
        })
    })
    

    $(document).ready(function() {
        $('form').on('submit', function(e){
            e.preventDefault();
    
            // Look for an empty input field and display message
            const $requiredInput = $('input:not([type=submit],#other-title)');
                $requiredInput.each(function(){
                    if($(this).val().length === 0){
                        addRequired($(this));
                        addToolTip($(this), "This field cannot be empty.");
                    }
                    else if(isValidField($(this))){
                        removeToolTip($(this));
                    }
                })
    
            //check if no activity has been chosen and add 'required' class and a message if so.
            if($('.activities input:checkbox:checked').length === 0){
                $('.activities legend').children().remove();
                $('.activities legend').addClass('required');
                $('.activities legend').append('<p> - Please choose one or more activities</p>');
            }
            else{
                $('.activities legend').removeClass('required');
                $('.activities legend').children().remove();
            }
            
        });
    });    
}




init();












    
    




