
// function to get params from url
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam)
      {
          return sParameterName[1];
      }
    }    
};



$(document).ready( function() {

    var show_error, stripeResponseHandler, submitHandler;

    // function to handle the submit the form and intercept the default event
    submitHandler = function(event) {
        var $form = $(event.target);    // get the reference to the form
        $form.find("input[type=submit]").prop("disabled", true);

        if (Stripe) {
            Stripe.card.createToken($form, stripeResponseHandler);
        } else {
            show_error("Failed to load credit card processing functionality. Please reload the page");
        }

        // prevent the default functionng to happening when the submit happen
        return false;
    };

    // initiate submit handle listener for any form with class cc_form
    $(".cc_form").on('submit', submitHandler);


    // handle event of plan drop down changing
    var handlePlanChange = function(planType, form) {
        var $form = $(form);

        if (planType == undefined) {
            planType = $('#tenant_plan :selected').val();
        }

        if (planType == 'premium') {
            $('[data-stripe]').prop('required', true);
            $form.off('submit');                // first remove the submit event  
            $form.on('submit', submitHandler);  // turn it on and call the submtHandler
            $('[data-stripe]').show();
        } else {
            $('[data-stripe]').hide();
            $form.off('submit');
            $('[data-stripe]').removeProp('required');
        }
    };

    // setup plan change event listener #tanent_id is the form for class cc_form
    $('#tenant_plan').on('change', function(event) {
        handlePlanChange($('#tenant_plan :selected').val(), ".cc_form");
    });


    // call plan change handler so that the plan is set correctly in the drop down when the page load;
    handlePlanChange(GetURLParameter('plan', ".cc_form"))


    // function to handle the token received from stripe and remove credit card fields
    stripeResponseHandler = function(status, response) {
        var token, $form;

        $form = $('.cc_form');
        if (response.error) {
            console.log(response.error.message);
            show_error(response.error.message);
            $form.find("input[type=submit]").prop("disabled", false);
        } else {
            token = response.id;
            $form.append($("<input type=\"hidden\" name=\"payment[token]\" >").val(token));

            $("[data-stripe=number]").remove();
            $("[data-stripe=ccv]").remove();
            $("[data-stripe=year]").remove();
            $("[data-stripe=month]").remove();
            $("[data-stripe=label]").remove();

            $form.get(0).submit(); // then call the submit on the form
        }

        // prevent the default
        return false;
    };


    // function to show errors when stripe functionality returns an error
    show_error = function (message) {
        if($("#flash-messages").size() < 1){
          $('div.container.main div:first').prepend("<div id='flash-messages'></div>")
        }
        $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
        $('.alert').delay(5000).fadeOut(3000);
        return false;
      };

});
