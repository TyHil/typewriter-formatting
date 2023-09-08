/* Tab Icon */

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.querySelector('link[rel="icon"]').href = 'typewriter-formatting/tabicon-light.png';
}




/* Constants */

const main = document.getElementsByTagName('main')[0];
const inputs = document.getElementsByClassName('input');
const charsOnLine = document.getElementById('charsOnLine');
const linesOnPage = document.getElementById('linesOnPage');
const marginChars = document.getElementById('marginChars');
const marginLines = document.getElementById('marginLines');
const columns = document.getElementById('columns');
const columnGap = document.getElementById('columnGap');
const wordBreak = document.getElementById('wordBreak');
const charsToHyphen = document.getElementById('charsToHyphen');
const addHyphen = document.getElementById('addHyphen');
const resetInputEssay = document.getElementById('resetInputEssay');
const resetInputASCII = document.getElementById('resetInputASCII');
const addLayer = document.getElementById('addLayer');
const deleteLayer = document.getElementById('deleteLayer');
const prevLayer = document.getElementById('prevLayer');
const nextLayer = document.getElementById('nextLayer');
const resetOptionsEssay = document.getElementById('resetOptionsEssay');
const resetOptionsASCII = document.getElementById('resetOptionsASCII');
const file = document.getElementById('file');
const transparency = document.getElementById('transparency');
const center = document.getElementById('center');
const lineSpacing = document.getElementById('lineSpacing');
const showSpaces = document.getElementById('showSpaces');
const renderChar = document.getElementById('renderChar');
const names = [
  'charsOnLine',
  'linesOnPage',
  'marginChars',
  'marginLines',
  'columns',
  'columnGap',
  'wordBreak',
  'charsToHyphen',
  'addHyphen',
  'file',
  'transparency',
  'center',
  'lineSpacing',
  'showSpaces',
  'renderChar',
];
let charsOnLineWithMargin;
let linesOnPageWithMargin;

//Input values
function inputName(i) {
  if (i === 0) {
    return 'input';
  }
  return 'input' + i.toString();
}
let i = 0;
let value = localStorage.getItem(inputName(0));
while (value !== null && typeof value !== 'undefined') {
  if (inputs.length <= i) {
    const newInput = document.createElement('textarea');
    newInput.classList.add('input');
    newInput.style.display = 'none';
    inputs[0].parentElement.append(newInput);
  }
  inputs[i].value = value;
  i++;
  value = localStorage.getItem(inputName(i));
}

for (const element of names) {
  const old = localStorage.getItem(element);
  if (old !== null && typeof old !== undefined) {
    const domElement = document.getElementById(element);
    if (domElement.type === 'checkbox') {
      domElement.checked = old === 'true';
    } else {
      domElement.value = old;
    }
  }
}
paddingCalc();
columnsDisabled();
wordBreakDisabled();
transparencyUpdate();

/* Listeners */

function addInputListeners(input, i) {
  input.addEventListener('change', function() {
    localStorage.setItem(inputName(i), this.value);
    if (!renderChar.checked) {
      generate();
    }
  });
  input.addEventListener('input', function() {
    if (renderChar.checked) {
      generate();
    }
  });
}

for (let i = 0; i < inputs.length; i++) {
  addInputListeners(inputs[i], i);
}

function resetInput() {
  localStorage.setItem('input', inputs[0].value);
  inputs[0].style.display = 'block';
  let i = inputs.length - 1;
  while (inputs.length > 1) {
    localStorage.removeItem(inputName(i));
    inputs[i].remove();
    i = inputs.length - 1;
  }
  layerButtons();
  generate();
}

