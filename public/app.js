$(document).on("click", ".submit", function() {
  var id=$(this).attr("value");
  console.log();
  $.ajax({
    method: "PUT",
    url: "/all/"+id,
    data: {
      // Value taken from title input
      comment: $(this).siblings().val(),
      title:$("h2").val()
    }
  }).then(function(data) {
      // Log the response
console.log(data)
      alert("added successfully");
    });

  });

  // $(document).on("click", ".delete", function() {
  //   var id=$(this).attr("id");
  //   $.ajax({
  //     method: "UPDATE",
  //     url: "/all/"+id
  //   }).then(function(data) {
  //     console.log(data)
  //     });
  
  //   });