/**
 *
 *	File:	jurlp.js
 *
 *	Title:	JQuery URL parser.
 *
 * 	JQuery URL parser plugin for parsing, manipulating, filtering and monitoring URLs in href and src attributes within arbitrary elements (including document.location.href), as well as creating anchor elements from URLs found in HTML/text.
 *
 *	About: Authors
 *
 *	Thomas James Bonner (tom.bonner@gmail.com).
 *
 *	Yonas Sandb�k (seltar@gmail.com).
 *
 *	About: Version
 *
 *	1.0.4
 *
 *	About: License
 *
 *	Copyright (C) 2012, Thomas James Bonner (tom.bonner@gmail.com).
 *
 *	MIT License:
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *	- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 **/ 

/**
 *
 *	Section: URL overview.
 *
 *	URL naming scheme:
 *
 *	A quick quide to URL nomenclature in this plugin.
 *
 *	Throughout this plugin, URLs are segmented and refered to in the following manner;
 *
 *	> http://username:password@www.example.com:443/path/file.name?query=string#anchor
 *	> |_____||______| |______| |_____________| |_||_____________||___________||_____|
 *	>    |       |       |           |          |         |             |         |
 *	> scheme   user   password      host       port      path         query   fragment
 *	> |______________________________________________________________________________|
 *	>                                        |
 *  >                                       url
 *
 *	Scheme:
 *
 *	Contains the protocol identifier (i.e. "https://", "ftp://").
 *
 *	User:
 *
 *	Conains the username to use when connecting to the host server. This segment may be empty.
 *
 *	Password:
 *
 *	Contains the password to use in conjunction with the username when connecting to the remote server. This segment may be empty (and cannot be set without a user name).
 *
 *	Host:
 *
 *	Contains the name or IP address of the host server (i.e. "www.example.com", or "127.0.0.1").
 *
 *	Port:
 *
 *	Contains the listening port number for the host server (i.e. "80", or "8080"). Note that an empty port value implies the default port (80).
 *
 *	Path:
 *
 *	Contains the file path (i.e. "/index.html", or "/").
 *
 *	Query:
 *
 *	Contains any parameters passed in the query (i.e. "?param1=value1&param2=value2"). This segment may be empty.
 *
 *	Fragment:
 *
 *	Contains any anchors/hash tags (i.e. "#elementname"). This segment may be empty.
 *
 *	Section: URL Objects
 *
 *	URL object definition.
 *
 *	For the purposes of this plugin, URLs can be represented either as a string, for example "http://www.example.com:8080/path/file.name?query=string#anchor", or as an object;
 *
 *	(start code)
 *
 *	{
 *		scheme: "http://"
 *		user: "username",
 *		password: "password",
 *		host: "www.example.com",
 *		port: "8080",
 *		path: "/path/file.name",
 *		query: "?query=string",
 *		fragment: "#anchor" 
 *	}
 *
 *	(end code)
 *
 *	Therefore, wherever URLs are supplied as a parameter to the plugin via the <url> or <proxy> methods, either a string or object representation or the URL may be supplied.
 *
 *	URL objects that have been returned via the parser interface can easily be converted to a string by calling the objects toString() method. 
 *
 *	Example:
 *
 *	(start code)
 *
 *	// Parse the document.location.href URL, and convert it back to a string again.
 *	$(document).jurlp("url").toString();
 *
 *	(end code)
 *
 */
 
/**
 *
 *	Section: Quick overview
 *
 *	Useful example code.
 *
 *	(start code)
 *
 *	// Parse and set the element(s) URL
 *	$("a").jurlp("url");
 *	$("a").jurlp("url", "http://www.example.com/");
 *	
 *	// Get or set individual URL segments for the element(s)
 *	$("a").jurlp("scheme");
 *	$("a").jurlp("scheme", "https://");
 *
 *	$("a").jurlp("user");
 *	$("a").jurlp("user", "username");
 *
 *	$("a").jurlp("password");
 *	$("a").jurlp("password", "password");
 *
 *	$("a").jurlp("host");
 *	$("a").jurlp("host", "www.example.com");
 *	
 *	$("a").jurlp("port");
 *	$("a").jurlp("port", "8080");
 *	
 *	$("a").jurlp("path");
 *	$("a").jurlp("path", "../file.name");
 *	
 *	$("a").jurlp("query");
 *	$("a").jurlp("query", {"param":"value"});
 *	
 *	$("a").jurlp("fragment");
 *	$("a").jurlp("fragment", "elementid");
 *	
 *	// Filter on URL segments
 *	$("a").jurlp("filter", "scheme", "^=", "http")
 *	      .jurlp("filter", "user", "=", "user")
 *	      .jurlp("filter", "password", "=", "password")
 *	      .jurlp("filter", "host", "=", "www.example.com")
 *	      .jurlp("filter", "port", "!=", "8080")
 *	      .jurlp("filter", "path", "$=", ".html")
 *	      .jurlp("filter", "query", "*=", "param=value")
 *	      .jurlp("filter", "fragment", "regex", /(\#)/);
 *	
 *	// Watch a selector for new nodes
 *	$("a:eq(0)").jurlp("watch", function(element, selector){})
 *	            .jurlp("filter", "host", "=", "www.example.com")
 *	            .jurlp("query",{"found":"example"});
 *	
 *	$("body").prepend("<a href='http://www.example.com/'></a>");
 *	
 *	$("a:eq(0)").jurlp("unwatch");
 *	
 *	// Parse an element's text for URLs and create/return anchor elements
 *	$("<div>www.example.com</div>").jurlp();
 *
 *	// Get an interface for parsing/manipulating the supplied URL
 *	url = $.jurlp("http://www.example.com:80/path/file.name?param1=value1#fragment");
 *
 *	// Parse the URL to an object.
 *	url.url();
 *
 *	// Get the URL scheme.
 *	url.scheme();
 *
 *	// Get the URL user name.
 *	url.user();
 *
 *	// Get the URL password.
 *	url.password();
 *
 *	// Get the URL host.
 *	url.host();
 *
 *	// Get the URL port.
 *	url.port();
 *
 *	// Get the URL path.
 *	url.path();
 *
 *	// Get the URL query.
 *	url.query();
 *
 *	// Get a specific parameter value from the URL query.
 *	url.query().param1;
 *
 *	// Get the URL fragment.
 *	url.fragment();
 *
 *	// Set the full URL.
 *	url.url("http://www.example.com:80/path/file.name?param1=value1#fragment");
 *
 *	// Set the URL scheme.
 *	url.scheme("https://");
 *
 *	// Set the URL user name.
 *	url.user("user");
 *
 *	// Set the URL password.
 *	url.password("password");
 *
 *	// Set the URL host.
 *	url.host("www.newexample.com");
 *
 *	// Set the URL port.
 *	url.port("80");
 *
 *	// Set the URL path.
 *	url.path("/newpath/newfile.file");
 *
 *	// Append to the URL path.
 *	url.path("./newfile.file");
 *
 *	// Remove two path elements and append to the URL path.
 *	url.path("../../newfile.file");
 *
 *	// Set the URL query.
 *	url.query("?param=value");
 *
 *	// Append/modify the URL query (string or object)
 *	url.query("param=value");
 *	url.query({"param":"value"});
 *
 *	// Remove the URL query
 *	url.query("");
 *	url.query({});
 *
 *	// Set the URL fragment.
 *	url.fragment("#newfragment");
 *
 *	(end code)
 *
 **/

/**
 *	Section: Parsing document.location.href
 *
 *	Parsing the document URL.
 *
 *	The document URL (document.location.href) can be parsed by specifying the HTML document element to the parser in the following manner;
 *
 *	(start code)
 *
 *	// Parse the document.location.href URL string into a URL object
 *	$(document).jurlp("url");
 *
 *	(end code)
 *
 *	Similarly, the document URL can be modified by the plugin, but it is worth noting that changes will not be directly applied to document.location.href until <goto> is explicitly called on the element, and instead, a working copy of the URL is stored under the documents "data-href" attribute.
 *
 *	(start code)
 *
 *	// Does not modify document.location.href (updates $(document).data("href"))
 *	$(document).jurlp("url", "www.example.com");
 *
 *	// Does modify document.location.href (from $(document).data("href"))
 *	$(document).jurlp("goto");
 *
 *	(end code)
 *
 */
 
/**
 *	Section: Parsing elements with an "href" or "src" attribute.
 *
 *	Parsing "href" or "src" attributes.
 *
 *	Elements with an "href" or "src" attribute (i.e. <a href="">, <base href="">, <link href="">, <img src="">, <script src=""> or <iframe src="">), can be parsed by specifying the element(s) to the parser in the following manner;
 *
 *	(start code)
 *
 *	// Parse all anchor element URLs into an array
 *	$("a").jurlp("url");
 *
 *	(end code)
 *
 *	Any modifications made to the URL will modify the relevant "href" or "src" attribute directly. If you want to visit the URL within an elements "href" or "src" attribute, it is possible to call <goto> on the element.
 *
 *	(start code)
 *
 *	// Directly set the first anchor elements URL, and then goto it!
 *	$("a:eq(0)").jurlp("url", "www.example.com").jurlp("goto");
 *
 *	(end code)
 *
 */

/**
 *	Section: Parsing element text/HTML.
 *
 *	Parsing text/HTML for URLs.
 *
 *	It is possible for the URL parser to find URLs within text/HTML, and convert them into HTML anchor elements.
 *
 *	(start code)
 *
 *	// Parse the HTML for URLs, and convert all URLs found in the text to anchors.
 *	$("<div>Here are URLs: www.example1.com, www.example2.com</div>").jurlp();
 *
 *	// HTML becomes:
 *	<div>
 *		Here are URLs: 
 *		<a href="http://www.example1.com/" class="jurlp-no-watch">www.example1.com</a>, 
 *		<a href="http://www.example2.com/" class="jurlp-no-watch">www.example2.com</a>
 *	</div>
 *	(end code)
 *
 **/
 
/**
 *	Section: Parsing URL strings directly.
 *
 *	How to directly parse, modify or monitor an arbitrary URL string.
 *
 *	(start code)
 *
 *	// Get an interface for parsing the document URL...
 *	var url = $.jurlp();
 *
 *	// .. or get an interface for parsing your own URL.
 *	url = $.jurlp("www.example.com");
 *
 *	// Parse the URL to an object.
 *	url.url();
 *
 *	// Get the URL scheme.
 *	url.scheme();
 *
 *	// Get the URL host.
 *	url.host();
 *
 *	// Get the URL port.
 *	url.port();
 *
 *	// Get the URL path.
 *	url.path();
 *
 *	// Get the URL query.
 *	url.query();
 *
 *	// Get a specific parameter value from the URL query.
 *	url.query().parameter;
 *
 *	// Get the URL fragment.
 *	url.fragment();
 *
 *	// Create a watch for new URLs that contain "example.com" in the host name
 *	var watch = $.jurlp("example.com").watch(function(element, selector){
 *		console.log("Found example.com URL!", element, selector);
 *	});
 *
 *	// We can even apply filters to the watch to be sure!
 *	watch.jurlp("filter", "host", "*=", "example.com");
 *
 *	// Append a new URL, which will trigger the watch
 *	$("body").append("<a href=\"www.example.com\"></a>");
 *
 *	// Stop watching for "example.com" URLs.
 *	watch.jurlp("unwatch");
 *
 *	(end code)
 *
 */
 
/**
 *	Section: Unknown URLs.
 *
 *	Overview of unknown URL parsing.
 *
 *	Unknown scheme:
 *
 *	The parser will attempt to parse any type of URL it encounters based on its scheme. However, not all URLs are parsable, for example "spotify:track:<trackid>". In this case, the following URL object is returned;
 *
 *	(start code)
 *
 *	{
 *		scheme: "spotify:",
 *		url: "track:<trackid>"
 *	}
 *
 *	(end code)
 *
 *	The unknown URL object will always contain the scheme (if present), for filtering purposes, and also contains a toString() method, which will convert the URL object back to the original URL string.
 *
 *	mailto:
 *
 *	"mailto:" URLs are parsable in the same manner as a regular HTTP URL. For example, the following URL object is returned for a URL with a "mailto:" scheme;
 *
 *	(start code)
 *
 *	{
 *		scheme: "mailto:"
 *		user: "username",
 *		password: "",
 *		host: "www.example.com",
 *		port: "",
 *		path: "",
 *		query: "?subject=subject&body=body",
 *		fragment: "" 
 *	}
 *
 *	(end code)
 *
 *	Therefore, "mailto:" URLs can be fully parsed using this parser, but note that it is not possible to set the password, port or fragment strings on a "mailto:" URL.
 *
 *	javascript:
 *
 *	"javascript" URLs are parsable in the same manner as a regular HTTP URL. For example, the following URL object is returned for a URL with a "javasrcipt:" scheme;
 *
 *	(start code)
 *
 *	{
 *		scheme: "javascript:"
 *		user: "",
 *		password: "",
 *		host: "www.example.com",
 *		port: "",
 *		path: "/",
 *		query: "",
 *		fragment: "",
 *		javascript: "alert('!');"
 *	}
 *
 *	(end code)
 *
 *	Therefore, "javascript:" URLs can be fully parsed using this parser, but note that the current "document.location.href" will always be parsed/returned as the main URL object.
 *
 **/
 
/**
 *	Section: Operators.
 *
 *	Overview of filter operators.
 *
 *	The following filter operators may be specified as the "operator" parameter to the <filter> method.
 *
 *	URL filter operators:
 *
 *	"=" - Equal to.
 *	"!=" - Not equal to.
 *	"*=" - Contains.
 *	"<" - Less than. 
 *	"<=" - Less than or equal to.
 *	">" - Greater than.
 *	">=" - Greater than or equal to.
 *	"^=" - Starts with.
 *	"$=" - Ends with.
 *	"regex" - Regular expression.
 *
 **/

 /**
 *	Section: this parameter.
 *
 *	Where "this" is refered to as an argument to the method functions, it may be one of the following;
 *
 *	- HTML document element.
 *	- An array of 1 or more elements with a "href" or "src" attribute.
 *	- A URL parser interface returned from $.jurlp().
 *
 **/