resetInputEssay.addEventListener('click', function() {
  inputs[0].value =
    '     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pulvinar ante lectus, in efficitur turpis cursus eget. Nullam ac sem semper, pharetra erat at, elementum arcu. Maecenas neque nisl, cursus eget leo ut, ullamcorper viverra quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel consectetur felis. Nullam dictum pellentesque arcu, non porta massa. Maecenas congue feugiat ipsum, non hendrerit odio rhoncus vitae. Nulla ut imperdiet eros. Donec arcu sapien, egestas nec scelerisque ut, iaculis eget dui. Mauris iaculis lacus nec libero imperdiet, non scelerisque purus sollicitudin. Vivamus non velit eu lectus lobortis ornare at in est. Curabitur quis elit eleifend, ultricies dolor semper, dapibus massa. Aliquam congue semper sem, vitae porta arcu consectetur euismod. Pellentesque varius odio vitae leo vulputate sodales.\n     Praesent lobortis, massa nec tristique venenatis, felis magna fermentum nunc, eget accumsan dui turpis vel odio. Pellentesque tincidunt, magna id finibus suscipit, turpis nibh accumsan eros, lacinia efficitur nunc augue et mi. Ut blandit sed elit sit amet mollis. Donec vel fringilla orci, sit amet feugiat sapien. Maecenas egestas posuere fermentum. Quisque tempor eu tortor et fermentum. Maecenas molestie metus interdum leo dictum aliquam. Nulla feugiat a quam vitae rhoncus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer sapien diam, pharetra vitae aliquet at, pretium et odio. Nam imperdiet ipsum diam, sit amet dapibus sem condimentum ac.\n     Nulla tincidunt metus at leo pretium, maximus rhoncus neque finibus. Praesent tellus augue, rhoncus et vestibulum in, vulputate ut est. In tristique nibh sed libero pulvinar imperdiet. Cras varius nunc vel scelerisque ullamcorper. Aenean pulvinar varius molestie. Morbi vehicula fringilla elit, egestas elementum quam commodo rhoncus. Cras rhoncus fringilla augue, ut malesuada turpis semper sed. Sed venenatis malesuada commodo. Praesent mattis sem vitae nibh semper, vitae fringilla quam dictum. Praesent ultricies, urna quis pharetra congue, ipsum erat auctor erat, in tempor risus neque in massa. Aliquam tellus metus, blandit vitae fringilla ac, venenatis at lacus.\n     Aliquam erat volutpat. Sed arcu nisi, lobortis sed est cursus, malesuada convallis odio. Praesent faucibus enim et leo accumsan, et facilisis eros eleifend. Donec sit amet dui nec libero pharetra condimentum eget vitae nunc. Cras quis augue eu arcu molestie fringilla in in risus. Pellentesque ullamcorper, ante et sollicitudin pulvinar, ante augue scelerisque lectus, et rutrum dui quam a nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam sodales velit vel magna semper lobortis. In ut eros viverra, finibus eros vel, ornare leo. Morbi pretium facilisis facilisis. Aenean posuere lorem eget libero hendrerit interdum. Nunc tristique ex quis augue rhoncus hendrerit. Vivamus ornare dui vel turpis elementum efficitur. Nam sit amet porta enim.\n     Nunc nec luctus magna, interdum scelerisque urna. Pellentesque ullamcorper nulla augue, a consequat dolor rutrum sed. Aenean ultrices lectus quis lobortis laoreet. Sed a ex a dui facilisis vestibulum in nec orci. Donec id elit eu augue vehicula aliquet ut non mi. Etiam volutpat turpis quis sollicitudin volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc sodales mauris vel arcu sollicitudin efficitur. Nunc id vestibulum nisl. Maecenas nec turpis lacinia, porttitor leo euismod, congue dui. Vestibulum mollis quam in nisl gravida eleifend. Curabitur pretium porttitor vulputate. Vivamus laoreet volutpat nisi nec semper. Nam a pretium nunc.\n     Curabitur lacus sem, imperdiet nec ornare ut, iaculis nec magna. Nullam sodales orci sem, ac dignissim mauris dapibus a. Phasellus tempus vulputate nibh, sollicitudin facilisis est sagittis non. Etiam lacinia porttitor diam ac porta. Vestibulum id congue libero. Donec in feugiat massa. In a aliquet sapien. Etiam in elementum lectus.\n     Sed a fermentum dolor. Donec id augue in magna lobortis iaculis a malesuada orci. Phasellus finibus congue aliquet. Sed vitae velit gravida, consequat sapien non, faucibus neque. Morbi iaculis vehicula consectetur. Nunc eu ornare lorem, eu porta leo. Aenean volutpat metus massa, in tincidunt lorem tempus nec. Phasellus fringilla velit in justo cursus, nec suscipit libero imperdiet. Curabitur malesuada placerat sodales. Vestibulum vitae ipsum id neque consectetur pulvinar. Integer nec condimentum ipsum. Mauris et condimentum justo. Etiam eget mi nec tellus vestibulum pulvinar.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at placerat lectus, vitae sagittis lorem. Sed placerat ac purus mattis interdum. Aenean blandit tempor lacinia. Sed posuere quam eget viverra commodo. Vestibulum luctus felis ut quam elementum mollis. Fusce hendrerit ornare neque, et efficitur odio condimentum eu. Nullam nec mauris commodo, venenatis velit in, facilisis nulla. Aenean vitae magna sit amet lacus iaculis molestie. Phasellus blandit est eget volutpat lobortis.\n     Suspendisse consequat suscipit purus, quis vestibulum diam finibus eget. Nullam eros dolor, semper non dapibus et, imperdiet non urna. Integer quis arcu non velit pellentesque condimentum at at arcu. Etiam dictum cursus justo, et placerat purus sagittis quis. Etiam blandit, lectus non fringilla egestas, neque nunc placerat dui, ac rutrum metus lectus ac dolor. Aenean porta egestas ultricies. Nulla pellentesque ultricies urna vel pulvinar. Morbi dignissim malesuada lacinia.\n     In sed suscipit mi. Vivamus elit nulla, aliquam nec nunc quis, rutrum posuere nisl. Praesent aliquam elit sed mauris placerat, quis ornare nunc facilisis. Suspendisse fringilla sapien in nisl molestie venenatis. Maecenas auctor magna non malesuada vulputate. Nam lobortis dictum mauris quis iaculis. Etiam pharetra hendrerit sem, at sagittis nunc vehicula vitae. Maecenas sodales tortor velit, aliquet fermentum dui sagittis quis. Curabitur cursus a ligula blandit molestie. Proin vitae massa ac turpis porttitor porta sed vel sapien. Maecenas tincidunt faucibus orci mollis volutpat. Fusce ac ligula a enim suscipit tempor. Donec eu magna placerat, varius mi sit amet, tristique neque. Nunc elit nisi, pharetra ut ex id, tincidunt accumsan mi. Duis dictum, lectus id dignissim dictum, lorem enim posuere eros, sit amet aliquam felis ante ac neque. Integer vehicula a leo egestas pretium.';
  resetInput();
});

