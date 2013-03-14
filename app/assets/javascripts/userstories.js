﻿
// wire up the page when it is ready
$("document").ready(function () {

    TTwireUpTree(populateStoryEditor);
    TTwireupRefinedListEvents("#tree-editor-actor", "#story-editor-wantto");
    TTwireUpSliderChest();

    $("#story-editor-actor, #story-editor-wantto, #story-editor-soican").keyup(function (e) {
        updateStorySummary();
    });

    // dont allow return keys in the story components
    $('#edit-story textarea').keypress(function (e) {
        if (e.keyCode == 13) return false;
    });

    $("#newStoryLink").click(function (e) {
        //Cancel the link behavior
        e.preventDefault();

        //Get the A tag
        var storyEditorId = $(this).attr('href').split("?")[0];
        var mode = $(this).attr('href').split("?")[1];

        TTshowTagInPopup(e, storyEditorId);

        if (mode == "edit") {
            $(storyEditorId + " .TTrefined-list-results").css("display", "none");
            $(storyEditorId + " .story-wantto").focus();
        }
        else if (mode == "new") {
            $(storyEditorId + " .refined-list-input").focus();
        }

    });


});

function populateStoryEditor(jqEditor, jqTreeNode)
{
  jqEditor.find("#story-editor-actor").val(jqTreeNode.find(".story-actor").text());
  jqEditor.find("#story-editor-wantto").val(jqTreeNode.find(".story-wantto").text());
  jqEditor.find("#story-editor-soican").val(jqTreeNode.find(".story-soican").text());
}


//////////////////////////////////////////////////////////////////////////
// story editor function
//////////////////////////////////////////////////////////////////////////
function updateStorySummary() {
  var editorControl = $("#tree-editor");
  editorControl.find(".tree-node-body").html('As a <span class="story-actor">'
       + $("#story-editor-actor").val()
        + '</span> I want to <span class="story-wantto">'
        + $("#story-editor-wantto").val()
        + '</span> so I can <span class="story-soican">'
        + $("#story-editor-soican").val()
        + '</span>');
}

