var data = tinyQuery.getAll();

if (data.code !== '0') {
  $('#thanks').hide();

  var responseInfo = ['code', 'info'].filter(function(d) {
			return data[d];
		})
		.map(function(d) {
			return '<p><small>Response ' + d + ': <b>' + data[d] + '</b></small></p>';
		})
		.join('');

  $('#sorry').show().append(responseInfo);
}