resetInputASCII.addEventListener('click', function() {
  document.getElementById('inputContainer').reset();
  resetInput();
});

function getSelectedLayer() {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].style.display !== 'none') {
      return i;
    }
  }
  return null;
}

function layerButtons() {
  if (inputs.length === 1) {
    [deleteLayer, prevLayer, nextLayer].forEach((button) => button.style.display = 'none');
  } else {
    [deleteLayer, prevLayer, nextLayer].forEach((button) => button.style.display = 'block');
    const selectedLayer = getSelectedLayer();
    deleteLayer.innerText = 'Delete Layer ' + (selectedLayer + 1).toString();
    if (selectedLayer === 0) {
      deleteLayer.disabled = true;
      prevLayer.disabled = true;
    } else {
      deleteLayer.disabled = false;
      prevLayer.disabled = false;
    }
    if (selectedLayer === inputs.length - 1) {
      nextLayer.disabled = true;
    } else {
      nextLayer.disabled = false;
    }
  }
}
layerButtons();

addLayer.addEventListener('click', function() {
  const newInput = document.createElement('textarea');
  newInput.classList.add('input');
  newInput.value = '';
  addInputListeners(newInput, inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.display = 'none';
  }
  inputs[0].parentElement.append(newInput);
  layerButtons();
});

deleteLayer.addEventListener('click', function() {
  const selectedLayer = getSelectedLayer();
  localStorage.removeItem(inputName(selectedLayer));
  inputs[selectedLayer].remove();
  inputs[selectedLayer - 1].style.display = 'block';
  layerButtons();
  generate();
});

prevLayer.addEventListener('click', function() {
  const selectedLayer = getSelectedLayer();
  inputs[selectedLayer].style.display = 'none';
  inputs[selectedLayer - 1].style.display = 'block';
  layerButtons();
});

