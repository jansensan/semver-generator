// consts
const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const empty = '';
const dot = '.';
const ten = 10;

// dom elements
let form = null;


// auto initialization
init();


function init() {
  // get dom elements
  form = document.getElementById('semVerForm');

  currentVersionField = document.getElementById('currentVersion');
  patchCB = document.getElementById('patchCB');
  minorCB = document.getElementById('minorCB');
  majorCB = document.getElementById('majorCB');

  resetButton = document.getElementById('resetButton');

  // add event listeners
  form.addEventListener('submit', onFormSubmit);
  resetButton.addEventListener('click', onReset);
}


// events
function onFormSubmit(event) {
  event.preventDefault();
  event.stopPropagation();

  clearOutput();
  soilForm();

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  showOutput(buildVersion());
}

function onReset() {
  resetForm();
}


// methods
function validateForm() {
  const isCurrentVersionValid = validateCurrentVersion();
  form.dataset.validVersion = isCurrentVersionValid;

  const areCheckboxesValid = validateCheckboxes();
  form.dataset.validCheckboxes = areCheckboxesValid;

  return isCurrentVersionValid && areCheckboxesValid;
}

function soilForm() {
  form.dataset.dirty = true;
}

function validateCurrentVersion() {
  let errorMessage = empty;

  const value = currentVersionField.value;

  if (value === empty) {
    errorMessage = 'Current version is required.'
  }

  if (!semverRegex.test(value) && errorMessage === empty) {
    errorMessage = 'Format entered is invalid. Ensure to enter a value formatted MAJOR.MINOR.PATCH, e.g. 1.2.3.';
  }

  currentVersionField.setCustomValidity(errorMessage);

  return errorMessage === empty;
}

function validateCheckboxes() {
  if (!majorCB.checked && !minorCB.checked && !patchCB.checked) {
    return false;
  }

  return true;
}

function buildVersion() {
  const currentValue = currentVersionField.value;
  const valueArray = currentValue.split(dot);
  const currentMajor = parseInt(valueArray[0], ten);
  const currentMinor = parseInt(valueArray[1], ten);
  const currentPatch = parseInt(valueArray[2], ten);

  if (currentMajor === 0) {
    if (majorCB.checked || minorCB.checked) {
      return [0, currentMinor + 1, 0].join(dot);
    }
  }

  if (majorCB.checked) {
    return [currentMajor + 1, 0, 0].join(dot);
  }

  if (minorCB.checked) {
    return [currentMajor, currentMinor + 1, 0].join(dot);
  }

  if (patchCB.checked) {
    return [currentMajor, currentMinor, currentPatch + 1].join(dot);
  }
}

function resetForm() {
  form.dataset.dirty = false;
  form.dataset.validVersion = false;
  form.dataset.validCheckboxes = false;

  currentVersionField.value = '';
  patchCB.checked = false;
  minorCB.checked = false;
  majorCB.checked = false;

  clearOutput();
}

function showOutput(value) {
  var versionPar = document.createElement('p');
  versionPar.classList = 'version';
  versionPar.innerText = value;
  output.appendChild(versionPar);
}

function clearOutput() {
  output.innerHTML = '';
}
