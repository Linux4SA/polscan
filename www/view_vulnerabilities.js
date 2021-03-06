// vim: set ts=4 sw=4: 
// View for displaying vulnerabilities in a sortable table

views.VulnerabilitiesView = function VulnerabilitiesView(parentDiv) {
	this.parentDiv = parentDiv;
	this.filterOptions = {
		filterby: true,
		search: true
	};
};

var resultTableLoadTimeout;

function sortTable(id, sortOrder) {
	$('#loadmessage i').html('Sorting results...');
	console.log("Table setup done.");
	resultTableLoadTimeout = setTimeout(function() {
		try {
			$(id).tablesorter(sortOrder);
		} catch(e) {
		}
		console.log("Table sorting done.");
		$('#loadmessage').hide();
	}, 100);
}

function addVulnResultRows(rows, offset, count, sortOrder) {
	var r = "";
	for(var i = offset; i < offset+count; i++) {
		if(rows[i])
			r += "<tr>" + rows[i] + "</tr>";
	}
	$("#resultTable tbody").append(r);
	if(offset + count < rows.length) {
		resultTableLoadTimeout = setTimeout(function() {
			$('#loadmessage i').html('Loading results ('+Math.ceil(100*offset/rows.length)+'%)...');
			addVulnResultRows(rows, offset+count, count, sortOrder);
		}, 50);
	} else {
		// Enable table sorting
		if(sortOrder != null)
			sortTable("#resultTable", sortOrder);
		else
			$('#loadmessage').hide();
		// Enable clicking
//		$("#resultTable .host").click(function() {
//			setLocationHash({ sT: $(this).html()}, true);
//		});
	}
}

function vulnMatches(item) {
	if(params.sT &&
	  !((undefined !== item.host && item.host.indexOf(this.params.sT) != -1) ||
	    (undefined !== item.pkg && item.pkg.indexOf(this.params.sT) != -1)))
		return false;
	if(-1 == this.filteredHosts.indexOf(item.host))
		return false;
	return true;
}

function createVulnGroupTable(id, results) {

	clearTimeout(resultTableLoadTimeout);
	$('#loadmessage').show();
	$('.resultTable').empty();
	$('.resultTable').remove();
	$("<table id='resultTable' class='resultTable tablesorter' width='100%'>")
	.html("<thead><tr><th>Vulnerability</th><th>Package</th><th>Severity</th><th>Host Count</th><th>Hosts</th></thead><tbody/>")
	.appendTo(id);

	console.log("Grouping hosts by vulnerability");
	$('#loadmessage i').html("Grouping by CVE...");
	var view = this;
	var values = new Array(1000);
	view.hosts = new Array(1000);
	$.each(results.filter(vulnMatches, view), function( i, item ) {
	        var key = item.cve+"___"+item.pkg;
		if(values[key] === undefined)
			values[key] = item;
		if(view.hosts[key] === undefined)
			view.hosts[key] = new Array();
		view.hosts[key].push(item.host);
	});
	console.log("Parsing done.");

	var rows = new Array(250);
	for(var key in values) {
		rows.push('<td class="vulnerability"><a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name='+values[key].cve+'">'+ values[key].cve +'</a></td>' +
				'<td class="pkg"><a href="javascript:setLocationHash({ sT: \''+values[key].pkg+'\'}, true);">' + values[key].pkg + '</a></td>' +
				'<td>' + values[key].tags + '</td>' +
				'<td>' + view.hosts[key].length + '</td>' +
				'<td class="hosts"><a href="">Show List</a></td>');
	}
	$('#tableRow').width('100%');
	$('#loadmessage i').html("Sorting by CVE...");
	addVulnResultRows(rows.sort().reverse(), 0, 250, null);
}

views.VulnerabilitiesView.prototype.update = function(params) {
	var id = this.parentDiv;

	console.log("Fetching results start (search="+params.sT+")");
	clean();

	$('#loadmessage').show();
	$('#loadmessage i').html("Fetching data...");
	getData("vulnerabilities", function(data) {
		this.params = params;
		this.filteredHosts = get_hosts_filtered(params, false);

		$(id).append("<div id='tableRow' width='100%'/>");

		createVulnGroupTable('#tableRow', data.results);
	});
};
