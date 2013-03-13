//////////////////////////////////////////////////////////////////////////
// Generic testtube (TT) functions
// wireup stuff automatically
// if there are any popups on the page, this will automatically wire up events for them
TTwireUpPopupEvents();


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
//   slider panel functions
//////////////////////////////////////////////////////////////////////////
//// decomposing pretty cool example:
//// http://www.zocdoc.com/search.aspx?dr_specialty=98&address=Enter+a+City+and+State%2C+or+Zip&insurance_carrier=-1&insurance_plan=-1&button.x=166&button.y=21
//bindHeader: function () { 
//    var thisObj = this
//        , windowJQ = $(window)
//        , thisOffsetTop = thisObj.$el.offset().top
//        , newFuncName = "scroll." + thisObj.cid; 
//    thisObj.positionHeader(windowJQ, thisOffsetTop); 
//    windowJQ.unbind(newFuncName).bind(newFuncName, function () { 
//        thisObj.positionHeader(windowJQ, thisOffsetTop) }); 
//    return 
//}

//positionHeader: function (windowJQ, thisOffsetTop) { 
//    var thisObj = this
//        , windowScrollTop = windowJQ.scrollTop()
//        , b = 0
//        , fancyShadeUnderWhenSliding = "selector-header-overlap"; 
//    if (windowScrollTop > thisOffsetTop) { 
//        // if the window has scrolled up so our objects top would be less than the top
//        // of the window, set the new object top to window scroll top (which is probably 0)
//        // minus the object's top (which should be a negative)... effectively adding
//        // the difference to create the new top
//        b = windowScrollTop - thisOffsetTop; 
//        thisObj.$header.addClass(fancyShadeUnderWhenSliding) 
//    } 
//    else 
//        thisObj.$header.removeClass(fancyShadeUnderWhenSliding); 
//    thisObj.$header.css({ top: b + "px" }); 
//    return 
//}

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



//////////////////////////////////////////////////////////////////////////
//   popup functions
//////////////////////////////////////////////////////////////////////////
function TTshowTagInPopup(e, popupId)
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
  $(popupId).css('top', winH / 2 - $(popupId).height() / 2);
  $(popupId).css('left', winW / 2 - $(popupId).width() / 2);

  $(popupId).show();

  //transition effect
  $(popupId).fadeIn(2000);
}

function TTwireUpPopupEvents()
{
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
}


//////////////////////////////////////////////////////////////////////////
// Tree
//////////////////////////////////////////////////////////////////////////
var TTtreeDraggingElement;
var TTtreeHoverBorderStyle = '2px dashed #999';
var TTtreeNormalBorderStyle = '';

function TTtreeDebugMessage(s)
{
  var elStatus;

  if (!elStatus) elStatus = $('#TTtreeDebugMessage')[0];
  if (!elStatus) return;
  if (s) elStatus.innerHTML = 'TREE DEBUG:' + s;
  else elStatus.innerHTML = '&nbsp;';
}

function TTwireUpTree()
{
  TTtreeDebugMessage('Using HTML5 Drag and Drop');
  var treeDraggable = TTtreeDraggableElements();
  var treeDroppable = TTtreeDroppableElements();

  treeDraggable.bind("dragstart", function (e)
  {
    TThandleDragStart(e);
  });
  treeDraggable.bind("dragend", function (e)
  {
    TThandleDragEnd(e);
  });

  treeDroppable.bind("dragover", function (e)
  {
    TThandleDragOver(e);
  });
  treeDroppable.bind("dragenter", function (e)
  {
    TThandleDragEnter(e);
  });
  treeDroppable.bind("dragleave", function (e)
  {
    TThandleDragLeave(e);
  });
  treeDroppable.bind("drop", function (e)
  {
    TThandleDrop(e);
  });

  var treeNodes = $(".tree-node");

  // wire up the key up event.  These are the actions
  // taken when user releases the key...  such as enterkey to edit
  // and space bar to expand/collapse
  treeNodes.keyup(function (e)
  {
    TTtreeNodeKeyUp(e, $(this)[0]);
  });

  // wire up the key press event.  These are the actions that the
  // user might want to take many time while holding down the key
  // such as arrow up & down
  treeNodes.keydown(function (e)
  {
    TTtreeNodeKeyDown(e, $(this));
  });

  treeNodes.click(function (e)
  {
    TTtreeNodeClick(e, $(this));
  });

  TTreindexTree(9000);
}

