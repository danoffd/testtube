
//////////////////////////////////////////////////////////////////////////
//   slider chest functions
//////////////////////////////////////////////////////////////////////////
var nextTop = 20;

function TTwireUpSliderChest()
{
  $(window).scroll(function ()
  {
    TTadjustSliderChest($(this));
  });
  $(window).resize(function ()
  {
    TTadjustSliderChest($(this));
  });

  // need to adjust the drawer handles so one is on top of the other.
  var drawers = $("#sliderChest .TTsliderDrawer");

  nextTop = 20;

  drawers.each(function ()
  {
    var handle = $(this).children("img");
    handle.css('top', nextTop + "px");
    nextTop += 80;
  });

  var handles = drawers.children("img");
  handles.mouseover(function (e)
  {
    $(this).css("right", "-180px");
  });

  handles.mouseleave(function (e)
  {
    $(this).css("right", "-10px");
  });

  handles.click(function (e)
  {
    TTpickSliderDrawer($(this));
  });

  // this hack sets up the window after some time.  There
  // was some race condition that prevented correct setup
  window.setTimeout(function ()
  {
    TTadjustSliderChest($(window));
  }, 200);

}

var jqSDClickedDrawer = undefined,
  jqSDKeepOpen = undefined,
  jqSDChangeToOpen = undefined,
  bLastOneIsPending = false;

function TTpickSliderDrawer(clickedHandleJQ)
{

  // reset global variables that need to be seen in the decision function

  // set to the drawer that was clicked when it is encountered
  jqSDClickedDrawer = undefined;

  // list of drawers to keep open(really just used to close then incase we 
  //decide to close the whole chest
  jqSDKeepOpen = $();

  // list of closed drawers that need to opened after decisions are made
  jqSDChangeToOpen = $();

  // list of closed drawers that need to closed after decisions are made
  jqSDChangeToClosed = $();

  // set to true by the loop if we cannot decide what to do until we see the state
  // of the next drawer.
  bLastOneIsPending = false;

  // assume the clicked drawer was already opened, so we need to close this one and
  // anything above it
  $(".TTsliderDrawer").each(function ()
  {
    TTpushOrPullDrawer($(this), clickedHandleJQ)
  });

  // if the last one is still pending, it means the top most drawer was opened
  // and was clicked. need to close the whole set
  if (bLastOneIsPending)
  {
    jqSDKeepOpen.each(function ()
    {
      jqSDChangeToClosed.push($(this)[0]);
    });
  }

  jqSDChangeToOpen.removeClass("closed").addClass("open");
  jqSDChangeToClosed.removeClass("open").addClass("closed");

  // if any drawers are open, set the margin on the content section, otherwise
  // clear the margin
  if ($(".TTsliderDrawer").hasClass("open") == false)
  {
    $(".TTsliderCompanion").addClass("full").removeClass("displaced");
  }
  else
  {
    $(".TTsliderCompanion").addClass("displaced").removeClass("full");
  }
}

function TTpushOrPullDrawer(currentDrawer, clickedHandleJQ)
{

  // to understand this function, it is helpful if you envision the drawers
  // as a chest of drawers, and we are moving our way from the bottom to the
  // top, making decisions about what to do with each drawer...  not sure why,
  // but its a bit of a brain twister...

  var currentWasClicked = (clickedHandleJQ.parent().attr("id") == currentDrawer.attr("id"));
  var currentIsOpen = currentDrawer.hasClass("open");


  if (currentWasClicked)
  {
    // this means we encountered the clicked drawer (as we work our
    // way from the bottom of the chest.

    // if the drawer is closed, we need to open it
    if (!currentIsOpen)
    {
      jqSDChangeToOpen.push(currentDrawer[0]);
    }
    else
    {
      //  the current drawer was the one that was clicked, and it was open.

      // in this awesome case, we need to know if the drawer above it in
      // the chest open or closed.  If the drawer above was open, we need to just
      // close the drawer above, and leave the current one open.  If it
      // was closed, we need to close all of the drawers.
      jqSDKeepOpen.push(currentDrawer[0]);
      bLastOneIsPending = true;
    }
    jqSDClickedDrawer = currentDrawer;
  }
  else if (jqSDClickedDrawer == undefined)
  {
    // this means we have not encountered the clicked drawer yet (as we
    // work our way from the bottom of the chest.

    // if the current drawer is open, need to leave it open (dont
    // take any action... leave it out of any change list).  If it is
    // closed, we need to open it because a higher closed drawer is
    // being opened.

    if (currentIsOpen)
    {
      //if the current drawer is open, need to leave it open (dont
      // take any action... leave it out of any change list).  Add
      // it to the keep open list incase we decide it needs to be closed
      // later because the whole chest was closed.
      jqSDKeepOpen.push(currentDrawer[0]);
    }
    else
    {
      // If the current drawer is closed, we need to open it because 
      // a higher closed drawer is being opened.
      jqSDChangeToOpen.push(currentDrawer[0]);
    }
  }
  else if (bLastOneIsPending)
  {
    // in this case, we are looking at a that is just above the clicked drawer
    // AND the clicked drawer was open.
    bLastOneIsPending = false; // reset this

    // if the current drawer is open, we need to close it and all of the drawers
    // above it.
    if (currentIsOpen)
    {
      jqSDChangeToClosed.push(currentDrawer[0]);
    }
    else
    {
      // if the current drawer is closed, that means the top-most drawer was open
      // and clicked.  Meaning, we need to close the entire chest because the
      // visible drawer was closed.
      jqSDKeepOpen.each(function ()
      {
        jqSDChangeToClosed.push($(this)[0]);
      });
    }
  }
  else if (currentIsOpen)
  {
    // we are looking at a drawer that is above the clicked drawer.  If it is open
    // it needs to be closed.  If it is closed, leave it alone.
    jqSDChangeToClosed.push(currentDrawer[0]);
  }
}

function TTadjustSliderChest(containerJQ)
{
  var panelOffsetTop = Math.round($("#sliderChest").offset().top);
  var sliderFrame = $("#sliderChest .TTsliderFrame");

  var windowScrollTop = containerJQ.scrollTop();
  var newPanelTop = 0;
  var newFrameHeight = 0;

  // need to adjust the slider frame (i.e. the thing that holds the drawers)
  // when the window scrolls or is resized.  We want to keep it under the header
  // when the header is visible, but want to freeze it in place when the 
  // window scrolls too high.
  if (windowScrollTop > panelOffsetTop)
  {
    newPanelTop = Math.round((windowScrollTop - panelOffsetTop));

    newFrameHeight = containerJQ.height();

    TTtreeDebugMessage('adjusting newPanelTop = windowScrollTop - panelOffsetTop: ' + newPanelTop + " = " + windowScrollTop + " - " + panelOffsetTop);
  }
  else
  {
    newFrameHeight = containerJQ.height() - panelOffsetTop + windowScrollTop;
  }

  TTtreeDebugMessage('keeping newPanelTop = windowScrollTop - panelOffsetTop: ' + newPanelTop + " = " + windowScrollTop + " - " + panelOffsetTop);

  sliderFrame.css("top", +newPanelTop + "px");
  sliderFrame.css("height", +newFrameHeight + "px");

}


