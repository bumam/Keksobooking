'use strict';

(function () {

  var bookingFormFieldsets = window.utils.bookingForm.querySelectorAll('fieldset');
  var addressInput = window.utils.bookingForm.querySelector('#address');
  var parentDiv = window.utils.before.parentNode;

  function deactivatePage() {

    window.utils.map.classList.add('map--faded');
    window.utils.bookingForm.classList.add('ad-form--disabled');

    for (var fieldset of bookingFormFieldsets) {
      fieldset.setAttribute('disabled', 'disabled');
    }

    var coords = window.pin.getMainPinCenterCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    mainPinClick();
    window.utils.mainPin.addEventListener('keydown', mainPinEnterPress);

  }

  function activatePage() {
    window.utils.map.classList.remove('map--faded');
    window.utils.bookingForm.classList.remove('ad-form--disabled');

    for (var fieldset of bookingFormFieldsets) {
      fieldset.removeAttribute('disabled');
    }

    var coords = window.pin.getMainPinArrowCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    window.form.setPriceRestrictions();
    window.form.validateGuestsLimit();

    var hotels = window.data.generateHotels(7);
    window.utils.mapPins.appendChild(window.pin.createPins(hotels));
    parentDiv.insertBefore(window.card.createCards(hotels), window.utils.before);
    window.card.hideCards();

    window.utils.typeSelect.addEventListener('change', window.form.setPriceRestrictions);
    window.utils.roomNumberSelect.addEventListener('change', window.form.validateGuestsLimit);

    window.utils.mapPins.addEventListener('click', window.card.showCard);

    window.utils.mainPin.removeEventListener('mousedown', mainPinClick);
    window.utils.mainPin.removeEventListener('keydown', mainPinEnterPress);

    window.syncTimes.syncCheckinTimes();
  }

  function mainPinClick() {
    window.utils.mainPin.addEventListener('mousedown', function (event) {
      if (event.which === 1) {
        event.preventDefault();

        var startCoords = {
          x: event.clientX,
          y: event.clientY
        };

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();
          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: startCoords.y - moveEvt.clientY
          };

          startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          window.utils.mainPin.style.top = (window.utils.mainPin.offsetTop - shift.y) + 'px';
          window.utils.mainPin.style.left = (window.utils.mainPin.offsetLeft - shift.x) + 'px';

        };
        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();

          if (window.utils.map.className === "map map--faded") {
            activatePage();
          }


          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    });
  }

  function mainPinEnterPress(event) {
    if (event.key === 'Enter') {
      activatePage();
    }
  }
  deactivatePage();
})();