(
	function ( $ )
	{
		/**
		 *
		 *	Regular expression for parsing URLs.
		 *
		 *	Taken from parseUri 1.2 (http://blog.stevenlevithan.com/archives/parseuri).
		 *
		 **/ 

		var urlRegEx = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

		/*

			Global object of watched selectors and their array of callstacks.

		*/ 

		var selectorCallStack = { };

		/*

			Currently watched selector. ToDo: Remove this and use a better mechanism for selector tracking.

		*/

		var currentSelector = "";

		/**
		 *
		 *	Section: Internal functions.
		 *
		 *	All internal private functions.
		 *
		 *	This section contains all internal functions that perform the grunt work for the parser interface.
		 *
		 **/ 

		/**
		 *
		 *	Function: initialiseElement
		 *
		 *	Initialise an element for use with the URL parser.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to initialise. See <this parameter>.
		 *
		 **/ 

		var initialiseElement = function ( )
		{
			/* Attempt to retreive a href from the element */ 

			var href = getHref.apply ( this );

			/* Was a href found for the element? */ 

			if ( href == "" )
			{
				/* Is the current element the document? */

				if ( this.get ( 0 ) == $( document ).get ( 0 ) )
				{
					/* Use the document href */ 

					href = document.location.href;
				}
				else if ( this.is ( "[href]" ) )
				{
					/* Use the element href attribute */ 

					href = this.attr ( "href" );
				}
				else if ( this.is ( "[src]" ) )
				{
					/* Use the element src attribute */ 

					href = this.attr ( "src" );
				}

				/* Check the href is not empty so we don't initialise the "data-href" attribute on text elements (although maybe this is not wanted, as an empty href is technically the current page?). */ 

				if ( href != "" )
				{
					/* Sanitise the URL */ 

					href = sanitiseUrl ( href );

					/* Store the URL as a data attribute within the element */ 

					this.data ( "href", href );
				}
			}
		};

		/**
		 *
		 *	Function: initialiseElementText
		 *
		 *	Initialise an elements text field for use with the URL parser.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to initialise.
		 *
		 **/ 

		var initialiseElementText = function ( )
		{
			/* Is the current element not the document, and also does not contain a "href" attribute */ 

			if ( this.get ( 0 ) != $( document ).get ( 0 ) && this.attr ( "href" ) == null && this.attr ( "src" ) == null )
			{
				/* Does the element contain anything? */ 

				if ( this.html ( ) != null && this.hasClass ( "jurlp-span" ) == false )
				{
					var urls = [ ];
					var modifiedHtml = false;
					var match = "";

					/* Regular expression for finding URLs in free text */ 

					var findUrlRegExp = /((((mailto|spotify|skype)\:([a-zA-Z0-9\.\-\:@\?\=\%]*))|((ftp|git|irc|ircs|irc6|pop|rss|ssh|svn|udp|feed|imap|ldap|nntp|rtmp|sftp|snmp|xmpp|http|https|telnet|ventrilo|webcal|view\-source)\:[\/]{2})?(([a-zA-Z0-9\.\-]+)\:([a-zA-Z0-9\.&;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|[a-zA-Z]{2}))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\?\'\\\+&;%\$\=~_\-]+)?(#\w*)?)*))/i;

					/* Store the elements HTML */ 

					var html = this.html ( );

					/* Attempt to locate URLs within the HTML */ 

					while ( match = findUrlRegExp.exec ( html ) )
					{
						/* Replace the URL with a unique ID */ 

						html = html.replace ( match [ 0 ], "$" + urls.length );

						/* Store the discovered URL */ 

						urls.push ( match [ 0 ] );

						/* Indicate that the HTML was modified */ 

						modifiedHtml = true;
					}

					/* Iterate through all discovered URLs */ 

					for ( var i = 0; i < urls.length; i++ )
					{
						/* Get the postion of the current URL ID */ 

						var pos = html.indexOf ( "$" + i );

						/* Get the possible attribute name */ 

						var attr = html.substring ( pos - 6, pos - 1 );

						/* Does the URL reside within an attribute (i.e. an existing tag) */ 

						if ( attr == "href=" || attr == " src=" || html.substring ( pos - 1, pos ) == ">" )
						{
							/* Replace the ID with the original URL (do not convert this URL to an anchor as it most likely is part of one) */ 

							html = html.replace ( "$" + i, urls [ i ] );
						}
						else
						{
							/* Replace the unique ID with an anchor tag */ 

							html = html.replace ( "$" + i, "<a href=\"[url]\" class=\"jurlp-no-watch\">[url]</a>".replace ( /\[url\]/g, urls [ i ] ) );
						}
					}

					/* Did we change the HTML at all? */ 

					if ( modifiedHtml != false )
					{
						/* Add a class on the parent element to indicate that we have modified it */ 

						this.addClass ( "jurlp-span" );

						/* Update the elements HTML */ 

						this.html ( html );

						/* Find and return all newly created anchor tags */ 

						return this.find ( "a[href]" ).each
						(
							function ( )
							{
								/* Get the href attribute for the element */ 

								var href = getHref.apply ( $( this ) );

								/* Sanitise the URL and reset the elements href */ 

								setHref.apply ( $( this ), [ href ] );
							}
						);
					}
				}
			}

			/* No URLs found */ 

			return null;
		}

		/**
		 *
		 *	Function: setAttrUrl
		 *
		 *	Given an element, and an attribute, set the attribute to the supplied URL, and created a backup of the original URL if not already done.
		 *
		 *	Note, if the attribute doesn't exist, then it will not be created.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to set the attribute URL on.
		 *
		 *	attr - The name of the attribute to set.
		 *
		 *	url - The value of the attributes URL.
		 *
		 **/ 

		var setAttrUrl = function ( attr, url )
		{
			/* Is the attribute present on this element? */ 

			if ( this.is ( "[" + attr + "]" ) != false )
			{
				/* Has a copy of the original attribute been stored? */ 

				if ( this.data ( "original-" + attr ) == null )
				{
					/* Store a copy of the original attribute */ 

					this.data ( "original-" + attr, this.attr ( attr ) );
				}

				/* Update the elements attribute */ 

				this.attr ( attr, url );
			}
		};

		/**
		 *
		 *	Function: restoreAttrUrl
		 *
		 *	Given an element, and an attribute, then restore the URL attribute value to its original value.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to restore the attribute URL on.
		 *
		 *	attr - The name of the attribute to restore.
		 *
		 **/ 

		var restoreAttrUrl = function ( attr )
		{
			/* Was a backup of the original attribute URL made? */ 

			if ( this.data ( "original-" + attr ) != null )
			{
				/* Restore the attribute URL */ 

				this.attr ( attr, this.data ( "original-" + attr ) );

				/* Remove the original URL */ 

				this.removeData ( "original-" + attr );
			}
		};

		/**
		 *
		 *	Function: restoreElement
		 *
		 *	Destroys any data associated with an element that has previously been initialised for use with the URL parser, and restores the elements "href" or "src" attribute (if any) to its original value.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to destroy.
		 *
		 **/ 

		var restoreElement = function ( )
		{
			/* Remove the working href URL */ 

			this.removeData ( "href" );

			/* Restore the href attribute */ 

			restoreAttrUrl.apply ( this, [ "href" ] );

			/* Restore the src attribute */ 

			restoreAttrUrl.apply ( this, [ "src" ] );

			/* Remove any watch attributes */ 

			this.removeData ( "jurlp-no-watch" );
			this.removeData ( "is-watched" );

			/* clean up selector callstack and unbind */ 

			methods.unwatch.apply ( this );
		}

		/**
		 *
		 *	Function: getHref
		 *
		 *	Get the href URL for the element. Prioritises internal objects href, over "data-href", over "href", over "src" attributes.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to retieve the URL value from.
		 *
		 **/ 

		var getHref = function ( )
		{
			return this.href || this.data ( "href" ) || this.attr ( "href" ) || this.attr ( "src" ) || "";
		};

		/**
		 *
		 *	Function: updateHref
		 *
		 *	Update a segment of the elements href URL.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to update the URL value on.
		 *
		 *	segment - The segment to update ("scheme", "host", "port", "path", "query" or "fragment").
		 *
		 *	value - The new value for the segment.
		 *
		 **/ 

		var updateHref = function ( segment, value )
		{
			setHref.apply ( this, [ setUrlSegment ( getHref.apply ( this ), segment, value ) ] );
		};

		/**
		 *
		 *	Function: updateHrefShim
		 *
		 *	Shim function for reorganising parameters before calling updateHref(). Called via the each callback.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to update the URL value on.
		 *
		 *	parameters - Array containing segment and value parameters for updateHref().
		 *
		 **/ 

		var updateHrefShim = function ( parameters )
		{
			updateHref.apply ( this, [ parameters [ 0 ], parameters [ 1 ] ] );
		};

		/**
		 *
		 *	Function: setHref
		 *
		 *	Sets the href URL value for an element.
		 *
		 *	Parameters: 
		 * 
		 *	this - The element to set the URL value on.
		 *
		 *	url - The new url (string) value.
		 *
		 **/ 

		var setHref = function ( url )
		{
			/* Ensure the supplied URL is a string */ 

			if ( typeof url == "object" )
			{
				url = objectToUrl ( url );
			}

			/* Sanitise the URL - slow and horrible :( */ 

			url = sanitiseUrl ( url );

			if ( this.href != null )
			{
				this.href = url;

				return;
			}

			/* Is the current element the document? */ 

			if ( this.get ( 0 ) == $( document ).get ( 0 ) )
			{
				/* Current element is the document. Save the href under a data attribute. */

				this.data ( "href", url );
			}
			else
			{
				/* Update href URL (if present) */ 

				setAttrUrl.apply ( this, [ "href", url ] );

				/* Update src URL (if present) */ 

				setAttrUrl.apply ( this, [ "src", url ] );
			}
		};

		/**
		 *
		 *	Function: urlToObject
		 *
		 *	Parse a URL into segments using the DOM. Parses authority information from the URL using parseUri (http://blog.stevenlevithan.com/archives/parseuri).
		 *
		 *	Parameters: 
		 *
		 *	url - URL String to parse.
		 *
		 *	Returns:
		 *
		 *	URL object.
		 *
		 **/ 

		var urlToObject = function ( url )
		{
			/* Was a null URL supplied? */ 

			if ( url == null )
			{
				/* Return an empty object */ 

				return { scheme : "", user : "", password : "", host : "", port : "", path : "", query : "", fragment : "" };
			}

			var credentials = { user : "", password : "" };

			if ( url.substring ( 0, 2 ) == "//" )
			{
				url = "http:" + url;
			}

			/* If a URL is supplied, ensure a protocol is specified, otherwise the parser will assume that the supplied host is the path */ 

			if ( url != "" && url.indexOf ( "://" ) == -1 )
			{
				url = "http://" + url;
			}

			/* Does the URL contain authority information? */ 

			if ( url.indexOf ( "@" ) != -1 )
			{
				/* Parse the URL using regex */ 

				var urlSegments = url.match ( urlRegEx );

				/* Was a username found? */ 

				if ( urlSegments [ 4 ] )
				{
					credentials.user = urlSegments [ 4 ];
				}

				/* Was a password found? */ 

				if ( urlSegments [ 5 ] )
				{
					credentials.password = urlSegments [ 5 ];
				}
			}

			/* Construct a new anchor element based on the supplied URL */ 

			var a = document.createElement ( "a" );

			/* Set the anchor href to the URL to parse (let the browser do (most of) the parsing) */ 

			a.href = url;

			/* Under IE, an anchor element containing a username and password is inaccessible, so we will probe "a.protocol" to test if we have access */ 

			try
			{
				/* Check if the element is accessible */ 

				var accessible = a.protocol;
			}
			catch ( err )
			{
				/* MSIE: A security problem occurred. (cannot access the anchor element) */ 

				if ( err.number == -2146697202 )
				{
					/* IE hack!.. strip the username and password from the URL, and reparse */ 

					var authority = "";

					/* Were credentials found in the URL? */ 

					if ( credentials.user != "" )
					{
						/* Build string containing the username and password to strip from the URL */ 

						authority += credentials.user;

						if ( credentials.password != "" )
						{
							authority += ":" + credentials.password;
						}

						authority += "@";

						/* Strip the username and password from the URL and set the anchor href (this could in theory be done for all browsers) */ 

						a.href = url.replace ( authority, "" );
					}
				}
			}

			/* Sanitise the protocol string */ 

			var protocol = a.protocol;

			if ( a.protocol.indexOf ( "//" ) == -1 )
			{
				protocol += "//";
			}

			/* Sanitise the path string */ 

			var pathname = a.pathname;

			if ( pathname [ 0 ] != "/" )
			{
				pathname = "/" + pathname;
			}

			/* Ensure the port value is a string */ 

			var port = a.port + "";

			/* Strip of default port numbers if added, and not present in the original URL */ 

			if ( ( port == "21" && url.indexOf ( ":21" ) == -1 ) || ( port == "80" && url.indexOf ( ":80" ) == -1 ) || ( port == "443" && url.indexOf ( ":443" ) == -1 ) || port == "0" )
			{
				port = "";
			}

			/* Return the URL object, based on the URL information for the newly created anchor element contained in the DOM */ 

			return { scheme : protocol, user : credentials.user, password : credentials.password, host : a.hostname, port : port, path : pathname, query : a.search, fragment : a.hash };
		};

		/**
		 *
		 *	Function: objectToUrl
		 *
		 *	Convert a URL object to a string.
		 *
		 *	Parameters: 
		 *
		 *	url - The URL object to convert.
		 *
		 *	Returns:
		 *
		 *	URL string.
		 *
		 **/ 

		var objectToUrl = function ( url )
		{
			/* Build URL string, starting with the scheme */ 

			var urlString = url.scheme;

			/* Was a username specified? */ 

			if ( url.user != null && url.user != "" )
			{
				/* Insert the username */ 

				urlString += url.user;

				/* Was a password also specified? */ 

				if ( url.password != null && url.password != "" )
				{
					urlString += ":" + url.password;
				}

				/* Insert authority/host seperator */ 

				urlString += "@";
			}

			/* Glue the remainder of the URL together (only including the port if explicitly specified) */ 

			return urlString + url.host + ( url.port != "" ? ":" + url.port : "" ) + url.path + url.query + url.fragment;
		};

		/**
		 *
		 *	Function: sanitiseUrl
		 *
		 *	Sanitise a URL. Creates a fully qualified URL by converting it from a string to a DOM element and back to a string again.
		 *
		 *	Parameters: 
		 *
		 *	url - The URL to sanitise.
		 *
		 *	Returns:
		 *
		 *	The sanitised URL string.
		 *
		 **/ 

		var sanitiseUrl = function ( url )
		{
			return uri.parse ( url ).toString ( );
		};

		/**
		 *
		 *	Function: urlObjectToString
		 *
		 *	Converts a URL object to a string (used to override toString for URL objects).
		 *
		 *	Parameters: 
		 *
		 *	this - The URL object to convert to a string.
		 *
		 *	Returns:
		 *
		 *	The URL string.
		 *
		 **/ 

		var urlObjectToString = function ( )
		{
			return objectToUrl ( this );
		};

		/**
		 *
		 *	Function: setUrlSegment
		 *
		 *	Set the value of a segment within a URL string.
		 *
		 *	Parameters: 
		 *
		 *	url - The URL to modify.
		 *
		 *	segment - The segment of the URL to modify ("scheme", "host", "port", "path", "query" or "fragment").
		 *
		 *	value - The new segment value.
		 *
		 *	Returns:
		 *
		 *	The URL string containing the update segment.
		 *
		 **/ 

		var setUrlSegment = function ( url, segment, value )
		{
			/* Convert the URL to an object */ 

			var urlObject = uri.parse ( url );

			/* Update the URL segment */ 

			urlObject [ segment ] = value;

			/* Convert the URL object back to a string */ 

			return objectToUrl ( urlObject );
		};

		/**
		 *
		 *	Function: getUrlObject
		 *
		 *	Convert a URL string to an object, if not already. Used to ensure we always work with URL objects where either a string or object can be supplied.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	URL object.
		 *
		 **/ 

		var getUrlObject = function ( url )
		{
			/* Is the URL a string? */ 

			if ( typeof url == "string" )
			{
				/* Return the URL string converted to an object */ 

				return uri.parse ( url );
			}

			/* Return the URL object */ 

			return url;
		};

		/**
		 *
		 *	Function: getFragmentString
		 *
		 *	Retrieve the fragment string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The fragment string.
		 *
		 **/ 

		var getFragmentString = function ( url )
		{
			return getUrlObject ( url ).fragment;
		};

		/**
		 *
		 *	Function: getQueryString
		 *
		 *	Retrieve the query string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The query string.
		 *
		 **/ 

		var getQueryString = function ( url )
		{
			/* Get the query string from the URL object */ 

			var query = getUrlObject ( url ).query;

			/* Anything?`*/ 

			if ( query [ 0 ] == "?" )
			{
				/* Strip the leading "?" (makes .split() happy later) */ 

				return query.slice ( 1 );
			}

			/* Return the (probably not very valid?) query */ 

			return query;
		};

		/**
		 *
		 *	Function: updateQuery
		 *
		 *	Update the query string for the elements URL.
		 *
		 *	Parameters: 
		 *
		 *	this - The element to set the new query string on.
		 *
		 *	query - New query object.
		 *
		 **/ 

		var updateQuery = function ( query )
		{
			var queryObject = { };

			/* Get the query object for the current URL */ 

			var currentQueryObject = getQueryObject ( getHref.apply ( this ) );

			/* Was a string supplied as the parameter? */ 

			if ( typeof query == "string" )
			{
				/* If the first character is a "?", then replace the whole query string */ 

				if ( query [ 0 ] == "?" )
				{
					/* Trash the existing query object */ 

					currentQueryObject = { };

					/* Strip the leading question mark */ 

					query = query.substring ( 1 );
				}

				/* Convert the supplied query string to an object */ 

				queryObject = queryStringToObject ( query );
			}
			else
			{
				queryObject = query;
			}

			/* Did the supplied query object contain parameters? */ 

			if ( $.isEmptyObject ( queryObject ) == false )
			{
				/* Extend the existing query object with the new query object */ 

				queryObject = $.extend ( currentQueryObject, queryObject );
			}
			else
			{
				/* An empty query object was supplied, so null the query string */ 

				currentQueryObject = { };
			}

			/* Convert the query object to a string, and update the URL query string */ 

			updateHref.apply ( this, [ "query", queryObjectToString.apply ( queryObject ) ] );
		};

		/**
		 *
		 *	Function: queryStringToObject
		 *
		 *	Convert a query string to an object.
		 *
		 *	Parameters: 
		 *
		 *	query - Query string to convert to an object.
		 *
		 *	Returns:
		 *
		 *	The query object.
		 *
		 **/ 

		var queryStringToObject = function ( query )
		{
			var object = { };

			/* Was a query string supplied? */ 

			if ( query != "" )
			{
				/* Get all elements of the query string ("&name=value") */ 

				var elements = query.split ( "&" );

				/* Create the query object */ 

				for ( var i = 0; i < elements.length; i++ )
				{
					/* Retrieve the parameter name and value from the string "name=value" */ 

					var parameter = elements [ i ].split ( "=" );

					/* Add the parameter to the query object */ 

					object [ parameter [ 0 ] ] = parameter [ 1 ];
				}
			}

			/* Return the query object */ 

			return object;
		};

		/**
		 *
		 *	Function: getQueryObject
		 *
		 *	Retrieve the query object for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The query object.
		 *
		 **/ 

		var getQueryObject = function ( url )
		{
			/* Get the query string from the URL and convert it to an object */ 

			return queryStringToObject ( getQueryString ( url ) );
		};

		/**
		 *
		 *	Function: queryObjectToString
		 *
		 *	Query objects toString method.
		 *
		 *	Parameters: 
		 *
		 *	this - Query object.
		 *
		 *	Returns:
		 *
		 *	The query string.
		 *
		 **/ 

		var queryObjectToString = function ( )
		{
			var string = "";

			/* For each item in the query string */ 

			for ( var i in this )
			{
				/* Ensure that it contains valid data */ 

				if ( i != "toString" && this [ i ] != null )
				{
					string += "&" + i + "=" + this [ i ];
				}
			}

			/* Anything? */ 

			if ( string [ 0 ] == "&" )
			{
				/* Return the query string (replacing the first "&" character with a "?" character. */ 

				string = "?" + string.slice ( 1 );
			}
 
			/* Empty query string */ 

			return string;
		};

		/**
		 *
		 *	Function: getPathString
		 *
		 *	Retrieve the path string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The path string.
		 *
		 **/ 

		var getPathString = function ( url )
		{
			/* Get the path string from the URL object */ 

			var path = getUrlObject ( url ).path;

			/* Ensure the path starts with a leading slash */ 

			if ( path [ 0 ] == "/" )
			{
				/* Strip the leading slash from the path */ 

				return path.slice ( 1 );
			}

			/* Empty or malformed path */ 

			return path;
		};

		/**
		 *
		 *	Function: getPathObject
		 *
		 *	Retrieve the path object for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The path obbject.
		 *
		 **/ 

		var getPathObject = function ( url )
		{
			/* Get the path string from the URL object (without leading slash) */ 

			var pathString = getPathString ( url );

			/* Anything? */ 

			if ( pathString != "" )
			{
				/* Create the path object */ 

				return pathString.split ( "/" );
			}

			/* No path specified */ 

			return [ ];
		};

		/**
		 *
		 *	Function: updatePath
		 *
		 *	Update the path string for the elements URL.
		 *
		 *	Parameters: 
		 *
		 *	this - The element to set the new path string on.
		 *
		 *	path - New path object.
		 *
		 **/ 

		var updatePath = function ( path )
		{
			var pathString = "";

			/* Get an array of existing path elements */ 

			var pathArray = getUrlObject ( getHref.apply ( this ) ).path.split ( "/" );

			/* Get an array of new path elements */ 

			var newPathArray = path.split ( "/" );
			var i = 0;

			/* Was the first character a "/"? */ 

			if ( newPathArray [ 0 ] == "" )
			{
				/* Truncate the existing path */ 

				pathArray = [ ];

				i++;
			}

			/* Remove the initial empty path element */ 

			pathArray.splice ( 0, 1 );

			/* Iterate through all new path elements */ 

			for ( var l = newPathArray.length; i < l; i++ )
			{
				/* Remove an old path element? */ 

				if ( newPathArray [ i ] == ".." )
				{
					/* Remove the element from the path array */ 

					if ( pathArray.length > 0 )
					{
						pathArray.splice ( pathArray.length - 1, 1 );
					}
				}
				else if ( newPathArray [ i ] == "." )
				{
					/* Current directory */ 
				}
				else
				{
					/* Include the new path element */ 

					pathArray.push ( newPathArray [ i ] );
				}
			}

			/* Update the path string */ 

			updateHref.apply ( this, [ "path", pathObjectToString.apply ( pathArray ) ] );
		};

		/**
		 *
		 *	Function: pathObjectToString
		 *
		 *	Path objects toString method.
		 *
		 *	Parameters: 
		 *
		 *	this - Path object.
		 *
		 *	Returns:
		 *
		 *	The path string.
		 *
		 **/ 

		var pathObjectToString = function ( )
		{
			/* Are there any path elements? */ 

			if ( this.length > 0 )
			{
				/* Join all elements with a "/", and return the leading path slash again */ 

				return "/" + this.join ( "/" );
			}

			/* No path */ 

			return "/";
		};

		/**
		 *
		 *	Function: getPortString
		 *
		 *	Retrieve the port string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The port string.
		 *
		 **/ 

		var getPortString = function ( url )
		{
			return getUrlObject ( url ).port;
		};

		/**
		 *
		 *	Function: getHostString
		 *
		 *	Retrieve the host string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The host string.
		 *
		 **/ 

		var getHostString = function ( url )
		{
			return getUrlObject ( url ).host;
		};

		/**
		 *
		 *	Function: getPasswordString
		 *
		 *	Retrieve the password string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The password string.
		 *
		 **/ 

		var getPasswordString = function ( url )
		{
			return getUrlObject ( url ).password;
		};

		/**
		 *
		 *	Function: getUserString
		 *
		 *	Retrieve the user string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The user string.
		 *
		 **/ 

		var getUserString = function ( url )
		{
			return getUrlObject ( url ).user;
		};

		/**
		 *
		 *	Function: getSchemeString
		 *
		 *	Retrieve the scheme string for a given URL.
		 *
		 *	Parameters: 
		 *
		 *	url - URL string or object.
		 *
		 *	Returns:
		 *
		 *	The scheme string.
		 *
		 **/ 

		var getSchemeString = function ( url )
		{
			return getUrlObject ( url ).scheme;
		};

		/**
		 *
		 *	Function: addSelectorCallback
		 *
		 *	Add a function the selector callstack.
		 *
		 **/ 

		var addSelectorCallback = function ( element, callback, parameters )
		{
			if ( element.data ( "is-watched" ) == true )
			{
				return;
			}

			if ( selectorCallStack [ currentSelector ] )
			{
				selectorCallStack [ currentSelector ].push ( [ callback, parameters ] );
			}
		};

		/**
		 *
		 *	Function: returnEachElement
		 *
		 *	Apply the callback for each element in this. Used for methods that return elements.
		 *
		 *	Parameters:
		 *
		 *	this Array of elements to iterate through.
		 *
		 *	callback Function to call for each element found.
		 *
		 *	parameters Callback function parameters (array).
		 *
		 *	Returns:
		 *
		 *	Array of elements.
		 *
		 **/ 

		var returnEachElement = function ( callback, parameters )
		{
			/* Is this an object, containing an href member? */ 

			if ( this.href != null )
			{
				/* Issue the callback */ 

				callback.apply ( this, [ parameters ] );

				/* Return the object (for chaining purposes) */ 

				return this;
			}

			/* Add this function and parameters to the watch selector callstack (if watched) */ 

			addSelectorCallback ( this, callback, [ parameters ] );

			/* Return all elements, after applying the callback */ 

			return this.each
			(
				function ( )
				{
					callback.apply ( $( this ), [ parameters ] );
				}
			);
		};

		/**
		 *
		 *	Function: returnEachObject
		 *
		 *	Apply the callback for each element in this, and buffer return codes. Used for methods that return data.
		 *
		 *	Parameters:
		 *
		 *	this Array of elements to iterate through.
		 *
		 *	callback Function to call for each element found.
		 *
		 *	parameters Callback function parameters (array).
		 *
		 *	Returns:
		 *
		 *	Array of return codes.
		 *
		 **/ 

		var returnEachObject = function ( callback, parameters )
		{
			if ( this.href != null )
			{
				return callback.apply ( this, [ parameters ] );
			}

			var result = [ ];

			/* Build and return an array of each elements callback results */ 

			this.each
			(
				function ( )
				{
					result.push ( callback.apply ( $( this ), [ parameters ] ) );
				}
			);

			return result;
		};

		/**
		 *
		 *	Function: dispatchGetSetHelper
		 *
		 *	Dispatch to get or set helper functions depending on the arguments supplied.
		 *
		 *	If no user arguments are supplied, perform the get, ortherwise perform the set with the user arguments.
		 *
		 *	Parameters:
		 *
		 *	getHelper - Get URL data callback.
		 *
		 *	setHelper - Set URL data callback.
		 *
		 *	helperArguments - User arguments supplied to the public interface.
		 *
		 *	Returns:
		 *
		 *	get/setHelper() return code.
		 *
		 **/ 

		var dispatchGetSetHelper = function ( getHelper, setHelper, helperArguments )
		{
			if ( helperArguments.length == 0 )
			{
				return getHelper.apply ( this )
			}
			
			return setHelper.apply ( this, helperArguments )
		};

		/**
		 *
		 *	Function: methodDispatcher
		 *
		 *	Main method dispatcher for the public interface.
		 *
		 *	Parameters: method
		 *
		 *	method - The method to perform.
		 *
		 *	Returns:
		 *
		 *	Array of method handler results (either elements for set/filter methods, or strings/objects for get methods).
		 *
		 */ 

		var methodDispatcher = function ( method )
		{
			/* Is the method name valid */ 

			if ( methods [ method ] != null )
			{
				/* Dispatch to the method handler */ 

				return methods [ method ].apply ( this, Array.prototype.slice.call ( arguments, 1 ) );
			}
			else if ( typeof method == "object" || method == null )
			{
				/* No method, or an object was supplied, initialise the element(s) */ 

				return methods.initialise.apply ( this, Array.prototype.slice.call ( arguments, 1 ) );
			}

			/* Invalid method/parameters */ 

			return this;
		};

		/**
		 *
		 *	Section: URI parser interface.
		 *
		 *	All URI parsing is handled through this interface.
		 *
		 *	This section contains all parser interfaces utilised by the public parser interface.
		 *
		 *	ToDo: Extend this interface with the current URL segment parsing logic, and implement a more comprehensive URI parser set.
		 *
		 *	See http://en.wikipedia.org/wiki/URI_scheme for an overview of URIs.
		 *
		 **/ 

		var uri =
		{
			/**
			 *
			 *	All URI object to string methods.
			 *
			 **/ 

			toString :
			{
				/**
				 *
				 *	Function: uri.toString.http
				 *
				 *	Converts a URI object with an "http" scheme to a string.
				 *
				 **/ 

				"http" : function ( )
				{
					return objectToUrl ( this );
				},

				/**
				 *
				 *	Function: uri.toString.mailto
				 *
				 *	Converts a URI object with a "mailto:" scheme to a string.
				 *
				 **/ 

				"mailto" : function ( )
				{
					/* Blank invalid fields */ 

					this.password = "";
					this.path = "";
					this.port = "";

					return objectToUrl ( this );
				},

				/**
				 *
				 *	Function: uri.toString.javascript
				 *
				 *	Converts a URI object with a "javascript:" scheme to a string.
				 *
				 **/ 

				"javascript" : function ( )
				{
					return "javascript:" + this.javascript;
				},

				/**
				 *
				 *	Function: uri.toString.generic
				 *
				 *	Converts an generic URI object to a string.
				 *
				 **/ 

				"generic" : function ( )
				{
					return this.scheme + this.url;
				}
			},

			/**
			 *
			 *	All URI string parsers.
			 *
			 **/ 

			parsers :
			{
				/**
				 *
				 *	Function: uri.parsers.http
				 *
				 *	Parse a URI with a "http://" scheme into a URI object.
				 *
				 **/ 

				"http" : function ( url )
				{
					return $.extend ( urlToObject ( url ), { toString : uri.toString.http } );
				},

				/**
				 *
				 *	Function: uri.parsers.mailto
				 *
				 *	Parse a URI with a "mailto:" scheme into a URI object.
				 *
				 **/ 

				"mailto" : function ( url )
				{

					return $.extend ( urlToObject ( url.substring ( 7 ) ), { scheme : "mailto:", toString : uri.toString.mailto } );
				},

				/**
				 *
				 *	Function: uri.parsers.javascript
				 *
				 *	Parse a URI with a "javascript:" scheme into a URI object.
				 *
				 **/ 

				"javascript" : function ( url )
				{
					return $.extend ( urlToObject ( document.location.href ), { javascript : url.substring ( 11 ), toString : uri.toString.javascript } );
				},

				/**
				 *
				 *	Function: uri.parsers.generic
				 *
				 *	Parses any URI (URIs with a scheme seperator of "://" are parsed as "http://", everything else is treated as unknown..
				 *
				 **/ 

				"generic" : function ( scheme, url )
				{
					/* Was a "//" specified in the scheme? */ 

					if ( url.substring ( 0, 2 ) == "//" )
					{
						/* Parse as HTTP URL */ 

						return $.extend ( urlToObject ( url.substring ( 2 ) ), { scheme : scheme + "://", toString : uri.toString.http } );
					}

					/* Unknown, store the schem (for filtering purposes), and simply append the remainder of the URI */ 

					return { scheme : scheme + ":", url : url, toString : uri.toString.generic };
				}
			},

			/**
			 *
			 *	Function: uri.parse
			 *
			 *	Parse a URI string based on scheme.
			 *
			 **/ 

			parse : function ( uri )
			{
				/* Only parse strings */ 

				if ( typeof uri != "string" )
				{
					/* URI object? */ 

					return uri;
				}

				/* Try to determine the scheme */ 

				var pos = uri.indexOf ( ":" );

				/* Was a scheme seperator found? */ 

				if ( pos != -1 )
				{
					/* Get the scheme name (from the start of the URI, until the first ":" character)*/ 

					var scheme = uri.substring ( 0, pos ).toLowerCase ( );

					/* Is a handler present for this scheme? */ 

					if ( this.parsers [ scheme ] != null )
					{
						/* Parse the URI with a specific parser */ 

						return this.parsers [ scheme ] ( uri );
					}

					/* Try to parse the URI generically */ 

					return this.parsers.generic ( scheme, uri.substring ( pos + 1 ) );
				}

				/* Parse the URI with the HTTP parser, for now... */ 

				return this.parsers.http ( uri );
			}
		};

		/**
		 *
		 *	Section: Helper interface.
		 *
		 *	All private helper methods.
		 *
		 *	This section contains all get/set and filter methods utilised by the public interface.
		 *
		 **/ 

		var helpers =
		{
			/**
			 *
			 *	Function: getUrl
			 *
			 *	Return the elements URL (stored under its "data-href", and/or "href"/"src" attribute).
			 *
			 **/ 

			"getUrl" : function ( )
			{
				return returnEachObject.apply ( this, [ getHref, null ] );
			},

			/**
			 *
			 *	Function: setUrl
			 *
			 *	Set the elements URL (stored under it's "data-href", and/or "href"/"src" attribute). Note: This does not change document.location.href for the $(document) element!
			 *
			*/ 

			"setUrl" : function ( url )
			{
				setHref.apply ( this, [ url ] );
			},

			/**
			 *
			 *	Function: parseUrl
			 *
			 *	Return the URL object for the elements "data-href" attribute value.
			 *
			 **/ 

			"parseUrl" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return uri.parse ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: getFragment
			 *
			 *	Get the fragment object from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the fragment object from.
			 *
			 *	Returns:
			 *
			 *	The fragment object. Call .toString() on the object to convert it to a string value.
			 *
			 **/ 

			"getFragment" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getFragmentString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setFragment
			 *
			 *	Set the fragment string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the fragment string on.
			 *
			 *	fragment - The new fragment string/object.
			 *
			 *	Returns:
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setFragment" : function ( fragment )
			{
				if ( fragment [ 0 ] != "#" )
				{
					fragment = "#" + fragment;
				}

				return returnEachElement.apply ( this, [ updateHrefShim, [ "fragment", fragment ] ] );
			},

			/**
			 *
			 *	Function: getQuery
			 *
			 *	Get the query object from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the query object from.
			 *
			 *	Returns:
			 *
			 *	The query object. Call .toString() on the object to convert it to a string value.
			 *
			 **/ 

			"getQuery" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return $.extend ( getQueryObject ( getHref.apply ( this ) ), { toString : queryObjectToString } ); }, null ] );
			},

			/**
			 *
			 *	Function: setQuery
			 *
			 *	Set the query string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the query object on.
			 *
			 *	query - The new query string represented as an object.
			 *
			 *	Returns:
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setQuery" : function ( query )
			{
				return returnEachElement.apply ( this, [ updateQuery, query ] );
			},

			/**
			 *
			 *	Function: getPath
			 *
			 *	Get the path object from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the path object from.
			 *
			 *	Returns:
			 *
			 *	The path object. Call .toString() on the object to convert it to a string value.
			 *
			 **/ 

			"getPath" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return $.extend ( getPathObject ( getHref.apply ( this ) ), { toString : pathObjectToString } ); }, null ] );
			},

			/**
			 *
			 *	Function: setPath
			 *
			 *	Set the path string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the path string on.
			 *
			 *	path - The new path string/object.
			 *
			 *	Returns:
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setPath" : function ( path )
			{
				return returnEachElement.apply ( this, [ updatePath, path ] );
			},

			/**
			 *
			 *	Function: getPort
			 *
			 *	Get the port string from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the port string from.
			 *
			 *	Returns: 
			 *
			 *	The port string.
			 *
			 **/ 

			"getPort" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getPortString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setPort
			 *
			 *	Set the port string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the port string on.
			 *
			 *	port - The new port string.
			 *
			 *	Returns: 
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setPort" : function ( port )
			{
				return returnEachElement.apply ( this, [ updateHrefShim, [ "port", port ] ] );
			},

			/**
			 *
			 *	Function: getHost
			 *
			 *	Get the host string from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the host string from.
			 *
			 *	Returns: 
			 *
			 *	The host string.
			 *
			 **/ 

			"getHost" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getHostString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setHost
			 *
			 *	Set the host string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the host string on.
			 *
			 *	host - The new host string.
			 *
			 *	Returns: 
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setHost" : function ( host )
			{
				return returnEachElement.apply ( this, [ updateHrefShim, [ "host", host ] ] );
			},

			/**
			 *
			 *	Function: getPassword
			 *
			 *	Get the password string from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the password string from.
			 *
			 *	Returns: 
			 *
			 *	The password string.
			 *
			 **/ 

			"getPassword" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getPasswordString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setPassword
			 *
			 *	Set the password string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the password string on.
			 *
			 *	password - The new password string.
			 *
			 *	Returns: 
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setPassword" : function ( password )
			{
				return returnEachElement.apply ( this, [ updateHrefShim, [ "password", password ] ] );
			},

			/**
			 *
			 *	Function: getUser
			 *
			 *	Get the user string from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the user string from.
			 *
			 *	Returns: 
			 *
			 *	The user string.
			 *
			 **/ 

			"getUser" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getUserString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setUser
			 *
			 *	Set the user string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the user string on.
			 *
			 *	user - The new user string.
			 *
			 *	Returns: 
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setUser" : function ( user )
			{
				return returnEachElement.apply ( this, [ updateHrefShim, [ "user", user ] ] );
			},

			/**
			 *
			 *	Function: getScheme
			 *
			 *	Get the scheme string from the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to retrieve the scheme string from.
			 *
			 *	Returns: 
			 *
			 *	The scheme string.
			 *
			 **/ 

			"getScheme" : function ( )
			{
				return returnEachObject.apply ( this, [ function ( ) { return getSchemeString ( getHref.apply ( this ) ); }, null ] );
			},

			/**
			 *
			 *	Function: setScheme
			 *
			 *	Set the scheme string for the elements URL.
			 *
			 *	Parameters: 
			 *
			 *	this - The element to set the scheme string on.
			 *
			 *	scheme - The new scheme string.
			 *
			 *	Returns: 
			 *
			 *	Array of elements that were changed.
			 *
			 **/ 

			"setScheme" : function ( scheme )
			{
				return returnEachElement.apply ( this, [ updateHrefShim, [ "scheme", scheme ] ] );
			},

			"filters" :
			{
				/**
				 *
				 *	Function: = (equals)
				 *
				 *	Test if the actual value is equal to the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual and user values are equal.
				 *
				 *	false - The actual and user values are not equal.
				 *
				 **/ 

				"=" : function ( actualValue, userValue )
				{
					if ( actualValue == userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: != (not equals)
				 *
				 *	Test if the actual value is equal to the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual and user values are not equal.
				 *
				 *	false - The actual and user values are equal.
				 *
				 **/ 

				"!=" : function ( actualValue, userValue )
				{
					if ( actualValue != userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: < (less than)
				 *
				 *	Test if the actual value is less than the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual value is less than the user supplied value.
				 *
				 *	false - The actual value is greater than or equal to the user supplied value.
				 *
				 **/ 

				"<" : function ( actualValue, userValue )
				{
					if ( actualValue < userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: > (greater than)
				 *
				 *	Test if the actualValue is greater than the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual value is greater than the user supplied value.
				 *
				 *	false - The actual value is less than or equal to the user supplied value.
				 *
				 **/ 

				">" : function ( actualValue, userValue )
				{
					if ( actualValue > userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: <= (less than or equal to)
				 *
				 *	Test if the actual value is less than or equal to the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual value is less than or equal to the user supplied value.
				 *
				 *	false - The actual value is greater than the user supplied value.
				 *
				 **/ 

				"<=" : function ( actualValue, userValue )
				{
					if ( actualValue <= userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: >= (greater than or equal to)
				 *
				 *	Test if the actual value is greater than or equal to the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual value is greater than or equal to the user supplied value.
				 *
				 *	false - The actual value is less than the user supplied value.
				 *
				 **/ 

				">=" : function ( actualValue, userValue )
				{
					if ( actualValue >= userValue )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: *= (contains)
				 *
				 *	Test if the actual value contains the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The actual value contains the user supplied value.
				 *
				 *	false - The actual value does not contain the user supplied value.
				 *
				 **/ 

				"*=" : function ( actualValue, userValue )
				{
					if ( actualValue.indexOf ( userValue ) != -1 )
					{
						return true;
					}

					return false;
				},

				/**
				 *
				 *	Function: ^= (starts with)
				 *
				 *	Test if the start of the actual value matches the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The start of the actual value matches the user supplied value.
				 *
				 *	false - The start of the actual value does not match the user supplied value.
				 *
				 **/ 

				"^=" : function ( actualValue, userValue )
				{
					if ( actualValue.length >= userValue.length )
					{
						if ( actualValue.substring ( 0, userValue.length ) == userValue )
						{
							return true;
						}
					}

					return false;
				},

				/**
				 *
				 *	Function: $= (ends with)
				 *
				 *	Test if the end of the actual value is the same as the user supplied value.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - User supplied value.
				 *
				 *	Returns:
				 *
				 *	true - The end of the actual value matches the user supplied value.
				 *
				 *	false - The end of the actual value does not match the user supplied value.
				 *
				 **/ 

				"$=" : function ( actualValue, userValue )
				{
					if ( actualValue.length >= userValue.length )
					{
						if ( actualValue.substring ( actualValue.length - userValue.length ) == userValue )
						{
							return true;
						}
					}

					return false;
				},

				/**
				 *
				 *	Function: regex (regular expression)
				 *
				 *	Test if the actual value matches the user supplied regular expression.
				 *
				 *	Parameters:
				 *
				 *	actualValue - Actual value.
				 *
				 *	userValue - Regular expression to apply.
				 *
				 *	Returns:
				 *
				 *	true - The regular expression matches.
				 *
				 *	false - The regular expression does not match.
				 *
				 **/ 

				"regex" : function ( actualValue, userValue )
				{
					return actualValue.match ( userValue );
				}
			}
		};

		/**
		 *
		 *	Section: Public interface.
		 *
		 *	All public methods exposed via the JQuery URL parser plugin interface.
		 *
		 **/ 

		var methods = 
		{
			/**
			 *
			 *	Function: url
			 *
			 *	Get/Set the href string for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	url - If present, specifies the new URL object/string to set. Otherwise the function will get the URL.
			 *
			 *	Returns:
			 *
			 *	If a URL was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of element URLs.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL
			 *	$(document).jurlp("url");
			 *
			 *	// Parse all URLs in anchor tags
			 *	$("a").jurlp("url");
			 *
			 *	// Update the working URL for the document
			 *	$(document).jurlp("url", "http://www.google.com");
			 *
			 *	// Replace all anchor tags with the google URL!
			 *	$("a").jurlp("url", "http://www.google.com");
			 *
			 *	// Output the documents URL object
			 *	console.log($(document).jurlp("url"));
			 *
			 *	// Output the documents URL string
			 *	console.log($(document).jurlp("url").toString());
			 *
			 *	(end code)
			 *
			 **/

			"url" : function ( url )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.parseUrl, helpers.setUrl, arguments ] );
			},

			/**
			 *
			 *	Function: fragment
			 *
			 *	Get/Set the fragment segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	fragment - If present, specifies the new fragment string to set. Otherwise the function will get the fragment string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a fragment string was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of URL fragments from each element.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the fragment string
			 *	$(document).jurlp("fragment");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their fragment strings
			 *	$("a").jurlp("fragment");
			 *
			 *	// Set a new fragment for the document
			 *	$(document).jurlp("fragment", "elementid");
			 *
			 *	// Replace the fragment string in all anchor tags with the new element ID
			 *	$("a").jurlp("fragment", "elementid");
			 *
			 *	// Output the documents URL fragment
			 *	console.log($(document).jurlp("fragment"));
			 *
			 *	(end code)
			 *
			 **/

			"fragment" : function ( fragment )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getFragment, helpers.setFragment, arguments ] );
			},

			/**
			 *
			 *	Function: query
			 *
			 *	Get/Set the query segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	query - If present, specifies the new query object to set. Otherwise the function will get the query object from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a query object was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of URL query objects from each element. Each returned query object can be converted to a string by calling its toString() method.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the query object
			 *	$(document).jurlp("query");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their query object
			 *	$("a").jurlp("query");
			 *
			 *	// Set/update the "new" parameter in the query string for the document
			 *	$(document).jurlp("query", {"new":"parameter"});
			 *
			 *	// Remove the query string for the document
			 *	$(document).jurlp("query", {});
			 *
			 *	// Update the query string in all anchor tags with the new query object.
			 *	$("a").jurlp("query", {"new":"parameter"});
			 *
			 *	// Remove the query string in all anchor tags.
			 *	$("a").jurlp("query", {});
			 *
			 *	// Output the documents URL query object
			 *	console.log($(document).jurlp("query"));
			 *
			 *	// Output the documents URL query string
			 *	console.log($(document).jurlp("query").toString());
			 *
			 *	(end code)
			 *
			 **/

			"query" : function ( query )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getQuery, helpers.setQuery, arguments ] );
			},

			/**
			 *
			 *	Function: path
			 *
			 *	Get/Set the path segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	path - If present, specifies the new path to set. Otherwise the function will get the path object from each elements URL.
			 *
			 *	A quick guide to paths:
			 *
			 *	- Leading slashes (i.e. "/index.html") set the full path.
			 *
			 *	- No leading slash (or a "./") will append to the existing path.
			 *
			 *	- You can use "../" to remove elements from the existing path, or the path string you supply (which makes concatinating an existing file path and new path easy, as specifying a leading "../" in the new path will remove the file name segment of the existing path).
			 *
			 *	Returns:
			 *
			 *	If a path was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of URL path objects from each element. Each returned path object can be converted to a string by calling its toString() method.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the path object
			 *	$(document).jurlp("path");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their path object
			 *	$("a").jurlp("path");
			 *
			 *	// Set a new path for the document
			 *	$(document).jurlp("path", "/index.html");
			 *
			 *	// Append a path to the document URLs path
			 *	$(document).jurlp("path", "./file.name");
			 *
			 *	// Append a path to the document URLs path, which removes 2 existing path
			 *	// elements before appending the new path 
			 *	$(document).jurlp("path", "../../folder/file.name");
			 *
			 *	// Update the file name segment of the path in all anchor tags 
			 *	// with the new file name.
			 *	$("a").jurlp("path", "../file.name");
			 *
			 *	// Remove the path in all anchor tags.
			 *	$("a").jurlp("path", "/");
			 *
			 *	// Output the documents URL path object
			 *	console.log($(document).jurlp("path"));
			 *
			 *	// Output the documents URL path string
			 *	console.log($(document).jurlp("path").toString());
			 *
			 *	(end code)
			 *
			 **/

			"path" : function ( path )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getPath, helpers.setPath, arguments ] );
			},

			/**
			 *
			 *	Function: port
			 *
			 *	Get/Set the port segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	port - If present, specifies the new port to set. Otherwise the function will get the port string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a port was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of port strings from each elements URL.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the port
			 *	$(document).jurlp("port");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their port
			 *	$("a").jurlp("port");
			 *
			 *	// Set a new port for the document
			 *	$(document).jurlp("port", "8080");
			 *
			 *	// Replace the port in all anchor tags with the new port number
			 *	$("a").jurlp("port", "8080");
			 *
			 *	// Output the documents URL port
			 *	console.log($(document).jurlp("port"));
			 *
			 *	(end code)
			 *
			 **/

			"port" : function ( port )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getPort, helpers.setPort, arguments ] );
			},

			/**
			 *
			 *	Function: host
			 *
			 *	Get/Set the host segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	host - If present, specifies the new host name to set. Otherwise the function will get the host name string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a host name was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of host name strings from each elements URL.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the host name
			 *	$(document).jurlp("host");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their host name
			 *	$("a").jurlp("host");
			 *
			 *	// Set a new host name for the document
			 *	$(document).jurlp("host", "www.example.com");
			 *
			 *	// Replace the host name in all anchor tags with the new host name
			 *	$("a").jurlp("host", "www.example.com");
			 *
			 *	// Output the documents URL host name
			 *	console.log($(document).jurlp("host"));
			 *
			 *	(end code)
			 *
			 **/

			"host" : function ( host )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getHost, helpers.setHost, arguments ] );
			},

			/**
			 *
			 *	Function: password
			 *
			 *	Get/Set the password segment of the URL for the given element(s).
			 *
			 *	Note! A password cannot be set on a URL unless a user name has been set first (see <user>).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	password - If present, specifies the new password to set. Otherwise the function will get the password string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a password was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of password strings from each elements URL.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse all URLs in anchor tags and retrieve their password
			 *	$("a").jurlp("password");
			 *
			 *	// Replace the password in all anchor tags with the new password string
			 *	$("a").jurlp("password", "newpassword");
			 *
			 *	(end code)
			 *
			 **/

			"password" : function ( password )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getPassword, helpers.setPassword, arguments ] );
			},

			/**
			 *
			 *	Function: user
			 *
			 *	Get/Set the user segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	user - If present, specifies the new username to set. Otherwise the function will get the username string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a username was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of username strings from each elements URL.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse all URLs in anchor tags and retrieve their username
			 *	$("a").jurlp("user");
			 *
			 *	// Replace the username in all anchor tags with the new username string
			 *	$("a").jurlp("username", "newusername");
			 *
			 *	(end code)
			 *
			 **/

			"user" : function ( user )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getUser, helpers.setUser, arguments ] );
			},

			/**
			 *
			 *	Function: scheme
			 *
			 *	Get/Set the scheme segment of the URL for the given element(s).
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	scheme - If present, specifies the new scheme. Otherwise the function will get the scheme string from each elements URL.
			 *
			 *	Returns:
			 *
			 *	If a scheme string was specified, then this function returns the array of modified elements for chaining purposes, otherwise it returns an array of scheme strings from each elements URL.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Parse the document.location.href URL for the scheme
			 *	$(document).jurlp("scheme");
			 *
			 *	// Parse all URLs in anchor tags and retrieve their scheme
			 *	$("a").jurlp("scheme");
			 *
			 *	// Set a new scheme name for the document
			 *	$(document).jurlp("scheme", "https://");
			 *
			 *	// Replace the scheme in all anchor tags href attributes
			 *	$("a").jurlp("scheme", "https://");
			 *
			 *	// Output the documents URL host name
			 *	console.log($(document).jurlp("scheme"));
			 *
			 *	(end code)
			 *
			 **/

			"scheme" : function ( scheme )
			{
				return dispatchGetSetHelper.apply ( this, [ helpers.getScheme, helpers.setScheme, arguments ] );
			},

			/**
			 *
			 *	Function: initialise
			 *
			 *	Initialise the parser for the given element(s). HTML anchor elements or the HTML document element need not be explicitly initialised.
			 *	
			 *	Elements are initialised as follows;
			 *
			 *	$(document) - Initialise the "data-href" attribute for the document with the value of "document.location.href". The "data-href" attribute will be modified instead of "document.location.href" when modifying this element. See <Parsing document.location.href>.
			 *
			 *	Elements with "href"/"src" attributes - An attribute named "data-original-href" or "data-original-src" is created to store a copy of the elements original "href"/"src" attribute at the time of initialisation. See <Parsing elements with an �href� or �src� attribute>.
			 *
			 *	All other elements - Parses the element HTML for URLs, wraps any URLs found in an anchor tag, and returns all anchor elements.
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	Returns:
			 *	
			 *	Array of initialised elements (minus the parent container element).
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Not necessary
			 *	$(document).jurlp();
			 *
			 *	// Not necessary
			 *	$("a").jurlp();
			 *
			 *	// Parse the HTML for URLs, and convert all URLs found in the
			 *	// text to anchors tags, and return the anchor elements.
			 *	$("<div>www.example.com</div>").jurlp();
			 *
			 *	(end code)
			 *
			 **/ 

			"initialise" : function ( )
			{
				var me = this;

				/* Attempt to initialise the element as a text field. */ 

				var elements = [ ];

				elements = initialiseElementText.apply ( $( this ) );

				if ( elements != null )
				{
					/* Initialise and return all created anchor elements, and remove the parent element from the array */ 

					return returnEachElement.apply ( this.filter ( function ( ) { return $( this ).get ( 0 ) != $( me ).get ( 0 ); } ).add ( elements ), [ initialiseElement ] );
				}

				/* Initialise the element directly */ 

				return returnEachElement.apply ( me, [ initialiseElement ] );
			},

			/**
			 *
			 *	Function: restore
			 *
			 *	Removes any parser data associated with the element(s), and sets the href attribute to its original value.
			 *
			 *	$(document) - Removes the "data-href" attribute.
			 *
			 *	Elements with "href"/"src" - Restores the "href"/"src" attribute to the "data-original-href/src" attribute value, and removes any other added attributes.
			 *
			 *	All other elements - Currently there is no way to restore an elements HTML which has been converted by the parser, so consider saving it first if needed!
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	Returns:
			 *
			 *	Array of elements which were restored for chaining purposes.
			 *
			 * 	Examples:
			 * 
			 *	(start code)
			 *
			 *	// Restore the working URL for the document.
			 *	$(document).jurlp("restore");
			 *
			 *	// Restore the URL for all anchor elements.
			 *	$("a").jurlp("restore");
			 *
			 *	(end code)
			 *
			 **/ 

			"restore" : function ( )
			{
				return returnEachElement.apply ( this, [ restoreElement ] );
			},

			/**
			 *
			 *	Function: goto
			 *
			 *	Set document.location.href to the supplied elements "href", "src" or "data-href" attribute value.
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Goto the documents URL.
			 *	$(document).jurlp("goto");
			 *
			 *	(end code)
			 *
			 **/ 

			"goto" : function ( )
			{
				document.location.href = getHref.apply ( this );
			},

			/**
			 *
			 *	Function: proxy
			 *
			 *	Proxy the URL. The elements URL will be replaced with the proxy URL, and the original URL will be encapsulated under the query string using the parameter name specified.
			 *
			 *	Parameters:
			 *
			 *	this - See <this parameter>.
			 *
			 *	url - The proxy URL.
			 *
			 *	parameter - The name of the query string parameter to encapsulate the original URL in.
			 *
			 *	Returns:
			 *
			 *	Array of modified elements for chaining purposes.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Proxy all URLs in anchor tags to www.example.com
			 *	// URL becomes "http://www.example.com/?url=<original URL>"
			 *	$("a").jurlp("proxy", "http://www.example.com", "url");
			 *
			 *	(end code)
			 *
			 **/

			"proxy" : function ( url, parameter )
			{
				var elementUrl = getHref.apply ( this );
				var query = { };

				setHref.apply ( this, [ objectToUrl ( getUrlObject ( url ) ) ] );

				query [ parameter ] = elementUrl;

				helpers.setQuery.apply ( this, [ query ] );
			},

			/**
			 *
			 *	function: watch
			 *
			 *	Automatically apply all modifications to new elements added to the DOM that match the selector for the supplied elements. This allows URL filters/modifications that have been applied to existing elements to be propogated to new elements if the page content is being modified (i.e. inserting new anchor tags via AJAX).
			 *
			 *	Overview:
			 *
			 *	Watch will monitor the selector of the supplied elements via a DOM node listener to detect when new elements are inserted. For each new element that is inserted, any prior filters or modifications made to URLs with the same selector will be applied, and the watcher will be alerted via a callback.
			 *
			 *	Note! It is not possible to call watch more than once for the same selector. To do this, try naming the selector differently, i.e. instead of "a", use "a:not(uniqueid)", where "uniqueid" is a nice lengthy descriptive name!
			 *
			 *	To stop watching for updates on a selecter, use <unwatch>.
			 *
			 *	Parameters:
			 *
			 *	this - Array of elements to obtain the selector from. See <this parameter>.
			 *
			 *	callback - Function to call when elements are found, which is supplied two arguments, the new element that was inserted into the DOM, and the selector that triggered the watch.
			 *
			 *	Returns:
			 *
			 *	Array of unmodified elements for chaining purposes.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Add a watch on the first anchor element, and if the host name is 
			 *	// "www.example.com", set the URL query string to "found=example".
			 *	// The "filter" and "query" calls will also be applied to all new elements that 
			 *	// watch discovers!..
			 *	$("a:eq(0)").jurlp("watch", function(element, selector){
			 *		// If we get here, the first anchor element has changed to a URL containing 
			 *		// "www.example.com" and now contains "found=example" in the query string.
			 *		// Dump the URL object to prove it!
			 *		console.log($(element).jurlp("url"));
			 *	}).jurlp("filter", "host", "=", "www.example.com")
			 *	  .jurlp("query",{"found":"example"});
			 *
			 *	//	Prepend a new anchor tag to the page. This will trigger the watch on the 
			 *	//	"a:eq(0)" selector, which will apply all prior calls to this selector, 
			 *	//	so in this instance:
			 *	//	- First perform the filter host, to ensure the host name is "www.example.com".
			 *	//	- If the host name matches, update the URL query string with "found=example").
			 *	// If the host name does not match, then the query string will not be set.
			 *
			 *	$("body").prepend ( "<a href='http://www.example.com/'></a>" );
			 *
			 *	// Stop watching for updates on the "a:eq(0)" selector. 
			 *	// The "a:eq(0)" selector can now be watched on again.
			 *	$("a:eq(0)").jurlp("unwatch");
			 *
			 *	(end code)
			 *
			 *	- Watching the "same selector":
			 *
			 *	(start code)
			 *
			 *	// As an arbitrary example, we want to modify the query string on all existing 
			 *	// facebook/twitter URLs, and then watch the "a" selector for all new 
			 *	// facebook/twitter URLs that appear, and apply the new query string to those too:
			 *
			 *	// THIS WILL NOT WORK!: 
			 *	$("a").jurlp("watch").
			 *	      .jurlp("filter", "host", "=", "www.facebook.com").
			 *	      .jurlp("query",{"found":"facebook"});
			 *
			 *	// This call will fail, as the "a" selector is now watched.
			 *	$("a").jurlp("watch").
			 *	      .jurlp("filter", "host", "=", "www.twitter.com")
			 *	      .jurlp("query",{"found":"twitter"});
			 *
			 *	// THIS WILL WORK!: 
			 *	$("a:not(facebook)").jurlp("watch").
			 *	                    .jurlp("filter", "host", "=", "www.facebook.com")
			 *	                    .jurlp("query",{"found":"facebook"});
			 *
			 *	$("a:not(twitter)").jurlp("watch")
			 *	                   .jurlp("filter", "host", "=", "www.twitter.com")
			 *	                   .jurlp("query",{"found":"twitter"});
			 *
			 *	(end code)
			 *
			 **/

			"watch" : function ( callback )
			{
				/* Get the current selector */ 

				var selector = this.selector;

				/* Has this selector been initialised? */ 

				if ( selectorCallStack [ currentSelector ] == null )
				{
					/* Initialise the selector callstack */ 

					selectorCallStack [ currentSelector ] = [ ];

					/* Monitor the DOM for new nodes being inserted */ 

					$( document ).bind
					(
						"DOMNodeInserted",
						function DOMListener ( event )
						{
							/* Has the selector been unwatched? */ 

							if ( selectorCallStack [ selector ] == null )
							{
								/* Remove the DOM listener for the specific selector */ 

								$( document ).unbind ( "DOMNodeInserted", DOMListener );

								return;
							}

							/* Does this element belong to the current selector? */ 

							var target = $( event.target ).filter ( selector );

							if ( target.get ( 0 ) == null )
							{
								/* Or is it a child */ 

								target = $( event.target ).find ( selector );
							}

							/* Ensure we have a target to modify, and that we are allowed to watch it (the ".jurlp-no-watch" class is present on elements created in initialiseElementText()). */ 

							if ( target.length > 0 && target.is ( ".jurlp-no-watch" ) == false )
							{
								var filtered = false;

								/* Mark the element as being watched */ 

								target.data ( "is-watched", true );

								/* Apply the selector callstack for this element */ 

								for ( var i = 0, l = selectorCallStack [ selector ].length; i < l; i++ )
								{
									/* Run the selector callback to update the element */ 

									var output = selectorCallStack [ selector ] [ i ] [ 0 ].apply ( target, selectorCallStack [ selector ] [ i ] [ 1 ] );

									/* Has the element been filtered out? */ 

									if ( output != null && output.length == 0 )
									{
										/* This element has been filtered, perform no further modifications */

										filtered = true;

										break;
									}
								}

								/* Was the element not filtered out, and a user callback specified? */ 

								if ( filtered == false && typeof callback == "function" )
								{
									/* Call the user callback for each element found in the watch */ 

									target.each ( function ( ){ callback ( $(this), selector ) } );
								}
							}
						}
					);
				}

				return this;
			},

			/**
			 *
			 *	Function: unwatch
			 *
			 *	Removes a watch previously created with <watch>, and prevents modifications being made to new elemenets of the same selector. This will also clear the list of modifications for the selector, and the selector is free to use in a sebsequent call to <watch>.
			 *
			 *	Parameters:
			 *
			 *	this - Array of elements to obtain the selector from.
			 *
			 *	Returns:
			 *
			 *	Array of unmodified elements for chaining purposes.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Create a watch on the "a" selector
			 *	$("a").jurlp("watch");
			 *
			 *	// Remove the watch on the "a" selector
			 *	$("a").jurlp("unwatch");
			 *
			 *	(end code)
			 *
			 **/

			"unwatch" : function ( )
			{
				selectorCallStack [ this.selector ] = null;
			},

			/**
			 *
			 *	Function: filter
			 *
			 *	Filters elements by URL or URL segment.
			 *
			 *	Parameters:
			 *
			 *	this - Array of elements to filter. See <this parameter>.
			 *
			 *	segment - The URL segment to filter on (either "scheme", "host", "port", "path", "query" or "fragment"), or "url" to filter on the full URL. See <URL overview> for more information.
			 *
			 *	operator - The type of filtering to apply (either "!=", "$=", "*=", "<", "<=", "=", ">", ">=" or "^="). See <Operators> for more information.
			 *
			 *	value - The value of the item to filter on.
			 *
			 *	Returns:
			 *
			 *	Filtered element array for chaining purposes.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Get the URL object for all anchors that match
			 *	// the document URLs host name.
			 *	$("a").jurlp("filter", "host", "=", $(document).jurlp("host"))
			 *	      .jurlp("url");
			 *
			 *	// Get the URL object for all anchors that match 
			 *	// the document URLs host, and has a path ending in ".php".
			 *	$("a").jurlp("filter", "host", "=", $(document).jurlp("host"))
			 *	      .jurlp("filter", "path", "$=", ".php")
			 *	      .jurlp("url");
			 *
			 *	// Get the URL object for all anchors whose query 
			 *	// string matches the regular expression
			 *	$("a").jurlp("filter", "query", "regex", /(\?)/).jurlp("url");
			 *
			 *	(end code)
			 *
			 **/ 

			"filter" : function ( segment, operator, value )
			{
				/* Get an arbitrary URL object */ 

				var url = uri.parse ( getHref.apply ( this ) );

				/* Ensure operator is valid */

				if ( operator == "==" )
				{
					operator = "=";
				}

				/* Ensure that the segment is valid, and that a filter method exists */ 

				if ( ( segment == "url" || url [ segment ] != null ) && helpers.filters [ operator ] != null )
				{
					/* Add the filter to the selectors callstack if watched */ 

					addSelectorCallback ( this, methods.filter, [ segment, operator, value ] );

					/* Filter each element */ 

					return this.filter
					(
						function ( )
						{
							/* Get the current elements href */

							var url = getHref.apply ( $( this ) );

							var actualValue = "";

							/* Get the segment value */ 

							if ( segment != "url" )
							{
								/* Use a segment of the URL */ 

								actualValue = uri.parse ( url ) [ segment ];
							}
							else
							{
								/* Use the full URL */ 

								actualValue = url;
							}

							/* If we are testing port numbers, then convert the actual and user port string to an integer */ 

							if ( segment == "port" )
							{
								actualValue = parseInt ( actualValue, 10 );

								value = parseInt ( value, 10 );
							}
							/* Perform the filter check */ 

							return helpers.filters [ operator ].apply ( $( this ), [ actualValue, value ] );
						}
					);
				}

				return this;
			},

			/**
			 *
			 *	Function: interface
			 *
			 *	Get the available methods for the parser interface.
			 *
			 *	Returns: 
			 *
			 *	Array of interface methods.
			 *
			 *	Examples:
			 *
			 *	(start code)
			 *
			 *	// Return all methods exposed by the URL parser interface.
			 *	$.fn.jurlp ( "interface" );
			 *
			 *	(end code)
			 *
			 **/ 

			"interface" : function ( )
			{
				return methods;
			}
		};

		/**
		 *
		 *	Section: JQuery plugin interface.
		 *
		 *	Function: $.fn.jurlp
		 *
		 *	Public interface/method dispatcher for the JQuery URL parser.
		 *
		 *	See <Public interface> for more information on the available methods.
		 *
		 *	See <initialise> for more specific information on how elements are initialised by the parser.
		 *
		 *	Parameters:
		 *
		 *	this - Element(s) to process. See <this parameter>.
		 *
		 *	method - See <Public interface> for an overview of available methods and arguments.
		 *
		 *	arguments - Method arguments.
		 *
		 *	Returns:
		 *
		 *	Either an array of elements for chaining purposes, or array of specific values, depending on the method called.
		 *
		 **/ 

		$.fn.jurlp = function ( method )
		{
			/* If the current selector isn't part of a filter... */ 

			if ( this.selector.indexOf ( ".filter" ) == -1 )
			{
				/* Set the global current selector */ 

				currentSelector = this.selector;
			}

			/* Ensure all elements are initialised with a "data-href". */ 

			returnEachElement.apply ( this, [ initialiseElement ] );

			/* Dispatch to the relevant method */ 

			return methodDispatcher.apply ( this, arguments );
		};

		/**
		 *
		 *
		 *	Function: $.jurlp
		 *
		 *	Returns an interface for directly parsing, manipulating and monitoring the supplied URL.
		 *
		 *	Parameters:
		 *
		 *	url - The URL string to provide a URL parser interface for. Defaults to document.location.href if no URL is supplied.
		 *
		 *	Returns:
		 *
		 *	The URL parser interface for the given URL.
		 *
		 *	Members:
		 *
		 *	href - The URL string.
		 *
		 *	Methods:
		 *
		 *	url - See <url>.
		 *
		 *	scheme - See <scheme>.
		 *
		 *	user - See <user>.
		 *
		 *	password - See <password>.
		 *
		 *	host - See <host>.
		 *
		 *	port - See <port>.
		 *
		 *	path - See <path>.
		 *
		 *	query - See <query>.
		 *
		 *	fragment - See <fragment>.
		 *
		 *	proxy - See <proxy>.
		 *
		 *	goto - See <goto>.
		 *
		 *	watch - Sets a watch for all "href" and "src" attributes containing the URLs hostname (selector is "[href*="host"],[src*="host"]" where host is this.host()), and returns all elements of the same selector for chaining purposes. See <watch> for more information.
		 *
		 *	unwatch - Removes a watch created for the current URLs hostname. See <unwatch>.
		 *
		 *	Examples:
		 *
		 *	See <Parsing URL strings directly>.
		 *
		 **/

		$.jurlp = function ( url )
		{
			/* Create an object for manipulating the url, or document.location.href if null. */ 

			return {
				href : url || document.location.href,
				url : methods.url,
				scheme : methods.scheme,
				user : methods.user,
				password : methods.password,
				host : methods.host,
				port : methods.port,
				path : methods.path,
				query : methods.query,
				fragment : methods.fragment,
				proxy : methods.proxy,
				"goto" : methods [ "goto" ],
				watch : function ( callback )
				{
					/* Get the current host name */ 

					var host = this.host ( );

					/* Set a watch on the href or src selectors */ 

					return $( "[href*=\"" + host + "\"],[src*=\"" + host + "\"]" ).jurlp ( "watch", callback );
				},
				unwatch : function ( )
				{
					/* Get the current host name */ 

					var host = this.host ( );

					/* Set a watch on the href or src selectors */ 

					return $( "[href*=\"" + host + "\"],[src*=\"" + host + "\"]" ).jurlp ( "unwatch" );
				}
			};
		};
	}
) ( jQuery );