nextLayer.addEventListener('click', function() {
  const selectedLayer = getSelectedLayer();
  inputs[selectedLayer].style.display = 'none';
  inputs[selectedLayer + 1].style.display = 'block';
  layerButtons();
});

function paddingCalc() {
  charsOnLineWithMargin = charsOnLine.value - 2 * parseInt(marginChars.value);
  linesOnPageWithMargin = linesOnPage.value - 2 * parseInt(marginLines.value);
  document.documentElement.style.setProperty(
    '--paddingTB',
    marginLines.value + 'em'
  );
  document.documentElement.style.setProperty(
    '--paddingLR',
    marginChars.value + 'ch'
  );
  document.documentElement.style.setProperty(
    '--width',
    charsOnLineWithMargin + 'ch'
  );
  document.documentElement.style.setProperty(
    '--height',
    linesOnPageWithMargin + 'em'
  );
  document.documentElement.style.setProperty('--scale', 1);
  const page = document
    .getElementsByClassName('page')[0]
    .getBoundingClientRect();
  document.documentElement.style.setProperty(
    '--scale',
    ((page.width / (parseInt(charsOnLine.value) / 10)) *
      (parseInt(linesOnPage.value) / 6)) /
    page.height
  );
}

charsOnLine.addEventListener('change', function() {
  this.value = Math.max(this.min, this.value);
  marginChars.value = Math.max(
    marginChars.min,
    Math.min(marginChars.value, Math.floor(this.value / 2))
  );
  paddingCalc();
  columnsUpdate();
  localStorage.setItem('charsOnLine', this.value);
  generate();
});

linesOnPage.addEventListener('change', function() {
  this.value = Math.max(this.min, this.value);
  marginLines.value = Math.max(
    marginLines.min,
    Math.min(marginLines.value, Math.floor(this.value / 2))
  );
  paddingCalc();
  localStorage.setItem('linesOnPage', this.value);
  generate();
});

marginChars.addEventListener('change', function() {
  this.value = Math.max(
    this.min,
    Math.min(this.value, Math.floor(charsOnLine.value / 2))
  );
  paddingCalc();
  localStorage.setItem('marginChars', this.value);
  generate();
});

marginLines.addEventListener('change', function() {
  this.value = Math.max(
    this.min,
    Math.min(this.value, Math.floor(linesOnPage.value / 2))
  );
  paddingCalc();
  columnsUpdate();
  localStorage.setItem('marginLines', this.value);
  generate();
});

function columnsUpdate() {
  columns.value = Math.max(
    columns.min,
    Math.min(columns.value, charsOnLineWithMargin)
  );
  localStorage.setItem('columns', columns.value);
  columnsDisabled();
  columnGapUpdate();
}
function columnsDisabled() {
  if (columns.value > 1) {
    columnGap.classList.remove('disabled');
    document
      .querySelector('label[for="columnGap"]')
      .classList.remove('disabled');
    columnGapUpdate();
  } else {
    columnGap.classList.add('disabled');
    document.querySelector('label[for="columnGap"]').classList.add('disabled');
  }
}
columns.addEventListener('change', function() {
  columnsUpdate();
  generate();
});

function columnGapUpdate() {
  const max = Math.floor(
    (charsOnLineWithMargin - columns.value) / Math.max(1, columns.value - 1)
  );
  columnGap.value = Math.max(columnGap.min, Math.min(columnGap.value, max));
  localStorage.setItem('columnGap', columnGap.value);
}
columnGap.addEventListener('change', function() {
  columnGapUpdate();
  generate();
});

function wordBreakDisabled() {
  if (wordBreak.checked) {
    charsToHyphen.classList.remove('disabled');
    document
      .querySelector('label[for="charsToHyphen"]')
      .classList.remove('disabled');
    addHyphen.classList.remove('disabled');
    document
      .querySelector('label[for="addHyphen"]')
      .classList.remove('disabled');
  } else {
    charsToHyphen.classList.add('disabled');
    document
      .querySelector('label[for="charsToHyphen"]')
      .classList.add('disabled');
    addHyphen.classList.add('disabled');
    document.querySelector('label[for="addHyphen"]').classList.add('disabled');
  }
}
wordBreak.addEventListener('click', function() {
  wordBreakDisabled();
  localStorage.setItem('wordBreak', this.checked);
  generate();
});

