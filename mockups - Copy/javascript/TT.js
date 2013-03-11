//////////////////////////////////////////////////////////////////////////
// Generic testtube (TT) functions


// wireup stuff automatically

// if there are any popups on the page, this will automatically wire up events for them
TTwireUpPopupEvents();


//////////////////////////////////////////////////////////////////////////
//UTILITY FUNCTIONS
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length).toUpperCase() == str.toUpperCase();
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length).toUpperCase() == str.toUpperCase();
    };
}


//////////////////////////////////////////////////////////////////////////
//   Refined list control provides google-like selector functionality
//////////////////////////////////////////////////////////////////////////
function TTwireupRefinedListEvents(refinedListId, focusOnSelect) {
    $(refinedListId + " .TTrefined-list-input").keyup(function (e) {
        TTrefineListSelector(e, this, refinedListId, focusOnSelect);
    });

    $(refinedListId + " .TTrefined-list-input").focusout(function (e) {
        // this hack puts a delay on the focus out because it was beating the
        // click event
        window.setTimeout(function () { $(refinedListId + " .TTrefined-list-results").css("display", "none") }, 300);
    });

    $(refinedListId + " .TTrefined-list-input").focusin(function (e) {
        TTrefineListSelector(e, this, refinedListId, focusOnSelect);
    });

    $(refinedListId + " .TTrefined-list-results .result").mouseover(function (e) {
        $(this).addClass("selected");
    });

    $(refinedListId + " .TTrefined-list-results .result").mouseleave(function (e) {
        $(this).removeClass("selected");
    });

    $(refinedListId + " .TTrefined-list-results .result").click(function (e) {
        TTselectRefinedListWithClick(e, $(this), refinedListId, focusOnSelect);
    });
}

function TTrefineListSelector(event, inputBox, refinedListId, focusOnSelect) {
    var listId = refinedListId + " .TTrefined-list-results"
    listBox = $(listId);

    if (event.keyCode == undefined) {
        return;
    }

    var isUpKey = (event.keyCode == 38);
    var isDownKey = (event.keyCode == 40);
    var isEnterKey = (event.keyCode == 13);

    if (isDownKey || isUpKey) {
        // user hit the up or down arrow.  
        if (listBox.css("display") == "none") {
            // If list not displayed, just display it.  dont make a selection yet
            listBox.css("display", "block");
        }
        else {
            // If list was already displayed, figure out what should be highlighted
            var selectedResult = $(listId + " .selected");
            if (selectedResult.length == 0) {
                // nothing was selected, select the first or last based on the key
                if (isDownKey) {
                    newSelection = $(listId + " .result:visible:first");
                }
                else if (isUpKey) {
                    newSelection = $(listId + " .result:visible:last");
                }
            }
            else {
                // there was already a selected item, move the cursor
                if (isDownKey) {
                    var newSelection = selectedResult.nextAll(":visible");
                    if (newSelection.length == 0) {
                        newSelection = $(listId + " .result:visible:first");
                    }
                }
                else if (isUpKey) {
                    var newSelection = selectedResult.prevAll(":visible");
                    if (newSelection.length == 0) {
                        newSelection = $(listId + " .result:visible:last");
                    }
                }
                selectedResult.removeClass("selected");
            }
            newSelection.addClass("selected");
            inputBox.value = newSelection[0].innerText;
        }
    }
    else if (isEnterKey) {
        // enter key... close it up
        $(focusOnSelect).focus();
    }
    else {
        // a key was typed in.  Make the selector go to that entry
        listBox.css("display", "block");
        $(listId + " > div.result").each(function (e) {
            var currentDiv = $(this);
            if (inputBox.value == "" || currentDiv[0].innerText.startsWith(inputBox.value)) {
                currentDiv.css("display", "block");
            }
            else {
                currentDiv.css("display", "none");
            }
        });
    }
}

function TTselectRefinedListWithClick(e, clickedDiv, refinedListId, focusOnSelect) {
    $(refinedListId + " .TTrefined-list-input")[0].value = clickedDiv[0].innerText;
    $(refinedListId + " .TTrefined-list-results").css("display", "none");
    $(focusOnSelect).focus();
}



