var queryStringData = tinyQuery.getAll();

if (queryStringData.code !== '0') {
  $('#thanks').hide();

  var responseInfo = ['code', 'info'].filter(function(d) {
			return queryStringData[d];
		})
		.map(function(d) {
			return '<p><small>Response ' + d + ': <b>' + queryStringData[d] + '</b></small></p>';
		})
		.join('');

  $('#sorry').show().append(responseInfo);
}
