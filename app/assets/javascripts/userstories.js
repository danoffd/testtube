
// wire up the page when it is ready
$("document").ready(function () {

    TTwireUpTree(populateStoryEditor);

    var editBoxes = $(".tree-editor textarea");
    editBoxes.keyup(function (e)
    {
      treeEditorKeyUp(e, $(this));
    });

    editBoxes.keydown(function (e)
    {
      treeEditorKeyDown(e, $(this));
    });

    TTwireupRefinedListEvents("#story-editor-actor", "#story-editor-wantto");
    TTwireUpSliderChest();

    $("#story-editor-actor-input, #story-editor-wantto, #story-editor-soican").keyup(function (e) {
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

function treeEditorKeyDown(event, jqBox)
{
  event = event || window.event;
  var charCode = event.charCode || event.keyCode;
  if (charCode == 13)
  {
    // prevents rapid fire of return key
    event.preventDefault();
  }
}

function treeEditorKeyUp(event, jqBox)
{
  event = event || window.event;
  var charCode = event.charCode || event.keyCode;
  if (charCode == 13)
  {
    alert("do we even get here?");
  }
}

function populateStoryEditor(jqEditor, jqTreeNode)
{
  var actorName = $.trim(jqTreeNode.find(".story-actor").text());
  jqEditor.find("#story-editor-id").val(jqTreeNode.attr("data-storyid"));
  jqEditor.find("#story-editor-actor-input").val(actorName);
  jqEditor.find("#story-editor-wantto").val(jqTreeNode.find(".story-wantto").text());
  jqEditor.find("#story-editor-soican").val(jqTreeNode.find(".story-soican").text());

  // if the actor was blank, set focus to the actor input
  if (actorName == "")
  {
    jqEditor.find("#story-editor-actor-input").focus();
  }
  else
  {
    jqEditor.find("#story-editor-wantto").focus();
  }
}


//////////////////////////////////////////////////////////////////////////
// story editor function
//////////////////////////////////////////////////////////////////////////
function updateStorySummary() {
  var editorControl = $("#tree-editor");

  var actorName = $.trim($("#story-editor-actor-input").val());
  var wantto = $("#story-editor-wantto").val();
  var soican = $("#story-editor-soican").val();

  if (actorName == "")
  {
    actorName = "...";
  }

  var displayHtml = 'As a <span class="story-actor">' + actorName + '</span>';

  if (actorName != "")
  {
    if (wantto == "")
    {
      wantto = "...";
    }
    displayHtml += ' I want to <span class="story-wantto">' + wantto + '</span>'
  }

  if (soican != "")
  {
    displayHtml += ' so I can <span class="story-soican">' + soican + '</span>';
  }

  editorControl.find(".tree-node-body").html(displayHtml);
}

