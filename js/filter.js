/*
 * Trump Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Donald Trump from the web page.
 */

// Variables
var regex = /Anime/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Anime'), :contains('ANIME'), :contains('anime')";


// Functions
function filterMild() {
	console.log("Filtering Anime with Mild filter...");
	return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering Anime with Default filter...");
	return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering Anime with Vindictive filter...");
	return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else if (filter == "aggro") {
	   return filterDefault();
   } else {
     return filterMild();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Anime found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", trumps: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " animes.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
