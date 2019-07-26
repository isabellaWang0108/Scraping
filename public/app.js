$(document).on("click", ".card", function() {
  var id=$(this).attr("value");
    window.location.href = "/articles/" + id;
  });

$(document).on("click", ".submit", function() {
  var id=$(this).attr("value");
  console.log($(this).siblings().val())
  $.ajax({
    method: "POST",
    url: "/articles/" + id,
    data: {
      note: $(this).siblings().val()
    }
  
  }).then(function(data) {
      console.log(data)
      alert("added successfully");
    });

  });