/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 *

/*
 *	jQuery elevateZoom 3.0.3
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F() { };
        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document, undefined) {
    var ElevateZoom = {
        init: function (options, elem) {
            var self = this;

            self.elem = elem;
            self.$elem = $(elem);

            self.options = $.extend({}, $.fn.elevateZoom.options, options);

            if (self.options.imageSrc) {
                self.imageSrc = self.options.imageSrc;
            } else if (self.$elem.data("zoom-image")) {
                self.imageSrc = self.$elem.data("zoom-image");
            } else {
                self.imageSrc = self.$elem.attr("src");
            }

            //TINT OVERRIDE SETTINGS
            if (self.options.tint) {
                self.options.lensColour = "none", //colour of the lens background
                    self.options.lensOpacity = "1" //opacity of the lens
            }
            //INNER OVERRIDE SETTINGS
            if (self.options.zoomType == "inner") { self.options.showLens = false; }


            //Remove alt on hover

            self.$elem.parent().removeAttr('title').removeAttr('alt');

            self.zoomImage = self.imageSrc;

            self.refresh(1);



            //Create the image swap from the gallery 
            $('#' + self.options.gallery + ' a').click(function (e) {

                //Set a class on the currently active gallery image
                if (self.options.galleryActiveClass) {
                    $('#' + self.options.gallery + ' a').removeClass(self.options.galleryActiveClass);
                    $(this).addClass(self.options.galleryActiveClass);
                }
                //stop any link on the a tag from working
                e.preventDefault();

                //call the swap image function            
                if ($(this).data("zoom-image")) { self.zoomImagePre = $(this).data("zoom-image") }
                else { self.zoomImagePre = $(this).data("image"); }
                self.swaptheimage($(this).data("image"), self.zoomImagePre);
                return false;
            });

        },

        refresh: function (length) {
            var self = this;

            setTimeout(function () {
                self.fetch(self.imageSrc);

            }, length || self.options.refresh);
        },

        fetch: function (imgsrc) {
            //get the image
            var self = this;
            var newImg = new Image();
            newImg.onload = function () {
                //set the large image dimensions - used to calculte ratio's
                self.largeWidth = newImg.width;
                self.largeHeight = newImg.height;
                //once image is loaded start the calls
                self.startZoom();
                self.currentImage = self.imageSrc;
                //let caller know image has been loaded
                self.options.onZoomedImageLoaded(self.$elem);
            }
            newImg.src = imgsrc; // this must be done AFTER setting onload

            return;

        },

        startZoom: function () {
            var self = this;
            //get dimensions of the non zoomed image
            self.nzWidth = self.$elem.width();
            self.nzHeight = self.$elem.height();

            //activated elements
            self.isWindowActive = false;
            self.isLensActive = false;
            self.isTintActive = false;
            self.overWindow = false;

            //CrossFade Wrappe
            if (self.options.imageCrossfade) {
                self.zoomWrap = self.$elem.wrap('<div style="height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;" class="zoomWrapper" />');
                self.$elem.css('position', 'absolute');
            }

            self.zoomLock = 1;
            self.scrollingLock = false;
            self.changeBgSize = false;
            self.currentZoomLevel = self.options.zoomLevel;


            //get offset of the non zoomed image
            self.nzOffset = self.$elem.offset();
            //calculate the width ratio of the large/small image
            self.widthRatio = (self.largeWidth / self.currentZoomLevel) / self.nzWidth;
            self.heightRatio = (self.largeHeight / self.currentZoomLevel) / self.nzHeight;


            //if window zoom        
            if (self.options.zoomType == "window") {
                self.zoomWindowStyle = "overflow: hidden;"
                    + "background-position: 0px 0px;text-align:center;"
                    + "background-color: " + String(self.options.zoomWindowBgColour)
                    + ";width: " + String(self.options.zoomWindowWidth) + "px;"
                    + "height: " + String(self.options.zoomWindowHeight)
                    + "px;float: left;"
                    + "background-size: " + self.largeWidth / self.currentZoomLevel + "px " + self.largeHeight / self.currentZoomLevel + "px;"
                    + "display: none;z-index:100;"
                    + "border: " + String(self.options.borderSize)
                    + "px solid " + self.options.borderColour
                    + ";background-repeat: no-repeat;"
                    + "position: absolute;";
            }


            //if inner  zoom    
            if (self.options.zoomType == "inner") {
                //has a border been put on the image? Lets cater for this

                var borderWidth = self.$elem.css("border-left-width");

                self.zoomWindowStyle = "overflow: hidden;"
                    + "margin-left: " + String(borderWidth) + ";"
                    + "margin-top: " + String(borderWidth) + ";"
                    + "background-position: 0px 0px;"
                    + "width: " + String(self.nzWidth) + "px;"
                    + "height: " + String(self.nzHeight) + "px;"
                    + "px;float: left;"
                    + "display: none;"
                    + "cursor:" + (self.options.cursor) + ";"
                    + "px solid " + self.options.borderColour
                    + ";background-repeat: no-repeat;"
                    + "position: absolute;";
            }



            //lens style for window zoom
            if (self.options.zoomType == "window") {


                // adjust images less than the window height

                if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                    lensHeight = self.nzHeight;
                }
                else {
                    lensHeight = String((self.options.zoomWindowHeight / self.heightRatio))
                }
                if (self.largeWidth < self.options.zoomWindowWidth) {
                    lensWidth = self.nzWidth;
                }
                else {
                    lensWidth = (self.options.zoomWindowWidth / self.widthRatio);
                }


                self.lensStyle = "background-position: 0px 0px;width: " + String((self.options.zoomWindowWidth) / self.widthRatio) + "px;height: " + String((self.options.zoomWindowHeight) / self.heightRatio)
                    + "px;float: right;display: none;"
                    + "overflow: hidden;"
                    + "z-index: 999;"
                    + "-webkit-transform: translateZ(0);"
                    + "opacity:" + (self.options.lensOpacity) + ";filter: alpha(opacity = " + (self.options.lensOpacity * 100) + "); zoom:1;"
                    + "width:" + lensWidth + "px;"
                    + "height:" + lensHeight + "px;"
                    + "background-color:" + (self.options.lensColour) + ";"
                    + "cursor:" + (self.options.cursor) + ";"
                    + "border: " + (self.options.lensBorderSize) + "px" +
                    " solid " + (self.options.lensBorderColour) + ";background-repeat: no-repeat;position: absolute;";
            }


            //tint style
            self.tintStyle = "display: block;"
                + "position: absolute;"
                + "background-color: " + self.options.tintColour + ";"
                + "filter:alpha(opacity=0);"
                + "opacity: 0;"
                + "width: " + self.nzWidth + "px;"
                + "height: " + self.nzHeight + "px;"

                ;

            //lens style for lens zoom with optional round for modern browsers
            self.lensRound = '';

            if (self.options.zoomType == "lens") {

                self.lensStyle = "background-position: 0px 0px;"
                    + "float: left;display: none;"
                    + "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour + ";"
                    + "width:" + String(self.options.lensSize) + "px;"
                    + "height:" + String(self.options.lensSize) + "px;"
                    + "background-repeat: no-repeat;position: absolute;";


            }


            //does not round in all browsers
            if (self.options.lensShape == "round") {
                self.lensRound = "border-top-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
                    + "border-top-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
                    + "border-bottom-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
                    + "border-bottom-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;";

            }

            //create the div's                                                + ""
            //self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});

            self.zoomContainer = $('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:fixed;left:' + self.nzOffset.left + 'px;top:' + self.nzOffset.top + 'px;height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;"></div>');
            //$('body').append(self.zoomContainer);
            self.$elem.after(self.zoomContainer);


            //this will add overflow hidden and contrain the lens on lens mode       
            if (self.options.containLensZoom && self.options.zoomType == "lens") {
                self.zoomContainer.css("overflow", "hidden");
            }
            if (self.options.zoomType != "inner") {
                self.zoomLens = $("<div class='zoomLens' style='" + self.lensStyle + self.lensRound + "'>&nbsp;</div>")
                    .appendTo(self.zoomContainer)
                    .click(function () {
                        self.$elem.trigger('click');
                    });


                if (self.options.tint) {
                    self.tintContainer = $('<div/>').addClass('tintContainer');
                    self.zoomTint = $("<div class='zoomTint' style='" + self.tintStyle + "'></div>");


                    self.zoomLens.wrap(self.tintContainer);


                    self.zoomTintcss = self.zoomLens.after(self.zoomTint);

                    //if tint enabled - set an image to show over the tint

                    self.zoomTintImage = $('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + self.nzWidth + 'px; height: ' + self.nzHeight + 'px;" src="' + self.imageSrc + '">')
                        .appendTo(self.zoomLens)
                        .click(function () {

                            self.$elem.trigger('click');
                        });

                }

            }







            //create zoom window 
            if (isNaN(self.options.zoomWindowPosition)) {
                self.zoomWindow = $("<div style='z-index:999;left:" + (self.windowOffsetLeft) + "px;top:" + (self.windowOffsetTop) + "px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
                    .appendTo('body')
                    .click(function () {
                        self.$elem.trigger('click');
                    });
            } else {
                self.zoomWindow = $("<div style='z-index:999;left:" + (self.windowOffsetLeft) + "px;top:" + (self.windowOffsetTop) + "px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
                    .appendTo(self.zoomContainer)
                    .click(function () {
                        self.$elem.trigger('click');
                    });
            }
            self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css("width", self.options.zoomWindowWidth);
            self.zoomWindow.wrap(self.zoomWindowContainer);


            //  self.captionStyle = "text-align: left;background-color: black;color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";                                                                                                                                                                                                                                          
            // self.zoomCaption = $('<div class="elevatezoom-caption" style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

            if (self.options.zoomType == "lens") {
                self.zoomLens.css({ backgroundImage: "url('" + self.imageSrc + "')" });
            }
            if (self.options.zoomType == "window") {
                self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" });
            }
            if (self.options.zoomType == "inner") {
                self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" });
            }
            /*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
            //touch events
            self.$elem.bind('touchmove', function (e) {
                e.preventDefault();
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                self.setPosition(touch);

            });
            self.zoomContainer.bind('touchmove', function (e) {
                if (self.options.zoomType == "inner") {
                    self.showHideWindow("show");

                }
                e.preventDefault();
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                self.setPosition(touch);

            });
            self.zoomContainer.bind('touchend', function (e) {
                self.showHideWindow("hide");
                if (self.options.showLens) { self.showHideLens("hide"); }
                if (self.options.tint && self.options.zoomType != "inner") { self.showHideTint("hide"); }
            });

            self.$elem.bind('touchend', function (e) {
                self.showHideWindow("hide");
                if (self.options.showLens) { self.showHideLens("hide"); }
                if (self.options.tint && self.options.zoomType != "inner") { self.showHideTint("hide"); }
            });
            if (self.options.showLens) {
                self.zoomLens.bind('touchmove', function (e) {

                    e.preventDefault();
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    self.setPosition(touch);
                });


                self.zoomLens.bind('touchend', function (e) {
                    self.showHideWindow("hide");
                    if (self.options.showLens) { self.showHideLens("hide"); }
                    if (self.options.tint && self.options.zoomType != "inner") { self.showHideTint("hide"); }
                });
            }
            //Needed to work in IE
            self.$elem.bind('mousemove', function (e) {
                if (self.overWindow == false) { self.setElements("show"); }
                //make sure on orientation change the setposition is not fired
                if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                    self.setPosition(e);
                    self.currentLoc = e;
                }
                self.lastX = e.clientX;
                self.lastY = e.clientY;

            });

            self.zoomContainer.bind('mousemove', function (e) {

                if (self.overWindow == false) { self.setElements("show"); }

                //make sure on orientation change the setposition is not fired 
                if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                    self.setPosition(e);
                    self.currentLoc = e;
                }
                self.lastX = e.clientX;
                self.lastY = e.clientY;
            });
            if (self.options.zoomType != "inner") {
                self.zoomLens.bind('mousemove', function (e) {
                    //make sure on orientation change the setposition is not fired
                    if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                        self.setPosition(e);
                        self.currentLoc = e;
                    }
                    self.lastX = e.clientX;
                    self.lastY = e.clientY;
                });
            }
            if (self.options.tint && self.options.zoomType != "inner") {
                self.zoomTint.bind('mousemove', function (e) {
                    //make sure on orientation change the setposition is not fired
                    if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                        self.setPosition(e);
                        self.currentLoc = e;
                    }
                    self.lastX = e.clientX;
                    self.lastY = e.clientY;
                });

            }
            if (self.options.zoomType == "inner") {
                self.zoomWindow.bind('mousemove', function (e) {
                    //self.overWindow = true;
                    //make sure on orientation change the setposition is not fired
                    if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                        self.setPosition(e);
                        self.currentLoc = e;
                    }
                    self.lastX = e.clientX;
                    self.lastY = e.clientY;
                });

            }


            //  lensFadeOut: 500,  zoomTintFadeIn
            self.zoomContainer.add(self.$elem).mouseenter(function () {

                if (self.overWindow == false) { self.setElements("show"); }


            }).mouseleave(function () {
                if (!self.scrollLock) {
                    self.setElements("hide");
                    self.options.onDestroy(self.$elem);
                }
            });
            //end ove image





            if (self.options.zoomType != "inner") {
                self.zoomWindow.mouseenter(function () {
                    self.overWindow = true;
                    self.setElements("hide");
                }).mouseleave(function () {

                    self.overWindow = false;
                });
            }
            //end ove image



            //				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);

            //      $(this).empty();    
            //    return false;

            //fix for initial zoom setting
            if (self.options.zoomLevel != 1) {
                //	self.changeZoomLevel(self.currentZoomLevel);
            }
            //set the min zoomlevel
            if (self.options.minZoomLevel) {
                self.minZoomLevel = self.options.minZoomLevel;
            }
            else {
                self.minZoomLevel = self.options.scrollZoomIncrement * 2;
            }


            if (self.options.scrollZoom) {


                self.zoomContainer.add(self.$elem).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (e) {


                    //						in IE there is issue with firing of mouseleave - So check whether still scrolling
                    //						and on mouseleave check if scrolllock          
                    self.scrollLock = true;
                    clearTimeout($.data(this, 'timer'));
                    $.data(this, 'timer', setTimeout(function () {
                        self.scrollLock = false;
                        //do something
                    }, 250));

                    var theEvent = e.originalEvent.wheelDelta || e.originalEvent.detail * -1


                    //this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                    //   e.preventDefault();


                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();


                    if (theEvent / 120 > 0) {
                        //scrolling up
                        if (self.currentZoomLevel >= self.minZoomLevel) {
                            self.changeZoomLevel(self.currentZoomLevel - self.options.scrollZoomIncrement);
                        }

                    }
                    else {
                        //scrolling down


                        if (self.options.maxZoomLevel) {
                            if (self.currentZoomLevel <= self.options.maxZoomLevel) {
                                self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
                            }
                        }
                        else {
                            //andy 

                            self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
                        }

                    }
                    return false;
                });
            }


        },
        setElements: function (type) {
            var self = this;
            if (!self.options.zoomEnabled) { return false; }
            if (type == "show") {
                if (self.isWindowSet) {
                    if (self.options.zoomType == "inner") { self.showHideWindow("show"); }
                    if (self.options.zoomType == "window") { self.showHideWindow("show"); }
                    if (self.options.showLens) { self.showHideLens("show"); }
                    if (self.options.tint && self.options.zoomType != "inner") {
                        self.showHideTint("show");
                    }
                }
            }

            if (type == "hide") {
                if (self.options.zoomType == "window") { self.showHideWindow("hide"); }
                if (!self.options.tint) { self.showHideWindow("hide"); }
                if (self.options.showLens) { self.showHideLens("hide"); }
                if (self.options.tint) { self.showHideTint("hide"); }
            }
        },
        setPosition: function (e) {

            var self = this;

            if (!self.options.zoomEnabled) { return false; }

            //recaclc offset each time in case the image moves
            //this can be caused by other on page elements
            self.nzHeight = self.$elem.height();
            self.nzWidth = self.$elem.width();
            self.nzOffset = self.$elem.offset();

            if (self.options.tint && self.options.zoomType != "inner") {
                self.zoomTint.css({ top: 0 });
                self.zoomTint.css({ left: 0 });
            }
            //set responsive       
            //will checking if the image needs changing before running this code work faster?
            if (self.options.responsive && !self.options.scrollZoom) {
                if (self.options.showLens) {
                    if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                        lensHeight = self.nzHeight;
                    }
                    else {
                        lensHeight = String((self.options.zoomWindowHeight / self.heightRatio))
                    }
                    if (self.largeWidth < self.options.zoomWindowWidth) {
                        lensWidth = self.nzWidth;
                    }
                    else {
                        lensWidth = (self.options.zoomWindowWidth / self.widthRatio);
                    }
                    self.widthRatio = self.largeWidth / self.nzWidth;
                    self.heightRatio = self.largeHeight / self.nzHeight;
                    if (self.options.zoomType != "lens") {


                        //possibly dont need to keep recalcalculating
                        //if the lens is heigher than the image, then set lens size to image size
                        if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                            lensHeight = self.nzHeight;

                        }
                        else {
                            lensHeight = String((self.options.zoomWindowHeight / self.heightRatio))
                        }

                        if (self.nzWidth < self.options.zoomWindowHeight / self.heightRatio) {
                            lensWidth = self.nzWidth;
                        }
                        else {
                            lensWidth = String((self.options.zoomWindowWidth / self.widthRatio));
                        }

                        self.zoomLens.css('width', lensWidth);
                        self.zoomLens.css('height', lensHeight);

                        if (self.options.tint) {
                            self.zoomTintImage.css('width', self.nzWidth);
                            self.zoomTintImage.css('height', self.nzHeight);
                        }

                    }
                    if (self.options.zoomType == "lens") {

                        self.zoomLens.css({ width: String(self.options.lensSize) + 'px', height: String(self.options.lensSize) + 'px' })


                    }
                    //end responsive image change
                }
            }

            //container fix
            self.zoomContainer.css({ top: self.nzOffset.top });
            self.zoomContainer.css({ left: self.nzOffset.left });
            self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
            self.mouseTop = parseInt(e.pageY - self.nzOffset.top);
            //calculate the Location of the Lens

            //calculate the bound regions - but only if zoom window
            if (self.options.zoomType == "window") {
                self.Etoppos = (self.mouseTop < (self.zoomLens.height() / 2));
                self.Eboppos = (self.mouseTop > self.nzHeight - (self.zoomLens.height() / 2) - (self.options.lensBorderSize * 2));
                self.Eloppos = (self.mouseLeft < 0 + ((self.zoomLens.width() / 2)));
                self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.zoomLens.width() / 2) - (self.options.lensBorderSize * 2)));
            }
            //calculate the bound regions - but only for inner zoom
            if (self.options.zoomType == "inner") {
                self.Etoppos = (self.mouseTop < ((self.nzHeight / 2) / self.heightRatio));
                self.Eboppos = (self.mouseTop > (self.nzHeight - ((self.nzHeight / 2) / self.heightRatio)));
                self.Eloppos = (self.mouseLeft < 0 + (((self.nzWidth / 2) / self.widthRatio)));
                self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.nzWidth / 2) / self.widthRatio - (self.options.lensBorderSize * 2)));
            }

            // if the mouse position of the slider is one of the outerbounds, then hide  window and lens
            if (self.mouseLeft < 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight) {
                self.setElements("hide");
                return;
            }
            //else continue with operations
            else {


                //lens options
                if (self.options.showLens) {
                    //		self.showHideLens("show");
                    //set background position of lens
                    self.lensLeftPos = String(Math.floor(self.mouseLeft - self.zoomLens.width() / 2));
                    self.lensTopPos = String(Math.floor(self.mouseTop - self.zoomLens.height() / 2));


                }
                //adjust the background position if the mouse is in one of the outer regions 

                //Top region
                if (self.Etoppos) {
                    self.lensTopPos = 0;
                }
                //Left Region
                if (self.Eloppos) {
                    self.windowLeftPos = 0;
                    self.lensLeftPos = 0;
                    self.tintpos = 0;
                }
                //Set bottom and right region for window mode
                if (self.options.zoomType == "window") {
                    if (self.Eboppos) {
                        self.lensTopPos = Math.max((self.nzHeight) - self.zoomLens.height() - (self.options.lensBorderSize * 2), 0);
                    }
                    if (self.Eroppos) {
                        self.lensLeftPos = (self.nzWidth - (self.zoomLens.width()) - (self.options.lensBorderSize * 2));
                    }
                }
                //Set bottom and right region for inner mode
                if (self.options.zoomType == "inner") {
                    if (self.Eboppos) {
                        self.lensTopPos = Math.max(((self.nzHeight) - (self.options.lensBorderSize * 2)), 0);
                    }
                    if (self.Eroppos) {
                        self.lensLeftPos = (self.nzWidth - (self.nzWidth) - (self.options.lensBorderSize * 2));
                    }

                }
                //if lens zoom
                if (self.options.zoomType == "lens") {
                    self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * (-1));
                    self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * (-1));

                    self.zoomLens.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });

                    if (self.changeBgSize) {

                        if (self.nzHeight > self.nzWidth) {
                            if (self.options.zoomType == "lens") {
                                self.zoomLens.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                            }

                            self.zoomWindow.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                        }
                        else {
                            if (self.options.zoomType == "lens") {
                                self.zoomLens.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                            }
                            self.zoomWindow.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                        }
                        self.changeBgSize = false;
                    }

                    self.setWindowPostition(e);
                }
                //if tint zoom   
                if (self.options.tint && self.options.zoomType != "inner") {
                    self.setTintPosition(e);

                }
                //set the css background position 
                if (self.options.zoomType == "window") {
                    self.setWindowPostition(e);
                }
                if (self.options.zoomType == "inner") {
                    self.setWindowPostition(e);
                }
                if (self.options.showLens) {

                    if (self.fullwidth && self.options.zoomType != "lens") {
                        self.lensLeftPos = 0;

                    }
                    self.zoomLens.css({ left: self.lensLeftPos + 'px', top: self.lensTopPos + 'px' })
                }

            } //end else



        },
        showHideWindow: function (change) {
            var self = this;
            if (change == "show") {
                if (!self.isWindowActive) {
                    if (self.options.zoomWindowFadeIn) {
                        self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
                    }
                    else { self.zoomWindow.show(); }
                    self.isWindowActive = true;
                }
            }
            if (change == "hide") {
                if (self.isWindowActive) {
                    if (self.options.zoomWindowFadeOut) {
                        self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut, function () {
                            if (self.loop) {
                                //stop moving the zoom window when zoom window is faded out
                                clearInterval(self.loop);
                                self.loop = false;
                            }
                        });
                    }
                    else { self.zoomWindow.hide(); }
                    self.isWindowActive = false;
                }
            }
        },
        showHideLens: function (change) {
            var self = this;
            if (change == "show") {
                if (!self.isLensActive) {
                    if (self.options.lensFadeIn) {
                        self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
                    }
                    else { self.zoomLens.show(); }
                    self.isLensActive = true;
                }
            }
            if (change == "hide") {
                if (self.isLensActive) {
                    if (self.options.lensFadeOut) {
                        self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
                    }
                    else { self.zoomLens.hide(); }
                    self.isLensActive = false;
                }
            }
        },
        showHideTint: function (change) {
            var self = this;
            if (change == "show") {
                if (!self.isTintActive) {

                    if (self.options.zoomTintFadeIn) {
                        self.zoomTint.css({ opacity: self.options.tintOpacity }).animate().stop(true, true).fadeIn("slow");
                    }
                    else {
                        self.zoomTint.css({ opacity: self.options.tintOpacity }).animate();
                        self.zoomTint.show();


                    }
                    self.isTintActive = true;
                }
            }
            if (change == "hide") {
                if (self.isTintActive) {

                    if (self.options.zoomTintFadeOut) {
                        self.zoomTint.stop(true, true).fadeOut(self.options.zoomTintFadeOut);
                    }
                    else { self.zoomTint.hide(); }
                    self.isTintActive = false;
                }
            }
        },
        setLensPostition: function (e) {


        },
        setWindowPostition: function (e) {
            //return obj.slice( 0, count );
            var self = this;

            if (!isNaN(self.options.zoomWindowPosition)) {

                switch (self.options.zoomWindowPosition) {
                    case 1: //done         
                        self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
                        self.windowOffsetLeft = (+self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 2:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin

                            self.windowOffsetTop = ((self.options.zoomWindowHeight / 2) - (self.nzHeight / 2)) * (-1);
                            self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        }
                        else { //negative margin

                        }
                        break;
                    case 3: //done        
                        self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize * 2)); //DONE 3,9
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 4: //done  
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 5: //done  
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.nzWidth - self.zoomWindow.width() - (self.options.borderSize * 2)); //DONE - 5,15
                        break;
                    case 6:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin
                            self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8

                            self.windowOffsetLeft = ((self.options.zoomWindowWidth / 2) - (self.nzWidth / 2) + (self.options.borderSize * 2)) * (-1);
                        }
                        else { //negative margin

                        }


                        break;
                    case 7: //done  
                        self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = 0; //DONE 7, 13
                        break;
                    case 8: //done  
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1);  //DONE 8,9,10,11,12
                        break;
                    case 9:  //done  
                        self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize * 2)); //DONE 3,9
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1);  //DONE 8,9,10,11,12
                        break;
                    case 10:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin

                            self.windowOffsetTop = ((self.options.zoomWindowHeight / 2) - (self.nzHeight / 2)) * (-1);
                            self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1);  //DONE 8,9,10,11,12
                        }
                        else { //negative margin

                        }
                        break;
                    case 11:
                        self.windowOffsetTop = (self.options.zoomWindowOffety);
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1);  //DONE 8,9,10,11,12
                        break;
                    case 12: //done  
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1);  //DONE 8,9,10,11,12
                        break;
                    case 13: //done  
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (0); //DONE 7, 13
                        break;
                    case 14:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin
                            self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16

                            self.windowOffsetLeft = ((self.options.zoomWindowWidth / 2) - (self.nzWidth / 2) + (self.options.borderSize * 2)) * (-1);
                        }
                        else { //negative margin

                        }

                        break;
                    case 15://done   
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.nzWidth - self.zoomWindow.width() - (self.options.borderSize * 2)); //DONE - 5,15
                        break;
                    case 16:  //done  
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    default: //done  
                        self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                }
            } //end isNAN
            else {
                //WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
                self.externalContainer = $('#' + self.options.zoomWindowPosition);
                self.externalContainerWidth = self.externalContainer.width();
                self.externalContainerHeight = self.externalContainer.height();
                self.externalContainerOffset = self.externalContainer.offset();

                self.windowOffsetTop = self.externalContainerOffset.top;//DONE - 1
                self.windowOffsetLeft = self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16

            }
            self.isWindowSet = true;
            self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffety;
            self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffetx;

            self.zoomWindow.css({ top: self.windowOffsetTop });
            self.zoomWindow.css({ left: self.windowOffsetLeft });

            if (self.options.zoomType == "inner") {
                self.zoomWindow.css({ top: 0 });
                self.zoomWindow.css({ left: 0 });

            }


            self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1));
            self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));
            if (self.Etoppos) { self.windowTopPos = 0; }
            if (self.Eloppos) { self.windowLeftPos = 0; }
            if (self.Eboppos) { self.windowTopPos = (self.largeHeight / self.currentZoomLevel - self.zoomWindow.height()) * (-1); }
            if (self.Eroppos) { self.windowLeftPos = ((self.largeWidth / self.currentZoomLevel - self.zoomWindow.width()) * (-1)); }

            //stops micro movements
            if (self.fullheight) {
                self.windowTopPos = 0;

            }
            if (self.fullwidth) {
                self.windowLeftPos = 0;

            }
            //set the css background position 


            if (self.options.zoomType == "window" || self.options.zoomType == "inner") {

                if (self.zoomLock == 1) {
                    //overrides for images not zoomable
                    if (self.widthRatio <= 1) {

                        self.windowLeftPos = 0;
                    }
                    if (self.heightRatio <= 1) {
                        self.windowTopPos = 0;
                    }
                }
                // adjust images less than the window height

                if (self.options.zoomType == "window") {
                    if (self.largeHeight < self.options.zoomWindowHeight) {

                        self.windowTopPos = 0;
                    }
                    if (self.largeWidth < self.options.zoomWindowWidth) {
                        self.windowLeftPos = 0;
                    }
                }

                //set the zoomwindow background position
                if (self.options.easing) {

                    //     if(self.changeZoom){
                    //           clearInterval(self.loop);
                    //           self.changeZoom = false;
                    //           self.loop = false;

                    //            }
                    //set the pos to 0 if not set
                    if (!self.xp) { self.xp = 0; }
                    if (!self.yp) { self.yp = 0; }
                    //if loop not already started, then run it 
                    if (!self.loop) {
                        self.loop = setInterval(function () {
                            //using zeno's paradox    

                            self.xp += (self.windowLeftPos - self.xp) / self.options.easingAmount;
                            self.yp += (self.windowTopPos - self.yp) / self.options.easingAmount;
                            if (self.scrollingLock) {


                                clearInterval(self.loop);
                                self.xp = self.windowLeftPos;
                                self.yp = self.windowTopPos

                                self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1);
                                self.yp = (((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));

                                if (self.changeBgSize) {
                                    if (self.nzHeight > self.nzWidth) {
                                        if (self.options.zoomType == "lens") {
                                            self.zoomLens.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                                        }
                                        self.zoomWindow.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                                    }
                                    else {
                                        if (self.options.zoomType != "lens") {
                                            self.zoomLens.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                                        }
                                        self.zoomWindow.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });

                                    }

                                    /*
         if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
                    if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}  
             if (!self.bgloop){   
                  self.bgloop = setInterval(function(){   

             self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount; 
                            self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;

       self.zoomWindow.css({ "background-size": self.bgxp + 'px ' + self.bgyp + 'px' });


              }, 16);

             }
                                     */
                                    self.changeBgSize = false;
                                }

                                self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
                                self.scrollingLock = false;
                                self.loop = false;

                            }
                            else if (Math.round(Math.abs(self.xp - self.windowLeftPos) + Math.abs(self.yp - self.windowTopPos)) < 1) {
                                //stops micro movements
                                clearInterval(self.loop);
                                self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
                                self.loop = false;
                            }
                            else {
                                if (self.changeBgSize) {
                                    if (self.nzHeight > self.nzWidth) {
                                        if (self.options.zoomType == "lens") {
                                            self.zoomLens.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                                        }
                                        self.zoomWindow.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                                    }
                                    else {
                                        if (self.options.zoomType != "lens") {
                                            self.zoomLens.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                                        }
                                        self.zoomWindow.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                                    }
                                    self.changeBgSize = false;
                                }

                                self.zoomWindow.css({ backgroundPosition: self.xp + 'px ' + self.yp + 'px' });
                            }
                        }, 16);
                    }
                }
                else {
                    if (self.changeBgSize) {
                        if (self.nzHeight > self.nzWidth) {
                            if (self.options.zoomType == "lens") {
                                self.zoomLens.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                            }

                            self.zoomWindow.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                        }
                        else {
                            if (self.options.zoomType == "lens") {
                                self.zoomLens.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                            }
                            if ((self.largeHeight / self.newvaluewidth) < self.options.zoomWindowHeight) {

                                self.zoomWindow.css({ "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px' });
                            }
                            else {

                                self.zoomWindow.css({ "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px' });
                            }

                        }
                        self.changeBgSize = false;
                    }

                    self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
                }
            }
        },
        setTintPosition: function (e) {
            var self = this;
            self.nzOffset = self.$elem.offset();
            self.tintpos = String(((e.pageX - self.nzOffset.left) - (self.zoomLens.width() / 2)) * (-1));
            self.tintposy = String(((e.pageY - self.nzOffset.top) - self.zoomLens.height() / 2) * (-1));
            if (self.Etoppos) {
                self.tintposy = 0;
            }
            if (self.Eloppos) {
                self.tintpos = 0;
            }
            if (self.Eboppos) {
                self.tintposy = (self.nzHeight - self.zoomLens.height() - (self.options.lensBorderSize * 2)) * (-1);
            }
            if (self.Eroppos) {
                self.tintpos = ((self.nzWidth - self.zoomLens.width() - (self.options.lensBorderSize * 2)) * (-1));
            }
            if (self.options.tint) {
                //stops micro movements
                if (self.fullheight) {
                    self.tintposy = 0;

                }
                if (self.fullwidth) {
                    self.tintpos = 0;

                }
                self.zoomTintImage.css({ 'left': self.tintpos + 'px' });
                self.zoomTintImage.css({ 'top': self.tintposy + 'px' });
            }
        },

        swaptheimage: function (smallimage, largeimage) {
            var self = this;
            var newImg = new Image();

            if (self.options.loadingIcon) {
                self.spinner = $('<div style="background: url(\'' + self.options.loadingIcon + '\') no-repeat center;height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>');
                self.$elem.after(self.spinner);
            }

            self.options.onImageSwap(self.$elem);

            newImg.onload = function () {
                self.largeWidth = newImg.width;
                self.largeHeight = newImg.height;
                self.zoomImage = largeimage;
                self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });
                self.swapAction(smallimage, largeimage);
                return;
            }
            newImg.src = largeimage; // this must be done AFTER setting onload

        },
        swapAction: function (smallimage, largeimage) {


            var self = this;

            var newImg2 = new Image();
            newImg2.onload = function () {
                //re-calculate values
                self.nzHeight = newImg2.height;
                self.nzWidth = newImg2.width;
                self.options.onImageSwapComplete(self.$elem);

                self.doneCallback();
                return;
            }
            newImg2.src = smallimage;

            //reset the zoomlevel to that initially set in options
            self.currentZoomLevel = self.options.zoomLevel;
            self.options.maxZoomLevel = false;

            //swaps the main image
            //self.$elem.attr("src",smallimage);
            //swaps the zoom image     
            if (self.options.zoomType == "lens") {
                self.zoomLens.css({ backgroundImage: "url('" + largeimage + "')" });
            }
            if (self.options.zoomType == "window") {
                self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" });
            }
            if (self.options.zoomType == "inner") {
                self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" });
            }



            self.currentImage = largeimage;

            if (self.options.imageCrossfade) {
                var oldImg = self.$elem;
                var newImg = oldImg.clone();
                self.$elem.attr("src", smallimage)
                self.$elem.after(newImg);
                newImg.stop(true).fadeOut(self.options.imageCrossfade, function () {
                    $(this).remove();
                });

                //       				if(self.options.zoomType == "inner"){
                //remove any attributes on the cloned image so we can resize later
                self.$elem.width("auto").removeAttr("width");
                self.$elem.height("auto").removeAttr("height");
                //   }

                oldImg.fadeIn(self.options.imageCrossfade);

                if (self.options.tint && self.options.zoomType != "inner") {

                    var oldImgTint = self.zoomTintImage;
                    var newImgTint = oldImgTint.clone();
                    self.zoomTintImage.attr("src", largeimage)
                    self.zoomTintImage.after(newImgTint);
                    newImgTint.stop(true).fadeOut(self.options.imageCrossfade, function () {
                        $(this).remove();
                    });



                    oldImgTint.fadeIn(self.options.imageCrossfade);


                    //self.zoomTintImage.attr("width",elem.data("image"));

                    //resize the tint window
                    self.zoomTint.css({ height: self.$elem.height() });
                    self.zoomTint.css({ width: self.$elem.width() });
                }

                self.zoomContainer.css("height", self.$elem.height());
                self.zoomContainer.css("width", self.$elem.width());

                if (self.options.zoomType == "inner") {
                    if (!self.options.constrainType) {
                        self.zoomWrap.parent().css("height", self.$elem.height());
                        self.zoomWrap.parent().css("width", self.$elem.width());

                        self.zoomWindow.css("height", self.$elem.height());
                        self.zoomWindow.css("width", self.$elem.width());
                    }
                }

                if (self.options.imageCrossfade) {
                    self.zoomWrap.css("height", self.$elem.height());
                    self.zoomWrap.css("width", self.$elem.width());
                }
            }
            else {
                self.$elem.attr("src", smallimage);
                if (self.options.tint) {
                    self.zoomTintImage.attr("src", largeimage);
                    //self.zoomTintImage.attr("width",elem.data("image"));
                    self.zoomTintImage.attr("height", self.$elem.height());
                    //self.zoomTintImage.attr('src') = elem.data("image");
                    self.zoomTintImage.css({ height: self.$elem.height() });
                    self.zoomTint.css({ height: self.$elem.height() });

                }
                self.zoomContainer.css("height", self.$elem.height());
                self.zoomContainer.css("width", self.$elem.width());

                if (self.options.imageCrossfade) {
                    self.zoomWrap.css("height", self.$elem.height());
                    self.zoomWrap.css("width", self.$elem.width());
                }
            }
            if (self.options.constrainType) {

                //This will contrain the image proportions
                if (self.options.constrainType == "height") {

                    self.zoomContainer.css("height", self.options.constrainSize);
                    self.zoomContainer.css("width", "auto");

                    if (self.options.imageCrossfade) {
                        self.zoomWrap.css("height", self.options.constrainSize);
                        self.zoomWrap.css("width", "auto");
                        self.constwidth = self.zoomWrap.width();


                    }
                    else {
                        self.$elem.css("height", self.options.constrainSize);
                        self.$elem.css("width", "auto");
                        self.constwidth = self.$elem.width();
                    }

                    if (self.options.zoomType == "inner") {

                        self.zoomWrap.parent().css("height", self.options.constrainSize);
                        self.zoomWrap.parent().css("width", self.constwidth);
                        self.zoomWindow.css("height", self.options.constrainSize);
                        self.zoomWindow.css("width", self.constwidth);
                    }
                    if (self.options.tint) {
                        self.tintContainer.css("height", self.options.constrainSize);
                        self.tintContainer.css("width", self.constwidth);
                        self.zoomTint.css("height", self.options.constrainSize);
                        self.zoomTint.css("width", self.constwidth);
                        self.zoomTintImage.css("height", self.options.constrainSize);
                        self.zoomTintImage.css("width", self.constwidth);
                    }

                }
                if (self.options.constrainType == "width") {
                    self.zoomContainer.css("height", "auto");
                    self.zoomContainer.css("width", self.options.constrainSize);

                    if (self.options.imageCrossfade) {
                        self.zoomWrap.css("height", "auto");
                        self.zoomWrap.css("width", self.options.constrainSize);
                        self.constheight = self.zoomWrap.height();
                    }
                    else {
                        self.$elem.css("height", "auto");
                        self.$elem.css("width", self.options.constrainSize);
                        self.constheight = self.$elem.height();
                    }
                    if (self.options.zoomType == "inner") {
                        self.zoomWrap.parent().css("height", self.constheight);
                        self.zoomWrap.parent().css("width", self.options.constrainSize);
                        self.zoomWindow.css("height", self.constheight);
                        self.zoomWindow.css("width", self.options.constrainSize);
                    }
                    if (self.options.tint) {
                        self.tintContainer.css("height", self.constheight);
                        self.tintContainer.css("width", self.options.constrainSize);
                        self.zoomTint.css("height", self.constheight);
                        self.zoomTint.css("width", self.options.constrainSize);
                        self.zoomTintImage.css("height", self.constheight);
                        self.zoomTintImage.css("width", self.options.constrainSize);
                    }

                }


            }

        },
        doneCallback: function () {

            var self = this;
            if (self.options.loadingIcon) {
                self.spinner.hide();
            }

            self.nzOffset = self.$elem.offset();
            self.nzWidth = self.$elem.width();
            self.nzHeight = self.$elem.height();

            // reset the zoomlevel back to default
            self.currentZoomLevel = self.options.zoomLevel;

            //ratio of the large to small image
            self.widthRatio = self.largeWidth / self.nzWidth;
            self.heightRatio = self.largeHeight / self.nzHeight;

            //NEED TO ADD THE LENS SIZE FOR ROUND
            // adjust images less than the window height
            if (self.options.zoomType == "window") {

                if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                    lensHeight = self.nzHeight;

                }
                else {
                    lensHeight = String((self.options.zoomWindowHeight / self.heightRatio))
                }

                if (self.options.zoomWindowWidth < self.options.zoomWindowWidth) {
                    lensWidth = self.nzWidth;
                }
                else {
                    lensWidth = (self.options.zoomWindowWidth / self.widthRatio);
                }


                if (self.zoomLens) {

                    self.zoomLens.css('width', lensWidth);
                    self.zoomLens.css('height', lensHeight);


                }
            }
        },
        getCurrentImage: function () {
            var self = this;
            return self.zoomImage;
        },
        getGalleryList: function () {
            var self = this;
            //loop through the gallery options and set them in list for fancybox
            self.gallerylist = [];
            if (self.options.gallery) {


                $('#' + self.options.gallery + ' a').each(function () {

                    var img_src = '';
                    if ($(this).data("zoom-image")) {
                        img_src = $(this).data("zoom-image");
                    }
                    else if ($(this).data("image")) {
                        img_src = $(this).data("image");
                    }
                    //put the current image at the start
                    if (img_src == self.zoomImage) {
                        self.gallerylist.unshift({
                            href: '' + img_src + '',
                            title: $(this).find('img').attr("title")
                        });
                    }
                    else {
                        self.gallerylist.push({
                            href: '' + img_src + '',
                            title: $(this).find('img').attr("title")
                        });
                    }


                });
            }
            //if no gallery - return current image
            else {
                self.gallerylist.push({
                    href: '' + self.zoomImage + '',
                    title: $(this).find('img').attr("title")
                });
            }
            return self.gallerylist;

        },
        changeZoomLevel: function (value) {
            var self = this;

            //flag a zoom, so can adjust the easing during setPosition     
            self.scrollingLock = true;

            //round to two decimal places
            self.newvalue = parseFloat(value).toFixed(2);
            newvalue = parseFloat(value).toFixed(2);




            //maxwidth & Maxheight of the image
            maxheightnewvalue = self.largeHeight / ((self.options.zoomWindowHeight / self.nzHeight) * self.nzHeight);
            maxwidthtnewvalue = self.largeWidth / ((self.options.zoomWindowWidth / self.nzWidth) * self.nzWidth);




            //calculate new heightratio
            if (self.options.zoomType != "inner") {
                if (maxheightnewvalue <= newvalue) {
                    self.heightRatio = (self.largeHeight / maxheightnewvalue) / self.nzHeight;
                    self.newvalueheight = maxheightnewvalue;
                    self.fullheight = true;

                }
                else {
                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;
                    self.newvalueheight = newvalue;
                    self.fullheight = false;

                }


                //					calculate new width ratio

                if (maxwidthtnewvalue <= newvalue) {
                    self.widthRatio = (self.largeWidth / maxwidthtnewvalue) / self.nzWidth;
                    self.newvaluewidth = maxwidthtnewvalue;
                    self.fullwidth = true;

                }
                else {
                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    self.newvaluewidth = newvalue;
                    self.fullwidth = false;

                }
                if (self.options.zoomType == "lens") {
                    if (maxheightnewvalue <= newvalue) {
                        self.fullwidth = true;
                        self.newvaluewidth = maxheightnewvalue;

                    } else {
                        self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                        self.newvaluewidth = newvalue;

                        self.fullwidth = false;
                    }
                }
            }



            if (self.options.zoomType == "inner") {
                maxheightnewvalue = parseFloat(self.largeHeight / self.nzHeight).toFixed(2);
                maxwidthtnewvalue = parseFloat(self.largeWidth / self.nzWidth).toFixed(2);
                if (newvalue > maxheightnewvalue) {
                    newvalue = maxheightnewvalue;
                }
                if (newvalue > maxwidthtnewvalue) {
                    newvalue = maxwidthtnewvalue;
                }


                if (maxheightnewvalue <= newvalue) {


                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;
                    if (newvalue > maxheightnewvalue) {
                        self.newvalueheight = maxheightnewvalue;
                    } else {
                        self.newvalueheight = newvalue;
                    }
                    self.fullheight = true;


                }
                else {



                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;

                    if (newvalue > maxheightnewvalue) {

                        self.newvalueheight = maxheightnewvalue;
                    } else {
                        self.newvalueheight = newvalue;
                    }
                    self.fullheight = false;
                }




                if (maxwidthtnewvalue <= newvalue) {

                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    if (newvalue > maxwidthtnewvalue) {

                        self.newvaluewidth = maxwidthtnewvalue;
                    } else {
                        self.newvaluewidth = newvalue;
                    }

                    self.fullwidth = true;


                }
                else {

                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    self.newvaluewidth = newvalue;
                    self.fullwidth = false;
                }


            } //end inner
            scrcontinue = false;

            if (self.options.zoomType == "inner") {

                if (self.nzWidth >= self.nzHeight) {
                    if (self.newvaluewidth <= maxwidthtnewvalue) {
                        scrcontinue = true;
                    }
                    else {

                        scrcontinue = false;
                        self.fullheight = true;
                        self.fullwidth = true;
                    }
                }
                if (self.nzHeight > self.nzWidth) {
                    if (self.newvaluewidth <= maxwidthtnewvalue) {
                        scrcontinue = true;
                    }
                    else {
                        scrcontinue = false;

                        self.fullheight = true;
                        self.fullwidth = true;
                    }
                }
            }

            if (self.options.zoomType != "inner") {
                scrcontinue = true;
            }

            if (scrcontinue) {



                self.zoomLock = 0;
                self.changeZoom = true;

                //if lens height is less than image height


                if (((self.options.zoomWindowHeight) / self.heightRatio) <= self.nzHeight) {


                    self.currentZoomLevel = self.newvalueheight;
                    if (self.options.zoomType != "lens" && self.options.zoomType != "inner") {
                        self.changeBgSize = true;

                        self.zoomLens.css({ height: String((self.options.zoomWindowHeight) / self.heightRatio) + 'px' })
                    }
                    if (self.options.zoomType == "lens" || self.options.zoomType == "inner") {
                        self.changeBgSize = true;
                    }


                }




                if ((self.options.zoomWindowWidth / self.widthRatio) <= self.nzWidth) {



                    if (self.options.zoomType != "inner") {
                        if (self.newvaluewidth > self.newvalueheight) {
                            self.currentZoomLevel = self.newvaluewidth;

                        }
                    }

                    if (self.options.zoomType != "lens" && self.options.zoomType != "inner") {
                        self.changeBgSize = true;

                        self.zoomLens.css({ width: String((self.options.zoomWindowWidth) / self.widthRatio) + 'px' })
                    }
                    if (self.options.zoomType == "lens" || self.options.zoomType == "inner") {
                        self.changeBgSize = true;
                    }

                }
                if (self.options.zoomType == "inner") {
                    self.changeBgSize = true;

                    if (self.nzWidth > self.nzHeight) {
                        self.currentZoomLevel = self.newvaluewidth;
                    }
                    if (self.nzHeight > self.nzWidth) {
                        self.currentZoomLevel = self.newvaluewidth;
                    }
                }

            }      //under

            //sets the boundry change, called in setWindowPos
            self.setPosition(self.currentLoc);
            //
        },
        closeAll: function () {
            if (self.zoomWindow) { self.zoomWindow.hide(); }
            if (self.zoomLens) { self.zoomLens.hide(); }
            if (self.zoomTint) { self.zoomTint.hide(); }
        },
        changeState: function (value) {
            var self = this;
            if (value == 'enable') { self.options.zoomEnabled = true; }
            if (value == 'disable') { self.options.zoomEnabled = false; }

        }

    };

    $.fn.elevateZoom = function (options) {
        return this.each(function () {
            var elevate = Object.create(ElevateZoom);

            elevate.init(options, this);

            $.data(this, 'elevateZoom', elevate);

        });
    };

    $.fn.elevateZoom.options = {
        imageSrc: null,
        zoomActivation: "hover", // Can also be click (PLACEHOLDER FOR NEXT VERSION)
        zoomEnabled: true, //false disables zoomwindow from showing
        preloading: 1, //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
        zoomLevel: 1, //default zoom level of image
        scrollZoom: false, //allow zoom on mousewheel, true to activate
        scrollZoomIncrement: 0.1,  //steps of the scrollzoom
        minZoomLevel: false,
        maxZoomLevel: false,
        easing: false,
        easingAmount: 12,
        lensSize: 200,
        zoomWindowWidth: 400,
        zoomWindowHeight: 400,
        zoomWindowOffetx: 0,
        zoomWindowOffety: 0,
        zoomWindowPosition: 1,
        zoomWindowBgColour: "#fff",
        lensFadeIn: false,
        lensFadeOut: false,
        debug: false,
        zoomWindowFadeIn: false,
        zoomWindowFadeOut: false,
        zoomWindowAlwaysShow: false,
        zoomTintFadeIn: false,
        zoomTintFadeOut: false,
        borderSize: 4,
        showLens: true,
        borderColour: "#888",
        lensBorderSize: 1,
        lensBorderColour: "#000",
        lensShape: "square", //can be "round"
        zoomType: "window", //window is default,  also "lens" available -
        containLensZoom: false,
        lensColour: "white", //colour of the lens background
        lensOpacity: 0.4, //opacity of the lens
        lenszoom: false,
        tint: false, //enable the tinting
        tintColour: "#333", //default tint color, can be anything, red, #ccc, rgb(0,0,0)
        tintOpacity: 0.4, //opacity of the tint
        gallery: false,
        galleryActiveClass: "zoomGalleryActive",
        imageCrossfade: false,
        constrainType: false,  //width or height
        constrainSize: false,  //in pixels the dimensions you want to constrain on
        loadingIcon: false, //http://www.example.com/spinner.gif
        cursor: "default", // user should set to what they want the cursor as, if they have set a click function
        responsive: true,
        onComplete: $.noop,
        onDestroy: function () { },
        onZoomedImageLoaded: function () { },
        onImageSwap: $.noop,
        onImageSwapComplete: $.noop
    };

})(jQuery, window, document);
// jquery.daterangepicker.js
// author : Chunlong Liu
// license : MIT
// www.jszen.com

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    } else if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS. Register as a module
        module.exports = factory(require('jquery'), require('moment'));
    } else {
        // Browser globals
        factory(jQuery, moment);
    }
}(function($, moment) {
    'use strict';
    $.dateRangePickerLanguages = {
        "default": //default language: English
        {
            "selected": "Selected:",
            "day": "Day",
            "days": "Days",
            "apply": "Close",
            "week-1": "mo",
            "week-2": "tu",
            "week-3": "we",
            "week-4": "th",
            "week-5": "fr",
            "week-6": "sa",
            "week-7": "su",
            "week-number": "W",
            "month-name": ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
            "shortcuts": "Shortcuts",
            "custom-values": "Custom Values",
            "past": "Past",
            "following": "Following",
            "previous": "Previous",
            "prev-week": "Week",
            "prev-month": "Month",
            "prev-year": "Year",
            "next": "Next",
            "next-week": "Week",
            "next-month": "Month",
            "next-year": "Year",
            "less-than": "Date range should not be more than %d days",
            "more-than": "Date range should not be less than %d days",
            "default-more": "Please select a date range longer than %d days",
            "default-single": "Please select a date",
            "default-less": "Please select a date range less than %d days",
            "default-range": "Please select a date range between %d and %d days",
            "default-default": "Please select a date range",
            "time": "Time",
            "hour": "Hour",
            "minute": "Minute"
        },
        "de": {
            "selected": "Auswahl:",
            "day": "Tag",
            "days": "Tage",
            "apply": "Schließen",
            "week-1": "mo",
            "week-2": "di",
            "week-3": "mi",
            "week-4": "do",
            "week-5": "fr",
            "week-6": "sa",
            "week-7": "so",
            "month-name": ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"],
            "shortcuts": "Schnellwahl",
            "past": "Vorherige",
            "following": "Folgende",
            "previous": "Vorherige",
            "prev-week": "Woche",
            "prev-month": "Monat",
            "prev-year": "Jahr",
            "next": "Nächste",
            "next-week": "Woche",
            "next-month": "Monat",
            "next-year": "Jahr",
            "less-than": "Datumsbereich darf nicht größer sein als %d Tage",
            "more-than": "Datumsbereich darf nicht kleiner sein als %d Tage",
            "default-more": "Bitte mindestens %d Tage auswählen",
            "default-single": "Bitte ein Datum auswählen",
            "default-less": "Bitte weniger als %d Tage auswählen",
            "default-range": "Bitte einen Datumsbereich zwischen %d und %d Tagen auswählen",
            "default-default": "Bitte ein Start- und Enddatum auswählen",
            "Time": "Zeit",
            "hour": "Stunde",
            "minute": "Minute"
        },
        "es": {
            "selected": "Seleccionado:",
            "day": "Día",
            "days": "Días",
            "apply": "Cerrar",
            "week-1": "lu",
            "week-2": "ma",
            "week-3": "mi",
            "week-4": "ju",
            "week-5": "vi",
            "week-6": "sa",
            "week-7": "do",
            "month-name": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            "shortcuts": "Accesos directos",
            "past": "Pasado",
            "following": "Siguiente",
            "previous": "Anterior",
            "prev-week": "Semana",
            "prev-month": "Mes",
            "prev-year": "Año",
            "next": "Siguiente",
            "next-week": "Semana",
            "next-month": "Mes",
            "next-year": "Año",
            "less-than": "El rango no debería ser mayor de %d días",
            "more-than": "El rango no debería ser menor de %d días",
            "default-more": "Por favor selecciona un rango mayor a %d días",
            "default-single": "Por favor selecciona un día",
            "default-less": "Por favor selecciona un rango menor a %d días",
            "default-range": "Por favor selecciona un rango entre %d y %d días",
            "default-default": "Por favor selecciona un rango de fechas."
        },
        "fr": {
            "selected": "Sélection:",
            "day": "Jour",
            "days": "Jours",
            "apply": "Fermer",
            "week-1": "lu",
            "week-2": "ma",
            "week-3": "me",
            "week-4": "je",
            "week-5": "ve",
            "week-6": "sa",
            "week-7": "di",
            "month-name": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
            "shortcuts": "Raccourcis",
            "past": "Passé",
            "following": "Suivant",
            "previous": "Précédent",
            "prev-week": "Semaine",
            "prev-month": "Mois",
            "prev-year": "Année",
            "next": "Suivant",
            "next-week": "Semaine",
            "next-month": "Mois",
            "next-year": "Année",
            "less-than": "L'intervalle ne doit pas être supérieure à %d jours",
            "more-than": "L'intervalle ne doit pas être inférieure à %d jours",
            "default-more": "Merci de choisir une intervalle supérieure à %d jours",
            "default-single": "Merci de choisir une date",
            "default-less": "Merci de choisir une intervalle inférieure %d jours",
            "default-range": "Merci de choisir une intervalle comprise entre %d et %d jours",
            "default-default": "Merci de choisir une date"
        },
        "pt": //Portuguese (European)
        {
            "selected": "Selecionado:",
            "day": "Dia",
            "days": "Dias",
            "apply": "Fechar",
            "week-1": "seg",
            "week-2": "ter",
            "week-3": "qua",
            "week-4": "qui",
            "week-5": "sex",
            "week-6": "sab",
            "week-7": "dom",
            "week-number": "N",
            "month-name": ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
            "shortcuts": "Atalhos",
            "custom-values": "Valores Personalizados",
            "past": "Passado",
            "following": "Seguinte",
            "previous": "Anterior",
            "prev-week": "Semana",
            "prev-month": "Mês",
            "prev-year": "Ano",
            "next": "Próximo",
            "next-week": "Próxima Semana",
            "next-month": "Próximo Mês",
            "next-year": "Próximo Ano",
            "less-than": "O período selecionado não deve ser maior que %d dias",
            "more-than": "O período selecionado não deve ser menor que %d dias",
            "default-more": "Selecione um período superior a %d dias",
            "default-single": "Selecione uma data",
            "default-less": "Selecione um período inferior a %d dias",
            "default-range": "Selecione um período de %d a %d dias",
            "default-default": "Selecione um período",
            "time": "Tempo",
            "hour": "Hora",
            "minute": "Minuto"
        }
    };

    $.fn.dateRangePicker = function (opt) {
        if (!opt) opt = {};
        opt = $.extend(true, {
            autoClose: false,
            format: 'YYYY-MM-DD',
            separator: ' - ',
            language: 'auto',
            startOfWeek: 'sunday', // or monday
            getValue: function() {
                return $(this).val();
            },
            setValue: function(s) {
                if (!$(this).attr('readonly') && !$(this).is(':disabled') && s != $(this).val()) {
                    $(this).val(s);
                }
            },
            startDate: false,
            endDate: false,
            time: {
                enabled: false
            },
            minDays: 0,
            maxDays: 0,
            customShortcuts: [],
            inline: false,
            container: 'body',
            alwaysOpen: false,
            singleDate: false,
            lookBehind: false,
            batchMode: false,
            highlightToday: false,
            duration: 200,
            stickyMonths: false,
            dayDivAttrs: [],
            dayTdAttrs: [],
            selectForward: false,
            selectBackward: false,
            applyBtnClass: '',
            singleMonth: 'auto',
            hoveringTooltip: function(days, startTime, hoveringTime) {
                return days > 1 ? days + ' ' + translate('days') : '';
            },
            showTopbar: true,
            swapTime: false,
            showWeekNumbers: false,
            getWeekNumber: function(date) //date will be the first day of a week
            {
                return moment(date).format('w');
            },
            customOpenAnimation: null,
            customCloseAnimation: null,
            customArrowPrevSymbol: null,
            customArrowNextSymbol: null
        }, opt);

        opt.start = false;
        opt.end = false;

        opt.startWeek = false;

        //detect a touch device
        opt.isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        //if it is a touch device, hide hovering tooltip
        if (opt.isTouchDevice) opt.hoveringTooltip = false;

        //show one month on mobile devices
        if (opt.singleMonth == 'auto') opt.singleMonth = $(window).width() < 480;
        if (opt.singleMonth) opt.stickyMonths = false;

        if (!opt.showTopbar) opt.autoClose = true;

        if (opt.startDate && typeof opt.startDate == 'string') opt.startDate = moment(opt.startDate, opt.format).toDate();
        if (opt.endDate && typeof opt.endDate == 'string') opt.endDate = moment(opt.endDate, opt.format).toDate();

        var languages = getLanguages();
        var box;
        var initiated = false;
        var self = this;
        var selfDom = $(self).get(0);
        var domChangeTimer;

        $(this).unbind('.datepicker').bind('click.datepicker', function(evt) {
            var isOpen = box.is(':visible');
            if (!isOpen) open(opt.duration);
        }).bind('change.datepicker', function(evt) {
            checkAndSetDefaultValue();
        }).bind('keyup.datepicker', function() {
            try {
                clearTimeout(domChangeTimer);
            } catch (e) {}
            domChangeTimer = setTimeout(function() {
                checkAndSetDefaultValue();
            }, 2000);
        });

        init_datepicker.call(this);

        if (opt.alwaysOpen) {
            open(0);
        }

        // expose some api
        $(this).data('dateRangePicker', {
            setStart: function (d1, silent) {
                if (typeof d1 == 'string') {
                    d1 = moment(d1, opt.format).toDate();
                }

                opt.end = false;
                setSingleDate(d1, silent);

                return this;
            },
            setEnd: function(d2, silent) {
                var start = new Date();
                start.setTime(opt.start);
                if (typeof d2 == 'string') {
                    d2 = moment(d2, opt.format).toDate();
                }
                setDateRange(start, d2, silent);
                return this;
            },
            setDateRange: function(d1, d2, silent) {
                if (typeof d1 == 'string' && typeof d2 == 'string') {
                    d1 = moment(d1, opt.format).toDate();
                    d2 = moment(d2, opt.format).toDate();
                }
                setDateRange(d1, d2, silent);
            },
            clear: clearSelection,
            close: closeDatePicker,
            open: open,
            redraw: redrawDatePicker,
            getDatePicker: getDatePicker,
            resetMonthsView: resetMonthsView,
            destroy: function() {
                $(self).unbind('.datepicker');
                $(self).data('dateRangePicker', '');
                $(self).data('date-picker-opened', null);
                box.remove();
                $(window).unbind('resize.datepicker', calcPosition);
                $(document).unbind('click.datepicker', closeDatePicker);
            }
        });

        $(window).bind('resize.datepicker', calcPosition);

        return this;

        function IsOwnDatePickerClicked(evt, selfObj) {
            return (selfObj.contains(evt.target) || evt.target == selfObj || (selfObj.childNodes != undefined && $.inArray(evt.target, selfObj.childNodes) >= 0));
        }

        function init_datepicker() {
            var self = this;

            if ($(this).data('date-picker-opened')) {
                closeDatePicker();
                return;
            }
            $(this).data('date-picker-opened', true);


            box = createDom().hide();
            box.append('<div class="date-range-length-tip"></div>');

            $(opt.container).append(box);

            if (!opt.inline) {
                calcPosition();
            } else {
                box.addClass('inline-wrapper');
            }

            if (opt.alwaysOpen) {
                box.find('.apply-btn').hide();
            }

            var defaultTime = getDefaultTime();
            resetMonthsView(defaultTime);

            if (opt.time.enabled) {
                if ((opt.startDate && opt.endDate) || (opt.start && opt.end)) {
                    showTime(moment(opt.start || opt.startDate).toDate(), 'time1');
                    showTime(moment(opt.end || opt.endDate).toDate(), 'time2');
                } else {
                    var defaultEndTime = opt.defaultEndTime ? opt.defaultEndTime : defaultTime;
                    showTime(defaultTime, 'time1');
                    showTime(defaultEndTime, 'time2');
                }
            }

            //showSelectedInfo();


            var defaultTopText = '';
            if (opt.singleDate)
                defaultTopText = translate('default-single');
            else if (opt.minDays && opt.maxDays)
                defaultTopText = translate('default-range');
            else if (opt.minDays)
                defaultTopText = translate('default-more');
            else if (opt.maxDays)
                defaultTopText = translate('default-less');
            else
                defaultTopText = translate('default-default');

            box.find('.default-top').html(defaultTopText.replace(/\%d/, opt.minDays).replace(/\%d/, opt.maxDays));
            if (opt.singleMonth) {
                box.addClass('single-month');
            } else {
                box.addClass('two-months');
            }

            setTimeout(function() {
                updateCalendarWidth();
                initiated = true;
            }, 0);

            box.click(function(evt) {
                evt.stopPropagation();
            });

            //if user click other place of the webpage, close date range picker window
            $(document).bind('click.datepicker', function(evt) {
                if (!IsOwnDatePickerClicked(evt, self[0])) {
                    if (box.is(':visible')) closeDatePicker();
                }
            });

            box.find('.next').click(function () {
                $(self).trigger('datepicker-next-month-clicked');
                if (!opt.stickyMonths)
                    gotoNextMonth(this);
                else
                    gotoNextMonth_stickily(this);
                $(self).trigger('datepicker-next-month-finish-clicked');
            });

            function gotoNextMonth(self) {
                var isMonth2 = $(self).parents('table').hasClass('month2');
                var month = isMonth2 ? opt.month2 : opt.month1;
                month = nextMonth(month);
                if (!opt.singleMonth && !opt.singleDate && !isMonth2 && compare_month(month, opt.month2) >= 0 || isMonthOutOfBounds(month)) return;
                showMonth(month, isMonth2 ? 'month2' : 'month1');
                showGap();
            }

            function gotoNextMonth_stickily(self) {
                var nextMonth1 = nextMonth(opt.month1);
                var nextMonth2 = nextMonth(opt.month2);
                if (isMonthOutOfBounds(nextMonth2)) return;
                if (!opt.singleDate && compare_month(nextMonth1, nextMonth2) >= 0) return;
                showMonth(nextMonth1, 'month1');
                showMonth(nextMonth2, 'month2');
                showSelectedDays();
            }


            box.find('.prev').click(function () {
                $(self).trigger('datepicker-prev-month-clicked');
                if (!opt.stickyMonths)
                    gotoPrevMonth(this);
                else
                    gotoPrevMonth_stickily(this);
                $(self).trigger('datepicker-prev-month-finish-clicked');
            });

            function gotoPrevMonth(self) {
                var isMonth2 = $(self).parents('table').hasClass('month2');
                var month = isMonth2 ? opt.month2 : opt.month1;
                month = prevMonth(month);
                if (isMonth2 && compare_month(month, opt.month1) <= 0 || isMonthOutOfBounds(month)) return;
                showMonth(month, isMonth2 ? 'month2' : 'month1');
                showGap();
            }

            function gotoPrevMonth_stickily(self) {
                var prevMonth1 = prevMonth(opt.month1);
                var prevMonth2 = prevMonth(opt.month2);
                if (isMonthOutOfBounds(prevMonth1)) return;
                if (!opt.singleDate && compare_month(prevMonth2, prevMonth1) <= 0) return;
                showMonth(prevMonth2, 'month2');
                showMonth(prevMonth1, 'month1');
                showSelectedDays();
            }

            box.attr('unselectable', 'on')
                .css('user-select', 'none')
                .bind('selectstart', function(e) {
                    e.preventDefault();
                    return false;
                });

            box.find('.apply-btn').click(function() {
                closeDatePicker();
                var dateRange = getDateString(new Date(opt.start)) + opt.separator + getDateString(new Date(opt.end));
                $(self).trigger('datepicker-apply', {
                    'value': dateRange,
                    'date1': new Date(opt.start),
                    'date2': new Date(opt.end)
                });
            });

            box.find('[custom]').click(function() {
                var valueName = $(this).attr('custom');
                opt.start = false;
                opt.end = false;
                box.find('.day.checked').removeClass('checked');
                opt.setValue.call(selfDom, valueName);
                checkSelectionValid();
                showSelectedInfo(true);
                showSelectedDays();
                if (opt.autoClose) closeDatePicker();
            });

            box.find('[shortcut]').click(function() {
                var shortcut = $(this).attr('shortcut');
                var end = new Date(),
                    start = false;
                var dir;
                if (shortcut.indexOf('day') != -1) {
                    var day = parseInt(shortcut.split(',', 2)[1], 10);
                    start = new Date(new Date().getTime() + 86400000 * day);
                    end = new Date(end.getTime() + 86400000 * (day > 0 ? 1 : -1));
                } else if (shortcut.indexOf('week') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    var stopDay;
                    if (dir == 1)
                        stopDay = opt.startOfWeek == 'monday' ? 1 : 0;
                    else
                        stopDay = opt.startOfWeek == 'monday' ? 0 : 6;

                    end = new Date(end.getTime() - 86400000);
                    while (end.getDay() != stopDay) end = new Date(end.getTime() + dir * 86400000);
                    start = new Date(end.getTime() + dir * 86400000 * 6);
                } else if (shortcut.indexOf('month') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    if (dir == 1)
                        start = nextMonth(end);
                    else
                        start = prevMonth(end);
                    start.setDate(1);
                    end = nextMonth(start);
                    end.setDate(1);
                    end = new Date(end.getTime() - 86400000);
                } else if (shortcut.indexOf('year') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    start = new Date();
                    start.setFullYear(end.getFullYear() + dir);
                    start.setMonth(0);
                    start.setDate(1);
                    end.setFullYear(end.getFullYear() + dir);
                    end.setMonth(11);
                    end.setDate(31);
                } else if (shortcut == 'custom') {
                    var name = $(this).html();
                    if (opt.customShortcuts && opt.customShortcuts.length > 0) {
                        for (var i = 0; i < opt.customShortcuts.length; i++) {
                            var sh = opt.customShortcuts[i];
                            if (sh.name == name) {
                                var data = [];
                                // try
                                // {
                                data = sh['dates'].call();
                                //}catch(e){}
                                if (data && data.length == 2) {
                                    start = data[0];
                                    end = data[1];
                                }

                                // if only one date is specified then just move calendars there
                                // move calendars to show this date's month and next months
                                if (data && data.length == 1) {
                                    var movetodate = data[0];
                                    showMonth(movetodate, 'month1');
                                    showMonth(nextMonth(movetodate), 'month2');
                                    showGap();
                                }

                                break;
                            }
                        }
                    }
                }
                if (start && end) {
                    setDateRange(start, end);
                    checkSelectionValid();
                }
            });

            box.find('.time1 input[type=range]').bind('change touchmove', function(e) {
                var target = e.target,
                    hour = target.name == 'hour' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined,
                    min = target.name == 'minute' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined;
                setTime('time1', hour, min);
            });

            box.find('.time2 input[type=range]').bind('change touchmove', function(e) {
                var target = e.target,
                    hour = target.name == 'hour' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined,
                    min = target.name == 'minute' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined;
                setTime('time2', hour, min);
            });

        }


        function calcPosition() {
            if (!opt.inline) {
                var offset = $(self).offset();
                if ($(opt.container).css('position') == 'relative') {
                    var containerOffset = $(opt.container).offset();
                    box.css({
                        top: offset.top - containerOffset.top + $(self).outerHeight() + 4,
                        left: offset.left - containerOffset.left
                    });
                } else {
                    if (offset.left < 460) //left to right
                    {
                        box.css({
                            top: offset.top + $(self).outerHeight() + parseInt($('body').css('border-top') || 0, 10),
                            left: offset.left
                        });
                    } else {
                        box.css({
                            top: offset.top + $(self).outerHeight() + parseInt($('body').css('border-top') || 0, 10),
                            left: offset.left + $(self).width() - box.width() - 16
                        });
                    }
                }
            }
        }

        // Return the date picker wrapper element
        function getDatePicker() {
            return box;
        }

        function open(animationTime) {
            calcPosition();
            redrawDatePicker();
            checkAndSetDefaultValue();
            if (opt.customOpenAnimation) {
                opt.customOpenAnimation.call(box.get(0), function() {
                    $(self).trigger('datepicker-opened', {
                        relatedTarget: box
                    });
                });
            } else {
                box.slideDown(animationTime, function() {
                    $(self).trigger('datepicker-opened', {
                        relatedTarget: box
                    });
                });
            }
            $(self).trigger('datepicker-open', {
                relatedTarget: box
            });
            showGap();
            updateCalendarWidth();
        }

        function checkAndSetDefaultValue() {
            var __default_string = opt.getValue.call(selfDom);
            var defaults = __default_string ? __default_string.split(opt.separator) : '';

            if (defaults && ((defaults.length == 1 && opt.singleDate) || defaults.length >= 2)) {
                var ___format = opt.format;
                if (___format.match(/Do/)) {

                    ___format = ___format.replace(/Do/, 'D');
                    defaults[0] = defaults[0].replace(/(\d+)(th|nd|st)/, '$1');
                    if (defaults.length >= 2) {
                        defaults[1] = defaults[1].replace(/(\d+)(th|nd|st)/, '$1');
                    }
                }
                // set initiated  to avoid triggerring datepicker-change event
                initiated = false;
                if (defaults.length >= 2) {
                    setDateRange(getValidValue(defaults[0], ___format, moment.locale(opt.language)), getValidValue(defaults[1], ___format, moment.locale(opt.language)));
                } else if (defaults.length == 1 && opt.singleDate) {
                    setSingleDate(getValidValue(defaults[0], ___format, moment.locale(opt.language)));
                }

                initiated = true;
            }
        }

        function getValidValue(date, format, locale) {
            if (moment(date, format, locale).isValid()) {
                return moment(date, format, locale).toDate();
            } else {
                return moment().toDate();
            }
        }

        function updateCalendarWidth() {
            var gapMargin = box.find('.gap').css('margin-left');
            if (gapMargin) gapMargin = parseInt(gapMargin);
            var w1 = box.find('.month1').width();
            var w2 = box.find('.gap').width() + (gapMargin ? gapMargin * 2 : 0);
            var w3 = box.find('.month2').width();
            box.find('.month-wrapper').width(w1 + w2 + w3 + (opt.singleMonth ? 0 : 77));
        }

        function renderTime(name, date) {
            box.find('.' + name + ' input[type=range].hour-range').val(moment(date).hours());
            box.find('.' + name + ' input[type=range].minute-range').val(moment(date).minutes());
            setTime(name, moment(date).format('HH'), moment(date).format('mm'));
        }

        function changeTime(name, date) {
            opt[name] = parseInt(
                moment(parseInt(date))
                .startOf('day')
                .add(moment(opt[name + 'Time']).format('HH'), 'h')
                .add(moment(opt[name + 'Time']).format('mm'), 'm').valueOf()
            );
        }

        function swapTime() {
            renderTime('time1', opt.start);
            renderTime('time2', opt.end);
        }

        function setTime(name, hour, minute) {
            hour && (box.find('.' + name + ' .hour-val').text(hour));
            minute && (box.find('.' + name + ' .minute-val').text(minute));
            switch (name) {
                case 'time1':
                    if (opt.start) {
                        setRange('start', moment(opt.start));
                    }
                    setRange('startTime', moment(opt.startTime || moment().valueOf()));
                    break;
                case 'time2':
                    if (opt.end) {
                        setRange('end', moment(opt.end));
                    }
                    setRange('endTime', moment(opt.endTime || moment().valueOf()));
                    break;
            }

            function setRange(name, timePoint) {
                var h = timePoint.format('HH'),
                    m = timePoint.format('mm');
                opt[name] = timePoint
                    .startOf('day')
                    .add(hour || h, 'h')
                    .add(minute || m, 'm')
                    .valueOf();
            }
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
        }

        function clearSelection() {
            opt.start = false;
            opt.end = false;
            box.find('.day.checked').removeClass('checked');
            box.find('.day.last-date-selected').removeClass('last-date-selected');
            box.find('.day.first-date-selected').removeClass('first-date-selected');
            opt.setValue.call(selfDom, '');
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
        }

        function handleStart(time) {
            var r = time;
            if (opt.batchMode === 'week-range') {
                if (opt.startOfWeek === 'monday') {
                    r = moment(parseInt(time)).startOf('isoweek').valueOf();
                } else {
                    r = moment(parseInt(time)).startOf('week').valueOf();
                }
            } else if (opt.batchMode === 'month-range') {
                r = moment(parseInt(time)).startOf('month').valueOf();
            }
            return r;
        }

        function handleEnd(time) {
            var r = time;
            if (opt.batchMode === 'week-range') {
                if (opt.startOfWeek === 'monday') {
                    r = moment(parseInt(time)).endOf('isoweek').valueOf();
                } else {
                    r = moment(parseInt(time)).endOf('week').valueOf();
                }
            } else if (opt.batchMode === 'month-range') {
                r = moment(parseInt(time)).endOf('month').valueOf();
            }
            return r;
        }


        function dayClicked(day) {
            if (day.hasClass('invalid')) return;
            var time = day.attr('time');
            day.addClass('checked');
            if (opt.singleDate) {
                opt.start = time;
                opt.end = false;
            } else if (opt.batchMode === 'week') {
                if (opt.startOfWeek === 'monday') {
                    opt.start = moment(parseInt(time)).startOf('isoweek').valueOf();
                    opt.end = moment(parseInt(time)).endOf('isoweek').valueOf();
                } else {
                    opt.end = moment(parseInt(time)).endOf('week').valueOf();
                    opt.start = moment(parseInt(time)).startOf('week').valueOf();
                }
            } else if (opt.batchMode === 'workweek') {
                opt.start = moment(parseInt(time)).day(1).valueOf();
                opt.end = moment(parseInt(time)).day(5).valueOf();
            } else if (opt.batchMode === 'weekend') {
                opt.start = moment(parseInt(time)).day(6).valueOf();
                opt.end = moment(parseInt(time)).day(7).valueOf();
            } else if (opt.batchMode === 'month') {
                opt.start = moment(parseInt(time)).startOf('month').valueOf();
                opt.end = moment(parseInt(time)).endOf('month').valueOf();
            } else if ((opt.start && opt.end) || (!opt.start && !opt.end)) {
                opt.start = handleStart(time);
                opt.end = false;
            } else if (opt.start) {
                opt.end = handleEnd(time);
                if (opt.time.enabled) {
                    changeTime('end', opt.end);
                }
            }

            //Update time in case it is enabled and timestamps are available
            if (opt.time.enabled) {
                if (opt.start) {
                    changeTime('start', opt.start);
                }
                if (opt.end) {
                    changeTime('end', opt.end);
                }
            }

            //In case the start is after the end, swap the timestamps
            if (!opt.singleDate && opt.start && opt.end && opt.start > opt.end) {
                var tmp = opt.end;
                opt.end = handleEnd(opt.start);
                opt.start = handleStart(tmp);
                if (opt.time.enabled && opt.swapTime) {
                    swapTime();
                }
            }

            opt.start = parseInt(opt.start);
            opt.end = parseInt(opt.end);

            clearHovering();
            if (opt.start && !opt.end) {
                $(self).trigger('datepicker-first-date-selected', {
                    'date1': new Date(opt.start)
                });
                dayHovering(day);
            }
            updateSelectableRange(time);

            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
            autoclose();
        }


        function weekNumberClicked(weekNumberDom) {
            var thisTime = parseInt(weekNumberDom.attr('data-start-time'), 10);
            var date1, date2;
            if (!opt.startWeek) {
                opt.startWeek = thisTime;
                weekNumberDom.addClass('week-number-selected');
                date1 = new Date(thisTime);
                opt.start = moment(date1).day(opt.startOfWeek == 'monday' ? 1 : 0).valueOf();
                opt.end = moment(date1).day(opt.startOfWeek == 'monday' ? 7 : 6).valueOf();
            } else {
                box.find('.week-number-selected').removeClass('week-number-selected');
                date1 = new Date(thisTime < opt.startWeek ? thisTime : opt.startWeek);
                date2 = new Date(thisTime < opt.startWeek ? opt.startWeek : thisTime);
                opt.startWeek = false;
                opt.start = moment(date1).day(opt.startOfWeek == 'monday' ? 1 : 0).valueOf();
                opt.end = moment(date2).day(opt.startOfWeek == 'monday' ? 7 : 6).valueOf();
            }
            updateSelectableRange();
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
            autoclose();
        }

        function isValidTime(time) {
            time = parseInt(time, 10);
            if (opt.startDate && compare_day(time, opt.startDate) < 0) return false;
            if (opt.endDate && compare_day(time, opt.endDate) > 0) return false;

            if (opt.start && !opt.end && !opt.singleDate) {
                //check maxDays and minDays setting
                if (opt.maxDays > 0 && countDays(time, opt.start) > opt.maxDays) return false;
                if (opt.minDays > 0 && countDays(time, opt.start) < opt.minDays) return false;

                //check selectForward and selectBackward
                if (opt.selectForward && time < opt.start) return false;
                if (opt.selectBackward && time > opt.start) return false;

                //check disabled days
                if (opt.beforeShowDay && typeof opt.beforeShowDay == 'function') {
                    var valid = true;
                    var timeTmp = time;
                    while (countDays(timeTmp, opt.start) > 1) {
                        var arr = opt.beforeShowDay(new Date(timeTmp));
                        if (!arr[0]) {
                            valid = false;
                            break;
                        }
                        if (Math.abs(timeTmp - opt.start) < 86400000) break;
                        if (timeTmp > opt.start) timeTmp -= 86400000;
                        if (timeTmp < opt.start) timeTmp += 86400000;
                    }
                    if (!valid) return false;
                }
            }
            return true;
        }


        function updateSelectableRange() {
            box.find('.day.invalid.tmp').removeClass('tmp invalid').addClass('valid');
            if (opt.start && !opt.end) {
                box.find('.day.toMonth.valid').each(function() {
                    var time = parseInt($(this).attr('time'), 10);
                    if (!isValidTime(time))
                        $(this).addClass('invalid tmp').removeClass('valid');
                    else
                        $(this).addClass('valid tmp').removeClass('invalid');
                });
            }

            return true;
        }


        function dayHovering(day) {
            var hoverTime = parseInt(day.attr('time'));
            var tooltip = '';

            if (day.hasClass('has-tooltip') && day.attr('data-tooltip')) {
                tooltip = '<span style="white-space:nowrap">' + day.attr('data-tooltip') + '</span>';
            } else if (!day.hasClass('invalid')) {
                if (opt.singleDate) {
                    box.find('.day.hovering').removeClass('hovering');
                    day.addClass('hovering');
                } else {
                    box.find('.day').each(function() {
                        var time = parseInt($(this).attr('time')),
                            start = opt.start,
                            end = opt.end;

                        if (time == hoverTime) {
                            $(this).addClass('hovering');
                        } else {
                            $(this).removeClass('hovering');
                        }

                        if (
                            (opt.start && !opt.end) &&
                            (
                                (opt.start < time && hoverTime >= time) ||
                                (opt.start > time && hoverTime <= time)
                            )
                        ) {
                            $(this).addClass('hovering');
                        } else {
                            $(this).removeClass('hovering');
                        }
                    });

                    if (opt.start && !opt.end) {
                        var days = countDays(hoverTime, opt.start);
                        if (opt.hoveringTooltip) {
                            if (typeof opt.hoveringTooltip == 'function') {
                                tooltip = opt.hoveringTooltip(days, opt.start, hoverTime);
                            } else if (opt.hoveringTooltip === true && days > 1) {
                                tooltip = days + ' ' + translate('days');
                            }
                        }
                    }
                }
            }

            if (tooltip) {
                var posDay = day.offset();
                var posBox = box.offset();

                var _left = posDay.left - posBox.left;
                var _top = posDay.top - posBox.top;
                _left += day.width() / 2;


                var $tip = box.find('.date-range-length-tip');
                var w = $tip.css({
                    'visibility': 'hidden',
                    'display': 'none'
                }).html(tooltip).width();
                var h = $tip.height();
                _left -= w / 2;
                _top -= h;
                setTimeout(function() {
                    $tip.css({
                        left: _left,
                        top: _top,
                        display: 'block',
                        'visibility': 'visible'
                    });
                }, 10);
            } else {
                box.find('.date-range-length-tip').hide();
            }
        }

        function clearHovering() {
            box.find('.day.hovering').removeClass('hovering');
            box.find('.date-range-length-tip').hide();
        }

        function autoclose() {
            if (opt.singleDate === true) {
                if (initiated && opt.start) {
                    if (opt.autoClose) closeDatePicker();
                }
            } else {
                if (initiated && opt.start && opt.end) {
                    if (opt.autoClose) closeDatePicker();
                }
            }
        }

        function checkSelectionValid() {
            var days = Math.ceil((opt.end - opt.start) / 86400000) + 1;
            if (opt.singleDate) { // Validate if only start is there
                if (opt.start && !opt.end)
                    box.find('.drp_top-bar').removeClass('error').addClass('normal');
                else
                    box.find('.drp_top-bar').removeClass('error').removeClass('normal');
            } else if (opt.maxDays && days > opt.maxDays) {
                opt.start = false;
                opt.end = false;
                box.find('.day').removeClass('checked');
                box.find('.drp_top-bar').removeClass('normal').addClass('error').find('.error-top').html(translate('less-than').replace('%d', opt.maxDays));
            } else if (opt.minDays && days < opt.minDays) {
                opt.start = false;
                opt.end = false;
                box.find('.day').removeClass('checked');
                box.find('.drp_top-bar').removeClass('normal').addClass('error').find('.error-top').html(translate('more-than').replace('%d', opt.minDays));
            } else {
                if (opt.start || opt.end)
                    box.find('.drp_top-bar').removeClass('error').addClass('normal');
                else
                    box.find('.drp_top-bar').removeClass('error').removeClass('normal');
            }

            if ((opt.singleDate && opt.start && !opt.end) || (!opt.singleDate && opt.start && opt.end)) {
                box.find('.apply-btn').removeClass('disabled');
            } else {
                box.find('.apply-btn').addClass('disabled');
            }

            if (opt.batchMode) {
                if (
                    (opt.start && opt.startDate && compare_day(opt.start, opt.startDate) < 0) ||
                    (opt.end && opt.endDate && compare_day(opt.end, opt.endDate) > 0)
                ) {
                    opt.start = false;
                    opt.end = false;
                    box.find('.day').removeClass('checked');
                }
            }
        }

        function showSelectedInfo(forceValid, silent) {
            box.find('.start-day').html('...');
            box.find('.end-day').html('...');
            box.find('.selected-days').hide();
            if (opt.start) {
                box.find('.start-day').html(getDateString(new Date(parseInt(opt.start))));
            }
            if (opt.end) {
                box.find('.end-day').html(getDateString(new Date(parseInt(opt.end))));
            }
            var dateRange;
            if (opt.start && opt.singleDate) {
                box.find('.apply-btn').removeClass('disabled');
                dateRange = getDateString(new Date(opt.start));
                opt.setValue.call(selfDom, dateRange, getDateString(new Date(opt.start)), getDateString(new Date(opt.end)));

                if (initiated && !silent) {
                    $(self).trigger('datepicker-change', {
                        'value': dateRange,
                        'date1': new Date(opt.start)
                    });
                }
            } else if (opt.start && opt.end) {
                box.find('.selected-days').show().find('.selected-days-num').html(countDays(opt.end, opt.start));
                box.find('.apply-btn').removeClass('disabled');
                dateRange = getDateString(new Date(opt.start)) + opt.separator + getDateString(new Date(opt.end));
                opt.setValue.call(selfDom, dateRange, getDateString(new Date(opt.start)), getDateString(new Date(opt.end)));
                if (initiated && !silent) {
                    $(self).trigger('datepicker-change', {
                        'value': dateRange,
                        'date1': new Date(opt.start),
                        'date2': new Date(opt.end)
                    });
                }
            } else if (forceValid) {
                box.find('.apply-btn').removeClass('disabled');
            } else {
                box.find('.apply-btn').addClass('disabled');
            }
        }

        function countDays(start, end) {
            return Math.abs(daysFrom1970(start) - daysFrom1970(end)) + 1;
        }

        function setDateRange(date1, date2, silent) {
            if (date1.getTime() > date2.getTime()) {
                var tmp = date2;
                date2 = date1;
                date1 = tmp;
                tmp = null;
            }
            var valid = true;
            if (opt.startDate && compare_day(date1, opt.startDate) < 0) valid = false;
            if (opt.endDate && compare_day(date2, opt.endDate) > 0) valid = false;
            if (!valid) {
                showMonth(opt.startDate, 'month1');
                showMonth(nextMonth(opt.startDate), 'month2');
                showGap();
                return;
            }

            opt.start = date1.getTime();
            opt.end = date2.getTime();

            if (opt.time.enabled) {
                renderTime('time1', date1);
                renderTime('time2', date2);
            }

            if (opt.stickyMonths || (compare_day(date1, date2) > 0 && compare_month(date1, date2) === 0)) {
                if (opt.lookBehind) {
                    date1 = prevMonth(date2);
                } else {
                    date2 = nextMonth(date1);
                }
            }

            if (opt.stickyMonths && opt.endDate !== false && compare_month(date2, opt.endDate) > 0) {
                date1 = prevMonth(date1);
                date2 = prevMonth(date2);
            }

            if (!opt.stickyMonths) {
                if (compare_month(date1, date2) === 0) {
                    if (opt.lookBehind) {
                        date1 = prevMonth(date2);
                    } else {
                        date2 = nextMonth(date1);
                    }
                }
            }

            showMonth(date1, 'month1');
            showMonth(date2, 'month2');
            showGap();
            checkSelectionValid();
            showSelectedInfo(false, silent);
            autoclose();
        }

        function setSingleDate(date1, silent) {

            var valid = true;
            if (opt.startDate && compare_day(date1, opt.startDate) < 0) valid = false;
            if (opt.endDate && compare_day(date1, opt.endDate) > 0) valid = false;
            if (!valid) {
                showMonth(opt.startDate, 'month1');
                return;
            }

            opt.start = date1.getTime();


            if (opt.time.enabled) {
                renderTime('time1', date1);

            }
            showMonth(date1, 'month1');
            if (opt.singleMonth !== true) {
                var date2 = nextMonth(date1);
                showMonth(date2, 'month2');
            }
            showGap();
            showSelectedInfo(false, silent);
            autoclose();
        }

        function showSelectedDays() {
            if (!opt.start && !opt.end) return;
            box.find('.day').each(function() {
                var time = parseInt($(this).attr('time')),
                    start = opt.start,
                    end = opt.end;
                if (opt.time.enabled) {
                    time = moment(time).startOf('day').valueOf();
                    start = moment(start || moment().valueOf()).startOf('day').valueOf();
                    end = moment(end || moment().valueOf()).startOf('day').valueOf();
                }
                if (
                    (opt.start && opt.end && end >= time && start <= time) ||
                    (opt.start && !opt.end && moment(start).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD'))
                ) {
                    $(this).addClass('checked');
                } else {
                    $(this).removeClass('checked');
                }

                //add first-date-selected class name to the first date selected
                if (opt.start && moment(start).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD')) {
                    $(this).addClass('first-date-selected');
                } else {
                    $(this).removeClass('first-date-selected');
                }
                //add last-date-selected
                if (opt.end && moment(end).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD')) {
                    $(this).addClass('last-date-selected');
                } else {
                    $(this).removeClass('last-date-selected');
                }
            });

            box.find('.week-number').each(function() {
                if ($(this).attr('data-start-time') == opt.startWeek) {
                    $(this).addClass('week-number-selected');
                }
            });
        }

        function showMonth(date, month) {
            date = moment(date).toDate();
            var monthName = nameMonth(date.getMonth());
            box.find('.' + month + ' .month-name').html(monthName + ' ' + date.getFullYear());
            box.find('.' + month + ' tbody').html(createMonthHTML(date));
            opt[month] = date;
            updateSelectableRange();
            bindDayEvents();
        }

        function bindDayEvents() {
            box.find('.day').unbind("click").click(function(evt) {
                dayClicked($(this));
            });

            box.find('.day').unbind("mouseenter").mouseenter(function(evt) {
                dayHovering($(this));
            });

            box.find('.day').unbind("mouseleave").mouseleave(function(evt) {
                box.find('.date-range-length-tip').hide();
                if (opt.singleDate) {
                    clearHovering();
                }
            });

            box.find('.week-number').unbind("click").click(function(evt) {
                weekNumberClicked($(this));
            });
        }

        function showTime(date, name) {
            box.find('.' + name).append(getTimeHTML());
            renderTime(name, date);
        }

        function nameMonth(m) {
            return translate('month-name')[m];
        }

        function getDateString(d) {
            return moment(d).format(opt.format);
        }

        function showGap() {
            showSelectedDays();
            var m1 = parseInt(moment(opt.month1).format('YYYYMM'));
            var m2 = parseInt(moment(opt.month2).format('YYYYMM'));
            var p = Math.abs(m1 - m2);
            var shouldShow = (p > 1 && p != 89);
            if (shouldShow) {
                box.addClass('has-gap').removeClass('no-gap').find('.gap').css('visibility', 'visible');
            } else {
                box.removeClass('has-gap').addClass('no-gap').find('.gap').css('visibility', 'hidden');
            }
            var h1 = box.find('table.month1').height();
            var h2 = box.find('table.month2').height();

            if (Math.max(h1, h2) === 0) {
                box.find('.gap').height(100);
            } else {
                box.find('.gap').height(Math.max(h1, h2) + 10);
            }
        }

        function closeDatePicker() {
            if (opt.alwaysOpen) return;

            var afterAnim = function() {
                $(self).data('date-picker-opened', false);
                $(self).trigger('datepicker-closed', {
                    relatedTarget: box
                });
            };
            if (opt.customCloseAnimation) {
                opt.customCloseAnimation.call(box.get(0), afterAnim);
            } else {
                $(box).slideUp(opt.duration, afterAnim);
            }
            $(self).trigger('datepicker-close', {
                relatedTarget: box
            });
        }

        function redrawDatePicker() {
            showMonth(opt.month1, 'month1');
            showMonth(opt.month2, 'month2');
        }

        function compare_month(m1, m2) {
            var p = parseInt(moment(m1).format('YYYYMM')) - parseInt(moment(m2).format('YYYYMM'));
            if (p > 0) return 1;
            if (p === 0) return 0;
            return -1;
        }

        function compare_day(m1, m2) {
            var p = parseInt(moment(m1).format('YYYYMMDD')) - parseInt(moment(m2).format('YYYYMMDD'));
            if (p > 0) return 1;
            if (p === 0) return 0;
            return -1;
        }

        function nextMonth(month) {
            return moment(month).add(1, 'months').toDate();
        }

        function prevMonth(month) {
            return moment(month).add(-1, 'months').toDate();
        }

        function getTimeHTML() {
            return '<div>' +
                '<span>' + translate('Time') + ': <span class="hour-val">00</span>:<span class="minute-val">00</span></span>' +
                '</div>' +
                '<div class="hour">' +
                '<label>' + translate('Hour') + ': <input type="range" class="hour-range" name="hour" min="0" max="23"></label>' +
                '</div>' +
                '<div class="minute">' +
                '<label>' + translate('Minute') + ': <input type="range" class="minute-range" name="minute" min="0" max="59"></label>' +
                '</div>';
        }

        function createDom() {
            var html = '<div class="date-picker-wrapper';
            if (opt.extraClass) html += ' ' + opt.extraClass + ' ';
            if (opt.singleDate) html += ' single-date ';
            html += '">';

            var _colspan = opt.showWeekNumbers ? 6 : 5;

            var arrowPrev = '<i class="icon-left-open-mini"></i>';
            if (opt.customArrowPrevSymbol) arrowPrev = opt.customArrowPrevSymbol;

            var arrowNext = '<i class="icon-right-open-mini"></i>';
            if (opt.customArrowNextSymbol) arrowNext = opt.customArrowNextSymbol;

            html += '<div class="month-wrapper">' +
                '   <table class="month1" cellspacing="0" border="0" cellpadding="0">' +
                '       <thead>' +
                '           <tr class="caption">' +
                '               <th style="width:27px;">' +
                '                   <div class="prev">' +
                arrowPrev +
                '                   </div>' +
                '               </th>' +
                '               <th colspan="' + _colspan + '" class="month-name">' +
                '               </th>' +
                '               <th style="width:27px;">' +
                (opt.singleDate || !opt.stickyMonths ? '<div class="next">' + arrowNext + '</div>' : '') +
                '               </th>' +
                '           </tr>' +
                '           <tr class="week-name">' + getWeekHead() +
                '       </thead>' +
                '       <tbody></tbody>' +
                '   </table>';

            if (hasMonth2()) {
                html += '<div class="gap"></div>' +
                    '<table class="month2" cellspacing="0" border="0" cellpadding="0">' +
                    '   <thead>' +
                    '   <tr class="caption">' +
                    '       <th style="width:27px;">' +
                    (!opt.stickyMonths ? '<div class="prev">' + arrowPrev + '</div>' : '') +
                    '       </th>' +
                    '       <th colspan="' + _colspan + '" class="month-name">' +
                    '       </th>' +
                    '       <th style="width:27px;">' +
                    '           <div class="next">' + arrowNext + '</div>' +
                    '       </th>' +
                    '   </tr>' +
                    '   <tr class="week-name">' + getWeekHead() +
                    '   </thead>' +
                    '   <tbody></tbody>' +
                    '</table>';

            }

            html += '<div style="clear:both;height:0;font-size:0;"></div>' +
                '<div class="time">' +
                '<div class="time1"></div>';
            if (!opt.singleDate) {
                html += '<div class="time2"></div>';
            }
            html += '</div>' +
                '<div style="clear:both;height:0;font-size:0;"></div>' +
                '</div></div>';

            return $(html);
        }

        function getApplyBtnClass() {
            var klass = '';
            if (opt.autoClose === true) {
                klass += ' hide';
            }
            if (opt.applyBtnClass !== '') {
                klass += ' ' + opt.applyBtnClass;
            }
            return klass;
        }

        function getWeekHead() {
            var prepend = opt.showWeekNumbers ? '<th>' + translate('week-number') + '</th>' : '';
            if (opt.startOfWeek == 'monday') {
                return prepend + '<th>' + translate('week-1') + '</th>' +
                    '<th>' + translate('week-2') + '</th>' +
                    '<th>' + translate('week-3') + '</th>' +
                    '<th>' + translate('week-4') + '</th>' +
                    '<th>' + translate('week-5') + '</th>' +
                    '<th>' + translate('week-6') + '</th>' +
                    '<th>' + translate('week-7') + '</th>';
            } else {
                return prepend + '<th>' + translate('week-7') + '</th>' +
                    '<th>' + translate('week-1') + '</th>' +
                    '<th>' + translate('week-2') + '</th>' +
                    '<th>' + translate('week-3') + '</th>' +
                    '<th>' + translate('week-4') + '</th>' +
                    '<th>' + translate('week-5') + '</th>' +
                    '<th>' + translate('week-6') + '</th>';
            }
        }

        function isMonthOutOfBounds(month) {
            month = moment(month);
            if (opt.startDate && month.endOf('month').isBefore(opt.startDate)) {
                return true;
            }
            if (opt.endDate && month.startOf('month').isAfter(opt.endDate)) {
                return true;
            }
            return false;
        }

        function hasMonth2() {
            return (!opt.singleMonth);
        }

        function attributesCallbacks(initialObject, callbacksArray, today) {
            var resultObject = $.extend(true, {}, initialObject);

            $.each(callbacksArray, function(cbAttrIndex, cbAttr) {
                var addAttributes = cbAttr(today);
                for (var attr in addAttributes) {
                    if (resultObject.hasOwnProperty(attr)) {
                        resultObject[attr] += addAttributes[attr];
                    } else {
                        resultObject[attr] = addAttributes[attr];
                    }
                }
            });

            var attrString = '';

            for (var attr in resultObject) {
                if (resultObject.hasOwnProperty(attr)) {
                    attrString += attr + '="' + resultObject[attr] + '" ';
                }
            }

            return attrString;
        }

        function daysFrom1970(t) {
            return Math.floor(toLocalTimestamp(t) / 86400000);
        }

        function toLocalTimestamp(t) {
            if (moment.isMoment(t)) t = t.toDate().getTime();
            if (typeof t == 'object' && t.getTime) t = t.getTime();
            if (typeof t == 'string' && !t.match(/\d{13}/)) t = moment(t, opt.format).toDate().getTime();
            t = parseInt(t, 10) - new Date().getTimezoneOffset() * 60 * 1000;
            return t;
        }

        function createMonthHTML(d) {
            var days = [];
            d.setDate(1);
            var lastMonth = new Date(d.getTime() - 86400000);
            var now = new Date();

            var dayOfWeek = d.getDay();
            if ((dayOfWeek === 0) && (opt.startOfWeek === 'monday')) {
                // add one week
                dayOfWeek = 7;
            }
            var today, valid;

            if (dayOfWeek > 0) {
                for (var i = dayOfWeek; i > 0; i--) {
                    var day = new Date(d.getTime() - 86400000 * i);
                    valid = isValidTime(day.getTime());
                    if (opt.startDate && compare_day(day, opt.startDate) < 0) valid = false;
                    if (opt.endDate && compare_day(day, opt.endDate) > 0) valid = false;
                    days.push({
                        date: day,
                        type: 'lastMonth',
                        day: day.getDate(),
                        time: day.getTime(),
                        valid: valid
                    });
                }
            }
            var toMonth = d.getMonth();
            for (var i = 0; i < 40; i++) {
                today = moment(d).add(i, 'days').toDate();
                valid = isValidTime(today.getTime());
                if (opt.startDate && compare_day(today, opt.startDate) < 0) valid = false;
                if (opt.endDate && compare_day(today, opt.endDate) > 0) valid = false;
                days.push({
                    date: today,
                    type: today.getMonth() == toMonth ? 'toMonth' : 'nextMonth',
                    day: today.getDate(),
                    time: today.getTime(),
                    valid: valid
                });
            }
            var html = [];
            for (var week = 0; week < 6; week++) {
                if (days[week * 7].type == 'nextMonth') break;
                html.push('<tr>');

                for (var day = 0; day < 7; day++) {
                    var _day = (opt.startOfWeek == 'monday') ? day + 1 : day;
                    today = days[week * 7 + _day];
                    var highlightToday = moment(today.time).format('L') == moment(now).format('L');
                    today.extraClass = '';
                    today.tooltip = '';
                    if (today.valid && opt.beforeShowDay && typeof opt.beforeShowDay == 'function') {
                        var _r = opt.beforeShowDay(moment(today.time).toDate());
                        today.valid = _r[0];
                        today.extraClass = _r[1] || '';
                        today.tooltip = _r[2] || '';
                        if (today.tooltip !== '') today.extraClass += ' has-tooltip ';
                    }

                    var todayDivAttr = {
                        time: today.time,
                        'data-tooltip': today.tooltip,
                        'class': 'day ' + today.type + ' ' + today.extraClass + ' ' + (today.valid ? 'valid' : 'invalid') + ' ' + (highlightToday && opt.highlightToday ? 'real-today' : '')
                    };

                    if (day === 0 && opt.showWeekNumbers) {
                        html.push('<td><div class="week-number" data-start-time="' + today.time + '">' + opt.getWeekNumber(today.date) + '</div></td>');
                    }

                    html.push('<td ' + attributesCallbacks({}, opt.dayTdAttrs, today) + '><div ' + attributesCallbacks(todayDivAttr, opt.dayDivAttrs, today) + '>' + showDayHTML(today.time, today.day) + '</div></td>');
                }
                html.push('</tr>');
            }
            return html.join('');
        }

        function showDayHTML(time, date) {
            if (opt.showDateFilter && typeof opt.showDateFilter == 'function') return opt.showDateFilter(time, date);
            return date;
        }

        function getLanguages() {
            if (opt.language == 'auto') {
                var language = navigator.language ? navigator.language : navigator.browserLanguage;
                if (!language) {
                    return $.dateRangePickerLanguages['default'];
                }
                language = language.toLowerCase();
                if(language in $.dateRangePickerLanguages){
                    return $.dateRangePickerLanguages[language];
                }

                return $.dateRangePickerLanguages['default'];
            } else if (opt.language && opt.language in $.dateRangePickerLanguages) {
                return $.dateRangePickerLanguages[opt.language];
            } else {
                return $.dateRangePickerLanguages['default'];
            }
        }

        /**
         * Translate language string, try both the provided translation key, as the lower case version
         */
        function translate(translationKey) {
            var translationKeyLowerCase = translationKey.toLowerCase();
            var result = (translationKey in languages) ? languages[translationKey] : (translationKeyLowerCase in languages) ? languages[translationKeyLowerCase] : null;
            var defaultLanguage = $.dateRangePickerLanguages['default'];
            if (result == null) result = (translationKey in defaultLanguage) ? defaultLanguage[translationKey] : (translationKeyLowerCase in defaultLanguage) ? defaultLanguage[translationKeyLowerCase] : '';

            return result;
        }

        function getDefaultTime() {
            var defaultTime = opt.defaultTime ? opt.defaultTime : new Date();

            if (opt.lookBehind) {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = nextMonth(moment(opt.startDate).toDate());
                if (opt.endDate && compare_month(defaultTime, opt.endDate) > 0) defaultTime = moment(opt.endDate).toDate();
            } else {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = moment(opt.startDate).toDate();
                if (opt.endDate && compare_month(nextMonth(defaultTime), opt.endDate) > 0) defaultTime = prevMonth(moment(opt.endDate).toDate());
            }

            if (opt.singleDate) {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = moment(opt.startDate).toDate();
                if (opt.endDate && compare_month(defaultTime, opt.endDate) > 0) defaultTime = moment(opt.endDate).toDate();
            }

            return defaultTime;
        }

        function resetMonthsView(time) {
            if (!time) {
                time = getDefaultTime();
            }

            if (opt.lookBehind) {
                showMonth(prevMonth(time), 'month1');
                showMonth(time, 'month2');
            } else {
                showMonth(time, 'month1');
                showMonth(nextMonth(time), 'month2');
            }

            if (opt.singleDate) {
                showMonth(time, 'month1');
            }

            showSelectedDays();
            showGap();
        }

    };
}));
angular.module('SER.utils', []);