charsToHyphen.addEventListener('change', function() {
  this.value = Math.max(this.min, this.value);
  localStorage.setItem('charsToHyphen', this.value);
  generate();
});

addHyphen.addEventListener('click', function() {
  localStorage.setItem('addHyphen', this.checked);
  generate();
});

file.addEventListener('change', function() {
  if (this.value.length) {
    document.documentElement.style.setProperty(
      '--file',
      'url(' + URL.createObjectURL(this.files[0]) + ')'
    );
    transparency.classList.remove('disabled');
    document
      .querySelector('label[for="transparency"]')
      .classList.remove('disabled');
  } else {
    document.documentElement.style.setProperty('--file', 'url()');
    transparency.classList.add('disabled');
    document
      .querySelector('label[for="transparency"]')
      .classList.add('disabled');
  }
});

function transparencyUpdate() {
  document.documentElement.style.setProperty(
    '--transparency',
    transparency.value / 100
  );
}
transparency.addEventListener('change', function() {
  this.value = Math.max(this.min, Math.min(this.value, this.max));
  transparencyUpdate();
  localStorage.setItem('transparency', this.value);
});

center.addEventListener('click', function() {
  columnsUpdate();
  localStorage.setItem('center', this.checked);
  generate();
});

lineSpacing.addEventListener('change', function() {
  localStorage.setItem('lineSpacing', this.value);
  generate();
});

showSpaces.addEventListener('click', function() {
  const pages = document.getElementsByClassName('page');
  for (let i = 0; i < pages.length; i++) {
    if (this.checked) {
      pages[i].classList.add('showSpaces');
    } else {
      pages[i].classList.remove('showSpaces');
    }
  }
  localStorage.setItem('showSpaces', this.checked);
});

renderChar.addEventListener('click', function() {
  localStorage.setItem('renderChar', this.checked);
});

function resetOptions() {
  for (const element of names) {
    const domElement = document.getElementById(element);
    if (domElement.type === 'checkbox') {
      localStorage.setItem(element, domElement.checked);
    } else {
      localStorage.setItem(element, domElement.value);
    }
  }
  document.documentElement.style.setProperty('--file', '');
  columnsDisabled();
  wordBreakDisabled();
  paddingCalc();
  transparencyUpdate();
  generate();
}

resetOptionsEssay.addEventListener('click', function() {
  document.getElementById('optionsContainer').reset();
  marginChars.value = 10;
  marginLines.value = 6;
  columns.value = 1;
  columnGap.value = 0;
  wordBreak.checked = true;
  center.checked = false;
  resetOptions();
});

resetOptionsASCII.addEventListener('click', function() {
  document.getElementById('optionsContainer').reset();
  resetOptions();
});

/*Generator*/

class CurrentInfo {
  constructor(layer) {
    this.line = 0;
    this.column = 0;
    this.columnWidths = this.#findColumnWidths(charsOnLineWithMargin);
    this.layer = layer;
  }
  #findColumnWidths(characters) {
    const spaceToFill = characters - columnGap.value * (columns.value - 1);
    const minWidth = Math.floor(spaceToFill / parseInt(columns.value));
    let columnWidths = Array(parseInt(columns.value)).fill(minWidth);
    for (let i = 0; i < spaceToFill - parseInt(columns.value) * minWidth; i++) {
      columnWidths[i % columnWidths.length]++;
    }
    return columnWidths;
  }
  get columnWidth() {
    return this.columnWidths[this.column];
  }
  increment() {
    if (this.line % linesOnPageWithMargin === linesOnPageWithMargin - 1) {
      //between page dash
      this.column = (this.column + 1) % columns.value;
    }
    this.line++;
  }
}

function createSpaceBlock(width) {
  const spaceBlock = document.createElement('span');
  spaceBlock.classList.add('spaceBlock');
  spaceBlock.innerText =
    '\u00A0'.repeat(Math.floor((width - width.toString().length) / 2)) +
    width.toString() +
    '\u00A0'.repeat(Math.ceil((width - width.toString().length) / 2));
  spaceBlock.style.width = width + 'ch';
  return spaceBlock;
}

