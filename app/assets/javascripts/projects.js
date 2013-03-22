

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