// Key codes
var KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13, backspace: 8, delete: 46, shift: 16, leftCmd: 91, rightCmd: 93, ctrl: 17, alt: 18, tab: 9 };

function getStyles(element) {
    return !(element instanceof HTMLElement) ? {} :
        element.ownerDocument && element.ownerDocument.defaultView.opener
            ? element.ownerDocument.defaultView.getComputedStyle(element)
            : window.getComputedStyle(element);
}

function arrayGroupBy(array, field) {

    var array_group_by = {};

    for (var index = 0; index < array.length; ++index) {

        if (array_group_by[array[index][field]] === undefined)
            array_group_by[array[index][field]] = [];

        array_group_by[array[index][field]].push(array[index]);
    }

    return array_group_by;
}

function hasValue(value) {
    if (angular.isArray(value)) {
        return 0 < value.length;
    } else if (angular.isDate(value)) {
        return true;
    } else if (angular.isObject(value)) {
        return !angular.element.isEmptyObject(value);
    } else {
        return ['', null, undefined, NaN].indexOf(value) === -1;
    }
}

function notValue(value) {
    if (angular.isArray(value)) {
        return 0 === value.length;
    } else if (angular.isDate(value)) {
        return false;
    } else if (angular.isObject(value)) {
        return angular.element.isEmptyObject(value);
    } else {
        return ['', null, undefined, NaN].indexOf(value) > -1;
    }
}

