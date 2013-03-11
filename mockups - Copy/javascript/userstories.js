
//////////////////////////////////////////////////////////////////////////
// story editor function
//////////////////////////////////////////////////////////////////////////
function updateStorySummary() {
    $("#editorSummary")[0].innerHTML = 'As an <span class="story-actor">'
       + $("#edit-story-actor .TTrefined-list-input")[0].value
        + '</span> I want to <span class="story-wantto">'
        + $("#edit-story .edit-story-wantto")[0].value
        + '</span> so I can '
        + $("#edit-story .edit-story-soican")[0].value;
}

//////////////////////////////////////////////////////////////////////////
//Tree control functions
