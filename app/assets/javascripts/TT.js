﻿//////////////////////////////////////////////////////////////////////////
// Generic testtube (TT) functions
// wireup stuff automatically
// if there are any popups on the page, this will automatically wire up events for them

$(window).load(function () {
  TTwireUpPopupEvents();
  TTwireTubeMenu();
});

//////////////////////////////////////////////////////////////////////////
//UTILITY FUNCTIONS
if (typeof String.prototype.startsWith != 'function')
{
  String.prototype.startsWith = function (str)
  {
    return this.slice(0, str.length).toUpperCase() == str.toUpperCase();
  };
}

if (typeof String.prototype.endsWith != 'function')
{
  String.prototype.endsWith = function (str)
  {
    return this.slice(-str.length).toUpperCase() == str.toUpperCase();
  };
}

//http://stackoverflow.com/questions/1909441/jquery-keyup-delay
// framework function to allow a js method to be fired after some delay in typing
// usage:
// $('input').keyup(function() {
//     delay(function(){
//       alert('Time elapsed!');
//     }, 1000 );
// });
// 
var TTfireAfterDelay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function TTconfirmNodeSave(jqNode)
{
  jqNode.prepend("<img class='confirm-image' src='/assets/saved.png'/>");
  var image = jqNode.children(".confirm-image");
  image.fadeOut(1500, function(){image.remove()});
}

//////////////////////////////////////////////////////////////////////////
// tube menu

function TTwireTubeMenu()
{
  // when the mouse hovers an item
  $(".tube-menu a").mouseover(function (e)
  {
    $(this).addClass("selected");
  });

  // when the mouse leaves an item
  $(".tube-menu a").mouseleave(function (e)
  {
    $(this).removeClass("selected");
  });
}

//////////////////////////////////////////////////////////////////////////
//   Refined list control provides google-like selector functionality
//////////////////////////////////////////////////////////////////////////
function TTwireupRefinedListEvents(refinedListId, focusOnSelect)
{
  $(refinedListId + " .TTrefined-list-input").keyup(function (e)
  {
    TTrefineListSelector(e, this, refinedListId, focusOnSelect);
  });

  $(refinedListId + " .TTrefined-list-input").focusout(function (e)
  {
    // this hack puts a delay on the focus out because it was beating the
    // click event
    window.setTimeout(function ()
    {
      $(refinedListId + " .TTrefined-list-results").css("display", "none")
    }, 300);
  });

  // when the input field gets focus
  $(refinedListId + " .TTrefined-list-input").focusin(function (e)
  {
    TTrefineListSelector(e, this, refinedListId, focusOnSelect);
  });

  // when the mouse hovers the selection list
  $(refinedListId + " .TTrefined-list-results .result").mouseover(function (e)
  {
    $(this).addClass("selected");
  });

  // when the mouse leaves the selection list
  $(refinedListId + " .TTrefined-list-results .result").mouseleave(function (e)
  {
    $(this).removeClass("selected");
  });

  // when selection list is clicked
  $(refinedListId + " .TTrefined-list-results .result").click(function (e)
  {
    TTselectRefinedListWithClick(e, $(this), refinedListId, focusOnSelect);
  });
}