function TTreindexTree(startingIndex, initialSelectionId)
{
  $(".tree-outer .tree-node").each(function (e)
  {
    $(this).attr("tabindex", startingIndex++);
  });

  var initialSelection = $("#" + initialSelectionId);
  if (initialSelection.length == 0)
  {
    initialSelection = $(".tree-outer:first .tree-node:first");
  }

  initialSelection[0].focus();

  //reset the expand/collapse commands
  //find all of the li's that contain tree nodes
  var nodeItems = $(".tree-node-list .tree-node-nav").parent().parent();

  nodeItems.each(function (e)
  {
    var innerList = $(this).children("ul.tree-node-list");

    if (innerList.length > 0)
    {
      // if the the LI node contains UL, its a parent, and needs an
      // expand/collapse control on it
      if (!innerList.isDisplayOn)
      {
        $(this).children(".tree-node").children(".tree-node-nav").addClass("TT-expanded");
      }
      else
      {
        $(this).children(".tree-node").children(".tree-node-nav").addClass("TT-collapsed");
      }
    }
    else
    {
      // if the the LI node does not contain UL, should not have an expand/collapse
      $(this).children(".tree-node").children(".tree-node-nav").removeClass("TT-expanded").removeClass("TT-collapsed");
    }
  });

  // TODO: probably a more efficient way to do this
  $('.tree-node-nav').off('click');
  $(".tree-node-nav.TT-expanded, .tree-node-nav.TT-collapsed").click(function (e)
  {
    TTtoggleTreeNode($(this).parent());
  });

}

function TTtreeDraggableElements()
{
  return $(".tree-node");
}

function TTtreeDroppableElements()
{
  return $(".tree-node, .tree-sibling-dropzone");
}

function TTtoggleTreeNode(jNode)
{
  var theList = jNode.next("ul")[0];
  var isDisplayOn = theList.style.display == "";
  theList.style.display = (isDisplayOn) ? 'none' : "";

  var navNode = jNode.children("div.tree-node-nav:first");
  if (isDisplayOn)
  {
    navNode.removeClass("TT-expanded").addClass("TT-collapsed");
  }
  else
  {
    navNode.removeClass("TT-collapsed").addClass("TT-expanded");
  }
}

var TTshouldSelectNext = false;

function TTtreeNodeClick(event, jqElement)
{
  var isShiftKey = event.shiftKey;
  var isControlKey = event.ctrlKey;

  var previousCurrentNode = $(".tree-node.current");

  if (isShiftKey)
  {
    // the shift key will select a range of nodes, but only works
    // if the parent of the selected node is the same as the 
    // currently selected node

    // start off my clearing everythign else
    $(".tree-node.selected").removeClass("selected");

    // parent.parent is the containing UL.  If they are the same, we are
    // working with nodes in the same list
    if (jqElement.parent().parent().attr("id") 
        == previousCurrentNode.parent().parent().attr("id"))
    {
      var siblingItems = jqElement.parent().parent().children().has(".tree-node");
      shouldSelectNext = false;

      siblingItems.each(function ()
      {
        //only take action if we are operating on a tree node
        var stopSelectingAfterThisOne = false;
        // if we hit either the clicked node or the original node,
        // need to change what we are doing

        var thisTreeNode = $(this).children(".tree-node");

        if (thisTreeNode.attr("id") == jqElement.attr("id") 
          && thisTreeNode.attr("id") == previousCurrentNode.attr("id"))
        {
          // if the currently selected node is the one that was clicked
          // need to select this one and stop selecting all others
          stopSelectingAfterThisOne = true;
          shouldSelectNext = true;
        }
        else
        {
          if ((thisTreeNode.attr("id") == jqElement.attr("id")) 
            || (thisTreeNode.attr("id") == previousCurrentNode.attr("id")))
          {
            if (shouldSelectNext)
            {
              //if we are in the mode of selecting items of the current
              // node was the one that was shift-clicked, we need
              //to select this item too, then transition off of selection mode
              stopSelectingAfterThisOne = true;
            }
            else
            {
              //if we have not started selecting yet, we need to start
              // selecting
              shouldSelectNext = true;
            }
          }
        }
        if (shouldSelectNext)
        {
          thisTreeNode.addClass("selected");
        }
        else
        {
          thisTreeNode.removeClass("selected");
        }
        if (stopSelectingAfterThisOne)
        {
          shouldSelectNext = false;
        }
      });
    }
  }
  else if (isControlKey)
  {
    // the control key is an exact multi-select.
    if (jqElement.hasClass("selected"))
    {
      jqElement.removeClass("selected");
    }
    else
    {
      jqElement.addClass("selected");
    }
  }
  else
  {
    // if this is not a multi-select request, clear all selected
    // elements and just be sure the current element is selected
    $(".tree-node.selected").removeClass("selected");
    jqElement.addClass("selected");
  }

  if (!isShiftKey)
  {
    // if this is not a shift-select, the clicked node should be the current node,
    // and there sould only ever be one
    previousCurrentNode.removeClass("current");
    jqElement.addClass("current");
  }
}

