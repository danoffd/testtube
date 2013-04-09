
$("document").ready(function () {
  $("#new-user-email").keyup(function (e) 
  {
    var emailRegEx = /\S+@\S+\.\S+/;
    if (emailRegEx.test($(this)[0].value))
    {
      $("#new-user-link").attr("href", "javascript: TTaddProjectUser($('#new-user-form'));");
    }
    else
    {
      $("#new-user-link").attr("href", "javascript:;");
    }
  });

  $(".project-changer").change(function(e)
  {
      TTupdateProject(e);
  });

  $(".project-changer-delay").keyup(function(e)
  {
    $(this).siblings(".delay-status").attr("src", "/assets/saving-animated.gif");
    TTfireAfterDelay(function()
    {
      TTupdateProject(e);
    }, 400);
  });

  $(".role-selector").change(function(e)
  {
    TTchangeProjectRole($(this), e);
  });
});

function TTupdateProject(event)
{
  var jqSource = $(event.currentTarget);
  var jqForm = jqSource.parents("form");
  $.ajax(
  {
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    success: function(data) { TTshowSaveSuccess(data); },
    error: function(jqXHR, stat, err) {alert("error saving project");}
  });
}

function TTshowSaveSuccess(data)
{
  var workingItems = $(".delay-status[src='/assets/saving-animated.gif']");
  workingItems.attr("src", "/assets/saved.png");
  workingItems.fadeOut(2000, function()
  {
    // workingItems.removeAttr("src");
    workingItems.attr("src", "/assets/nothingness.gif");

    // not sure why, but the saved image flashes back if we dont delay the reset...
    setTimeout(function () 
    {
      workingItems.show();
    }, 200);
    
  });
}

function TTchangeProjectRole(jqSelect, event)
{
  var changeForm = $("#change-project-user-form");
  changeForm.find("#role").attr("value"
      , $(jqSelect).find("option:selected").attr("value"));

  changeForm.find("#project_user_id").attr("value"
      , $(jqSelect).attr("datapuid"));

  $.ajax(
  {
    headers: { Accept : "text/javascript" },
    type: "put",
    url: "/project_users/" +  jqSelect.attr("datapuid"),
    data: changeForm.serialize(),
    error: function(jqXHR, stat, err) {alert("error changing role");}
  });
}

function TTaddProjectUser(jqForm)
{
  $.ajax(
  {
    headers: { Accept : "text/javascript" },
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    error: function(jqXHR, stat, err) {alert("error adding user");}
  });
}

function TTcreateProject(jqForm)
{
  $.ajax(
  {
    headers: { Accept : "text/javascript" },
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    error: function(jqXHR, stat, err) {alert("We encountered an error while creating the project.");}
  });
}

function TTremoveProjectUser(removeUserPath)
{
  $.ajax(
  {
    headers: { Accept : "text/javascript" },
    type: "delete",
    url: removeUserPath,
    error: function(jqXHR, stat, err) {alert("failed to remove user");}
  });
}