function addStringToLine(line, text, currentInfo) {
  let spaceCount = 0;
  let lastIsWord = 0;
  let spaceFirst = 1;
  let onlySpace = 1;
  for (const word of text.split(' ')) {
    if (word === '') {
      spaceCount++;
      lastIsWord = 0;
    } else {
      if (spaceCount) {
        line.append(createSpaceBlock((spaceCount + !spaceFirst).toString()));
        spaceCount = 0;
      }
      spaceFirst = 0;
      onlySpace = 0;
      const textBlock = document.createElement('span');
      textBlock.classList.add('textBlock');
      textBlock.innerText = (lastIsWord ? ' ' : '') + word;
      line.append(textBlock);
      lastIsWord = 1;
    }
  }
  if (spaceCount && currentInfo.column + 1 < columns.value) {
    line.append(createSpaceBlock((spaceCount - onlySpace).toString()));
    spaceCount = 0;
  }
}

function createPage(pageNum, currentInfo) {
  let page = document.getElementById('page' + pageNum.toString());
  if (page === null) {
    page = document.createElement('div');
    page.classList.add('page');
    if (showSpaces.checked) {
      page.classList.add('showSpaces');
    }
    page.id = 'page' + pageNum.toString();
    main.append(page);
  }
  return page;
}

function createLine(page, linePlacement, currentInfo) {
  let line = document.getElementById('line' + linePlacement.toString());
  if (line === null) {
    const br = document.createElement('br');
    page.append(br);
    line = document.createElement('div');
    line.classList.add('line');
    line.id = 'line' + linePlacement.toString();
    page.append(line);
  }
  let layer = line.getElementsByClassName('layer' + currentInfo.layer.toString())[0];
  if (typeof layer === 'undefined') {
    layer = document.createElement('div');
    layer.classList.add('layer');
    layer.classList.add('layer' + currentInfo.layer.toString());
    line.append(layer);
  }
  return layer;
}

function addStringToMain(text, currentInfo) {
  const charsLeft = currentInfo.columnWidth - text.slice(0, -1).length;
  if (center.checked) {
    const leftSpaces = Math.ceil(charsLeft / 2); //spaces on left
    const rightSpaces = Math.floor(charsLeft / 2); //spaces on right
    text = ' '.repeat(leftSpaces) + text.slice(0, -1) + ' '.repeat(rightSpaces); //add spaces and number of spaces
  } else {
    text = text.slice(0, -1) + ' '.repeat(charsLeft);
  }
  if (
    columns.value != 1 &&
    currentInfo.column != columns.value - 1 &&
    parseInt(columnGap.value)
  ) {
    text += ' '.repeat(columnGap.value);
  }
  let lastColumn = currentInfo.column;
  for (
    let i = 0;
    i < Number(lineSpacing.value) && currentInfo.column === lastColumn;
    i++
  ) {
    const textToUse = i === 0 ? text : ' '.repeat(currentInfo.columnWidth);
    const linePlacement =
      Math.floor(
        currentInfo.line / (parseInt(columns.value) * linesOnPageWithMargin)
      ) *
      linesOnPageWithMargin +
      (currentInfo.line % linesOnPageWithMargin);
    let line = document.getElementById('line' + linePlacement.toString());
    if (line !== null) {
      line = line.getElementsByClassName('layer' + currentInfo.layer.toString())[0];
    }
    if (line !== null && typeof line !== 'undefined') {
      addStringToLine(line, textToUse, currentInfo);
    } else {
      const pageCount = Math.floor(
        currentInfo.line / (parseInt(columns.value) * linesOnPageWithMargin)
      );
      let page = createPage(pageCount);
      const line = createLine(page, linePlacement, currentInfo);
      addStringToLine(line, textToUse, currentInfo);
    }
    currentInfo.increment();
  }
}

