$(document).on("click", ".like", function() {
  var id=$(this).attr("value");
  $.ajax({
    method: "POST",
    url: "/api/"+id,
    data: {
      // Value taken from title input
      comment: $(".comment").val()
    }
  }).then(function(data) {
      // Log the response
      // console.log(data);
      alert("added successfully")
    });

  });

  $(document).on("click", ".delete", function() {
    var id=$(this).attr("id");
    $.ajax({
      method: "DELET",
      url: "/api/"+id
    }).then(function(data) {
      console.log(data)
      });
  
    });