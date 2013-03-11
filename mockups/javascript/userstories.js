
// wire up the page when it is ready
$("document").ready(function () {

    TTwireUpTree();
    TTwireupRefinedListEvents("#edit-story-actor", "#edit-story .edit-story-wantto");
    TTwireUpSliderChest();

    $("#edit-story-actor .TTrefined-list-input, #edit-story .edit-story-wantto, #edit-story .edit-story-soican").keyup(function (e) {
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



//////////////////////////////////////////////////////////////////////////
// story editor function
//////////////////////////////////////////////////////////////////////////
function updateStorySummary() {
    $("#editorSummary")[0].innerHTML = 'As an <span class="story-actor">'
       + $("#edit-story-actor .TTrefined-list-input")[0].value
        + '</span> I want to <span class="text-standout">'
        + $("#edit-story .edit-story-wantto")[0].value
        + '</span> so I can '
        + $("#edit-story .edit-story-soican")[0].value;
}

//////////////////////////////////////////////////////////////////////////
//Tree control functions
