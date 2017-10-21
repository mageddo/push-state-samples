/**
* Based on article https://zinoui.com/blog/single-page-apps-html5-pushstate
*/
$(function () {

	/**
	 * Try to load a file with the passed URL in the 'data' folder
	 * then put it in the #content div
	 */
	function load (url) {
		console.debug('m=load, url=%s', url)
		$.get('data/' + url).done(function (data) {
				$("#content").html(data);
		}).fail(function(res){
			console.error('m=load, status=%d, err=%o', res.status, arguments);
			wrapIframe($("#content").empty(), '<h2>Error at load page "/' + url + '"</h2>' + res.responseText);
		})
	}
	
	/**
	 * handling all link clicks and  forwarding it to ajax calls
	 */
	$(document).on('click', 'a', function (e) {
			e.preventDefault();

			var $this = $(this),
					url = $this.attr("href"),
					title = $this.text();

			history.pushState({
					url: url,
					title: title
			}, title, url);

			// currently browsers does not consider the pushState title property
			// so we need to set it using document
			document.title = title;

			load(url);
	});

	// when a state change we must load the new page
	$(window).on('popstate', function (e) {
			var state = e.originalEvent.state;
			console.debug('m=onpopstate, state=%o', state)
			if (state !== null) {
					document.title = state.title;
					load(state.url);
			} else {
					document.title = 'World Regions';
					$("#content").html('No state to load');
			}
	});
	
	// just wrap the content with a iframe to prevent to get style from remote page
	function wrapIframe(parent, html){
		var ifr = $('<iframe frameborder="0" scrolling="yes" style="width:100%" />').get(0)
		parent.append(ifr);
		iframedoc = ifr.contentDocument || ifr.contentWindow.document;
		iframedoc.body.innerHTML = html
	}
	
	history.pushState({
		url: 'south-america',
		title: 'South America'
	}, 'South America', 'south-america');
	
});