// Send a message containing the page details back to the event page
var pics = function() {
	var imgs = document.getElementsByTagName("img");
	var imgSrcs = "";

	for (var i = 0; i < imgs.length; i++) {
		imgSrcs += imgs[i].src + "\n" + "\n";
	}

	return imgSrcs;
};
chrome.runtime.sendMessage({
    'title': document.title,
	'pics': pics(),
    'url': window.location.href,
    'summary': window.getSelection().toString()
});