function TTtreeNodeKeyUp(event, element)
{
  event = event || window.event;
  var charCode = event.charCode || event.keyCode;

  var isShiftKey = event.shiftKey;

  if (charCode == 13)
  { // enter key, edit the row
    alert("Fix me to edit the row");
  }
  else if (charCode == 32)
  { // space bar, expand/contract tree node
    alert("Fix me to expand/contract");
  }
  else if (charCode == 45)
  { // insert key, create a child
    alert("Fix me to insert a new child");
  }
  else if (charCode == 46)
  { // delete key, warn and delete
    alert("Fix me to warn about the delete and delete");
  }
  else if (charCode == 40)
  { // down arrow key
    if (isShiftKey)
    {
      alert("Fix me to toggle selection of the current row and move to the next");
    }
  }
  else if (charCode == 38)
  { // up arrow key
    if (isShiftKey)
    {
      alert("Fix me to toggle selection of the current row and move to the previous");
    }
  }
  else if (charCode == 39)
  { //right arrow
    alert("Fix me to indent the current node");
  }
  else if (charCode == 37)
  { // left arrow
    alert("Fix me to un-indent");
  }
}

function TTtreeNodeKeyDown(event, jqNode)
{
  event = event || window.event;
  var charCode = event.charCode || event.keyCode;

  var isShiftKey = event.shiftKey;

  var cancelDefaultAction = false;

  if (charCode == 40)
  { // down arrow key
    if (!isShiftKey)
    {
      cancelDefaultAction = true;
      TTtreeStep(event, jqNode, false);
    }
  }
  else if (charCode == 38)
  { // up arrow key
    if (!isShiftKey)
    {
      cancelDefaultAction = true;
      TTtreeStep(event, jqNode, true);
    }
  }

  if (cancelDefaultAction)
  {
    event.preventDefault();
  }
}

function TTtreeStep(event, jqNode, isUp)
{
  // this should be the LI that contains the current node
  var containingLI = jqNode.parent();
  jqNode.removeClass("selected");

  // find the next node
  var nextLI = undefined;
  var nodeToSelect = undefined;

  if (isUp)
  {
    nextLI = containingLI.prev("li").has(".tree-node");
    if (nextLI.length == 0)
    {
      // if there was no big brother of this node, we have reached
      // the top of the current list.  Need to jump to the parent
      // of the containing list.  In this case, need to select the
      // node that represents the root of the list
      nodeToSelect = containingLI.parent().parent().children(".tree-node:visible:first");
      if (nodeToSelect.length == 0)
      {
        nodeToSelect = $(".tree-node:visible:last");
      }
    }
    else if (nextLI.has("ul").length > 0)
    {
      // if the chosen LI contains a UL, it is a parent.
      // when moving up, we need to select the lowest visible child 
      // instead of selecting the parent node
      nodeToSelect = nextLI.find(".tree-node:visible:last");
    }
    else
    {
      nodeToSelect = nextLI.children(".tree-node:visible");
    }
  }
  else // moving down, bit different
  {
    // if the current node has a UL in it, it is a root of another list
    // the first node in it should be selected
    nodeToSelect = containingLI.children("ul").find(".tree-node:visible:first");

    if (nodeToSelect.length == 0)
    {
      // the node was not a root of another list.  Get try to get the
      // next sibling instead
      nextLI = containingLI.next("li").has(".tree-node:visible");
      if (nextLI.length > 0)
      {
        // found a sibling, use it
        nodeToSelect = nextLI.children(".tree-node:visible");
      }
      else
      {
        // ran out of siblings to pick. go back up to the parent
        // and nav down from there
        nextLI = TTgetFirstUncleRecursively(containingLI);
        // must have hit the end of the list
        if (nextLI == undefined)
        {
          nodeToSelect = $(".tree-node:visible:first");
        }
        else
        {
          nodeToSelect = nextLI.children(".tree-node:visible");
        }
      }
    }
  }


  // mark the selected node as selected
  nodeToSelect.addClass("selected");
  nodeToSelect.focus();
}