function addWordToString(text, word, currentInfo) {
  if (text.length + word.length > currentInfo.columnWidth) {
    //next word over line
    let charsLeft = currentInfo.columnWidth - text.length; //chars left in line
    if (addHyphen.checked) {
      //space for hyphen
      charsLeft -= 1;
    }
    if (
      wordBreak.checked &&
      charsLeft > 0 &&
      charsLeft >= charsToHyphen.value &&
      word.length - charsLeft >= charsToHyphen.value
    ) {
      //check enough chars on each line
      addStringToMain(
        text + word.slice(0, charsLeft) + (addHyphen.checked ? '- ' : ' '),
        currentInfo
      ); //add split and hyphen if necessary
      return addWordToString('', word.slice(charsLeft), currentInfo); //add other half of word to a new line
    } else if (word.length > currentInfo.columnWidth) {
      //force word break
      addStringToMain(text, currentInfo);
      charsLeft = currentInfo.columnWidth;
      if (addHyphen.checked) {
        //space for hyphen
        charsLeft -= 1;
      }
      return addWordToString(
        word.slice(0, charsLeft) + (addHyphen.checked ? '- ' : ' '),
        word.slice(charsLeft),
        currentInfo
      );
    } else {
      addStringToMain(text, currentInfo);
      return addWordToString('', word, currentInfo);
    }
  } else {
    //add word to line normally
    return text + word + ' ';
  }
}

function generateSingle(input, layer) {
  let currentInfo = new CurrentInfo(layer);
  if (input === '') {
    //add blank page
    createPage(0);
  } else {
    let writeLine = '';
    for (const line of input.split(/\r?\n|\r/)) {
      if (line.length) {
        for (const word of line.split(' ')) {
          writeLine = addWordToString(
            writeLine,
            word.replace(/\r?\n|\r/g, ''),
            currentInfo
          );
          if (/\r|\n/.exec(word)) {
            //end line
            addStringToMain(writeLine, currentInfo);
            writeLine = '';
          }
        }
      }
      addStringToMain(writeLine, currentInfo);
      writeLine = '';
    }

    //remove spaceBlocks in a row
    const doubleSpaceBlocks = document.querySelectorAll(
      '.spaceBlock+.spaceBlock'
    );
    for (let i = 0; i < doubleSpaceBlocks.length; i++) {
      const prev = doubleSpaceBlocks[i].previousSibling;
      const width =
        parseInt(doubleSpaceBlocks[i].innerText) + parseInt(prev.innerText);
      doubleSpaceBlocks[i].style.width = width.toString() + 'ch';
      doubleSpaceBlocks[i].innerText =
        '\u00A0'.repeat(Math.floor((width - width.toString().length) / 2)) +
        width.toString() +
        '\u00A0'.repeat(Math.ceil((width - width.toString().length) / 2));
      prev.remove();
    }

    //remove spaceBlocks at the ends of lines
    while (document.querySelector('span.spaceBlock:last-of-type')) {
      document.querySelector('span.spaceBlock:last-of-type').remove();
    }
  }

  //lines
  currentInfo.line =
    Math.floor(
      currentInfo.line / (parseInt(columns.value) * linesOnPageWithMargin)
    ) *
    linesOnPageWithMargin +
    Math.min(
      currentInfo.line % (parseInt(columns.value) * linesOnPageWithMargin),
      linesOnPageWithMargin
    ); //basically divide currentInfo.line by columns
  const lineCount = document.getElementById('lineCount');
  if (lineCount.innerText === '' || currentInfo.line > parseInt(lineCount.innerText)) {
    lineCount.innerText = currentInfo.line.toString() + ' line' + (currentInfo.line !== 1 ? 's' : '');
  }

  //pages
  const numPages = Math.ceil(currentInfo.line / linesOnPageWithMargin);
  const pageCount = document.getElementById('pageCount');
  if (pageCount.innerText === '' || numPages > parseInt(pageCount.innerText)) {
    pageCount.innerText = numPages.toString() + ' page' + (numPages !== 1 ? 's' : '');
  }
}

function generate() {
  //remove past pages
  const pages = document.getElementsByClassName('page');
  while (pages.length) {
    pages[0].remove();
  }

  for (let i = 0; i < inputs.length; i++) {
    generateSingle(inputs[i].value, i);
  }
}

generate();
