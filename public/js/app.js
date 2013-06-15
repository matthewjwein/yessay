$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

  $('#ready').click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions").delay(600).fadeIn(400);
    return false;
  })

  $("#next-question-two").click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions-one").fadeOut(400);
    $("#main-question").fadeOut(400);
    $("#main-question-two").delay(600).fadeIn(400);
    return false;
  })

  $('#ready-two').click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions-two").delay(600).fadeIn(400);
    return false;
  })

  $("#next-question-three").click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions-two").fadeOut(400);
    $("#main-question-two").fadeOut(400);
    $("#questions-three").hide();
    $("#main-question-three").delay(600).fadeIn(400);
    return false;
  })

  $('#ready-two').click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions-three").delay(600).fadeIn(400);
    return false;
  })

  $('#ready-three').click(function(e) {
    e.preventDefault();
    $(this).fadeOut(400);
    $("#questions-three").delay(600).fadeIn(400);
    return false;
  })

  $(document).delegate('#textbox', 'keydown', function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 9) {
      e.preventDefault();
      var start = $(this).get(0).selectionStart;
      var end = $(this).get(0).selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
        + "\t"
        + $(this).val().substring(end));

      // put caret at right position again
      $(this).get(0).selectionStart =
        $(this).get(0).selectionEnd = start + 1;
    }
  });
});