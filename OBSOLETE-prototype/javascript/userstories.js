var dndSupported;    // true if drag and drop supported
var draggingElement;

var hoverBorderStyle = '2px dashed #999';
var normalBorderStyle = '';

//////////////////////////////////////////////////////////////////////////
//UTILITY FUNCTIONS
var elStatus;

function statusMessage(s) {
    if (!elStatus) elStatus = $('#statusMessage')[0];
    if (!elStatus) return;
    if (s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

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
// Initialization
function initTree() {
    var treeDraggable = treeDraggableElements();
    var treeDroppable = treeDroppableElements();
    statusMessage('Using HTML5 Drag and Drop');
    for (var i = 0; i < treeDraggable.length; i++) {
        treeDraggable[i].addEventListener('dragstart', handleDragStart, false);
        treeDraggable[i].addEventListener('dragend', handleDragEnd, false);
    }

    for (var i = 0; i < treeDroppable.length; i++) {
        treeDroppable[i].addEventListener('dragover', handleDragOver, false);
        treeDroppable[i].addEventListener('dragenter', handleDragEnter, false);
        treeDroppable[i].addEventListener('dragleave', handleDragLeave, false);
        treeDroppable[i].addEventListener('drop', handleDrop, false);
    }
}


//////////////////////////////////////////////////////////////////////////
// story editor function

function updateStorySummary() {
    $("#editorSummary")[0].innerHTML = 'As an <span class="story-actor">'
       + $("#edit-story-actor-input")[0].value
        + '</span> I want to <span class="story-wantto">'
        + $("#edit-story .edit-story-wantto")[0].value
        + '</span> so I can '
        + $("#edit-story .edit-story-soican")[0].value;
}

function refineActorSelector(event, inputBox, storyEditorId)
{
    var listId = storyEditorId + "-actor-selector"
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
    else if (isEnterKey){
        // enter key... close it up
        $(storyEditorId + " .story-wantto").focus();
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

function selectActorWithClick(e, clickedDiv, storyEditorId) {
    $(storyEditorId + "-actor-input")[0].value = clickedDiv[0].innerText;
    $(storyEditorId + " .story-wantto").focus();
}

function showStoryEditor(e, source) {

    //Get the A tag
    var storyEditorId = source.attr('href').split("?")[0];
    var mode = source.attr('href').split("?")[1];

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
    $(storyEditorId).css('top', winH / 2 - $(storyEditorId).height() / 2);
    $(storyEditorId).css('left', winW / 2 - $(storyEditorId).width() / 2);

    $(storyEditorId).show();

    if (mode == "edit") {
        $(storyEditorId + " .refined-list-results").css("display", "none");
        $(storyEditorId + " .story-wantto").focus();
    }
    else if (mode == "new") {
        //$(storyEditorId + " .refined-list-results").css("display", "block");
        $(storyEditorId + " .refined-list-input").focus();
    }


    //transition effect
    $(storyEditorId).fadeIn(2000);
}

//////////////////////////////////////////////////////////////////////////
//Tree control functions
function treeDraggableElements() {
    return $(".tree-draggable");
}

function treeDroppableElements() {
    return $(".tree-droppable");
}

function toggleTreeNode(targetId) {
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

function treeNodeKey(event, element) {
    event = event || window.event;
    var charCode = event.charCode || event.keyCode;

    if (charCode == 13) {
        alert("Fix me to edit the row");
    }
    if (charCode == 32) {
        alert("Fix me to expand/contract");
    }
}

function handleDragStart(e) {
    draggingElement = this;
    draggingElement.className = 'moving';
    statusMessage('Drag ' + this.id);
    this.style.opacity = '0.5';
    this.style.border = hoverBorderStyle;
}

function handleDragEnd(e) {
    this.style.opacity = '1.0';

    // reset the element style
    //draggingElement.className = undefined;
    draggingElement = undefined;

    var treeDraggable = treeDraggableElements();
    var treeDroppable = treeDroppableElements();

    // reset all of the elements
    for (var i = 0; i < treeDroppable.length; i++) {
        treeDroppable[i].style.border = normalBorderStyle;
    }
    for (var i = 0; i < treeDraggable.length; i++) {
        treeDraggable[i].style.border = normalBorderStyle;
    }
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle;

    return false;   // some browsers may need this to prevent default action
}

function handleDragEnter(e) {
    if (this !== draggingElement) statusMessage('Hover ' + draggingElement.id + ' over ' + this.id); 
    this.style.border = hoverBorderStyle;
}

function handleDragLeave(e) {
    this.style.border = normalBorderStyle;
}

function handleDrop(e) {
    if (e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if (e.preventDefault) e.preventDefault();
    dropInto(this, draggingElement);
}

// utility functions
function dropInto(into, dropping) {
    if (into.id == dropping.id) {
        statusMessage('im not a snake');
        return;
    }
    statusMessage('dropped ' + dropping.id + ' into ' + into.id);
}

function getRPSFooter(e) {
    var children = e.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName.toLowerCase() == 'footer') return children[i];
    }
    return undefined;
}

function getRPSImg(e) {
    var children = e.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName.toLowerCase() == 'img') return children[i];
    }
    return undefined;
}