//////////////////////////////////////////////////////////////////////////
//   popup functions
//////////////////////////////////////////////////////////////////////////
function TTshowTagInPopup(e, popupId) {

    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    //Set heigth and width to mask to fill up the whole screen
    $('#mask').css({ 'width': maskWidth, 'height': maskHeight });

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

function TTwireUpPopupEvents() {
    $(window).resize(function () {

        //Get the screen height and width
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        //Set height and width to mask to fill up the whole screen
        $('#mask').css({ 'width': maskWidth, 'height': maskHeight });

        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();

        //Set the popup window to center
        $('.TTpopup').each(function(){
            $(this).css({
                'top': winH / 2 - $(this).height() / 2
            , 'left': winW / 2 - $(this).width() / 2})
        });

    });
}


//////////////////////////////////////////////////////////////////////////
// Tree
//////////////////////////////////////////////////////////////////////////
var TTtreeDraggingElement;
var TTtreeHoverBorderStyle = '2px dashed #999';
var TTtreeNormalBorderStyle = '';

function TTtreeDebugMessage(s) {
    var elStatus;

    if (!elStatus) elStatus = $('#TTtreeDebugMessage')[0];
    if (!elStatus) return;
    if (s) elStatus.innerHTML = 'TREE DEBUG:' + s;
    else elStatus.innerHTML = '&nbsp;';
}

function TTwireUpTree() {
    var treeDraggable = TTtreeDraggableElements();
    var treeDroppable = TTtreeDroppableElements();
    TTtreeDebugMessage('Using HTML5 Drag and Drop');
    for (var i = 0; i < treeDraggable.length; i++) {
        treeDraggable[i].addEventListener('dragstart', TThandleDragStart, false);
        treeDraggable[i].addEventListener('dragend', TThandleDragEnd, false);
    }

    for (var i = 0; i < treeDroppable.length; i++) {
        treeDroppable[i].addEventListener('dragover', TThandleDragOver, false);
        treeDroppable[i].addEventListener('dragenter', TThandleDragEnter, false);
        treeDroppable[i].addEventListener('dragleave', TThandleDragLeave, false);
        treeDroppable[i].addEventListener('drop', TThandleDrop, false);
    }
}

function TTtreeDraggableElements() {
    return $(".tree-draggable");
}

function TTtreeDroppableElements() {
    return $(".tree-droppable");
}

function TTtoggleTreeNode(targetId) {
    var parentJqueryId = '#' + targetId;
    var theParent = $(parentJqueryId)[0];
    var theList = $(parentJqueryId + " ul:first")[0];
    var isDisplayOn = theList.style.display == "";
    theList.style.display = (isDisplayOn) ? 'none' : "";

    var theExpandCollapseDiv = $(parentJqueryId + " > a:first > div:first")[0];
    if (!isDisplayOn) {
        theExpandCollapseDiv.className = 'tree-node-command tree-node-nav-leaf-collapse';
    }
    else {
        theExpandCollapseDiv.className = 'tree-node-command tree-node-nav-leaf-expand';
    }
}

function TTtreeNodeKey(event, element) {
    event = event || window.event;
    var charCode = event.charCode || event.keyCode;

    if (charCode == 13) {
        alert("Fix me to edit the row");
    }
    if (charCode == 32) {
        alert("Fix me to expand/contract");
    }
}

function TThandleDragStart(e) {
    TTtreeDraggingelement = this;
    TTtreeDraggingelement.className = 'moving';
    TTtreeDebugMessage('Drag ' + this.id);
    this.style.opacity = '0.5';
    this.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragEnd(e) {
    this.style.opacity = '1.0';

    // reset the element style
    //TTtreeDraggingelement.className = undefined;
    TTtreeDraggingelement = undefined;

    var treeDraggable = TTtreeDraggableElements();
    var treeDroppable = TTtreeDroppableElements();

    // reset all of the elements
    for (var i = 0; i < treeDroppable.length; i++) {
        treeDroppable[i].style.border = TTtreeNormalBorderStyle;
    }
    for (var i = 0; i < treeDraggable.length; i++) {
        treeDraggable[i].style.border = TTtreeNormalBorderStyle;
    }
}

function TThandleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    this.style.border = TTtreeHoverBorderStyle;

    return false;   // some browsers may need this to prevent default action
}

function TThandleDragEnter(e) {
    if (this !== TTtreeDraggingelement) TTtreeDebugMessage('Hover ' + TTtreeDraggingelement.id + ' over ' + this.id);
    this.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragLeave(e) {
    this.style.border = TTtreeNormalBorderStyle;
}

function TThandleDrop(e) {
    if (e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if (e.preventDefault) e.preventDefault();
    TTdropInto(this, TTtreeDraggingelement);
}

// utility functions
function TTdropInto(into, dropping) {
    if (into.id == dropping.id) {
        TTtreeDebugMessage('im not a snake');
        return;
    }
    TTtreeDebugMessage('dropped ' + dropping.id + ' into ' + into.id);
}


