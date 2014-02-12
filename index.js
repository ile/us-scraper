/*
 * Uusi Suomi Scraper
 * 
 * (C) Ilkka Huotari
 */

var jsdom = require("jsdom"),
	fs = require("fs"),
	request = require("request"),
	jquery = fs.readFileSync("./jquery.js", "utf-8"),
	links = [],
	MAX_ITEMS = 150,

	// these are example data - replace wth real
	// get the read data from headers
	readlists = [
		{
			title: "Oikkonen 1",
			"url": 'http://readlists.com/api/v1/readlists/c2ded02f/entries/',
			headers: {
				"Cookie":"sessionid=xxxxxxxxxx; csrftoken=xxxxxxxxxx; __utma=205737104.878159197.1392166653.1392209871.1392219887.4; __utmb=205737104.16.10.1392219887; __utmc=205737104; __utmz=205737104.1392166653.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)",
				"Referer":"http://readlists.com/c2ded02f/",
				"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1825.4 Safari/537.36",
				"X-CSRFToken":"xxxxxxxxxx",
				"X-Requested-With":"XMLHttpRequest"
			},
			json: {"readlist":{"is_from_edit_id":false,"entries":[null],"class":"sharing","readlist_title":"Oikkonen 1","date_added":"2014-02-12T13:19:48","date_featured":null,"date_updated":"2014-02-12T13:19:48","description":"","edit_id":"xxxxxxxxxx","id":"c2ded02f","is_owner":true,"resource_uri":"/api/v1/readlists/c2ded02f/","user":{"avatar_url":"https://secure.gravatar.com/avatar/97619a7123afbc1d5895e8646f0a3e08?d=https://d370mdr42phnax.cloudfront.net/avatar/defaultavatar-de3c15.png&s=640","first_name":"","id":"14102","is_owner":true,"kindle_email_address":"ilkkah","last_name":"","resource_uri":"/api/v1/user/14102/","username":"badding"}},"article_url":""}
		},

		{
			title: "Oikkonen 2",
			"url": 'http://readlists.com/api/v1/readlists/5fd671c1/entries/',
			headers: {
				"Cookie":"sessionid=xxxxxxxxxx; csrftoken=xxxxxxxxxx; __utma=205737104.878159197.1392166653.1392209871.1392219887.4; __utmb=205737104.16.10.1392219887; __utmc=205737104; __utmz=205737104.1392166653.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)",
				"Referer":"http://readlists.com/5fd671c1/",
				"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1825.4 Safari/537.36",
				"X-CSRFToken":"xxxxxxxxxx",
				"X-Requested-With":"XMLHttpRequest"
			},
			json: {"readlist":{"is_from_edit_id":false,"entries":[null],"class":"sharing","readlist_title":"Oikkonen 2","date_added":"2014-02-12T13:19:59","date_featured":null,"date_updated":"2014-02-12T13:19:59","description":"","edit_id":"5fd671c1d0044246b977039a6b552db5","id":"5fd671c1","is_owner":true,"resource_uri":"/api/v1/readlists/5fd671c1/","user":{"avatar_url":"https://secure.gravatar.com/avatar/97619a7123afbc1d5895e8646f0a3e08?d=https://d370mdr42phnax.cloudfront.net/avatar/defaultavatar-de3c15.png&s=640","first_name":"","id":"14102","is_owner":true,"kindle_email_address":"ilkkah","last_name":"","resource_uri":"/api/v1/user/14102/","username":"badding"}},"article_url":""}
		},

		{
			title: "Oikkonen 3",
			"url": 'http://readlists.com/api/v1/readlists/20c947b6/entries/',
			headers: {
				"Cookie":"sessionid=xxxxxxxxxx; csrftoken=xxxxxxxxxx; __utma=205737104.878159197.1392166653.1392209871.1392219887.4; __utmb=205737104.16.10.1392219887; __utmc=205737104; __utmz=205737104.1392166653.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)",
				"Referer":"http://readlists.com/20c947b6/",
				"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1825.4 Safari/537.36",
				"X-CSRFToken":"xxxxxxxxxx",
				"X-Requested-With":"XMLHttpRequest"
			},
			json: {"readlist":{"is_from_edit_id":false,"entries":[null],"class":"sharing","readlist_title":"Oikkonen 3","date_added":"2014-02-12T13:20:06","date_featured":null,"date_updated":"2014-02-12T13:20:06","description":"","edit_id":"20c947b6043a48ffad909cbfa1fdfed0","id":"20c947b6","is_owner":true,"resource_uri":"/api/v1/readlists/20c947b6/","user":{"avatar_url":"https://secure.gravatar.com/avatar/97619a7123afbc1d5895e8646f0a3e08?d=https://d370mdr42phnax.cloudfront.net/avatar/defaultavatar-de3c15.png&s=640","first_name":"","id":"14102","is_owner":true,"kindle_email_address":"ilkkah","last_name":"","resource_uri":"/api/v1/user/14102/","username":"badding"}},"article_url":"http://kuinkakarlmarxtavataan.puheenvuoro.uusisuomi.fi/156416-naamareita-ja-s%C3%A4rkyv%C3%A4%C3%A4-lasia"}
		}

	]



function usage() {
	console.log('\nScrape usage');
	console.log('\tnode index.js scrape <url>\n');
}

function send(listNum, i) {
	listNum = listNum || 0;
	i = i || 0;
	var list = readlists[listNum],
		url = links[i];

	var body = list.json;

	if (url) {
		body.article_url = url;
		console.log(list.title + ': ' + url);

		var options = {
			url: list.url,
			method: 'POST',
			headers: list.headers,
			body: body,
			json: true
		}

		request(options);
		i = i + 1;

		if (i % MAX_ITEMS === 0 && readlists[listNum + 1]) {
			listNum++;
		}

		setTimeout(function() { send(listNum, i); }, 5000);
	}
}

function get(url) {
	console.log('get '+url);

	jsdom.env({
	  url: url,
	  src: [ jquery ],
	  done: function (errors, window) {
	  	var $ = window.$;

	    var l = $("#main-content .view-content .teaser h2 a")

	    l.each( function(index) { 
	    	links.push(this.href);
	    });

	    var next = $("#main-content .pager-next a").first()
	    if (next && next[0]) {
	    	get(next[0].href);	
	    }
	    else {
	    	links = links.reverse();
	    	send();
	    }
	  }
	});
}

(function main() {
	var url;

	if (process.argv.length !== 3) {
		usage();
		process.exit(1);
	}
	
	url = process.argv[2];
	get(url);

}());

