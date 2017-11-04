var data = tinyQuery.getAll();

if (data.code !== '0') {
  $('#thanks').hide();

  var $sorry = $('#sorry');
  $sorry.show();

  if (data.code) {
  	$sorry.append('<p><small>Response code: <b>' + data.code + '</b></small></p>');
  }
  if (data.info) {
  	$sorry.append('<p><small>Response info: <b>' + data.info + '</b></small></p>');
  }
}
