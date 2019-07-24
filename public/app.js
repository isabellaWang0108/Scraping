$(document).on("click", ".submit", function() {
   
  $(".comment").append("<p>"+$(this).siblings().val()+"<button class='delete'>delet</button> </p>");

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