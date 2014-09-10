(function() {
  $(function() {
    var editor, language, runSnippet, running;
    NProgress.configure({
      showSpinner: false
    });
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/python");
    editor.getSession().setUseWrapMode(true);
    editor.setFontSize(14);
    editor.focus();
    editor.gotoLine(3);
    language = "python3";
    running = false;
    runSnippet = function() {
      var params;
      if (running) {
        return;
      }
      NProgress.start();
      running = true;
      $("#output-container").text("Running code snippet...");
      params = JSON.stringify({
        language: language,
        contents: editor.getValue()
      });
      return $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/snippet/run",
        dataType: "json",
        data: params,
        success: function(res) {
          var output;
          NProgress.done();
          output = res.data.output;
          if (res.data.timedOut) {
            output += "[Process timed out]\n";
          }
          if (res.data.truncated) {
            output += "[Output truncated]\n";
          }
          output += "Program exited with code " + res.data.exitCode;
          $('#output-container').text(output);
          return running = false;
        },
        error: function(res) {
          NProgress.done();
          console.log(res);
          $('#output-container').text("Unable to reach server!");
          return running = false;
        }
      });
    };
    editor.commands.addCommand({
      name: "runSnippet",
      exec: runSnippet,
      bindKey: {
        win: "Ctrl-Return",
        mac: "Command-Return"
      }
    });
    $('#run').on('click', runSnippet);
    $(".toggle-python").on("click", function(e) {
      e.preventDefault();
      editor.getSession().setMode("ace/mode/python");
      language = "python3";
      $(this).removeAttr("href");
      $(".toggle-scheme").attr("href", "#");
      return $(".toggle-logic").attr("href", "#");
    });
    $(".toggle-scheme").on("click", function(e) {
      e.preventDefault();
      editor.getSession().setMode("ace/mode/scheme");
      language = "scheme";
      $(this).removeAttr("href");
      $(".toggle-python").attr("href", "#");
      return $(".toggle-logic").attr("href", "#");
    });
    return $(".toggle-logic").on("click", function(e) {
      e.preventDefault();
      editor.getSession().setMode("ace/mode/scheme");
      language = "logic";
      $(this).removeAttr("href");
      $(".toggle-python").attr("href", "#");
      return $(".toggle-scheme").attr("href", "#");
    });
  });

}).call(this);