function hasProperty(obj, key) {
    if (obj){
        return obj.hasOwnProperty(key);
    } else {
        return false;
    }
}

function inArray(value, array) {
    return array ? array.indexOf(value) !== -1 : false;
}

function notInArray(value, array) {
    return array ? array.indexOf(value) === -1 : false;
}

function getObjectByValue(array, attr, value) {

    for (var i = 0; i < array.length; i++) {

        if (array[i].hasOwnProperty(attr)) {

            if (array[i][attr] === value) {

                return array[i];

            } else {

                for (var prop in array[i][attr]) {

                    if (array[i][attr][prop] === value) {

                        return array[i];

                    }

                }

            }

        }

    }
}

function getObjIndexByValue(array, attr, value) {

    for (var i = 0; i < array.length; i++) {

        if (array[i].hasOwnProperty(attr)) {

            if (array[i][attr] === value) {

                return array[i];

            } else {

                for (var prop in array[i][attr]) {

                    if (array[i][attr][prop] === value) {

                        return i;

                    }

                }

            }

        }

    }
}

function browserWidth() {
    return 0 < window.innerWidth ? window.innerWidth : screen.width;
}

function hasPdfViewer() {
    for (var index = 0; index < window.navigator.plugins.length; index++) {
        if (window.navigator.plugins[index].name.toLowerCase().indexOf("pdf") > -1) {
            return true;
        }
    }

    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasFiles(Files) {
    
    var result = false;

    var isFile = function (file) {
        return file != null && (file instanceof window.Blob || (file.flashId && file.name && file.size));
    };

    for (var key in Files) {
        if (isFile(Files[key])) {
            result = true;
            break;
        }
    }

    return result;

}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

window.onbeforeprint = function () {
    console.log('Functionality to run before printing: ', window.location.href);
};
window.onafterprint = function () {
    console.log('Functionality to run after printing: ', window.location.href);
};

if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
            window.onbeforeprint();
        } else {
            window.onafterprint();
        }
    });
}