function TTgetFirstUncleRecursively(nodeLI)
{
  // first parent is the UL...  next parent should be LI
  var parentLI = nodeLI.parent().parent("li");
  if (parentLI.length == 0)
  {
    return undefined;
  }
  
  var youngUncle = parentLI.next("li").has(".tree-node:first");
  if (youngUncle.length == 0)
  {
    return TTgetFirstUncleRecursively(parentLI);
  }

  return youngUncle;
}

function TThandleDragStart(e)
{
  TTtreeDraggingElement = e.currentTarget;
  $(TTtreeDraggingElement).addClass('moving');
  TTtreeDebugMessage('Drag ' + TTtreeDraggingElement.id);
  TTtreeDraggingElement.style.opacity = '0.5';
  TTtreeDraggingElement.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragEnd(e)
{
  e.currentTarget.style.opacity = '1.0';

  // reset the element style
  $(TTtreeDraggingElement).removeClass('moving');
  //TTtreeDraggingElement.className = undefined;
  TTtreeDraggingElement = undefined;

  var treeDraggable = TTtreeDraggableElements();
  var treeDroppable = TTtreeDroppableElements();

  // reset all of the elements
  for (var i = 0; i < treeDroppable.length; i++)
  {
    treeDroppable[i].style.border = TTtreeNormalBorderStyle;
  }
  for (var i = 0; i < treeDraggable.length; i++)
  {
    treeDraggable[i].style.border = TTtreeNormalBorderStyle;
  }
}

function TThandleDragOver(e)
{
  if (e.preventDefault) e.preventDefault();
  e.currentTarget.style.border = TTtreeHoverBorderStyle;

  return false; // some browsers may need this to prevent default action
}

function TThandleDragEnter(e)
{
  if (this !== TTtreeDraggingElement) 
  {
    TTtreeDebugMessage('Hover ' + TTtreeDraggingElement.id + ' over ' + this.id);
  }
  e.currentTarget.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragLeave(e)
{
  e.currentTarget.style.border = TTtreeNormalBorderStyle;
}

function TThandleDrop(e)
{
  if (e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
  if (e.preventDefault) e.preventDefault();
  TTdropInto(e.currentTarget, TTtreeDraggingElement);
}

// utility functions
function TTdropInto(into, droppingNode)
{

  if (into.id == droppingNode.id)
  {
    TTtreeDebugMessage('im not a snake');
    return;
  }
  TTtreeDebugMessage('dropped ' + droppingNode.id + ' into ' + into.id);

  var droppingNodeContainer = $(droppingNode).parent();
  var droppingNodeContainerParentList = $(droppingNodeContainer).parent();
  var intoNodeContainer = $(into).parent();

  // figure out what is being dropped into
  var jInto = $(into);
  if (jInto.hasClass("tree-sibling-dropzone"))
  {
    TTtreeDebugMessage('creating a sibling of ' + into.id);
    // in this case, the dragging tree node was dropped into a sibling
    // dropzone.  We need to find the parent of the dropzone, which is
    // an li that contains the new big brother of the dropped element.
    // we need to relocate the entire parent LI of the dropping node
    intoNodeContainer.after(droppingNodeContainer);
  }
  else if (jInto.hasClass("tree-node"))
  {
    TTtreeDebugMessage('creating a child of ' + into.id);
    // in this case, we are dragging into a node.  Add the dragged node
    // as a child of the into node.  If the into node is already a parent
    // (i.e. already has an associated UL), then just append the dropped
    // node as a new child. Otherwise, need to create a new UL for
    // the into node first.
    var intoNodeChildList = jInto.next("ul");
    if (intoNodeChildList.length == 1)
    {
      droppingNodeContainer.appendTo(intoNodeChildList);
    }
    else if (intoNodeChildList.length == 0)
    {
      intoNodeChildList = TTbuildNewTreeList();
      jInto.after(intoNodeChildList);
      droppingNodeContainer.appendTo(intoNodeChildList);
    }
    else
    {
      TTtreeDebugMessage(into.id + ' has more than one child list!?!?!?');
    }


  }
  else
  {
    TTtreeDebugMessage('HMMMM.... not sure what this is ' + into.id);
  }

  if (droppingNodeContainerParentList.children().length <= 1)
  {
    droppingNodeContainerParentList.remove();
  }

  TTreindexTree(9000, droppingNode.id);
}

var newListCounter = 1;

function TTbuildNewTreeList()
{
  //var retVal = $('<ul> \
  //    </ul>');
  var retVal = $('<ul class="tree-inner tree-node-list"> \
            <li> \
                <div class="tree-sibling-dropzone"> \
                    <div class="tree-node-nav"></div> \
                </div> \
            </li> \
        </ul>').attr("id", "newList_" + newListCounter++);
  return retVal;
}