function TTrefineListSelector(event, inputBox, refinedListId, focusOnSelect)
{
  var listId = refinedListId + " .TTrefined-list-results"
  listBox = $(listId);

  if (event.keyCode == undefined)
  {
    return;
  }

  var isUpKey = (event.keyCode == 38);
  var isDownKey = (event.keyCode == 40);
  var isEnterKey = (event.keyCode == 13);

  if (isDownKey || isUpKey)
  {
    // user hit the up or down arrow.  
    if (listBox.css("display") == "none")
    {
      // If list not displayed, just display it.  dont make a selection yet
      listBox.css("display", "block");
    }
    else
    {
      // If list was already displayed, figure out what should be highlighted
      var selectedResult = $(listId + " .selected");
      if (selectedResult.length == 0)
      {
        // nothing was selected, select the first or last based on the key
        if (isDownKey)
        {
          newSelection = $(listId + " .result:visible:first");
        }
        else if (isUpKey)
        {
          newSelection = $(listId + " .result:visible:last");
        }
      }
      else
      {
        // there was already a selected item, move the cursor
        if (isDownKey)
        {
          var newSelection = selectedResult.nextAll(":visible");
          if (newSelection.length == 0)
          {
            newSelection = $(listId + " .result:visible:first");
          }
        }
        else if (isUpKey)
        {
          var newSelection = selectedResult.prevAll(":visible");
          if (newSelection.length == 0)
          {
            newSelection = $(listId + " .result:visible:last");
          }
        }
        selectedResult.removeClass("selected");
      }
      newSelection.addClass("selected");
      inputBox.value = newSelection[0].innerText;
    }
  }
  else if (isEnterKey)
  {
    // enter key... close it up
    $(focusOnSelect).focus();
  }
  else
  {
    // a key was typed in.  Make the selector go to that entry
    listBox.css("display", "block");
    $(listId + " > div.result").each(function (e)
    {
      var currentDiv = $(this);
      if (inputBox.value == "" || currentDiv[0].innerText.startsWith(inputBox.value))
      {
        currentDiv.css("display", "block");
      }
      else
      {
        currentDiv.css("display", "none");
      }
    });
  }
}

function TTselectRefinedListWithClick(e, clickedDiv, refinedListId, focusOnSelect)
{
  $(refinedListId + " .TTrefined-list-input")[0].value = clickedDiv[0].innerText;
  $(refinedListId + " .TTrefined-list-results").css("display", "none");
  $(focusOnSelect).focus();
}



//////////////////////////////////////////////////////////////////////////
//   popup functions
//////////////////////////////////////////////////////////////////////////
function TTshowTagInPopup(e, jqPopup, args)
{

  //Get the screen height and width
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();

  //Set heigth and width to mask to fill up the whole screen
  $('#mask').css(
  {
    'width': maskWidth,
    'height': maskHeight
  });

  //transition effect		
  $('#mask').fadeIn(1000);
  $('#mask').fadeTo("slow", 0.8);

  //Get the window height and width
  var winH = $(window).height();
  var winW = $(window).width();

  //Set the popup window to center
  jqPopup.css('top', winH / 2 - jqPopup.height() / 2);
  jqPopup.css('left', winW / 2 - jqPopup.width() / 2);

  jqPopup.show();

  //transition effect
  jqPopup.fadeIn(2000);
}

function TTwireUpPopupEvents()
{
  var ttPopups = $(".TTpopup");

  // if the current page has any popup controls in it...
  if (ttPopups.length > 0)
  {
    // wire up the window resize event to reposition the mask
    // and the popup windows
    $(window).resize(function ()
    {
      //Get the screen height and width
      var maskHeight = $(document).height();
      var maskWidth = $(window).width();

      //Set height and width to mask to fill up the whole screen
      $('#mask').css(
      {
        'width': maskWidth,
        'height': maskHeight
      });

      //Get the window height and width
      var winH = $(window).height();
      var winW = $(window).width();

      //Set the popup window to center
      $('.TTpopup').each(function ()
      {
        $(this).css(
        {
          'top': winH / 2 - $(this).height() / 2,
          'left': winW / 2 - $(this).width() / 2
        })
      });

    });

    // wire up the registered links to fire the popup function
    $(".TTpopupLink").click(function(e) 
    {
      // stop the link from doing what it does
      e.preventDefault();

      // expect the href tag is formatted like:
      //     #idOfPopupTag
      // for example:  <a href="#my-popup-control?args">link text</a>
      var idOfControlToShow = $(this).attr("href").split("?")[0];
      var args =  $(this).attr("href").split("?")[1];

      TTshowTagInPopup(e, $(idOfControlToShow), args);
    });

  }
}