function getLogo(name, version) {

    if (typeof name === 'string') {

        switch (name.toLowerCase().replace(/[0-9\. ]*/g, '')) {

            // Browser
            case 'chrome':
            case 'chromium':
                return AWS_S3_URL + 'images/logos/chrome.svg';
            case 'edge':
                return AWS_S3_URL + 'images/logos/edge.svg';
            case 'firefox':
                return AWS_S3_URL + 'images/logos/firefox.svg';
            case 'ie':
            case 'iemobile':
                return AWS_S3_URL + 'images/logos/ie.svg';
            case 'opera':
                return AWS_S3_URL + 'images/logos/opera.svg';
            case 'safari':
            case 'mobilesafari':
                return AWS_S3_URL + 'images/logos/safari.svg';
            case 'webkit':
                return AWS_S3_URL + 'images/logos/webkit.svg';

            // OS
            case 'android':
                return AWS_S3_URL + 'images/logos/android.svg';
            case 'ios':
            case 'macos':
                return AWS_S3_URL + 'images/logos/apple.svg';
            case 'debian':
                return AWS_S3_URL + 'images/logos/debian.svg';
            case 'linux':
                return AWS_S3_URL + 'images/logos/linux.svg';
            case 'ubuntu':
                return AWS_S3_URL + 'images/logos/ubuntu.svg';
            case 'windows':
                switch (version.toLowerCase()) {
                    case 'xp':
                    case '7':
                        return AWS_S3_URL + 'images/logos/windows-xp.svg';
                    case '8':
                    case '8.1':
                    case '10':
                        return AWS_S3_URL + 'images/logos/windows.svg';
                }
                break;
            case 'windowsphone':
                return AWS_S3_URL + 'images/logos/windows-phone.svg';
        }
    }
}

if (bowser) {
    $('body').addClass('bos-' + bowser.osname.replace(/ /g,"") + ' bosv-' + bowser.osversion.replace(/ /g, "") + ' bn-' + bowser.name.replace(/ /g,"") + ' bv-' + bowser.version.replace(/ /g,""));
}
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
angular.module('SER.auth', []);

angular.module('SER.auth').value('userPermissions', []);
angular.module('SER.auth').value('isSuperuser', false);
angular.module('SER.auth').value('url403', '');

angular.module('SER.auth').service('permissionService', [
    'userPermissions',
    'isSuperuser',
    function (userPermissions, isSuperuser) {
        
        return {
            hasPermission: function (requiredPermission) {

                if (isSuperuser) {
                    return true;
                }

                if (notValue(requiredPermission)) {
                    return false;
                }

                return userPermissions.indexOf(requiredPermission) !== -1;
            },
            atLeastPermissions: function (requiredPermissions) {

                if (isSuperuser) {
                    return true;
                }

                if (hasValue(requiredPermissions)) {

                    for (var index = 0; index < requiredPermissions.length; index++) {

                        if (inArray(requiredPermissions[index], userPermissions)) {
                            return true;
                        }
                    }

                    return false;
                }

                return true;
            },
            hasPermissions: function (requiredPermissions) {

                if (isSuperuser) {
                    return true;
                }

                for (var index = 0; index < requiredPermissions.length; index++) {

                    if (notInArray(requiredPermissions[index], userPermissions)) {
                        return false;
                    }
                }

                return true;
            }
        }

    }
]);
angular.module('SER.chip', []);

angular.module('SER.chip').directive('serChips', ['$document', function ($document) {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            pattern: '=?'
        },
        link: function (scope, element, attrs, controller) {

            var regex = scope.pattern ? new RegExp(scope.pattern) : new RegExp(/^[\w\d].*$/);
            var input = element.find('input.chip-input');
            var formCtrl = element.find('select').controller('ngModel');

            if (notValue(scope.model)) {
                scope.model = [];
                scope.selectedValue = [];
            } else {
                formCtrl.$setViewValue(scope.model);
                formCtrl.$setDirty(true);
            }

            scope.addChip = function () {

                if (notValue(scope.model)) {
                    scope.model = [];
                }

                if (scope.chipInput) {
                    if (notInArray(scope.chipInput, scope.model) && regex.test(scope.chipInput)) {
                        scope.model.push(scope.chipInput);
                        formCtrl.$setViewValue(scope.model);
                        formCtrl.$validate();
                        formCtrl.$setDirty(true);
                    }

                    scope.chipInput = null;
                }

            };

            scope.removeChip = function (index) {
                scope.model.splice(index, 1);
                formCtrl.$setViewValue(scope.model);
                formCtrl.$validate();
            };

            scope.setFocus = function () {
                element.addClass('ng-focused');
                element.removeClass('ng-blur');
            };

            scope.setBlur = function () {
                element.addClass('ng-blur');
                element.removeClass('ng-focused');
                scope.addChip();
            };

            scope.checkKeypress = function (ev) {
                switch (ev.keyCode) {

                    case KEYS.backspace:
                        if (notValue(scope.chipInput) && hasValue(scope.model)) {
                            scope.removeChip(scope.model.length - 1);
                        }

                        break;

                    case KEYS.enter:
                        scope.addChip();
                        break;

                    default:

                }
            };

            //$scope.$watch('$destroy', function () {
            //    $document.unbind('click', $scope.checkFocus);
            //});

        },
        template: function (element, attrs) {

            var name = '';

            if (attrs.name) {
                name = 'name="' + attrs.name + '"';
            }

            return '<div class="chip" ng-repeat="chip in model track by $index">{{chip}}<md-icon class="remove" ng-click="removeChip($index)">close</md-icon></div> \
                <input class="chip-input not-styled s-flex" ng-model="chipInput" ng-keydown="checkKeypress($event)" ng-focus="setFocus()" ng-blur="setBlur()" /> \
                <select ' + name + ' style="display: none;" multiple ng-model="selectedValue" ' + (('required' in attrs) ? 'required': '') + ' ></select>';
        }
    };
}]);
angular.module('SER.search', []);

angular.module('SER.search').directive('serAutocomplete', ['$http', '$timeout', function ($http, $timeout) {
    
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            remoteUrl: '=',
            keywordField: '@',
            ngRequired: '=?',
            ngDisabled: '=?',
            selectItem: '&?',
            dropdownClass: '@?',
        },
        link: function (scope, element, attrs, controller, transclude) {

            var inputChangedPromise, input;
            var dropdown = angular.element(element[0].querySelector('.ser-autocomplete-results'));
            var originParents = element.parents();
            var namespace = 'autocomplete-results-' + Math.round(Math.random() * 1000000);
            dropdown.attr('id', namespace);
            dropdown.detach();

            scope.results = [];
            scope.isFetching = false;

            scope.selectInternalItem = function (item) {
                if (angular.isFunction(scope.selectItem)) {
                    scope.selectItem({ newValue: item });
                }

                if (hasValue(scope.keywordField)) {
                    scope.ngModel = item[scope.keywordField];
                }

                scope.close();
            };

            var dropdownPosition = function () {
                var label = element[0];

                var style = {
                    top: '',
                    bottom: '',
                    left: label.getBoundingClientRect().left + 'px',
                    width: label.offsetWidth + 'px'
                };

                if (angular.element(document.body).height() - (label.offsetHeight + label.getBoundingClientRect().top) >= 220) {
                    style.top = label.offsetHeight + label.getBoundingClientRect().top;
                    dropdown.removeClass('ontop');
                } else {

                    style.bottom = angular.element(document.body).height() - label.getBoundingClientRect().top;
                    dropdown.addClass('ontop');
                }

                dropdown.css(style);
            };

            // Dropdown utilities
            scope.showDropdown = function () {
                dropdownPosition();
                angular.element(document.body).append(dropdown);

                $timeout(function () {
                    angular.element(window).triggerHandler('resize');
                }, 50);
            };

            scope.open = function () {
                scope.isOpen = true;
                scope.showDropdown();
            };

            scope.close = function () {
                scope.isOpen = false;
                dropdown.detach();
            };

            originParents.each(function (i, parent) {
                angular.element(parent).on('scroll.' + namespace, function (e) {
                    dropdownPosition();
                });
            });

            var keyup = function (evt) {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }

                inputChangedPromise = setTimeout(function () {
                    scope.$apply(function () {
                        scope.isFetching = true;
                        scope.results = [];
                        scope.close();

                        if (scope.ngModel) {
                            $http.get(scope.remoteUrl + scope.ngModel).then(function (response) {

                                scope.results = response.data;
                                scope.isFetching = false;
                                if (hasValue(scope.results)) {
                                    scope.open();
                                }

                            });
                        } else {
                            scope.isFetching = false;
                            scope.close();
                        }
                    });
                }, 500);
            };

            input = angular.element(element[0].querySelector('.ser-autocomplete-wrapper input'))
                .on('focus', function () {
                    if (hasValue(scope.results)) {
                        $timeout(function () {
                            scope.open();
                        });
                    }
                })
                .on('blur', function () {
                    scope.close();
                })
                .on('keyup', function (e) {
                    keyup(e);
                });

            dropdown
                .on('mousedown', function (e) {
                    e.preventDefault();
                });

        },
        template: function (element, attrs) {

            function getSpanAddon() {
                var addon = element.find('addon').detach();
                return addon.length ? '<span class="addon">' + addon.html() + '</span>': '';
            }

            function getTemplateTag() {
                var templateTag = element.find('ser-item-template').detach();
                return templateTag.length ? templateTag.html() : element.html();
            }

            function getEmptyTag() {
                var emptyTag = element.find('ser-empty-template').detach();
                return emptyTag.length ? emptyTag.html() : '<div class="align-center">' + __('no_results') + '</div>';
            }

            //TODO usar virtual-repeat
            return '' +
                '<div class="ser-autocomplete-wrapper" ng-class="{open: isOpen}">' +

                    '<div class="input-group">' +
                        getSpanAddon() +
                        '<input placeholder="{{placeholder}}" ' + (attrs.name ? 'name="' + attrs.name + '"' : '') + ' ng-model="ngModel" ' + (attrs.disabled ? 'disabled' : 'ng-disabled="ngDisabled"') + ' ng-focus="ngFocus" ng-blur="searchBlur()" ' + (attrs.required ? 'required' : 'ng-required="ngRequired"') + ' />' +
                    '</div>' +

                    '<div class="fetching line-loader" ng-show="isFetching"></div>' +
                
                    '<ul md-virtual-repeat-container md-auto-shrink md-top-index="highlighted" class="ser-autocomplete-results ' + attrs.dropdownClass + '">' +
                        '<li class="item" md-virtual-repeat="item in results" ' + (attrs.mdItemSize ? 'md-item-size="' + attrs.mdItemSize + '"' : '') + ' ng-click="selectInternalItem(item)">' + getTemplateTag() + '</li>' +
                    '</ul>' +
                '</div>';
        }
    };
    
}]);
angular.module('SER.datepicker', []);

angular.module('SER.datepicker').directive('weekDay', function () {
    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, controller) {

            scope.toggleDay = function (day) {

                if ('multiple' in attrs) {

                    if (notValue(scope.ngModel)) {
                        scope.ngModel = [];
                    }

                    if (notInArray(day, scope.ngModel)) {
                        scope.ngModel.push(day);
                    } else {
                        scope.ngModel.splice(scope.ngModel.indexOf(day), 1);
                    }

                } else {
                    scope.ngModel = day !== scope.ngModel ? day: null;
                }
                
            }

            scope.isSet = function (day) {
                if ('multiple' in attrs) {
                    return inArray(day, scope.ngModel);
                } else {
                    return day === scope.ngModel;
                }
            }

        },
        template: function () {
            return '' +
                '<div class="wrapper">' +
                '<div class="day" ng-click="toggleDay(1)" ng-class="{active: isSet(1)}">' + __('LUN') + '</div>' +
                '<div class="day" ng-click="toggleDay(2)" ng-class="{active: isSet(2)}">' + __('MAR') + '</div>' +
                '<div class="day" ng-click="toggleDay(3)" ng-class="{active: isSet(3)}">' + __('MIE') + '</div>' +
                '<div class="day" ng-click="toggleDay(4)" ng-class="{active: isSet(4)}">' + __('JUE') + '</div>' +
                '<div class="day" ng-click="toggleDay(5)" ng-class="{active: isSet(5)}">' + __('VIE') + '</div>' +
                '<div class="day" ng-click="toggleDay(6)" ng-class="{active: isSet(6)}">' + __('SAB') + '</div>' +
                '<div class="day" ng-click="toggleDay(7)" ng-class="{active: isSet(7)}">' + __('DOM') + '</div>' +
                '</div>'
        }
    };
});

angular.module('SER.datepicker').directive('serDate', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            config: '='
        },
        controller: ['$scope', function ($scope) {

            $scope.placeholder = __('select_date');
            
            $scope.clear = function () {
                $scope.ngModel = null;
            };

        }],
        link: function (scope, element) {

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            });

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                alwaysOpen: true,
                language: 'es',
                singleDate: true,
                singleMonth: true
            }).bind('datepicker-change', function (event, obj) {

                scope.$apply(function () {
                    scope.ngModel = obj.date1;
                });

                element.find('.value-wrapper').tooltipster('close');

            }).bind('datepicker-next-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            }).bind('datepicker-prev-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            });

            if (scope.ngModel) {
                picker_instance.data('dateRangePicker').setStart(scope.ngModel, true);
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    picker_instance.data('dateRangePicker').setStart(newValue, true);
                }
            }, true);

        },
        template: function (element, attr) {

            return '' +
                '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +

                    '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                        '<button type="button" class="bttn value-wrapper">{{ (ngModel | date: \'longDate\') || placeholder }}</button>' +
                        '<button type="button" ng-show="ngModel" class="bttn clear" ng-click="clear()">×</button>' +
                    '</div>' +

                    '<div class="tooltip-templates">' +
                        '<div class="picker-wrapper">' +
                            '<div class="date-wrapper"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    };


}]);

angular.module('SER.datepicker').directive('serDateRange', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            config: '='
        },
        controller: ['$scope', function ($scope) {

            $scope.placeholder = __('select_date_range');

            $scope.clear = function () {
                $scope.ngModel = null;
                $scope.placeholder = __('select_date_range');
            };

        }],
        link: function (scope, element) {

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            });

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                alwaysOpen: true,
                language: 'es'
            }).bind('datepicker-change', function (event, obj) {

                scope.$apply(function () {

                    obj.date1.setHours(0, 0, 0, 0);
                    obj.date2.setHours(23, 59, 59, 0);
                    scope.ngModel = {
                        FromDate: obj.date1,
                        ToDate: obj.date2
                    };

                    scope.placeholder = $filter('date')(obj.date1, 'longDate') + ' - ' + $filter('date')(obj.date2, 'longDate');
                });

                element.find('.value-wrapper').tooltipster('close');

            }).bind('datepicker-next-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            }).bind('datepicker-prev-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            });

            if (scope.ngModel && scope.ngModel.FromDate && scope.ngModel.ToDate) {
                picker_instance.data('dateRangePicker').setStart(scope.ngModel.FromDate, true);
                picker_instance.data('dateRangePicker').setEnd(scope.ngModel.ToDate, true);
                scope.placeholder = $filter('date')(scope.ngModel.FromDate, 'longDate') + ' - ' + $filter('date')(scope.ngModel.ToDate, 'longDate');
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (hasValue(newValue) && hasValue(newValue.FromDate) && hasValue(newValue.ToDate)) {
                    scope.placeholder = $filter('date')(newValue.FromDate, 'longDate') + ' - ' + $filter('date')(newValue.ToDate, 'longDate');
                    picker_instance.data('dateRangePicker').setStart(scope.ngModel.FromDate, true);
                    picker_instance.data('dateRangePicker').setEnd(scope.ngModel.ToDate, true);
                }
            }, true);

        },
        template: function (element, attr) {

            return '' +
                '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +

                    '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                        '<button type="button" class="bttn value-wrapper">{{ placeholder }}</button>' +
                        '<button type="button" ng-show="ngModel" class="bttn clear" ng-click="clear()">×</button>' +
                    '</div>' +

                    '<div class="tooltip-templates">' +
                        '<div class="picker-wrapper">' +
                            '<div class="date-wrapper"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    };


}]);
angular.module('SER.filters', []);

angular.module('SER.filters').filter('PascalCase', [function () {
    return function (input) {

        return input
            // Look for long acronyms and filter out the last letter
            .replace(/([A-Z]+)([A-Z])/g, ' $1 $2')
            // Look for lower-case letters followed by upper-case letters
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            // Look for lower-case letters followed by numbers
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); })
            // Remove any white space left around the word
            .trim();
    };
}]);

angular.module('SER.filters').filter('getItem', ['$filter', function ($filter) {
    return function (input, array, field) {
        var fields = {};
        fields[field] = input;
        var resultArray = [];
        resultArray = $filter('filter')(array, fields, true);
        if (hasValue(resultArray) && 0 < resultArray.length) return resultArray[0];
        return null;
    };
}]);

angular.module('SER.filters').filter('minutesTime', [function () {
    /**
     * input should be a number of minutes to be parsed
     * @param {input} number of minutes
     * @param {type} true = 00:00:00 | false = 00:00 am or pm
     */
    return function (input, type) {
        var
            hours = parseInt(input / 60, 10),
            minutes = (input - (hours * 60)) < 10 ? '0' + (input - (hours * 60)) : input - (hours * 60),
            meridian = type ? ':00' : (hours >= 12 && hours !== 24 ? ' pm' : ' am');

        return (!type && hours > 12 ? (hours === 24 ? '00' : (hours - 12 < 10 ? '0' : '') + (hours - 12)) : (hours < 10 ? '0' : '') + hours) + ':' + minutes + meridian;
    };
}]);

angular.module('SER.filters').filter('timeMinutes', [function () {

    return function (input) {
        return (parseInt(input.split(':')[0]) * 60) + parseInt(input.split(':')[1]);
    };

}]);

angular.module('SER.filters').filter('leadingChar', function () {
    return function (input, width, char) {
        char = char || '0';
        if (hasValue(input)) {
            input = input + '';
            return input.length >= width ? input : new Array(width - input.length + 1).join(char) + input;
        } else {
            return '';
        }
    };
});
angular.module('SER.fullscreen', []);

angular.module('SER.fullscreen').factory('Fullscreen', ['$document', '$rootScope', function ($document,$rootScope) {
    var document = $document[0];

    // ensure ALLOW_KEYBOARD_INPUT is available and enabled
    var isKeyboardAvailbleOnFullScreen = (typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element) && Element.ALLOW_KEYBOARD_INPUT;

    var emitter = $rootScope.$new();

    // listen event on document instead of element to avoid firefox limitation
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(){
    emitter.$emit('SERFullscreen.change', serviceInstance.isEnabled());
    });

    var serviceInstance = {
    $on: angular.bind(emitter, emitter.$on),
    all: function() {
        serviceInstance.enable( document.documentElement );
    },
    enable: function(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            // Safari temporary fix
            if (/Version\/[\d]{1,2}(\.[\d]{1,2}){1}(\.(\d){1,2}){0,1} Safari/.test(navigator.userAgent)) {
                element.webkitRequestFullscreen();
            } else {
                element.webkitRequestFullscreen(isKeyboardAvailbleOnFullScreen);
            }
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    cancel: function() {
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    isEnabled: function(){
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        return fullscreenElement ? true : false;
    },
    toggleAll: function(){
        serviceInstance.isEnabled() ? serviceInstance.cancel() : serviceInstance.all();
    },
    isSupported: function(){
        var docElm = document.documentElement;
        var requestFullscreen = docElm.requestFullScreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullscreen || docElm.msRequestFullscreen;
        return requestFullscreen ? true : false;
    }
    };

    return serviceInstance;
}]);

angular.module('SER.fullscreen').directive('fullscreen', ['Fullscreen', function(Fullscreen) {
    return {
    link : function ($scope, $element, $attrs) {
        // Watch for changes on scope if model is provided
        if ($attrs.fullscreen) {
            $scope.$watch($attrs.fullscreen, function(value) {
                var isEnabled = Fullscreen.isEnabled();
                if (value && !isEnabled) {
                Fullscreen.enable($element[0]);
                $element.addClass('isInFullScreen');
                } else if (!value && isEnabled) {
                Fullscreen.cancel();
                $element.removeClass('isInFullScreen');
                }
            });

            // Listen on the `SERFullscreen.change`
            // the event will fire when anything changes the fullscreen mode
            var removeFullscreenHandler = Fullscreen.$on('SERFullscreen.change', function(evt, isFullscreenEnabled){
                if(!isFullscreenEnabled){
                $scope.$evalAsync(function(){
                    $scope.$eval($attrs.fullscreen + '= false');
                    $element.removeClass('isInFullScreen');
                });
                }
            });

            $scope.$on('$destroy', function() {
                removeFullscreenHandler();
            });

        } else {
            if ($attrs.onlyWatchedProperty !== undefined) {
                return;
            }

            $element.on('click', function (ev) {
                Fullscreen.enable(  $element[0] );
            });
        }
    }
    };
}]);

angular.module('SER.Clipboard', []);

angular.module('SER.Clipboard').service('CopyToClipboard', ['$window', function ($window) {
    var body = angular.element($window.document.body);
    var textarea = angular.element('<textarea/>');
    textarea.css({
        position: 'fixed',
        opacity: '0'
    });

    return function (toCopy, ShowAlert) {
        textarea.val(toCopy);
        body.append(textarea);
        textarea[0].select();

        try {
            var successful = document.execCommand('copy');
            if (!successful) throw successful;
            if (ShowAlert) alert(__('copy_success_clipboard'));
        } catch (err) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
        }

        textarea.remove();
    }
}]);

angular.module('SER.Clipboard').directive('serClickCopy', ['CopyToClipboard', function (CopyToClipboard) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function (e) {
                CopyToClipboard(attrs.serClickCopy, true);
            });
        }
    }
}]);
var i18n = {
    __DICT: undefined,
    loadJSON: function (locale_json) {
        this.__DICT = locale_json;
    },
    __: function (key) {
        if (typeof this.__DICT !== 'undefined') {

            if (key in this.__DICT) {
                return this.__DICT[key];
            } else {
                console.warn('Locale not found for: ' + key);
                return key;
            }
        } else {
            console.error('Locale JSON file not loaded | Locale not found for: ' + key);
        }

    }
};

var __ = function (key) {
    return i18n.__(key);
};

angular.module('SER.i18n', []);

angular.module('SER.i18n').filter('translate', function () {
    return function (input) {
        return i18n.__(input);
    };
});
angular.module('SER.image', []);

angular.module('SER.image').directive('exifData', ['Upload', '$filter', 'afterPromises', function (Upload, $filter, afterPromises) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var template = '<div class="exif">';

            var initialPromises = new afterPromises(2, function () {
                template += '</div>';
                element.after(template);
            });

            element.on('load', function (ev) {
                template += '<div><strong>' + __('dimensions') + ': </strong>' + ev.target.naturalWidth + 'x' + ev.target.naturalHeight + '</div>';
                initialPromises.notify();
            });

            Upload.urlToBlob(attrs.src).then(function (blob) {
                template += '<div><strong>' + __('size') + ': </strong>' + $filter('byteFmt')(blob.size, 0) + '</div><div><strong>' + __('type') + ': </strong>' + blob.type + '</div>';
                initialPromises.notify();
            }, function () {
                initialPromises.notify();
            });

        }
    };
}]);

angular.module('SER.image').directive('callbackImage', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('dragstart', function (event) { event.preventDefault(); });

            element.bind('error', function () {
                element[0].src = attrs.callbackImage;
            });

        }
    };
});

angular.module('SER.image').directive('retryGetImage', function () {
    return {
        restrict: 'A',
        scope: {
            retryGetImage: '@',
            fallbackRetry: '='
        },
        link: function (scope, element, attrs) {

            var timeout;

            function retry() {
                timeout = setTimeout(function () {
                    element[0].src = scope.retryGetImage;
                }, 5000);
            }

            scope.$watch('retryGetImage', function (new_value) {

                clearTimeout(timeout);
                element.unbind('load');
                element.unbind('error');
                element[0].src = new_value;
                element.addClass('hidden');

                element.bind('load', function () {
                    element.removeClass('hidden');
                    scope.fallbackRetry = false;
                    clearTimeout(timeout);
                    scope.$apply();
                });

                element.bind('error', function () {
                    scope.fallbackRetry = true;
                    retry();
                });
            });

        }
    };
});

angular.module('SER.image').directive('imgZoom', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            options: '='
        },
        link: function (scope, element, attrs) {

            element.find('.target').on('load', function () {
                element.find('.loader').addClass('ng-hide');
            });

            element.find('.target').on('error', function () {
                element.find('.loader').addClass('ng-hide');
                scope.zoomReset();
            });

            scope.size = 'auto';

            var defaults = {
                'max-height': 'none'
            };

            angular.merge(defaults, scope.options);
            //var clicked = false, clickY;
            //$(element).on({
            //    'mousemove': function (e) {
            //        clicked && updateScrollPos(e);
            //    },
            //    'mousedown': function (e) {
            //        clicked = true;
            //        clickY = e.pageY;
            //    },
            //    'mouseup': function () {
            //        clicked = false;
            //    }
            //});

            //var updateScrollPos = function (e) {
            //    $(element).css('cursor', 'row-resize');
            //    $(element).scrollTop($(element).scrollTop() + (clickY - e.pageY));
            //}

            scope.zoomIn = function () {
                scope.size = element.find('.target').width() * 1.1;
                element.find('.target').css({
                    'max-height': 'none',
                    height: 'auto'
                });
            };

            scope.zoomOut = function () {
                scope.size = element.find('.target').width() / 1.1;
                element.find('.target').css({
                    'max-height': 'none',
                    height: 'auto'
                });
            };

            scope.zoomReset = function () {
                scope.size = 'auto';
                element.find('.target').css({
                    'max-height': defaults['max-height'],
                    height: 'auto'
                });
            };

            scope.zoomExpand = function () {
                scope.size = 'auto';
                element.find('.target').css({
                    'max-height': defaults['max-height'],
                    height: element.height() - 2
                });
            };

            $timeout(function () {
                scope.zoomExpand();
            }, 500);
        },
        template: function () {
            return '' +
                '<div class="controls">' +
                    '<button class="bttn icon" ng-click="zoomOut()"><i class="icon-zoom-out"></i></button>' +
                    '<button class="bttn icon" ng-click="zoomReset()"><i class="icon-zoom-actual"></i></button>' +
                    '<button class="bttn icon" ng-click="zoomExpand()"><i class="icon-zoom-expand"></i></button>' +
                    '<button class="bttn icon" ng-click="zoomIn()"><i class="icon-zoom-in"></i></button>' +
                '</div>' +
                '<div class="loader dots">' + __('loading') + '</div>' +
                '<img class="target" ng-src="{{ image }}" ng-style="{width: size}" callback-image="/images/' + __("no_image_available.svg") + '" />';
        }
    };
}]);

angular.module('SER.image').directive('zoomImage', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var defaultValues = {
                responsive: true,
                loadingIcon: true,
                tint: true,
                scrollZoom: true,
                zoomWindowWidth: 150,
                zoomWindowHeight: 150,
                imageSrc: attrs.ngSrc
            };

            angular.merge(defaultValues, scope.$eval(attrs.zoomImage));

            element.elevateZoom(defaultValues);

        }
    };
});
angular.module('SER.image').factory('cropAreaCircle', ['cropArea', function(CropArea) {
  var CropAreaCircle = function() {
    CropArea.apply(this, arguments);

    this._boxResizeBaseSize = 20;
    this._boxResizeNormalRatio = 0.9;
    this._boxResizeHoverRatio = 1.2;
    this._iconMoveNormalRatio = 0.9;
    this._iconMoveHoverRatio = 1.2;

    this._boxResizeNormalSize = this._boxResizeBaseSize*this._boxResizeNormalRatio;
    this._boxResizeHoverSize = this._boxResizeBaseSize*this._boxResizeHoverRatio;

    this._posDragStartX=0;
    this._posDragStartY=0;
    this._posResizeStartX=0;
    this._posResizeStartY=0;
    this._posResizeStartSize=0;

    this._boxResizeIsHover = false;
    this._areaIsHover = false;
    this._boxResizeIsDragging = false;
    this._areaIsDragging = false;
  };

  CropAreaCircle.prototype = new CropArea();

  CropAreaCircle.prototype._calcCirclePerimeterCoords=function(angleDegrees) {
    var hSize=this._size/2;
    var angleRadians=angleDegrees * (Math.PI / 180),
        circlePerimeterX=this._x + hSize * Math.cos(angleRadians),
        circlePerimeterY=this._y + hSize * Math.sin(angleRadians);
    return [circlePerimeterX, circlePerimeterY];
  };

  CropAreaCircle.prototype._calcResizeIconCenterCoords=function() {
    return this._calcCirclePerimeterCoords(-45);
  };

  CropAreaCircle.prototype._isCoordWithinArea=function(coord) {
    return Math.sqrt((coord[0]-this._x)*(coord[0]-this._x) + (coord[1]-this._y)*(coord[1]-this._y)) < this._size/2;
  };
  CropAreaCircle.prototype._isCoordWithinBoxResize=function(coord) {
    var resizeIconCenterCoords=this._calcResizeIconCenterCoords();
    var hSize=this._boxResizeHoverSize/2;
    return(coord[0] > resizeIconCenterCoords[0] - hSize && coord[0] < resizeIconCenterCoords[0] + hSize &&
            coord[1] > resizeIconCenterCoords[1] - hSize && coord[1] < resizeIconCenterCoords[1] + hSize);
  };

  CropAreaCircle.prototype._drawArea=function(ctx,centerCoords,size){
    ctx.arc(centerCoords[0],centerCoords[1],size/2,0,2*Math.PI);
  };

  CropAreaCircle.prototype.draw=function() {
    CropArea.prototype.draw.apply(this, arguments);

    // draw move icon
    this._cropCanvas.drawIconMove([this._x,this._y], this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);

    // draw resize cubes
    this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(), this._boxResizeBaseSize, this._boxResizeIsHover?this._boxResizeHoverRatio:this._boxResizeNormalRatio);
  };

  CropAreaCircle.prototype.processMouseMove=function(mouseCurX, mouseCurY) {
    var cursor='default';
    var res=false;

    this._boxResizeIsHover = false;
    this._areaIsHover = false;

    if (this._areaIsDragging) {
      this._x = mouseCurX - this._posDragStartX;
      this._y = mouseCurY - this._posDragStartY;
      this._areaIsHover = true;
      cursor='move';
      res=true;
      this._events.trigger('area-move');
    } else if (this._boxResizeIsDragging) {
        cursor = 'nesw-resize';
        var iFR, iFX, iFY;
        iFX = mouseCurX - this._posResizeStartX;
        iFY = this._posResizeStartY - mouseCurY;
        if(iFX>iFY) {
          iFR = this._posResizeStartSize + iFY*2;
        } else {
          iFR = this._posResizeStartSize + iFX*2;
        }

        this._size = Math.max(this._minSize, iFR);
        this._boxResizeIsHover = true;
        res=true;
        this._events.trigger('area-resize');
    } else if (this._isCoordWithinBoxResize([mouseCurX,mouseCurY])) {
        cursor = 'nesw-resize';
        this._areaIsHover = false;
        this._boxResizeIsHover = true;
        res=true;
    } else if(this._isCoordWithinArea([mouseCurX,mouseCurY])) {
        cursor = 'move';
        this._areaIsHover = true;
        res=true;
    }

    this._dontDragOutside();
    angular.element(this._ctx.canvas).css({'cursor': cursor});

    return res;
  };

  CropAreaCircle.prototype.processMouseDown=function(mouseDownX, mouseDownY) {
    if (this._isCoordWithinBoxResize([mouseDownX,mouseDownY])) {
      this._areaIsDragging = false;
      this._areaIsHover = false;
      this._boxResizeIsDragging = true;
      this._boxResizeIsHover = true;
      this._posResizeStartX=mouseDownX;
      this._posResizeStartY=mouseDownY;
      this._posResizeStartSize = this._size;
      this._events.trigger('area-resize-start');
    } else if (this._isCoordWithinArea([mouseDownX,mouseDownY])) {
      this._areaIsDragging = true;
      this._areaIsHover = true;
      this._boxResizeIsDragging = false;
      this._boxResizeIsHover = false;
      this._posDragStartX = mouseDownX - this._x;
      this._posDragStartY = mouseDownY - this._y;
      this._events.trigger('area-move-start');
    }
  };

  CropAreaCircle.prototype.processMouseUp=function(/*mouseUpX, mouseUpY*/) {
    if(this._areaIsDragging) {
      this._areaIsDragging = false;
      this._events.trigger('area-move-end');
    }
    if(this._boxResizeIsDragging) {
      this._boxResizeIsDragging = false;
      this._events.trigger('area-resize-end');
    }
    this._areaIsHover = false;
    this._boxResizeIsHover = false;

    this._posDragStartX = 0;
    this._posDragStartY = 0;
  };

  return CropAreaCircle;
}]);



angular.module('SER.image').factory('cropAreaSquare', ['cropArea', function(CropArea) {
  var CropAreaSquare = function() {
    CropArea.apply(this, arguments);

    this._resizeCtrlBaseRadius = 10;
    this._resizeCtrlNormalRatio = 0.75;
    this._resizeCtrlHoverRatio = 1;
    this._iconMoveNormalRatio = 0.9;
    this._iconMoveHoverRatio = 1.2;

    this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius*this._resizeCtrlNormalRatio;
    this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius*this._resizeCtrlHoverRatio;

    this._posDragStartX=0;
    this._posDragStartY=0;
    this._posResizeStartX=0;
    this._posResizeStartY=0;
    this._posResizeStartSize=0;

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;
    this._resizeCtrlIsDragging = -1;
    this._areaIsDragging = false;
  };

  CropAreaSquare.prototype = new CropArea();

  CropAreaSquare.prototype._calcSquareCorners=function() {
    var hSize=this._size/2;
    return [
      [this._x-hSize, this._y-hSize],
      [this._x+hSize, this._y-hSize],
      [this._x-hSize, this._y+hSize],
      [this._x+hSize, this._y+hSize]
    ];
  };

  CropAreaSquare.prototype._calcSquareDimensions=function() {
    var hSize=this._size/2;
    return {
      left: this._x-hSize,
      top: this._y-hSize,
      right: this._x+hSize,
      bottom: this._y+hSize
    };
  };

  CropAreaSquare.prototype._isCoordWithinArea=function(coord) {
    var squareDimensions=this._calcSquareDimensions();
    return (coord[0]>=squareDimensions.left&&coord[0]<=squareDimensions.right&&coord[1]>=squareDimensions.top&&coord[1]<=squareDimensions.bottom);
  };

  CropAreaSquare.prototype._isCoordWithinResizeCtrl=function(coord) {
    var resizeIconsCenterCoords=this._calcSquareCorners();
    var res=-1;
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      if(coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius &&
          coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
        res=i;
        break;
      }
    }
    return res;
  };

  CropAreaSquare.prototype._drawArea=function(ctx,centerCoords,size){
    var hSize=size/2;
    ctx.rect(centerCoords[0]-hSize,centerCoords[1]-hSize,size,size);
  };

  CropAreaSquare.prototype.draw=function() {
    CropArea.prototype.draw.apply(this, arguments);

    // draw move icon
    this._cropCanvas.drawIconMove([this._x,this._y], this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);

    // draw resize cubes
    var resizeIconsCenterCoords=this._calcSquareCorners();
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover===i?this._resizeCtrlHoverRatio:this._resizeCtrlNormalRatio);
    }
  };

  CropAreaSquare.prototype.processMouseMove=function(mouseCurX, mouseCurY) {
    var cursor='default';
    var res=false;

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;

    if (this._areaIsDragging) {
      this._x = mouseCurX - this._posDragStartX;
      this._y = mouseCurY - this._posDragStartY;
      this._areaIsHover = true;
      cursor='move';
      res=true;
      this._events.trigger('area-move');
    } else if (this._resizeCtrlIsDragging>-1) {
      var xMulti, yMulti;
      switch(this._resizeCtrlIsDragging) {
        case 0: // Top Left
          xMulti=-1;
          yMulti=-1;
          cursor = 'nwse-resize';
          break;
        case 1: // Top Right
          xMulti=1;
          yMulti=-1;
          cursor = 'nesw-resize';
          break;
        case 2: // Bottom Left
          xMulti=-1;
          yMulti=1;
          cursor = 'nesw-resize';
          break;
        case 3: // Bottom Right
          xMulti=1;
          yMulti=1;
          cursor = 'nwse-resize';
          break;
      }
      var iFX = (mouseCurX - this._posResizeStartX)*xMulti;
      var iFY = (mouseCurY - this._posResizeStartY)*yMulti;
      var iFR;
      if(iFX>iFY) {
        iFR = this._posResizeStartSize + iFY;
      } else {
        iFR = this._posResizeStartSize + iFX;
      }
      var wasSize=this._size;
      this._size = Math.max(this._minSize, iFR);
      var posModifier=(this._size-wasSize)/2;
      this._x+=posModifier*xMulti;
      this._y+=posModifier*yMulti;
      this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
      res=true;
      this._events.trigger('area-resize');
    } else {
      var hoveredResizeBox=this._isCoordWithinResizeCtrl([mouseCurX,mouseCurY]);
      if (hoveredResizeBox>-1) {
        switch(hoveredResizeBox) {
          case 0:
            cursor = 'nwse-resize';
            break;
          case 1:
            cursor = 'nesw-resize';
            break;
          case 2:
            cursor = 'nesw-resize';
            break;
          case 3:
            cursor = 'nwse-resize';
            break;
        }
        this._areaIsHover = false;
        this._resizeCtrlIsHover = hoveredResizeBox;
        res=true;
      } else if(this._isCoordWithinArea([mouseCurX,mouseCurY])) {
        cursor = 'move';
        this._areaIsHover = true;
        res=true;
      }
    }

    this._dontDragOutside();
    angular.element(this._ctx.canvas).css({'cursor': cursor});

    return res;
  };

  CropAreaSquare.prototype.processMouseDown=function(mouseDownX, mouseDownY) {
    var isWithinResizeCtrl=this._isCoordWithinResizeCtrl([mouseDownX,mouseDownY]);
    if (isWithinResizeCtrl>-1) {
      this._areaIsDragging = false;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = isWithinResizeCtrl;
      this._resizeCtrlIsHover = isWithinResizeCtrl;
      this._posResizeStartX=mouseDownX;
      this._posResizeStartY=mouseDownY;
      this._posResizeStartSize = this._size;
      this._events.trigger('area-resize-start');
    } else if (this._isCoordWithinArea([mouseDownX,mouseDownY])) {
      this._areaIsDragging = true;
      this._areaIsHover = true;
      this._resizeCtrlIsDragging = -1;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = mouseDownX - this._x;
      this._posDragStartY = mouseDownY - this._y;
      this._events.trigger('area-move-start');
    }
  };

  CropAreaSquare.prototype.processMouseUp=function(/*mouseUpX, mouseUpY*/) {
    if(this._areaIsDragging) {
      this._areaIsDragging = false;
      this._events.trigger('area-move-end');
    }
    if(this._resizeCtrlIsDragging>-1) {
      this._resizeCtrlIsDragging = -1;
      this._events.trigger('area-resize-end');
    }
    this._areaIsHover = false;
    this._resizeCtrlIsHover = -1;

    this._posDragStartX = 0;
    this._posDragStartY = 0;
  };

  return CropAreaSquare;
}]);

