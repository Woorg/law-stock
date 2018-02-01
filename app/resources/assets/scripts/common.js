'use strict';

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
