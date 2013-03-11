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
    TTtreeDebugMessage('Using HTML5 Drag and Drop');
    var treeDraggable = TTtreeDraggableElements();
    var treeDroppable = TTtreeDroppableElements();

    treeDraggable.bind("dragstart", function (e) {
        TThandleDragStart(e);
    });
    treeDraggable.bind("dragend", function (e) {
        TThandleDragEnd(e);
    });

    treeDroppable.bind("dragover", function (e) {
        TThandleDragOver(e);
    });
    treeDroppable.bind("dragenter", function (e) {
        TThandleDragEnter(e);
    });
    treeDroppable.bind("dragleave", function (e) {
        TThandleDragLeave(e);
    });
    treeDroppable.bind("drop", function (e) {
        TThandleDrop(e);
    });

    $(".tree-node").keyup(function (e) {
        TTtreeNodeKey(e, $(this)[0]);
    });

    TTreindexTree(9000);
}

function TTreindexTree(startingIndex, initialSelectionId) {
    $(".tree-outer .tree-node").each(function (e) {
        $(this).attr("tabindex", startingIndex++);
    });

    var initialSelection = $("#" + initialSelectionId);
    if (initialSelection.length == 0) {
        initialSelection = $(".tree-outer:first .tree-node:first");
    }

    initialSelection[0].focus();

    //reset the expand/collapse commands
    //find all of the li's that contain tree nodes
    var nodeItems = $(".tree-node-list .tree-node-nav").parent().parent();

    nodeItems.each(function (e) {
        var innerList = $(this).children("ul.tree-node-list");

        if (innerList.length > 0) {
            // if the the LI node contains UL, its a parent, and needs an
            // expand/collapse control on it
            if (!innerList.isDisplayOn) {
                $(this).children(".tree-node").children(".tree-node-nav").addClass("TT-expanded");
            }
            else{
                $(this).children(".tree-node").children(".tree-node-nav").addClass("TT-collapsed");
            }
        }
        else{
            // if the the LI node does not contain UL, should not have an expand/collapse
            $(this).children(".tree-node").children(".tree-node-nav").removeClass("TT-expanded").removeClass("TT-collapsed");
        }
    });

    // TODO: probably a more efficient way to do this
    $('.tree-node-nav').off('click');
    $(".tree-node-nav.TT-expanded, .tree-node-nav.TT-collapsed").click(function (e) {
        TTtoggleTreeNode($(this).parent());
    });

}

function TTtreeDraggableElements() {
    return $(".tree-node");
}

function TTtreeDroppableElements() {
    return $(".tree-node, .tree-sibling-dropzone");
}

function TTtoggleTreeNode(jNode) {
    var theList = jNode.next("ul")[0];
    var isDisplayOn = theList.style.display == "";
    theList.style.display = (isDisplayOn) ? 'none' : "";

    var navNode = jNode.children("div.tree-node-nav:first");
    if (isDisplayOn) {
        navNode.removeClass("TT-expanded").addClass("TT-collapsed");
    }
    else {
        navNode.removeClass("TT-collapsed").addClass("TT-expanded");
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
    TTtreeDraggingElement = e.currentTarget;
    $(TTtreeDraggingElement).addClass('moving');
    TTtreeDebugMessage('Drag ' + TTtreeDraggingElement.id);
    TTtreeDraggingElement.style.opacity = '0.5';
    TTtreeDraggingElement.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragEnd(e) {
    e.currentTarget.style.opacity = '1.0';

    // reset the element style
    $(TTtreeDraggingElement).removeClass('moving');
    //TTtreeDraggingElement.className = undefined;
    TTtreeDraggingElement = undefined;

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
    e.currentTarget.style.border = TTtreeHoverBorderStyle;

    return false;   // some browsers may need this to prevent default action
}

function TThandleDragEnter(e) {
    if (this !== TTtreeDraggingElement) TTtreeDebugMessage('Hover ' + TTtreeDraggingElement.id + ' over ' + this.id);
    e.currentTarget.style.border = TTtreeHoverBorderStyle;
}

function TThandleDragLeave(e) {
    e.currentTarget.style.border = TTtreeNormalBorderStyle;
}

function TThandleDrop(e) {
    if (e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if (e.preventDefault) e.preventDefault();
    TTdropInto(e.currentTarget, TTtreeDraggingElement);
}

// utility functions
function TTdropInto(into, droppingNode) {

    if (into.id == droppingNode.id) {
        TTtreeDebugMessage('im not a snake');
        return;
    }
    TTtreeDebugMessage('dropped ' + droppingNode.id + ' into ' + into.id);

    var droppingNodeContainer = $(droppingNode).parent();
    var droppingNodeContainerParentList = $(droppingNodeContainer).parent();
    var intoNodeContainer = $(into).parent();

    // figure out what is being dropped into
    var jInto = $(into);
    if (jInto.hasClass("tree-sibling-dropzone")) {
        TTtreeDebugMessage('creating a sibling of ' + into.id);
        // in this case, the dragging tree node was dropped into a sibling
        // dropzone.  We need to find the parent of the dropzone, which is
        // an li that contains the new big brother of the dropped element.
        // we need to relocate the entire parent LI of the dropping node
        intoNodeContainer.after(droppingNodeContainer);
    }
    else if (jInto.hasClass("tree-node")) {
        TTtreeDebugMessage('creating a child of ' + into.id);
        // in this case, we are dragging into a node.  Add the dragged node
        // as a child of the into node.  If the into node is already a parent
        // (i.e. already has an associated UL), then just append the dropped
        // node as a new child. Otherwise, need to create a new UL for
        // the into node first.
        var intoNodeChildList = jInto.next("ul");
        if (intoNodeChildList.length == 1) {
            droppingNodeContainer.appendTo(intoNodeChildList);
        }
        else if (intoNodeChildList.length == 0) {
            intoNodeChildList = TTbuildNewTreeList();
            jInto.after(intoNodeChildList);
            droppingNodeContainer.appendTo(intoNodeChildList);
        }
        else {
            TTtreeDebugMessage(into.id + ' has more than one child list!?!?!?');
        }


    }
    else {
        TTtreeDebugMessage('HMMMM.... not sure what this is ' + into.id);
    }

    if (droppingNodeContainerParentList.children().length <= 1) {
        droppingNodeContainerParentList.remove();
    }

    TTreindexTree(9000, droppingNode.id);
}

function TTbuildNewTreeList() {
    //var retVal = $('<ul> \
    //    </ul>');
    var retVal = $('<ul class="tree-inner tree-node-list"> \
            <li> \
                <div class="tree-sibling-dropzone"> \
                    <div class="tree-node-nav"></div> \
                </div> \
            </li> \
        </ul>');
    return retVal;
}

