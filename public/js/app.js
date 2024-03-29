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
    $("#questions-one").fadeOut(380);
    $("#main-question").fadeOut(380);
    $("#main-question-two").delay(420).fadeIn(400);
    $("#questions-two").delay(420).fadeIn(400);
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
    $("#questions-two").fadeOut(380);
    $("#main-question-two").fadeOut(380);
    $("#questions-three").fadeIn();
    $("#main-question-three").delay(420).fadeIn(400);
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

  $('.question').keyup(function(){
    var charLeft = 140 - $(this).val().length
    $(this).parent().prev().html(charLeft)
  })

  $('.org').keyup(function(){
    var text = $(this).val()
    $('#words').html(calculateWordCount(text))
  })

  function calculateWordCount(text) {
    var items = $.trim(text).split(' ')
    var words = 0
    for (var i = 0; i < items.length; i++) {
      if (items[i]) {
        words++;
      }
    }
    return words
  }

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