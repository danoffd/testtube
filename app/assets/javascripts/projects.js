
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
    TTupdateProject(e, $(this));
  });

  $(".role-selector").change(function(e)
  {
    TTchangeProjectRole($(this), e);
  });
});

function TTupdateProject(event, jqSource)
{
  var jqForm = jqSource.parents("form");
  $.ajax(
  {
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    success: function(data) {alert("saved project");},
    error: function(jqXHR, stat, err) {alert("error saving project");}
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
    type: "put",
    url: "/project_users/" +  jqSelect.attr("datapuid"),
    data: changeForm.serialize(),
    success: function(data) {alert("changed role");},
    error: function(jqXHR, stat, err) {alert("error changing role");}
  });
}

function TTaddProjectUser(jqForm)
{
  $.ajax(
  {
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    success: function(data) {alert("added user");},
    error: function(jqXHR, stat, err) {alert("error adding user");}
  });
}

function TTcreateProject(jqForm)
{
  $.ajax(
  {
    type: jqForm.attr("method"),
    url: jqForm.attr("action"),
    data: jqForm.serialize(),
    success: function(data) {alert("created project");},
    error: function(jqXHR, stat, err) {alert("error creating project");}
  });
}

function TTremoveProjectUser(removeUserPath)
{
  $.ajax(
  {
    type: "delete",
    url: removeUserPath,
    success: function(data) {alert("removed projectUser");},
    error: function(jqXHR, stat, err) {alert("failed to remove user");}
  });
}