angular.module('SER.image').factory('cropArea', ['cropCanvas', function(CropCanvas) {
  var CropArea = function(ctx, events) {
    this._ctx=ctx;
    this._events=events;

    this._minSize=80;

    this._cropCanvas=new CropCanvas(ctx);

    this._image=new Image();
    this._x = 0;
    this._y = 0;
    this._size = 200;
  };

  /* GETTERS/SETTERS */

  CropArea.prototype.getImage = function () {
    return this._image;
  };
  CropArea.prototype.setImage = function (image) {
    this._image = image;
  };

  CropArea.prototype.getX = function () {
    return this._x;
  };
  CropArea.prototype.setX = function (x) {
    this._x = x;
    this._dontDragOutside();
  };

  CropArea.prototype.getY = function () {
    return this._y;
  };
  CropArea.prototype.setY = function (y) {
    this._y = y;
    this._dontDragOutside();
  };

  CropArea.prototype.getSize = function () {
    return this._size;
  };
  CropArea.prototype.setSize = function (size) {
    this._size = Math.max(this._minSize, size);
    this._dontDragOutside();
  };

  CropArea.prototype.getMinSize = function () {
    return this._minSize;
  };
  CropArea.prototype.setMinSize = function (size) {
    this._minSize = size;
    this._size = Math.max(this._minSize, this._size);
    this._dontDragOutside();
  };

  /* FUNCTIONS */
  CropArea.prototype._dontDragOutside=function() {
    var h=this._ctx.canvas.height,
        w=this._ctx.canvas.width;
    if(this._size>w) { this._size=w; }
    if(this._size>h) { this._size=h; }
    if(this._x<this._size/2) { this._x=this._size/2; }
    if(this._x>w-this._size/2) { this._x=w-this._size/2; }
    if(this._y<this._size/2) { this._y=this._size/2; }
    if(this._y>h-this._size/2) { this._y=h-this._size/2; }
  };

  CropArea.prototype._drawArea=function() {};

  CropArea.prototype.draw=function() {
    // draw crop area
    this._cropCanvas.drawCropArea(this._image,[this._x,this._y],this._size,this._drawArea);
  };

  CropArea.prototype.processMouseMove=function() {};

  CropArea.prototype.processMouseDown=function() {};

  CropArea.prototype.processMouseUp=function() {};

  return CropArea;
}]);

angular.module('SER.image').factory('cropCanvas', [function() {
  // Shape = Array of [x,y]; [0, 0] - center
  var shapeArrowNW=[[-0.5,-2],[-3,-4.5],[-0.5,-7],[-7,-7],[-7,-0.5],[-4.5,-3],[-2,-0.5]];
  var shapeArrowNE=[[0.5,-2],[3,-4.5],[0.5,-7],[7,-7],[7,-0.5],[4.5,-3],[2,-0.5]];
  var shapeArrowSW=[[-0.5,2],[-3,4.5],[-0.5,7],[-7,7],[-7,0.5],[-4.5,3],[-2,0.5]];
  var shapeArrowSE=[[0.5,2],[3,4.5],[0.5,7],[7,7],[7,0.5],[4.5,3],[2,0.5]];
  var shapeArrowN=[[-1.5,-2.5],[-1.5,-6],[-5,-6],[0,-11],[5,-6],[1.5,-6],[1.5,-2.5]];
  var shapeArrowW=[[-2.5,-1.5],[-6,-1.5],[-6,-5],[-11,0],[-6,5],[-6,1.5],[-2.5,1.5]];
  var shapeArrowS=[[-1.5,2.5],[-1.5,6],[-5,6],[0,11],[5,6],[1.5,6],[1.5,2.5]];
  var shapeArrowE=[[2.5,-1.5],[6,-1.5],[6,-5],[11,0],[6,5],[6,1.5],[2.5,1.5]];

  // Colors
  var colors={
    areaOutline: '#fff',
    resizeBoxStroke: '#fff',
    resizeBoxFill: '#444',
    resizeBoxArrowFill: '#fff',
    resizeCircleStroke: '#fff',
    resizeCircleFill: '#444',
    moveIconFill: '#fff'
  };

  return function(ctx){

    /* Base functions */

    // Calculate Point
    var calcPoint=function(point,offset,scale) {
        return [scale*point[0]+offset[0], scale*point[1]+offset[1]];
    };

    // Draw Filled Polygon
    var drawFilledPolygon=function(shape,fillStyle,centerCoords,scale) {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        var pc, pc0=calcPoint(shape[0],centerCoords,scale);
        ctx.moveTo(pc0[0],pc0[1]);

        for(var p in shape) {
            if (p > 0) {
                pc=calcPoint(shape[p],centerCoords,scale);
                ctx.lineTo(pc[0],pc[1]);
            }
        }

        ctx.lineTo(pc0[0],pc0[1]);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    /* Icons */

    this.drawIconMove=function(centerCoords, scale) {
      drawFilledPolygon(shapeArrowN, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowW, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowS, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowE, colors.moveIconFill, centerCoords, scale);
    };

    this.drawIconResizeCircle=function(centerCoords, circleRadius, scale) {
      var scaledCircleRadius=circleRadius*scale;
      ctx.save();
      ctx.strokeStyle = colors.resizeCircleStroke;
      ctx.lineWidth = 2;
      ctx.fillStyle = colors.resizeCircleFill;
      ctx.beginPath();
      ctx.arc(centerCoords[0],centerCoords[1],scaledCircleRadius,0,2*Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };

    this.drawIconResizeBoxBase=function(centerCoords, boxSize, scale) {
      var scaledBoxSize=boxSize*scale;
      ctx.save();
      ctx.strokeStyle = colors.resizeBoxStroke;
      ctx.lineWidth = 2;
      ctx.fillStyle = colors.resizeBoxFill;
      ctx.fillRect(centerCoords[0] - scaledBoxSize/2, centerCoords[1] - scaledBoxSize/2, scaledBoxSize, scaledBoxSize);
      ctx.strokeRect(centerCoords[0] - scaledBoxSize/2, centerCoords[1] - scaledBoxSize/2, scaledBoxSize, scaledBoxSize);
      ctx.restore();
    };
    this.drawIconResizeBoxNESW=function(centerCoords, boxSize, scale) {
      this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
      drawFilledPolygon(shapeArrowNE, colors.resizeBoxArrowFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowSW, colors.resizeBoxArrowFill, centerCoords, scale);
    };
    this.drawIconResizeBoxNWSE=function(centerCoords, boxSize, scale) {
      this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
      drawFilledPolygon(shapeArrowNW, colors.resizeBoxArrowFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowSE, colors.resizeBoxArrowFill, centerCoords, scale);
    };

    /* Crop Area */

    this.drawCropArea=function(image, centerCoords, size, fnDrawClipPath) {
      var xRatio=image.width/ctx.canvas.width,
          yRatio=image.height/ctx.canvas.height,
          xLeft=centerCoords[0]-size/2,
          yTop=centerCoords[1]-size/2;

      ctx.save();
      ctx.strokeStyle = colors.areaOutline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      fnDrawClipPath(ctx, centerCoords, size);
      ctx.stroke();
      ctx.clip();

      // draw part of original image
      if (size > 0) {
          ctx.drawImage(image, xLeft*xRatio, yTop*yRatio, size*xRatio, size*yRatio, xLeft, yTop, size, size);
      }

      ctx.beginPath();
      fnDrawClipPath(ctx, centerCoords, size);
      ctx.stroke();
      ctx.clip();

      ctx.restore();
    };

  };
}]);

/**
 * EXIF service is based on the exif-js library (https://github.com/jseidelin/exif-js)
 */

angular.module('SER.image').service('cropEXIF', [function() {
  var debug = false;

  var ExifTags = this.Tags = {

      // version tags
      0x9000 : "ExifVersion",             // EXIF version
      0xA000 : "FlashpixVersion",         // Flashpix format version

      // colorspace tags
      0xA001 : "ColorSpace",              // Color space information tag

      // image configuration
      0xA002 : "PixelXDimension",         // Valid width of meaningful image
      0xA003 : "PixelYDimension",         // Valid height of meaningful image
      0x9101 : "ComponentsConfiguration", // Information about channels
      0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

      // user information
      0x927C : "MakerNote",               // Any desired information written by the manufacturer
      0x9286 : "UserComment",             // Comments by user

      // related file
      0xA004 : "RelatedSoundFile",        // Name of related sound file

      // date and time
      0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
      0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
      0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
      0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
      0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

      // picture-taking conditions
      0x829A : "ExposureTime",            // Exposure time (in seconds)
      0x829D : "FNumber",                 // F number
      0x8822 : "ExposureProgram",         // Exposure program
      0x8824 : "SpectralSensitivity",     // Spectral sensitivity
      0x8827 : "ISOSpeedRatings",         // ISO speed rating
      0x8828 : "OECF",                    // Optoelectric conversion factor
      0x9201 : "ShutterSpeedValue",       // Shutter speed
      0x9202 : "ApertureValue",           // Lens aperture
      0x9203 : "BrightnessValue",         // Value of brightness
      0x9204 : "ExposureBias",            // Exposure bias
      0x9205 : "MaxApertureValue",        // Smallest F number of lens
      0x9206 : "SubjectDistance",         // Distance to subject in meters
      0x9207 : "MeteringMode",            // Metering mode
      0x9208 : "LightSource",             // Kind of light source
      0x9209 : "Flash",                   // Flash status
      0x9214 : "SubjectArea",             // Location and area of main subject
      0x920A : "FocalLength",             // Focal length of the lens in mm
      0xA20B : "FlashEnergy",             // Strobe energy in BCPS
      0xA20C : "SpatialFrequencyResponse",    //
      0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
      0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
      0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
      0xA214 : "SubjectLocation",         // Location of subject in image
      0xA215 : "ExposureIndex",           // Exposure index selected on camera
      0xA217 : "SensingMethod",           // Image sensor type
      0xA300 : "FileSource",              // Image source (3 == DSC)
      0xA301 : "SceneType",               // Scene type (1 == directly photographed)
      0xA302 : "CFAPattern",              // Color filter array geometric pattern
      0xA401 : "CustomRendered",          // Special processing
      0xA402 : "ExposureMode",            // Exposure mode
      0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
      0xA404 : "DigitalZoomRation",       // Digital zoom ratio
      0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
      0xA406 : "SceneCaptureType",        // Type of scene
      0xA407 : "GainControl",             // Degree of overall image gain adjustment
      0xA408 : "Contrast",                // Direction of contrast processing applied by camera
      0xA409 : "Saturation",              // Direction of saturation processing applied by camera
      0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
      0xA40B : "DeviceSettingDescription",    //
      0xA40C : "SubjectDistanceRange",    // Distance to subject

      // other tags
      0xA005 : "InteroperabilityIFDPointer",
      0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
  };

  var TiffTags = this.TiffTags = {
      0x0100 : "ImageWidth",
      0x0101 : "ImageHeight",
      0x8769 : "ExifIFDPointer",
      0x8825 : "GPSInfoIFDPointer",
      0xA005 : "InteroperabilityIFDPointer",
      0x0102 : "BitsPerSample",
      0x0103 : "Compression",
      0x0106 : "PhotometricInterpretation",
      0x0112 : "Orientation",
      0x0115 : "SamplesPerPixel",
      0x011C : "PlanarConfiguration",
      0x0212 : "YCbCrSubSampling",
      0x0213 : "YCbCrPositioning",
      0x011A : "XResolution",
      0x011B : "YResolution",
      0x0128 : "ResolutionUnit",
      0x0111 : "StripOffsets",
      0x0116 : "RowsPerStrip",
      0x0117 : "StripByteCounts",
      0x0201 : "JPEGInterchangeFormat",
      0x0202 : "JPEGInterchangeFormatLength",
      0x012D : "TransferFunction",
      0x013E : "WhitePoint",
      0x013F : "PrimaryChromaticities",
      0x0211 : "YCbCrCoefficients",
      0x0214 : "ReferenceBlackWhite",
      0x0132 : "DateTime",
      0x010E : "ImageDescription",
      0x010F : "Make",
      0x0110 : "Model",
      0x0131 : "Software",
      0x013B : "Artist",
      0x8298 : "Copyright"
  };

  var GPSTags = this.GPSTags = {
      0x0000 : "GPSVersionID",
      0x0001 : "GPSLatitudeRef",
      0x0002 : "GPSLatitude",
      0x0003 : "GPSLongitudeRef",
      0x0004 : "GPSLongitude",
      0x0005 : "GPSAltitudeRef",
      0x0006 : "GPSAltitude",
      0x0007 : "GPSTimeStamp",
      0x0008 : "GPSSatellites",
      0x0009 : "GPSStatus",
      0x000A : "GPSMeasureMode",
      0x000B : "GPSDOP",
      0x000C : "GPSSpeedRef",
      0x000D : "GPSSpeed",
      0x000E : "GPSTrackRef",
      0x000F : "GPSTrack",
      0x0010 : "GPSImgDirectionRef",
      0x0011 : "GPSImgDirection",
      0x0012 : "GPSMapDatum",
      0x0013 : "GPSDestLatitudeRef",
      0x0014 : "GPSDestLatitude",
      0x0015 : "GPSDestLongitudeRef",
      0x0016 : "GPSDestLongitude",
      0x0017 : "GPSDestBearingRef",
      0x0018 : "GPSDestBearing",
      0x0019 : "GPSDestDistanceRef",
      0x001A : "GPSDestDistance",
      0x001B : "GPSProcessingMethod",
      0x001C : "GPSAreaInformation",
      0x001D : "GPSDateStamp",
      0x001E : "GPSDifferential"
  };

  var StringValues = this.StringValues = {
      ExposureProgram : {
          0 : "Not defined",
          1 : "Manual",
          2 : "Normal program",
          3 : "Aperture priority",
          4 : "Shutter priority",
          5 : "Creative program",
          6 : "Action program",
          7 : "Portrait mode",
          8 : "Landscape mode"
      },
      MeteringMode : {
          0 : "Unknown",
          1 : "Average",
          2 : "CenterWeightedAverage",
          3 : "Spot",
          4 : "MultiSpot",
          5 : "Pattern",
          6 : "Partial",
          255 : "Other"
      },
      LightSource : {
          0 : "Unknown",
          1 : "Daylight",
          2 : "Fluorescent",
          3 : "Tungsten (incandescent light)",
          4 : "Flash",
          9 : "Fine weather",
          10 : "Cloudy weather",
          11 : "Shade",
          12 : "Daylight fluorescent (D 5700 - 7100K)",
          13 : "Day white fluorescent (N 4600 - 5400K)",
          14 : "Cool white fluorescent (W 3900 - 4500K)",
          15 : "White fluorescent (WW 3200 - 3700K)",
          17 : "Standard light A",
          18 : "Standard light B",
          19 : "Standard light C",
          20 : "D55",
          21 : "D65",
          22 : "D75",
          23 : "D50",
          24 : "ISO studio tungsten",
          255 : "Other"
      },
      Flash : {
          0x0000 : "Flash did not fire",
          0x0001 : "Flash fired",
          0x0005 : "Strobe return light not detected",
          0x0007 : "Strobe return light detected",
          0x0009 : "Flash fired, compulsory flash mode",
          0x000D : "Flash fired, compulsory flash mode, return light not detected",
          0x000F : "Flash fired, compulsory flash mode, return light detected",
          0x0010 : "Flash did not fire, compulsory flash mode",
          0x0018 : "Flash did not fire, auto mode",
          0x0019 : "Flash fired, auto mode",
          0x001D : "Flash fired, auto mode, return light not detected",
          0x001F : "Flash fired, auto mode, return light detected",
          0x0020 : "No flash function",
          0x0041 : "Flash fired, red-eye reduction mode",
          0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
          0x0047 : "Flash fired, red-eye reduction mode, return light detected",
          0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
          0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          0x0059 : "Flash fired, auto mode, red-eye reduction mode",
          0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
      },
      SensingMethod : {
          1 : "Not defined",
          2 : "One-chip color area sensor",
          3 : "Two-chip color area sensor",
          4 : "Three-chip color area sensor",
          5 : "Color sequential area sensor",
          7 : "Trilinear sensor",
          8 : "Color sequential linear sensor"
      },
      SceneCaptureType : {
          0 : "Standard",
          1 : "Landscape",
          2 : "Portrait",
          3 : "Night scene"
      },
      SceneType : {
          1 : "Directly photographed"
      },
      CustomRendered : {
          0 : "Normal process",
          1 : "Custom process"
      },
      WhiteBalance : {
          0 : "Auto white balance",
          1 : "Manual white balance"
      },
      GainControl : {
          0 : "None",
          1 : "Low gain up",
          2 : "High gain up",
          3 : "Low gain down",
          4 : "High gain down"
      },
      Contrast : {
          0 : "Normal",
          1 : "Soft",
          2 : "Hard"
      },
      Saturation : {
          0 : "Normal",
          1 : "Low saturation",
          2 : "High saturation"
      },
      Sharpness : {
          0 : "Normal",
          1 : "Soft",
          2 : "Hard"
      },
      SubjectDistanceRange : {
          0 : "Unknown",
          1 : "Macro",
          2 : "Close view",
          3 : "Distant view"
      },
      FileSource : {
          3 : "DSC"
      },

      Components : {
          0 : "",
          1 : "Y",
          2 : "Cb",
          3 : "Cr",
          4 : "R",
          5 : "G",
          6 : "B"
      }
  };

  function addEvent(element, event, handler) {
      if (element.addEventListener) {
          element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
          element.attachEvent("on" + event, handler);
      }
  }

  function imageHasData(img) {
      return !!(img.exifdata);
  }

  function base64ToArrayBuffer(base64, contentType) {
      contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
      var binary = atob(base64);
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
      }
      return buffer;
  }

  function objectURLToBlob(url, callback) {
      var http = new XMLHttpRequest();
      http.open("GET", url, true);
      http.responseType = "blob";
      http.onload = function(e) {
          if (this.status == 200 || this.status === 0) {
              callback(this.response);
          }
      };
      http.send();
  }

  function getImageData(img, callback) {
      function handleBinaryFile(binFile) {
          var data = findEXIFinJPEG(binFile);
          var iptcdata = findIPTCinJPEG(binFile);
          img.exifdata = data || {};
          img.iptcdata = iptcdata || {};
          if (callback) {
              callback.call(img);
          }
      }

      if (img.src) {
          if (/^data\:/i.test(img.src)) { // Data URI
              var arrayBuffer = base64ToArrayBuffer(img.src);
              handleBinaryFile(arrayBuffer);

          } else if (/^blob\:/i.test(img.src)) { // Object URL
              var fileReader = new FileReader();
              fileReader.onload = function(e) {
                  handleBinaryFile(e.target.result);
              };
              objectURLToBlob(img.src, function (blob) {
                  fileReader.readAsArrayBuffer(blob);
              });
          } else {
              var http = new XMLHttpRequest();
              http.onload = function() {
                  if (this.status == 200 || this.status === 0) {
                      handleBinaryFile(http.response);
                  } else {
                      throw "Could not load image";
                  }
                  http = null;
              };
              http.open("GET", img.src, true);
              http.responseType = "arraybuffer";
              http.send(null);
          }
      } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
          var fileReader = new FileReader();
          fileReader.onload = function(e) {
              if (debug) console.log("Got file of length " + e.target.result.byteLength);
              handleBinaryFile(e.target.result);
          };

          fileReader.readAsArrayBuffer(img);
      }
  }

  function findEXIFinJPEG(file) {
      var dataView = new DataView(file);

      if (debug) console.log("Got file of length " + file.byteLength);
      if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
          if (debug) console.log("Not a valid JPEG");
          return false; // not a valid jpeg
      }

      var offset = 2,
          length = file.byteLength,
          marker;

      while (offset < length) {
          if (dataView.getUint8(offset) != 0xFF) {
              if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
              return false; // not a valid marker, something is wrong
          }

          marker = dataView.getUint8(offset + 1);
          if (debug) console.log(marker);

          // we could implement handling for other markers here,
          // but we're only looking for 0xFFE1 for EXIF data

          if (marker == 225) {
              if (debug) console.log("Found 0xFFE1 marker");

              return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

              // offset += 2 + file.getShortAt(offset+2, true);

          } else {
              offset += 2 + dataView.getUint16(offset+2);
          }

      }

  }

  function findIPTCinJPEG(file) {
      var dataView = new DataView(file);

      if (debug) console.log("Got file of length " + file.byteLength);
      if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
          if (debug) console.log("Not a valid JPEG");
          return false; // not a valid jpeg
      }

      var offset = 2,
          length = file.byteLength;

      var isFieldSegmentStart = function(dataView, offset){
          return (
              dataView.getUint8(offset) === 0x38 &&
              dataView.getUint8(offset+1) === 0x42 &&
              dataView.getUint8(offset+2) === 0x49 &&
              dataView.getUint8(offset+3) === 0x4D &&
              dataView.getUint8(offset+4) === 0x04 &&
              dataView.getUint8(offset+5) === 0x04
          );
      };

      while (offset < length) {

          if ( isFieldSegmentStart(dataView, offset )){

              // Get the length of the name header (which is padded to an even number of bytes)
              var nameHeaderLength = dataView.getUint8(offset+7);
              if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
              // Check for pre photoshop 6 format
              if(nameHeaderLength === 0) {
                  // Always 4
                  nameHeaderLength = 4;
              }

              var startOffset = offset + 8 + nameHeaderLength;
              var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

              return readIPTCData(file, startOffset, sectionLength);

              break;

          }

          // Not the marker, continue searching
          offset++;

      }

  }
  var IptcFieldMap = {
      0x78 : 'caption',
      0x6E : 'credit',
      0x19 : 'keywords',
      0x37 : 'dateCreated',
      0x50 : 'byline',
      0x55 : 'bylineTitle',
      0x7A : 'captionWriter',
      0x69 : 'headline',
      0x74 : 'copyright',
      0x0F : 'category'
  };
  function readIPTCData(file, startOffset, sectionLength){
      var dataView = new DataView(file);
      var data = {};
      var fieldValue, fieldName, dataSize, segmentType, segmentSize;
      var segmentStartPos = startOffset;
      while(segmentStartPos < startOffset+sectionLength) {
          if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
              segmentType = dataView.getUint8(segmentStartPos+2);
              if(segmentType in IptcFieldMap) {
                  dataSize = dataView.getInt16(segmentStartPos+3);
                  segmentSize = dataSize + 5;
                  fieldName = IptcFieldMap[segmentType];
                  fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                  // Check if we already stored a value with this name
                  if(data.hasOwnProperty(fieldName)) {
                      // Value already stored with this name, create multivalue field
                      if(data[fieldName] instanceof Array) {
                          data[fieldName].push(fieldValue);
                      }
                      else {
                          data[fieldName] = [data[fieldName], fieldValue];
                      }
                  }
                  else {
                      data[fieldName] = fieldValue;
                  }
              }

          }
          segmentStartPos++;
      }
      return data;
  }

  function readTags(file, tiffStart, dirStart, strings, bigEnd) {
      var entries = file.getUint16(dirStart, !bigEnd),
          tags = {},
          entryOffset, tag,
          i;

      for (i=0;i<entries;i++) {
          entryOffset = dirStart + i*12 + 2;
          tag = strings[file.getUint16(entryOffset, !bigEnd)];
          if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
          tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
      }
      return tags;
  }

  function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
      var type = file.getUint16(entryOffset+2, !bigEnd),
          numValues = file.getUint32(entryOffset+4, !bigEnd),
          valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
          offset,
          vals, val, n,
          numerator, denominator;

      switch (type) {
          case 1: // byte, 8-bit unsigned int
          case 7: // undefined, 8-bit byte, value depending on field
              if (numValues == 1) {
                  return file.getUint8(entryOffset + 8, !bigEnd);
              } else {
                  offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint8(offset + n);
                  }
                  return vals;
              }

          case 2: // ascii, 8-bit byte
              offset = numValues > 4 ? valueOffset : (entryOffset + 8);
              return getStringFromDB(file, offset, numValues-1);

          case 3: // short, 16 bit int
              if (numValues == 1) {
                  return file.getUint16(entryOffset + 8, !bigEnd);
              } else {
                  offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                  }
                  return vals;
              }

          case 4: // long, 32 bit int
              if (numValues == 1) {
                  return file.getUint32(entryOffset + 8, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                  }
                  return vals;
              }

          case 5:    // rational = two long values, first is numerator, second is denominator
              if (numValues == 1) {
                  numerator = file.getUint32(valueOffset, !bigEnd);
                  denominator = file.getUint32(valueOffset+4, !bigEnd);
                  val = new Number(numerator / denominator);
                  val.numerator = numerator;
                  val.denominator = denominator;
                  return val;
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                      denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                      vals[n] = new Number(numerator / denominator);
                      vals[n].numerator = numerator;
                      vals[n].denominator = denominator;
                  }
                  return vals;
              }

          case 9: // slong, 32 bit signed int
              if (numValues == 1) {
                  return file.getInt32(entryOffset + 8, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                  }
                  return vals;
              }

          case 10: // signed rational, two slongs, first is numerator, second is denominator
              if (numValues == 1) {
                  return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                  }
                  return vals;
              }
      }
  }

  function getStringFromDB(buffer, start, length) {
      var outstr = "";
      for (var n = start; n < start+length; n++) {
          outstr += String.fromCharCode(buffer.getUint8(n));
      }
      return outstr;
  }

  function readEXIFData(file, start) {
      if (getStringFromDB(file, start, 4) != "Exif") {
          if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
          return false;
      }

      var bigEnd,
          tags, tag,
          exifData, gpsData,
          tiffOffset = start + 6;

      // test for TIFF validity and endianness
      if (file.getUint16(tiffOffset) == 0x4949) {
          bigEnd = false;
      } else if (file.getUint16(tiffOffset) == 0x4D4D) {
          bigEnd = true;
      } else {
          if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
          return false;
      }

      if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
          if (debug) console.log("Not valid TIFF data! (no 0x002A)");
          return false;
      }

      var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

      if (firstIFDOffset < 0x00000008) {
          if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
          return false;
      }

      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

      if (tags.ExifIFDPointer) {
          exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
          for (tag in exifData) {
              switch (tag) {
                  case "LightSource" :
                  case "Flash" :
                  case "MeteringMode" :
                  case "ExposureProgram" :
                  case "SensingMethod" :
                  case "SceneCaptureType" :
                  case "SceneType" :
                  case "CustomRendered" :
                  case "WhiteBalance" :
                  case "GainControl" :
                  case "Contrast" :
                  case "Saturation" :
                  case "Sharpness" :
                  case "SubjectDistanceRange" :
                  case "FileSource" :
                      exifData[tag] = StringValues[tag][exifData[tag]];
                      break;

                  case "ExifVersion" :
                  case "FlashpixVersion" :
                      exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                      break;

                  case "ComponentsConfiguration" :
                      exifData[tag] =
                          StringValues.Components[exifData[tag][0]] +
                          StringValues.Components[exifData[tag][1]] +
                          StringValues.Components[exifData[tag][2]] +
                          StringValues.Components[exifData[tag][3]];
                      break;
              }
              tags[tag] = exifData[tag];
          }
      }

      if (tags.GPSInfoIFDPointer) {
          gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
          for (tag in gpsData) {
              switch (tag) {
                  case "GPSVersionID" :
                      gpsData[tag] = gpsData[tag][0] +
                          "." + gpsData[tag][1] +
                          "." + gpsData[tag][2] +
                          "." + gpsData[tag][3];
                      break;
              }
              tags[tag] = gpsData[tag];
          }
      }

      return tags;
  }

  this.getData = function(img, callback) {
      if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

      if (!imageHasData(img)) {
          getImageData(img, callback);
      } else {
          if (callback) {
              callback.call(img);
          }
      }
      return true;
  }

  this.getTag = function(img, tag) {
      if (!imageHasData(img)) return;
      return img.exifdata[tag];
  }

  this.getAllTags = function(img) {
      if (!imageHasData(img)) return {};
      var a,
          data = img.exifdata,
          tags = {};
      for (a in data) {
          if (data.hasOwnProperty(a)) {
              tags[a] = data[a];
          }
      }
      return tags;
  }

  this.pretty = function(img) {
      if (!imageHasData(img)) return "";
      var a,
          data = img.exifdata,
          strPretty = "";
      for (a in data) {
          if (data.hasOwnProperty(a)) {
              if (typeof data[a] == "object") {
                  if (data[a] instanceof Number) {
                      strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                  } else {
                      strPretty += a + " : [" + data[a].length + " values]\r\n";
                  }
              } else {
                  strPretty += a + " : " + data[a] + "\r\n";
              }
          }
      }
      return strPretty;
  }

  this.readFromBinaryFile = function(file) {
      return findEXIFinJPEG(file);
  }
}]);

angular.module('SER.image').factory('cropHost', ['$document', 'cropAreaCircle', 'cropAreaSquare', 'cropEXIF', function($document, CropAreaCircle, CropAreaSquare, cropEXIF) {
  /* STATIC FUNCTIONS */

  // Get Element's Offset
  var getElementOffset=function(elem) {
      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docElem = document.documentElement;

      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
  };

  return function(elCanvas, opts, events){
    /* PRIVATE VARIABLES */

    // Object Pointers
    var ctx=null,
        image=null,
        theArea=null;

    // Dimensions
    var minCanvasDims=[100,100],
        maxCanvasDims=[300,300];

    // Result Image size
    var resImgSize=200;

    // Result Image type
    var resImgFormat='image/png';

    // Result Image quality
    var resImgQuality=null;

    /* PRIVATE FUNCTIONS */

    // Draw Scene
    function drawScene() {
      // clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if(image!==null) {
        // draw source image
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();

        // and make it darker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.restore();

        // draw Area
        theArea.draw();
      }
    }

    // Resets CropHost
    var resetCropHost=function() {
      if(image!==null) {
        theArea.setImage(image);
        var imageDims=[image.width, image.height],
            imageRatio=image.width/image.height,
            canvasDims=imageDims;

        if(canvasDims[0]>maxCanvasDims[0]) {
          canvasDims[0]=maxCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        } else if(canvasDims[0]<minCanvasDims[0]) {
          canvasDims[0]=minCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        }
        if(canvasDims[1]>maxCanvasDims[1]) {
          canvasDims[1]=maxCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        } else if(canvasDims[1]<minCanvasDims[1]) {
          canvasDims[1]=minCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        }
        elCanvas.prop('width',canvasDims[0]).prop('height',canvasDims[1]).css({'margin-left': -canvasDims[0]/2+'px', 'margin-top': -canvasDims[1]/2+'px'});

        theArea.setX(ctx.canvas.width/2);
        theArea.setY(ctx.canvas.height/2);
        theArea.setSize(Math.min(200, ctx.canvas.width/2, ctx.canvas.height/2));
      } else {
        elCanvas.prop('width',0).prop('height',0).css({'margin-top': 0});
      }

      drawScene();
    };

    /**
     * Returns event.changedTouches directly if event is a TouchEvent.
     * If event is a jQuery event, return changedTouches of event.originalEvent
     */
    var getChangedTouches=function(event){
      if(angular.isDefined(event.changedTouches)){
        return event.changedTouches;
      }else{
        return event.originalEvent.changedTouches;
      }
    };

    var onMouseMove=function(e) {
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchmove') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseMove(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    var onMouseDown=function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchstart') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseDown(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    var onMouseUp=function(e) {
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchend') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseUp(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    this.getResultImageDataURI=function() {
      var temp_ctx, temp_canvas;
      temp_canvas = angular.element('<canvas></canvas>')[0];
      temp_ctx = temp_canvas.getContext('2d');
      temp_canvas.width = resImgSize;
      temp_canvas.height = resImgSize;
      if(image!==null){
        temp_ctx.drawImage(image, (theArea.getX()-theArea.getSize()/2)*(image.width/ctx.canvas.width), (theArea.getY()-theArea.getSize()/2)*(image.height/ctx.canvas.height), theArea.getSize()*(image.width/ctx.canvas.width), theArea.getSize()*(image.height/ctx.canvas.height), 0, 0, resImgSize, resImgSize);
      }
      if (resImgQuality!==null ){
        return temp_canvas.toDataURL(resImgFormat, resImgQuality);
      }
      return temp_canvas.toDataURL(resImgFormat);
    };

    this.setNewImageSource=function(imageSource) {
      image=null;
      resetCropHost();
      events.trigger('image-updated');
      if(!!imageSource) {
        var newImage = new Image();
        if(imageSource.substring(0,4).toLowerCase()==='http') {
          newImage.crossOrigin = 'anonymous';
        }
        newImage.onload = function(){
          events.trigger('load-done');

          cropEXIF.getData(newImage,function(){
            var orientation=cropEXIF.getTag(newImage,'Orientation');

            if([3,6,8].indexOf(orientation)>-1) {
              var canvas = document.createElement("canvas"),
                  ctx=canvas.getContext("2d"),
                  cw = newImage.width, ch = newImage.height, cx = 0, cy = 0, deg=0;
              switch(orientation) {
                case 3:
                  cx=-newImage.width;
                  cy=-newImage.height;
                  deg=180;
                  break;
                case 6:
                  cw = newImage.height;
                  ch = newImage.width;
                  cy=-newImage.height;
                  deg=90;
                  break;
                case 8:
                  cw = newImage.height;
                  ch = newImage.width;
                  cx=-newImage.width;
                  deg=270;
                  break;
              }

              canvas.width = cw;
              canvas.height = ch;
              ctx.rotate(deg*Math.PI/180);
              ctx.drawImage(newImage, cx, cy);

              image=new Image();
              image.src = canvas.toDataURL("image/png");
            } else {
              image=newImage;
            }
            resetCropHost();
            events.trigger('image-updated');
          });
        };
        newImage.onerror=function() {
          events.trigger('load-error');
        };
        events.trigger('load-start');
        newImage.src=imageSource;
      }
    };

    this.setMaxDimensions=function(width, height) {
      maxCanvasDims=[width,height];

      if(image!==null) {
        var curWidth=ctx.canvas.width,
            curHeight=ctx.canvas.height;

        var imageDims=[image.width, image.height],
            imageRatio=image.width/image.height,
            canvasDims=imageDims;

        if(canvasDims[0]>maxCanvasDims[0]) {
          canvasDims[0]=maxCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        } else if(canvasDims[0]<minCanvasDims[0]) {
          canvasDims[0]=minCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        }
        if(canvasDims[1]>maxCanvasDims[1]) {
          canvasDims[1]=maxCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        } else if(canvasDims[1]<minCanvasDims[1]) {
          canvasDims[1]=minCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        }
        elCanvas.prop('width',canvasDims[0]).prop('height',canvasDims[1]).css({'margin-left': -canvasDims[0]/2+'px', 'margin-top': -canvasDims[1]/2+'px'});

        var ratioNewCurWidth=ctx.canvas.width/curWidth,
            ratioNewCurHeight=ctx.canvas.height/curHeight,
            ratioMin=Math.min(ratioNewCurWidth, ratioNewCurHeight);

        theArea.setX(theArea.getX()*ratioNewCurWidth);
        theArea.setY(theArea.getY()*ratioNewCurHeight);
        theArea.setSize(theArea.getSize()*ratioMin);
      } else {
        elCanvas.prop('width',0).prop('height',0).css({'margin-top': 0});
      }

      drawScene();

    };

    this.setAreaMinSize=function(size) {
      size=parseInt(size,10);
      if(!isNaN(size)) {
        theArea.setMinSize(size);
        drawScene();
      }
    };

    this.setResultImageSize=function(size) {
      size=parseInt(size,10);
      if(!isNaN(size)) {
        resImgSize=size;
      }
    };

    this.setResultImageFormat=function(format) {
      resImgFormat = format;
    };

    this.setResultImageQuality=function(quality){
      quality = parseFloat(quality);
      if (!isNaN(quality) && quality>=0 && quality<=1){
        resImgQuality = quality;
      }
    };

    this.setAreaType=function(type) {
      var curSize=theArea.getSize(),
          curMinSize=theArea.getMinSize(),
          curX=theArea.getX(),
          curY=theArea.getY();

      var AreaClass=CropAreaCircle;
      if(type==='square') {
        AreaClass=CropAreaSquare;
      }
      theArea = new AreaClass(ctx, events);
      theArea.setMinSize(curMinSize);
      theArea.setSize(curSize);
      theArea.setX(curX);
      theArea.setY(curY);

      // resetCropHost();
      if(image!==null) {
        theArea.setImage(image);
      }

      drawScene();
    };

    /* Life Cycle begins */

    // Init Context var
    ctx = elCanvas[0].getContext('2d');

    // Init CropArea
    theArea = new CropAreaCircle(ctx, events);

    // Init Mouse Event Listeners
    $document.on('mousemove',onMouseMove);
    elCanvas.on('mousedown',onMouseDown);
    $document.on('mouseup',onMouseUp);

    // Init Touch Event Listeners
    $document.on('touchmove',onMouseMove);
    elCanvas.on('touchstart',onMouseDown);
    $document.on('touchend',onMouseUp);

    // CropHost Destructor
    this.destroy=function() {
      $document.off('mousemove',onMouseMove);
      elCanvas.off('mousedown',onMouseDown);
      $document.off('mouseup',onMouseMove);

      $document.off('touchmove',onMouseMove);
      elCanvas.off('touchstart',onMouseDown);
      $document.off('touchend',onMouseMove);

      elCanvas.remove();
    };
  };

}]);


