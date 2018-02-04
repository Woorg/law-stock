import svg4everybody from 'svg4everybody';
import $ from 'jquery';
import 'jquery-mousewheel';
import mCustomScrollbar from 'malihu-custom-scrollbar-plugin';
import slick from 'slick-carousel';
// import 'magnific-popup';
// import mask from "jquery-mask-plugin";

(function ($) {
	svg4everybody();

	var styles = [
		'padding: 0 9px',
		'background: #fff',
		'color: #000',
		'display: inline-block',
		'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2)',
		'box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.2) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
		'line-height: 1.4',
		'text-align: left',
		'font-size: 12px',
		'font-weight: 400'
	].join(';');

	console.log('%c заказать html верстку', styles);
	console.log('%c gorlov35@gmail.com', styles);

	document.addEventListener("DOMContentLoaded", function(){
		initializeSidebar();

		initializeSimpleValidation();
		setPreviousModalClose(".close-login", "#loginModal", "#registerModal");
		setPreviousModalClose(".close-register", "#registerModal", "#loginModal");
	});

	function setAuthFormSubmit(formId, requestUrl, redirectUrl, formErrorsClass) {
		$( formId ).on( "submit", function( event ) {
		  event.preventDefault();
		  var formData = getFormData($(this));

		  $.ajax({
			  beforeSend: function (xhr) {
				  setCSRFToken(xhr, formData.csrf_token)
			  },
			  type: 'POST',
			  url: requestUrl,
			  contentType: 'application/json',
			  dataType: 'json',
			  data: JSON.stringify(formData)
		  })
			  .done(function () {
				window.location.replace(redirectUrl);
			  })
			  .fail(function (xhr) {
				processErrorResponse(xhr, formErrorsClass);
			  });
		});

		function getFormData(form){
			var unindexed_array = form.serializeArray();
			var indexed_array = {};

			$.map(unindexed_array, function(n){
				indexed_array[n['name']] = n['value'];
			});

			return indexed_array;
		}

		function setCSRFToken(request, token){
			request.setRequestHeader('X-CSRFToken', token)
		}

		function processErrorResponse(response, formErrorsClass) {
			var responseErrors = response['responseJSON']
				['response']['errors'];

			if (!responseErrors) {
				return
			}

			var errorsFields = Array.prototype.slice.call(
				document.getElementsByClassName(formErrorsClass));

			errorsFields.forEach(function (value, index) {
				var fieldClasses = errorsFields[index].classList;

				for(var i = 0; i < fieldClasses.length; i++) {
					if (fieldClasses[i] === formErrorsClass) {
						continue
					}
					if (responseErrors.hasOwnProperty(fieldClasses[i])) {
						value.innerHTML = responseErrors[fieldClasses[i]][0];
						value.style.display = 'block';
						continue
					}
					value.style.display = 'none';
				}
			})

		}

	}

	function initializeSidebar() {
		var overlay = document.querySelector('.overlay');
		var fixedNavbar = document.querySelector('section.navbar-fixed-top');
		var sidebarBox = document.querySelector('#sidebar-container');
		var sidebarBtn = document.querySelector('#menuToggle');

		sidebarBtn.addEventListener('click', function (event) {
			if (overlay.classList.contains('enable-overlay')) {
				removeSidebarState();
				toggleSidebar();
				return
			}

			toggleSidebar();

			document.body.classList.add('disable-scrolling');
			fixedNavbar.classList.remove('navbar-fixed-shadow');
			overlay.classList.add('enable-overlay');
		});

		overlay.addEventListener('click', function (event) {
			if (sidebarBox.classList.contains('open')) {
				sidebarBtn.classList.remove('open');
				sidebarBox.classList.remove('open');
				removeSidebarState();
			}
		});

		function toggleSidebar() {
			sidebarBtn.classList.toggle('open');
			sidebarBox.classList.toggle('open');
		}

		function removeSidebarState() {
			overlay.classList.remove('enable-overlay');
			fixedNavbar.classList.add('navbar-fixed-shadow');
			document.body.classList.remove('disable-scrolling');
		}
	}

	function setPreviousModalClose(closeBtn, modalToClose, modalToOpen) {
		$(closeBtn).click(function() {
			$(modalToClose).one('hidden.bs.modal', function() {
				$(modalToOpen).modal('show');
			}).modal('hide');
		});
	}


	function initializeSimpleValidation() {
		var VALIDATION_MESSAGE = "Пароли не совпадают";

		var password = document.getElementById("register-pswd");
		var password_confirmation = document.getElementById("confirm-pswd");

		if (!(password) || !(password_confirmation)) {
			return
		}

		function validatePassword(){
			if(password.value !== password_confirmation.value) {
				password_confirmation.setCustomValidity(
					VALIDATION_MESSAGE);
			} else {
				password_confirmation.setCustomValidity('');
			}
		}

		password.onchange = validatePassword;
		password_confirmation.onkeyup = validatePassword;
	}



	$(function() {

		const $cardsFav = $('.fav');
		$cardsFav.on('click', function () {
			$(this).toggleClass('fav_active');
		});

		const $filterTitle = $('.filter__item-title');
		$filterTitle.on('click', function () {
			$(this).toggleClass('filter__item-title_active');
			$(this).next().toggleClass('filter__list_active');
		});



		const $comments = $('.comments__w');

		$comments.mCustomScrollbar({
			theme: "dark",
			documentTouchScroll: true,
			mouseWheelPixels: 200
		});

		const $notificationsList = $('.notifications__list');

		$notificationsList.slick({
			arrows: false,
			dots: true
			// fade: true
		});

		function pageWidget(pages) {
			var widgetWrap = $('<div class="widget_wrap"><ul class="widget_list"></ul></div>');
			widgetWrap.prependTo("body");
			for (var i = 0; i < pages.length; i++) {
				$('<li class="widget_item"><a class="widget_link" href="' + pages[i] + '.html' + '">' + pages[i] + '</a></li>').appendTo('.widget_list');
			}
			var widgetStilization = $('<style>body {position:relative} .widget_wrap{position:absolute;top:0;left:0;z-index:9999;padding:10px 20px;background:#222;border-bottom-right-radius:10px;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-transform:translate(-100%,0);-ms-transform:translate(-100%,0);transform:translate(-100%,0)}.widget_wrap:after{content:" ";position:absolute;top:0;left:100%;width:24px;height:24px;background:#222 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAABGdBTUEAALGPC/xhBQAAAAxQTFRF////////AAAA////BQBkwgAAAAN0Uk5TxMMAjAd+zwAAACNJREFUCNdjqP///y/DfyBg+LVq1Xoo8W8/CkFYAmwA0Kg/AFcANT5fe7l4AAAAAElFTkSuQmCC) no-repeat 50% 50%;cursor:pointer}.widget_wrap:hover{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.widget_item{padding:0 0 10px}.widget_link{color:#fff;text-decoration:none;font-size:15px;}.widget_link:hover{text-decoration:underline} </style>');
			widgetStilization.prependTo(".widget_wrap");
		}

		pageWidget(['index', 'index-empty', 'case', 'single', 'messages' ]);

	});

})(jQuery);
