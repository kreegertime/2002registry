//==================================================================================================
//
// @file new_car.js
// @brief Javascript file for controlling the new car form.
//
//==================================================================================================

$(function() {


  // Clear out form values each time
  $(':input', '#new_car').not(":button, :submit, :reset, :hidden")
                         .val('')
                         .removeAttr('selected');
  $.fn.nextStep = function() {
    // Determine what step to do next.
    var curStep = $(".current-step").attr("rel");
    switch (curStep) {
      case "1":
        //
        // XXX Do something load-ey.
        //
        var vin = $(".vin-textbox").val(); 
        var car = new Registry.Car(vin, function(success) {
          if (success) {
            if (car.is_registered) {
              var curUserId = parseInt($(".user-id-field").val());
              if (car.registered_user.id == curUserId) {
                var html =
                    "<div class=\"section\">" +
                      "<h2>This VIN is already registered</h2" +
                      "<p>" +
                        "You have already registered this car." +
                      "</p>" +
                      "<div class=\"field\">" +
                        "<input class=\"ok\" type=\"button\" value=\"OK\" />" +
                      "</div>" +
                    "</div>";
                var dialogBox = new DialogBox(html);
                dialogBox.show();
                $("input.ok").click(function() {
                  dialogBox.close();
                });
              }
              else {
                var html =
                  "<div class=\"section\">" +
                    "<h2>This VIN is already registered</h2" +
                    "<p>" +
                      "This car has already been registered by " + car.registered_user.name + ". " +
                      "To claim this car, please click on the 'Claim Car' button below" +
                      "<div class=\"field\">" +
                        "<input class=\"cancel\" type=\"button\" value=\"Cancel\" />" +
                        "&nbsp;" +
                        "<input class=\"claim\" type=\"button\" value=\"Claim Car\" />" +
                      "</div>" +
                    "</p>" +
                  "</div>";
                var dialogBox = new DialogBox(html);
                dialogBox.show();
                $("input.cancel").click(function() {
                  dialogBox.close();
                });
                $("input.claim").click(function() {
                  dialogBox.close();
                  var userId = $(".user-id-field").val();
                  car.claimCar(vin, userId, function(success) {
                    if (success) {
                      window.location = "<%= user_path(current_user) %>";
                    }
                    else {
                      alert("Sorry, something went wrong. Please try again.");
                    }
                  });
                });

                /* XXX KREEGER: Left off right here --> Need to figure out how we want to do the
                                JSON part of this - might just be easy enough to throw the 'user'
                                property on the JSON response.

                var userName = data["user"]["name"];
                var carID = data["car"]["id"];
                var html =
                  "<div class=\"section\">" +
                    "<h2>This VIN is already registered</h2" +
                    "<p>" +
                      "This car has already been registered by " + userName + ". " +
                      "To claim this car, please click on the 'Claim Car' button below" +
                      "<div class=\"field\">" +
                        "<input class=\"cancel\" type=\"button\" value=\"Cancel\" />" +
                        "&nbsp;" +
                        "<input class=\"claim\" type=\"button\" value=\"Claim Car\" />" +
                      "</div>" +
                    "</p>" +
                  "</div>";
                var dialogBox = new DialogBox(html);
                dialogBox.show();
                $("input.cancel").click(function() {
                  dialogBox.close();
                });
                $("input.claim").click(function() {
                  $.post("/cars/" + carID + "/claim",
                         "user_id=" + $(".user-id-field").val(),
                         function(data) {
                           if (data["success"]) {
                             // Probably want to take to the 'edit car' path
                             // when that page has been completed.
                             // XXX KREEGER: FIX ME!
                             //window.location = "<%= user_path(current_user) %>";
                           }
                           else {
                             alert("Sorry, something went wrong, please try again");
                           }
                         });
                  dialogBox.close();
                });
                */
              }
            }
          }
          else {
          }
        });

        $.get("/vins/" + $(".vin-textbox").val(), function(data) {
          if (data["success"]) {
            if (data["is_registered"]) {
              var url = "/vins/" + $(".vin-textbox").val() + "/registered_user";
              $.get(url, function(data) {
                if (data["success"]) {
                  if (data["user"]["id"] == $(".user-id-field").val()) {
                    var html =
                      "<div class=\"section\">" +
                        "<h2>This VIN is already registered</h2" +
                        "<p>" +
                          "You have already registered this car." +
                        "</p>" +
                        "<div class=\"field\">" +
                          "<input class=\"ok\" type=\"button\" value=\"OK\" />" +
                        "</div>" +
                      "</div>";
                    var dialogBox = new DialogBox(html);
                    dialogBox.show();
                    $("input.ok").click(function() {
                      dialogBox.close();
                    });
                  }
                  else {
                    var userName = data["user"]["name"];
                    var carID = data["car"]["id"];
                    var html =
                      "<div class=\"section\">" +
                        "<h2>This VIN is already registered</h2" +
                        "<p>" +
                          "This car has already been registered by " + userName + ". " +
                          "To claim this car, please click on the 'Claim Car' button below" +
                          "<div class=\"field\">" +
                            "<input class=\"cancel\" type=\"button\" value=\"Cancel\" />" +
                            "&nbsp;" +
                            "<input class=\"claim\" type=\"button\" value=\"Claim Car\" />" +
                          "</div>" +
                        "</p>" +
                      "</div>";
                    var dialogBox = new DialogBox(html);
                    dialogBox.show();
                    $("input.cancel").click(function() {
                      dialogBox.close();
                    });
                    $("input.claim").click(function() {
                      $.post("/cars/" + carID + "/claim",
                             "user_id=" + $(".user-id-field").val(),
                             function(data) {
                               if (data["success"]) {
                                 // Probably want to take to the 'edit car' path
                                 // when that page has been completed.
                                 // XXX KREEGER: FIX ME!
                                 //window.location = "<%= user_path(current_user) %>";
                               }
                               else {
                                 alert("Sorry, something went wrong, please try again");
                               }
                             });
                      dialogBox.close();
                    });
                  }
                }
                else {
                  // XXX Do something with errors here.
                }
              });
            }
            else {
              $(".step.one").addClass("hidden");
              $(".step.two").removeClass("hidden");
              $(".current-step").attr("rel", "2");

              var model = data.result.model;
              $(".model-name-entry").html(model.name);
              $(".model-number-entry").html(model.number)
              $(".model-id-hidden-field").attr("value", model.id);
            }
          }
          else {
            // XXX Do something with errors here.
          }
        });
        break;

      case "2":
        // Ensure that data is validated..
        $(".step.two").addClass("hidden");
        $(".step.three").removeClass("hidden");
        $(".current-step").attr("rel", "3");
        break;

      case "3":
        $(".step.three").addClass("hidden");
        $(".step.four").removeClass("hidden");
        $(".current-step").attr("rel", "4");
        break;

      case "4":
        $("#new_car").submit();
        break;
        
      default:
        alert("Something went wrong!");
    }
  },

  $.fn.validateLocation = function() {
  },

  $(".next-step-button").click(function() {
    $(this).nextStep();
  });

  $(".vin-textbox").keydown(function(arg) {
    // Keycode '13' is the enter key.
    if (arg.keyCode == 13) {
      $(this).nextStep();
    }
  });

  $(".guess-year-button").click(function() {
    $.get("/vins/" + $(".vin-textbox").val() + "/guess_year", function(data) {
      if (data["success"]) {
        $(".year-textbox").val(data.year);
      }
      else {
        // XXX DO SOMETHING?
      }
    });
  });

  $(".select-country").change(function() {
    if ($(".select-country option:selected").attr("value") == "US") {
      // Load the states drop down..
      $(".state-textbox").addClass("hidden");
      $(".select-state").removeClass("hidden");
      $(".select-state").attr("disabled", "");
    }
    else {
      // Hide the states select field and show the state textfield
      $(".select-state").addClass("hidden");
      $(".state-textbox").removeClass("hidden");
    }
  });

  $(".location-lookup-button").click(function() {
    $.get("/locations/lookup", function(data) {
    });
  });
});