angular.module('SER.image').factory('cropPubSub', [function() {
  return function() {
    var events = {};
    // Subscribe
    this.on = function(names, handler) {
      names.split(' ').forEach(function(name) {
        if (!events[name]) {
          events[name] = [];
        }
        events[name].push(handler);
      });
      return this;
    };
    // Publish
    this.trigger = function(name, args) {
      angular.forEach(events[name], function(handler) {
        handler.call(null, args);
      });
      return this;
    };
  };
}]);

angular.module('SER.image').directive('imgCrop', ['$timeout', 'cropHost', 'cropPubSub', function($timeout, CropHost, CropPubSub) {
  return {
    restrict: 'E',
    scope: {
      image: '=',
      resultImage: '=',

      changeOnFly: '=',
      areaType: '@',
      areaMinSize: '=',
      resultImageSize: '=',
      resultImageFormat: '@',
      resultImageQuality: '=',

      onChange: '&',
      onLoadBegin: '&',
      onLoadDone: '&',
      onLoadError: '&'
    },
    template: '<canvas></canvas>',
    controller: ['$scope', function($scope) {
      $scope.events = new CropPubSub();
    }],
    link: function(scope, element/*, attrs*/) {
      // Init Events Manager
      var events = scope.events;

      // Init Crop Host
      var cropHost=new CropHost(element.find('canvas'), {}, events);

      // Store Result Image to check if it's changed
      var storedResultImage;

      var updateResultImage=function(scope) {
        var resultImage=cropHost.getResultImageDataURI();
        if(storedResultImage!==resultImage) {
          storedResultImage=resultImage;
          if(angular.isDefined(scope.resultImage)) {
            scope.resultImage=resultImage;
          }
          scope.onChange({$dataURI: scope.resultImage});
        }
      };

      // Wrapper to safely exec functions within $apply on a running $digest cycle
      var fnSafeApply=function(fn) {
        return function(){
          $timeout(function(){
            scope.$apply(function(scope){
              fn(scope);
            });
          });
        };
      };

      // Setup CropHost Event Handlers
      events
        .on('load-start', fnSafeApply(function(scope){
          scope.onLoadBegin({});
        }))
        .on('load-done', fnSafeApply(function(scope){
          scope.onLoadDone({});
        }))
        .on('load-error', fnSafeApply(function(scope){
          scope.onLoadError({});
        }))
        .on('area-move area-resize', fnSafeApply(function(scope){
          if(!!scope.changeOnFly) {
            updateResultImage(scope);
          }
        }))
        .on('area-move-end area-resize-end image-updated', fnSafeApply(function(scope){
          updateResultImage(scope);
        }));

      // Sync CropHost with Directive's options
      scope.$watch('image',function(){
        cropHost.setNewImageSource(scope.image);
      });
      scope.$watch('areaType',function(){
        cropHost.setAreaType(scope.areaType);
        updateResultImage(scope);
      });
      scope.$watch('areaMinSize',function(){
        cropHost.setAreaMinSize(scope.areaMinSize);
        updateResultImage(scope);
      });
      scope.$watch('resultImageSize',function(){
        cropHost.setResultImageSize(scope.resultImageSize);
        updateResultImage(scope);
      });
      scope.$watch('resultImageFormat',function(){
        cropHost.setResultImageFormat(scope.resultImageFormat);
        updateResultImage(scope);
      });
      scope.$watch('resultImageQuality',function(){
        cropHost.setResultImageQuality(scope.resultImageQuality);
        updateResultImage(scope);
      });

      // Update CropHost dimensions when the directive element is resized
      scope.$watch(
        function () {
          return [element[0].clientWidth, element[0].clientHeight];
        },
        function (value) {
          cropHost.setMaxDimensions(value[0],value[1]);
          updateResultImage(scope);
        },
        true
      );

      // Destroy CropHost Instance when the directive is destroying
      scope.$on('$destroy', function(){
          cropHost.destroy();
      });
    }
  };
}]);
angular.module('SER.loader', []).service('afterPromises', [
    function () {

        var afterPromises = function (topCount, callbackFunction) {
            this.callback = callbackFunction;
            this.topCount = topCount;
            this.counter = 0;
        };

        afterPromises.prototype.notify = function () {
            this.counter += 1;
            if (this.counter == this.topCount) {
                this.callback();
            }
        };

        return afterPromises;
    }
]);

angular.module('SER.search').directive('remoteSearch', ['$http', function search($http) {

    return {
        restrict: 'A',
        require: ['ngModel'],
        scope: {
            remoteSearchResults: '=',
            remoteSearch: '=',
            model: '=ngModel'
        },
        link: function (scope, elem, attrs, ngModel) {

            var inputChangedPromise;

            var fetch = function () {

                scope.$apply(function () {
                    scope.remoteSearchResults = [];
                });
                
                if (scope.model) {
                    $http.get(scope.remoteSearch + scope.model).then(function (response) {
                        if (0 < response.data.length) {
                            scope.remoteSearchResults = response.data;
                        }
                    });
                }
            };

            elem.on('keyup', function (evt) {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }
                inputChangedPromise = setTimeout(function () {
                    fetch();
                }, 500);
            });

        }
    };

    
}]);

angular.module('SER.search').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { $event: event });
                });
                event.preventDefault();
                element.blur();
            }
        });
    };
});

//angular.module('SER.search').directive('highlightText', ['$interpolate', '$parse', function search($interpolate, $parse) {
//    return {
//        terminal: true,
//        controller: 'MdHighlightCtrl',
//        compile: function mdHighlightCompile(tElement, tAttr) {
//            var termExpr = $parse(tAttr.mdHighlightText);
//            var unsafeContentExpr = $interpolate(tElement.html());

//            return function mdHighlightLink(scope, element, attr, ctrl) {
//                ctrl.init(termExpr, unsafeContentExpr);
//            };
//        }
//    };
//}]);
//TODO actualizar highlighted
angular.module('SER.selector', []).directive('selector', [
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    '$http',
    '$q',
    '$templateCache',
    function ($rootScope, $filter, $timeout, $window, $http, $q, $templateCache) {

        return {
            restrict: 'EC',
            replace: true,
            transclude: true,
            scope: {
                value: '=model',
                disabled: '=?disable',
                disableSearch: '=?',
                required: '=?require',
                multiple: '=?multi',
                placeholder: '@?',
                valueAttr: '@',
                labelAttr: '@?',
                options: '=?',
                dropdownClass: '@?',
                limit: '=?',
                rtl: '=?',
                api: '=?',
                change: '&?',
                removeButton: '=?',
                softDelete: '=?',
                closeAfterSelection: '=?'
            },
            link: function (scope, element, attrs, controller, transclude) {
            
                var dropdown = angular.element(element[0].querySelector('.selector-dropdown'));
                var selectInput = angular.element(element[0].querySelector('select'));
                var originParents = element.parents();
                var namespace = 'selector-' + Math.round(Math.random() * 1000000);
                dropdown.attr('id', namespace);

                transclude(scope, function (clone, scope) {
                    var filter = $filter('filter'),
                        input = angular.element(element[0].querySelector('.selector-input input')),
                        inputCtrl = input.controller('ngModel'),
                        selectCtrl = element.find('select').controller('ngModel'),
                        defaults = {
                            api: {},
                            search: '',
                            disableSearch: false,
                            selectedValues: [],
                            highlighted: 0,
                            valueAttr: null,
                            labelAttr: 'label',
                            options: [],
                            limit: Infinity,
                            removeButton: true,
                            closeAfterSelection: true
                        };

                    dropdown.detach();

                    // Default attributes
                    if (!angular.isDefined(scope.value) && scope.multiple) scope.value = [];

                    for (var defaultsKey in defaults) {
                        if (!angular.isDefined(scope[defaultsKey])) scope[defaultsKey] = defaults[defaultsKey];
                    }

                    // Options' utilities
                    scope.getObjValue = function (obj, path) {
                        var key;
                        if (!angular.isDefined(obj) || !angular.isDefined(path)) return obj;
                        path = angular.isArray(path) ? path : path.split('.');
                        key = path.shift();

                        if (key.indexOf('[') > 0) {
                            var match = key.match(/(\w+)\[(\d+)\]/);
                            if (match !== null) {
                                obj = obj[match[1]];
                                key = match[2];
                            }
                        }
                        return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
                    };
                    scope.setObjValue = function (obj, path, value) {
                        var key;
                        if (!angular.isDefined(obj)) obj = {};
                        path = angular.isArray(path) ? path : path.split('.');
                        key = path.shift();

                        if (key.indexOf('[') > 0) {
                            var match = key.match(/(\w+)\[(\d+)\]/);
                            if (match !== null) {
                                obj = obj[match[1]];
                                key = match[2];
                            }
                        }
                        obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
                        return obj;
                    };
                    scope.optionValue = function (option) {
                        return scope.valueAttr === null ? option : scope.getObjValue(option, scope.valueAttr);
                    };
                    scope.optionEquals = function (option, value) {
                        return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
                    };

                    // Value utilities
                    scope.setValue = function (value) {
                        if (!scope.multiple) scope.value = scope.valueAttr === null ? value : scope.getObjValue(value || {}, scope.valueAttr);
                        else scope.value = scope.valueAttr === null ? value || [] : (value || []).map(function (option) { return scope.getObjValue(option, scope.valueAttr); });
                    };
                    scope.hasValue = function () {
                        return scope.multiple ? (scope.value || []).length > 0 : !!scope.value;
                    };

                    // Fill with options in the select
                    scope.optionToObject = function (option) {
                        var object = {},
                            element = angular.element(option);

                        angular.forEach(option.dataset, function (value, key) {
                            if (!key.match(/^\$/)) object[key] = value;
                        });
                        if (option.value)
                            scope.setObjValue(object, scope.valueAttr || 'value', option.value);
                        if (element.text())
                            scope.setObjValue(object, scope.labelAttr, element.text().trim());
                        scope.options.push(object);

                        if (element.attr('selected') && (scope.multiple || !scope.hasValue()))
                            if (!scope.multiple) {
                                if (!scope.value) scope.value = scope.optionValue(object);
                            } else {
                                if (!scope.value) scope.value = [];
                                scope.value.push(scope.optionValue(object));
                            }
                    };
                    scope.fillWithHtml = function () {
                        scope.options = [];
                        angular.forEach(clone, function (element) {
                            var tagName = (element.tagName || '').toLowerCase();

                            if (tagName === 'option') scope.optionToObject(element);
                        });
                        scope.updateSelected();
                    };

                    // Initialization
                    scope.initialize = function () {
                        if (!angular.isArray(scope.options) || !scope.options.length)
                            scope.fillWithHtml();
                        if (scope.hasValue()) {
                            if (!scope.multiple) {
                                if (angular.isArray(scope.value)) scope.value = scope.value[0];
                            } else {
                                if (!angular.isArray(scope.value)) scope.value = [scope.value];
                            }
                            scope.updateSelected();
                            scope.filterOptions();
                            scope.updateValue();
                        }
                    };
                    scope.$watch('multiple', function () {
                        $timeout(scope.setInputWidth);
                    });

                    var dropdownPosition = function () {
                        var label = input.parent()[0];

                        var style = {
                            top: '',
                            bottom: '',
                            left: label.getBoundingClientRect().left + 'px',
                            width: label.offsetWidth + 'px'
                        };

                        if (angular.element(document.body).height() - (label.offsetHeight + label.getBoundingClientRect().top) >= 220) {
                            style.top = label.offsetHeight + label.getBoundingClientRect().top;
                            dropdown.removeClass('ontop');
                        } else {
                        
                            style.bottom = angular.element(document.body).height() - label.getBoundingClientRect().top;
                            dropdown.addClass('ontop');
                        }

                        dropdown.css(style);
                    };

                    // Dropdown utilities
                    scope.showDropdown = function () {
                        dropdownPosition();
                        angular.element(document.body).append(dropdown);

                        $timeout(function () {
                            angular.element(window).triggerHandler('resize');
                        }, 50);
                    };

                    scope.open = function () {
                        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;
                        scope.isOpen = true;
                        scope.showDropdown();
                        $timeout(scope.scrollToHighlighted);
                    };

                    scope.close = function () {
                        scope.isOpen = false;
                        dropdown.detach();
                        scope.resetInput()
                    };

                    var highlight = function (index) {
                        if (scope.filteredOptions.length)
                            scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                    };

                    var decrementHighlighted = function () {
                        highlight(scope.highlighted - 1);
                    };
                    
                    var incrementHighlighted = function () {
                        highlight(scope.highlighted + 1);
                    };

                    scope.set = function (option) {
                        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;

                        if (!scope.multiple) scope.selectedValues = [option];
                        else {
                            if (!scope.selectedValues)
                                scope.selectedValues = [];
                            if (scope.selectedValues.indexOf(option) < 0)
                                scope.selectedValues.push(option);
                        }
                        if (!scope.multiple && scope.closeAfterSelection) input.blur();
                        highlight(scope.options.indexOf(option));
                        scope.resetInput();
                        selectCtrl.$setDirty();
                    };

                    scope.unset = function (index) {
                        if (!scope.multiple) scope.selectedValues = [];
                        else scope.selectedValues.splice(angular.isDefined(index) ? index : scope.selectedValues.length - 1, 1);
                        scope.resetInput();
                        selectCtrl.$setDirty();
                    };

                    scope.keydown = function (e) {
                        switch (e.keyCode) {
                            case KEYS.up:
                                if (!scope.isOpen) break;
                                decrementHighlighted();
                                e.preventDefault();
                                break;
                            case KEYS.down:
                                if (!scope.isOpen) scope.open();
                                else incrementHighlighted();
                                e.preventDefault();
                                break;
                            case KEYS.escape:
                                highlight(0);
                                scope.close();
                                break;
                            case KEYS.enter:
                                if (scope.isOpen) {
                                    if (scope.filteredOptions.length)
                                        scope.set();
                                    e.preventDefault();
                                }
                                break;
                            case KEYS.backspace:
                                if (!input.val()) {
                                    var search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                    scope.unset();
                                    scope.open();
                                    if (scope.softDelete && !scope.disableSearch)
                                        $timeout(function () {
                                            scope.search = search;
                                        });
                                    e.preventDefault();
                                }
                                break;
                            case KEYS.left:
                            case KEYS.right:
                            case KEYS.shift:
                            case KEYS.ctrl:
                            case KEYS.alt:
                            case KEYS.tab:
                            case KEYS.leftCmd:
                            case KEYS.rightCmd:
                                break;
                            default:
                                if (!scope.multiple && scope.hasValue()) {
                                    e.preventDefault();
                                } else {
                                    scope.open();
                                    highlight(0);
                                }
                                break;
                        }
                    };

                    // Filtered options
                    scope.inOptions = function (options, value) {
                        return options.indexOf(value) >= 0;
                    };

                    scope.filterOptions = function () {
                        scope.filteredOptions = filter(scope.options || [], scope.search);
                        if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
                        if (scope.multiple)
                            scope.filteredOptions = scope.filteredOptions.filter(function (option) {
                                return !scope.inOptions(scope.selectedValues, option);
                            });
                        else {
                            var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                            if (index >= 0) highlight(index);
                        }
                    };

                    // Input width utilities
                    scope.measureWidth = function () {
                        var width,
                            styles = getStyles(input[0]),
                            shadow = angular.element('<span class="selector-shadow"></span>');
                        shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                        angular.element(document.body).append(shadow);
                        angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                            shadow.css(style, styles[style]);
                        });
                        width = shadow[0].offsetWidth;
                        shadow.remove();
                        return width;
                    };

                    scope.setInputWidth = function () {
                        var width = scope.measureWidth() + 1;
                        input.css('width', width + 'px');
                    };

                    scope.resetInput = function () {
                        input.val('');
                        scope.setInputWidth();
                        $timeout(function () { scope.search = ''; });
                    };

                    scope.$watch('[search, options, value]', function () {
                        // hide selected items
                        scope.filterOptions();
                        $timeout(function () {
                            // set input width
                            scope.setInputWidth();
                            // repositionate dropdown
                            if (scope.isOpen) scope.showDropdown();
                        });
                    }, true);

                    // Update value
                    scope.updateValue = function (origin) {
                        if (!angular.isDefined(origin)) origin = scope.selectedValues || [];
                        scope.setValue(!scope.multiple ? origin[0] : origin);
                    };

                    scope.$watch('selectedValues', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateValue();
                        if (angular.isFunction(scope.change))
                            scope.change(scope.multiple
                                ? { newValue: newValue, oldValue: oldValue }
                                : { newValue: (newValue || [])[0], oldValue: (oldValue || [])[0] });
                    }, true);

                    scope.$watchCollection('options', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateSelected();
                    });

                    // Update selected values
                    scope.updateSelected = function () {
                        if (!scope.multiple) scope.selectedValues = (scope.options || []).filter(function (option) { return scope.optionEquals(option); }).slice(0, 1);
                        else
                            scope.selectedValues = (scope.value || []).map(function (value) {
                                return filter(scope.options, function (option) {
                                    return scope.optionEquals(option, value);
                                })[0];
                            }).filter(function (value) { return angular.isDefined(value); }).slice(0, scope.limit);
                    };

                    scope.$watch('value', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateSelected();
                    }, true);

                    // DOM event listeners
                    input = angular.element(element[0].querySelector('.selector-input input'))
                        .on('focus', function () {
                            $timeout(function () {
                                scope.$apply(scope.open);
                            });
                        })
                        .on('blur', function () {
                            scope.close();
                        })
                        .on('keydown', function (e) {
                            scope.$apply(function () {
                                scope.keydown(e);
                            });
                        })
                        .on('input', function () {
                            scope.setInputWidth();
                        });

                    dropdown
                        .on('mousedown', function (e) {
                            e.preventDefault();
                        });

                    // scrolling may require the tooltip to be moved or even
                    // repositioned in some cases

                    originParents.each(function (i, parent) {
                        angular.element(parent).on('scroll.' + namespace, function (e) {
                            dropdownPosition();
                        });
                    });

                    // Update select controller
                    scope.$watch(function () { return inputCtrl.$pristine; }, function ($pristine) {
                        selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
                    });

                    scope.$watch(function () { return inputCtrl.$touched; }, function ($touched) {
                        selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
                    });

                    // Expose APIs
                    angular.forEach(['open', 'close'], function (api) {
                        scope.api[api] = scope[api];
                    });

                    scope.api.focus = function () {
                        input[0].focus();
                    };

                    scope.api.set = function (value) {
                        return scope.value = value;
                    };
                    
                    scope.api.unset = function (value) {
                        var values = !value ? scope.selectedValues : (scope.selectedValues || []).filter(function (option) { return scope.optionEquals(option, value); }),
                            indexes =
                                scope.selectedValues.map(function (option, index) {
                                    return scope.inOptions(values, option) ? index : -1;
                                }).filter(function (index) { return index >= 0; });

                        angular.forEach(indexes, function (index, i) {
                            scope.unset(index - i);
                        });
                    };

                    scope.isDirty = function () {
                        return selectInput.hasClass('ng-dirty');
                    };

                    scope.isInvalid = function () {
                        return selectInput.hasClass('ng-invalid');
                    };

                    scope.initialize();
                });

                scope.$on('$destroy', function () {
                    dropdown.remove();
                    dropdown.off('mousedown');
                    angular.element(element[0].querySelector('.selector-input input')).off('focus blur keydown input ');
                    angular.element(document.body).off('resize.' + namespace);
                    originParents.each(function (i, el) {
                        $(el).off('scroll.' + namespace  + ' resize.' + namespace);
                    });
                    // clear the array to prevent memory leaks
                    originParents = null;
                });
            },
            template: function (element, attrs) {

                var viewItemTemplate = $templateCache.get(attrs.viewItemTemplate) ? $templateCache.get(attrs.viewItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                var dropdownItemTemplate;

                if (attrs.labelAttr) {
                    dropdownItemTemplate = '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                } else {
                    dropdownItemTemplate = $templateCache.get(attrs.viewItemTemplate) ? $templateCache.get(attrs.viewItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                }

                if (attrs.dropdownItemTemplate) {
                    dropdownItemTemplate = $templateCache.get(attrs.dropdownItemTemplate) ? $templateCache.get(attrs.dropdownItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                }

                var name = '';

                if (attrs.name) {
                    name = 'name="' + attrs.name + '"';
                }

                var template = $templateCache.get('selector/Base') ? $templateCache.get('selector/Base') : '' +
                    '<div class="selector-container" ng-attr-dir="{{rtl ? \'rtl\' : \'ltr\'}}" ng-class="{open: isOpen, empty: !filteredOptions.length && !search, \'ng-dirty\': isDirty(), \'ng-invalid\': isInvalid(),multiple: multiple, \'has-value\': hasValue(), rtl: rtl, \'remove-button\': removeButton, disabled: disabled}">' +
                        '<select ' + name + ' ng-required="required && !hasValue()" class="not-styled" ng-model="selectedValues" multiple style="display: none;"></select>' +
                        '<label class="selector-input">' +
                            '<ul class="selector-values">' +
                                '<li ng-repeat="(index, option) in selectedValues track by index">' +
                                    '<div>' + viewItemTemplate + '</div>' +
                                    '<div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">' +
                                        '<span class="selector-icon"></span>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                            '<input ng-model="search" class="selector-search-input not-styled" placeholder="{{!hasValue() ? placeholder : \'\'}}"' +
                                'ng-disabled="disabled" ng-readonly="disableSearch" ng-required="required && !hasValue()" autocomplete="off">' +
                            '<div ng-if="!multiple" class="selector-helper selector-global-helper" ng-click="!disabled && removeButton && unset()">' +
                                '<span class="selector-icon"></span>' +
                            '</div>' +
                        '</label>' +
                        '<ul md-virtual-repeat-container md-auto-shrink md-top-index="highlighted" class="selector-dropdown ' + attrs.dropdownClass + '">' +
                            '<li md-virtual-repeat="option in filteredOptions" ng-class="{active: highlighted == $index}" class="selector-option" ng-click="set(option)">' + dropdownItemTemplate + '</li>' +
                        '</ul>' +
                    '</div>';

                return template;
            }
        };
    }
]);
angular.module('SER.tooltipster', []);

angular.module('SER.tooltipster').directive('tooltipster', function () {
    return {
        restrict: 'A',
        scope: {
            tooltipsterOptions: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: attrs.tooltipster,
                maxWidth: 300,
                delay: 0,
                contentAsHTML: true,
                positionTracker: true,
                interactive: true,
                trigger: 'hover',
                theme: 'tooltipster-borderless',
                functionReady: function (instance, helper) {
                    $(helper.tooltip).on('click', function () {
                        element.tooltipster('hide');
                    });
                }
            };

            angular.merge(tooltipster_default, scope.tooltipsterOptions);
            element.tooltipster(tooltipster_default);

        }
    };
});

angular.module('SER.tooltipster').directive('tooltipsterMenu', function () {
    return {
        restrict: 'A',
        scope: {
            tooltipsterMenu: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                positionTracker: true,
                interactive: true,
                functionReady: function (instance, helper) {
                    $(helper.tooltip).on('click', function () {
                        element.tooltipster('hide');
                    });
                }
            };

            angular.merge(tooltipster_default, scope.tooltipsterMenu);
            element.tooltipster(tooltipster_default);

        }
    };
});

angular.module('SER.tooltipster').directive('tooltipsterHtml', function () {
    return {
        restrict: 'A',
        scope: {
            tooltipsterHtml: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                trigger: 'hover',
                theme: 'tooltipster-borderless',
                position: 'top',
                positionTracker: true,
                functionReady: function (instance, helper) {
                    $(helper.tooltip).on('click', function () {
                        element.tooltipster('hide');
                    });
                }
            };

            angular.merge(tooltipster_default, scope.tooltipsterHtml);
            element.tooltipster(tooltipster_default);

        }
    };
});
angular.module('SER.match', []).directive('match', ['$parse', function ($parse) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            if(!ctrl || !attrs.match) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var caselessGetter = $parse(attrs.matchCaseless);
            var noMatchGetter = $parse(attrs.notMatch);
            var matchIgnoreEmptyGetter = $parse(attrs.matchIgnoreEmpty);

            scope.$watch(getMatchValue, function(){
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = function(modelValue, viewValue){
              var matcher = modelValue || viewValue;
              var match = getMatchValue();
              var notMatch = noMatchGetter(scope);
              var value;

              if (matchIgnoreEmptyGetter(scope) && !viewValue) {
                return true;
              }

              if(caselessGetter(scope)){
                value = angular.lowercase(matcher) === angular.lowercase(match);
              }else{
                value = matcher === match;
              }
              /*jslint bitwise: true */
              value ^= notMatch;
              /*jslint bitwise: false */
              return !!value;
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}]);

angular.module('SER.barcode', []);

angular.module('SER.barcode').directive('barcode', function () {

    return {
        restrict: 'EA',
        scope: {
            model: '=',
            options: '='
        },
        link: function (scope, element, attrs) {
            
            var default_options = {
                format: "CODE128",
                lineColor: "#000000",
                width: 3,
                height: 110,
                displayValue: true
            };

            angular.merge(default_options, scope.options);

            scope.$watch('model', function (new_value) {
                JsBarcode(element[0], new_value, default_options);
            });

        }
    };

});
angular.module('SER.diff', []);

angular.module('SER.diff').factory('ObjectDiff', [
    '$sce',
    function objectDiff($sce) {

        var openChar = '{',
            closeChar = '}',
            service = {
                diff: diff,
                getPatchChanges: getPatchChanges
            };

        return service;


        /* service methods */

        /**
         * diff between object a and b
         * @param {Object} a
         * @param {Object} b
         * @param shallow
         * @param isOwn
         * @return {Object}
         */
        function diff(a, b, shallow, isOwn) {

            if (a === b) {
                return equalObj(a);
            }

            var diffValue = {};
            var equal = true;

            for (var key in a) {
                if ((!isOwn && key in b) || (isOwn && typeof b != 'undefined' && b.hasOwnProperty(key))) {
                    if (a[key] === b[key]) {
                        diffValue[key] = equalObj(a[key]);
                    } else {
                        if (!shallow && isValidAttr(a[key], b[key])) {
                            var valueDiff = diff(a[key], b[key], shallow, isOwn);
                            if (valueDiff.changed == 'equal') {
                                diffValue[key] = equalObj(a[key]);
                            } else {
                                equal = false;
                                diffValue[key] = valueDiff;
                            }
                        } else {
                            equal = false;
                            diffValue[key] = {
                                changed: 'primitive change',
                                removed: a[key],
                                added: b[key]
                            }
                        }
                    }
                } else {
                    equal = false;
                    diffValue[key] = {
                        changed: 'removed',
                        value: a[key]
                    }
                }
            }

            for (key in b) {
                if ((!isOwn && !(key in a)) || (isOwn && typeof a != 'undefined' && !a.hasOwnProperty(key))) {
                    equal = false;
                    diffValue[key] = {
                        changed: 'added',
                        value: b[key]
                    }
                }
            }

            if (equal) {
                return equalObj(a);
            } else {
                return {
                    changed: 'object change',
                    value: diffValue
                }
            }
        }


        /**
         * diff between object a and b own properties only
         * @param {Object} a
         * @param {Object} b
         * @return {Object}
         * @param deep
         */
        function getPatchChanges(init_obj, mod_obj, shallow, isOwn) {
            var _mod_obj = angular.fromJson(angular.toJson(mod_obj));
            var _diff = diff(angular.fromJson(angular.toJson(init_obj)), _mod_obj, shallow, isOwn);
            var result = [];

            if (_diff.changed !== 'equal') {
                angular.forEach(_diff.value, function (value, key) {
                    if (value.changed !== 'equal') {
                        result.push({
                            "op": "replace",
                            "path": "/" + key,
                            "value": _mod_obj[key]
                        });
                    }
                });
            }

            return result;

        }

        /**
         * @param obj
         * @returns {{changed: string, value: *}}
         */
        function equalObj(obj) {
            return {
                changed: 'equal',
                value: obj
            }
        }

        /**
         * @param a
         * @param b
         * @returns {*|boolean}
         */
        function isValidAttr(a, b) {
            var typeA = typeof a;
            var typeB = typeof b;
            return (a && b && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function'));
        }

        /**
         * @param {string} key
         * @return {string}
         */
        function stringifyObjectKey(key) {
            return /^[a-z0-9_$]*$/i.test(key) ?
                key :
                JSON.stringify(key);
        }

        /**
         * @param {string} string
         * @return {string}
         */
        function escapeHTML(string) {
            return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        /**
         * @param {Object} obj
         * @return {string}
         * @param shallow
         */
        function inspect(obj, shallow) {

            return _inspect('', obj, shallow);

            /**
             * @param {string} accumulator
             * @param {object} obj
             * @see http://jsperf.com/continuation-passing-style/3
             * @return {string}
             * @param shallow
             */
            function _inspect(accumulator, obj, shallow) {
                switch (typeof obj) {
                    case 'object':
                        if (!obj) {
                            accumulator += 'null';
                            break;
                        }
                        if (shallow) {
                            accumulator += '[object]';
                            break;
                        }
                        var keys = Object.keys(obj);
                        var length = keys.length;
                        if (length === 0) {
                            accumulator += '<span>' + openChar + closeChar + '</span>';
                        } else {
                            accumulator += '<span>' + openChar + '</span>\n<div class="diff-level">';
                            for (var i = 0; i < length; i++) {
                                var key = keys[i];
                                accumulator = _inspect(accumulator + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>', obj[key]);
                                if (i < length - 1) {
                                    accumulator += '<span>,</span>\n';
                                }
                            }
                            accumulator += '\n</div><span>' + closeChar + '</span>'
                        }
                        break;

                    case 'string':
                        accumulator += JSON.stringify(escapeHTML(obj));
                        break;

                    case 'undefined':
                        accumulator += 'undefined';
                        break;

                    default:
                        accumulator += escapeHTML(String(obj));
                        break;
                }
                return accumulator;
            }
        }
    }

]);
angular.module('SER.map', []);

angular.module('SER.map').service('mapFunctions', [
    function () {

        return {
            getCurrentPosition: function () {

                var defered = $q.defer();
                var promise = defered.promise;

                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function (position) {
                        defered.resolve({
                            Latitude: position.coords.latitude,
                            Longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    }, function () {
                        defered.reject();
                    });
                } else {
                    defered.reject();
                }

                return promise;
            },
            checkLatLog: function (Latitude, Longitude) {
                return (-90 <= Latitude) && (90 >= Latitude) && (-180 <= Longitude) && (180 >= Longitude);
            },
            middlePoint: function (options) {

                var optionsSrc = {
                    From: {
                        Lat: 0,
                        longitude: 0
                    },
                    To: {
                        Lat: 0,
                        longitude: 0
                    }
                };
        
                angular.merge(optionsSrc, options);
        
                if ((optionsSrc.From.longitude != optionsSrc.To.Longitude) || (optionsSrc.From.Latitude != optionsSrc.To.Latitude)) {
        
                    var lat1 = optionsSrc.From.Latitude * Math.PI / 180;
                    var lat2 = optionsSrc.To.Latitude * Math.PI / 180;
                    var lon1 = optionsSrc.From.Longitude * Math.PI / 180;
                    var lon2 = optionsSrc.To.Longitude * Math.PI / 180;
                    var dLon = lon2 - lon1;
                    var x = Math.cos(lat2) * Math.cos(dLon);
                    var y = Math.cos(lat2) * Math.sin(dLon);
                    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + x) * (Math.cos(lat1) + x) + y * y));
                    var lon3 = lon1 + Math.atan2(y, Math.cos(lat1) + x);
                    lat3 *= 180 / Math.PI;
                    lon3 *= 180 / Math.PI;
                    var deltaY = optionsSrc.To.Longitude - optionsSrc.From.Longitude;
                    var deltaX = optionsSrc.To.Latitude - optionsSrc.From.Latitude;
                    var angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                    return {
                        longitude: lon3,
                        Latitude: lat3,
                        angle: angleInDegrees,
                        distance: this.distancePoints(optionsSrc.From.Longitude, optionsSrc.From.Latitude, optionsSrc.To.Longitude, optionsSrc.To.Latitude)
                    }
                } else {
                    return false;
                }
        
            },
            distancePoints: function (lon1, lat1, lon2, lat2) {
                // Distancia en Kilometros
        
                var R = 6371;
                //var dLat = ((lat2-lat1) * Math.PI/180);
                //var dLon = ((lon2-lon1) * Math.PI/180);
                var a = Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) * Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2);
                var c = 2 * Math.asin(Math.sqrt(a));
                var d = R * c;
                return (d * 1.60934);
            },
            cutPrecision: function (obj, e) {
                if ('number' === typeof obj[0]) {
                    for (var i = 0; i < obj.length; i++) obj[i] = Math.round(obj[i] * e) / e;
                } else {
                    var arr = obj.features || obj.geometries || obj.coordinates || obj;
                    for (var i = 0; i < arr.length; i++) this.cutPrecision(arr[i], e);
                }
            },
            processPoints: function (geometry, callback, thisArg) {
                if (geometry instanceof google.maps.LatLng) {
                    callback.call(thisArg, geometry);
                } else if (geometry instanceof google.maps.Data.Point) {
                    callback.call(thisArg, geometry.get());
                } else {
                    geometry.getArray().forEach(function(g) {
                        this.processPoints(g, callback, thisArg);
                    });
                }
            },
            generateGeoJSONCircle: function (center, radius, numSides) {

                var points = [], degreeStep = 360 / numSides;
            
                for(var i = 0; i < numSides; i++){
                   var gpos = google.maps.geometry.spherical.computeOffset(center, radius, degreeStep * i);
                   points.push([gpos.lng(), gpos.lat()]);
                }
            
                points.push(points[0]);
            
                return {
                   type: 'Polygon',
                   coordinates: [ points ]
                };
            
            },
            getLatLngLiteralArray: function (array) {
                var latLngArray = [];
                for(var index = 0; index < array.length; index++){
                    latLngArray.push({lat: array[index][1], lng: array[index][0]});
                }
                return latLngArray;
             }
        }

    }
]);
angular.module('SER.sentry', []);

angular.module('SER.sentry').factory('$exceptionHandler', ['$window', '$log', function ($window, $log) {

    if ($window.Raven && RAVEN_CONFIG_DSN) {
        console.log('Using the RavenJS exception handler.');
        Raven.config(RAVEN_CONFIG_DSN).install();
        return function (exception, cause) {
            Raven.captureException(exception);
            if (RAVEN_SHOW_DIALOG) Raven.showReportDialog();
        };
    } else {
        console.log('Using the default logging exception handler.');
        return function (exception, cause) {
            $log.error.apply($log, arguments);
        };
    }

}]);
angular.module('SER', [
    'SER.i18n',
    'SER.auth',
    'SER.selector',
    'SER.match',
    'SER.image',
    'SER.search',
    'SER.tooltipster',
    'SER.datepicker',
    'SER.chip',
    'SER.loader',
    'SER.filters',
    'SER.barcode',
    'SER.diff',
    'SER.fullscreen',
    'SER.Clipboard',
    'SER.sentry'
]);

(function (url) {
    // Create a new `Image` instance
    var SerImagePowered = new Image();

    SerImagePowered.onload = function () {
        // Inside here we already have the dimensions of the loaded image
        var style = [
            // Hacky way of forcing image's viewport using `font-size` and `line-height`
            'font-size: 1px;',
            'line-height: ' + this.height + 'px;',

            // Hacky way of forcing a middle/center anchor point for the image
            'padding: ' + this.height * .5 + 'px ' + this.width * .5 + 'px;',

            // Set image dimensions
            'background-size: ' + this.width + 'px ' + this.height + 'px;',

            // Set image URL
            'background: url(' + url + ');'
        ].join(' ');
        
        console.log('');
        console.log('');
        console.log('%c', style);
        console.log('https://www.sersoluciones.com');
        console.log('');
        console.log('');
    };

    // Actually loads the image
    SerImagePowered.src = url;

})('https://s3.amazonaws.com/ser-ui/images/powered.jpg');


//Routes & Http
angular.module('SER').config([
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$compileProvider',
    '$resourceProvider',
    '$httpProvider',
    function ($urlRouterProvider, $urlMatcherFactoryProvider, $compileProvider, $resourceProvider, $httpProvider) {

        $httpProvider.defaults.paramSerialize = '$httpParamSerializerJQLike';
        $resourceProvider.defaults.stripTrailingSlashes = true;
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|tel|chrome-extension):/);

        $urlRouterProvider.rule(function ($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = '/' === path[path.length - 1];

            if (hasTrailingSlash) {
                //if last charcter is a slash, return the same url without the slash
                return path.substr(0, path.length - 1);
            }

        });

        var GUID_REGEXP = /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i;
        $urlMatcherFactoryProvider.type('guid', {
            encode: angular.identity,
            decode: angular.identity,
            is: function (item) {
                return GUID_REGEXP.test(item);
            }
        });

    }
]);

angular.module('SER').run(['$rootScope', '$sce', function ($rootScope, $sce) {

    $rootScope.backHistory = function () {
        $window.history.back();
    };

    $rootScope.__ = __;

    $rootScope.bodyHeight = function () {
        return angular.element('body').height();
    };

    $rootScope.browserWidth = browserWidth;

    $rootScope.trustAsHtml = function (string) {
        return $sce.trustAsHtml(string);
    };

}]);