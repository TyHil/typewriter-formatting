/* Constants */

const main = document.getElementsByTagName('main')[0];
const input = document.getElementById('input');
const charsOnLine = document.getElementById('charsOnLine');
const linesOnPage = document.getElementById('linesOnPage');
const center = document.getElementById('center');
const centerCharsOnLine = document.getElementById('centerCharsOnLine');
const columns = document.getElementById('columns');
const columnGap = document.getElementById('columnGap');
const wordBreak = document.getElementById('wordBreak');
const charsToHyphen = document.getElementById('charsToHyphen');
const addHyphen = document.getElementById('addHyphen');
const resetInput = document.getElementsByClassName('reset')[0];
const resetOptions = document.getElementsByClassName('reset')[1];
const file = document.getElementById('file');
const names = ['input', 'charsOnLine', 'linesOnPage', 'center', 'centerCharsOnLine', 'columns', 'columnGap', 'wordBreak', 'charsToHyphen', 'addHyphen', 'file'];

for (const element of names) {
  const old = localStorage.getItem(element);
  if (old !== null && old != 'undefined') {
    const domElement = document.getElementById(element);
    if (domElement.type === 'checkbox') {
      domElement.checked = old === 'true';
    } else {
      domElement.value = old;
    }
  }
}
centerDisabled();
columnsDisabled();
wordBreakDisabled();
paddingCalc();



/* Listeners */

const faviconEl = document.querySelector('link[rel="icon"]');
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
  if (event.matches) {
    faviconEl.href = '/typewriter-formatting/tabicon-light.png';
  } else {
    faviconEl.href = '/typewriter-formatting/tabicon.png';
  }
});

input.addEventListener('change', function() {
  localStorage.setItem('input', this.value);
  generate();
});

resetInput.addEventListener('click', function() {
  document.getElementById('inputContainer').reset();
  localStorage.setItem('input', input.value);
  generate();
});

function paddingCalc() {
  document.documentElement.style.setProperty('--paddingTB', Math.max((66-linesOnPage.value)/2,0).toString() + 'em');
  document.documentElement.style.setProperty('--paddingLR', Math.max((85-charsOnLine.value)/2,0).toString() + 'ch');
  document.documentElement.style.setProperty('--width', charsOnLine.value + 'ch');
  document.documentElement.style.setProperty('--height', linesOnPage.value + 'em');
}

const page = document.getElementsByClassName('page')[0].getBoundingClientRect();
document.documentElement.style.setProperty('--scale', page.width / 8.5 * 11 / page.height);

charsOnLine.addEventListener('change', function() {
  this.value = Math.max(1, this.value);
  columnsUpdate();
  paddingCalc();
  localStorage.setItem('charsOnLine', this.value);
  generate();
});

linesOnPage.addEventListener('change', function() {
  this.value = Math.max(1, this.value);
  paddingCalc();
  localStorage.setItem('linesOnPage', this.value);
  generate();
});

function centerDisabled() {
  if (center.checked) {
    centerCharsOnLine.classList.remove('disabled');
    document.querySelector('label[for="centerCharsOnLine"]').classList.remove('disabled');
  } else {
    centerCharsOnLine.classList.add('disabled');
    document.querySelector('label[for="centerCharsOnLine"]').classList.add('disabled');
  }
}
center.addEventListener('click', function() {
  centerDisabled();
  columnsUpdate();
  localStorage.setItem('center', this.checked);
  generate();
});

centerCharsOnLine.addEventListener('change', function() {
  this.value = Math.max(1, Math.min(this.value, charsOnLine.value));
  columnsUpdate();
  localStorage.setItem('centerCharsOnLine', this.value);
  generate();
});

function columnsUpdate() {
  columns.value = Math.max(1, Math.min(columns.value, center.checked ? centerCharsOnLine.value : charsOnLine.value));
  localStorage.setItem('columns', columns.value);
  columnsDisabled();
  columnGapUpdate();
}
function columnsDisabled() {
  if (columns.value > 1) {
    columnGap.classList.remove('disabled');
    document.querySelector('label[for="columnGap"]').classList.remove('disabled');
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
  const max = Math.floor(((center.checked ? centerCharsOnLine.value : charsOnLine.value) - columns.value) / Math.max(1, columns.value - 1));
  columnGap.value = Math.max(0, Math.min(columnGap.value, max));
  localStorage.setItem('columnGap', columnGap.value);
}
columnGap.addEventListener('change', function() {
  columnGapUpdate();
  generate();
});

function wordBreakDisabled() {
  if (wordBreak.checked) {
    charsToHyphen.classList.remove('disabled');
    document.querySelector('label[for="charsToHyphen"]').classList.remove('disabled');
    addHyphen.classList.remove('disabled');
    document.querySelector('label[for="addHyphen"]').classList.remove('disabled');
  } else {
    charsToHyphen.classList.add('disabled');
    document.querySelector('label[for="charsToHyphen"]').classList.add('disabled');
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
  this.value = Math.max(1, this.value);
  localStorage.setItem('charsToHyphen', this.value);
  generate();
});

addHyphen.addEventListener('click', function() {
  localStorage.setItem('addHyphen', this.checked);
  generate();
});

file.addEventListener('change', function() {
  document.documentElement.style.setProperty('--file', 'url(' + (this.value.length ? URL.createObjectURL(this.files[0]) : '') + ')');
});

resetOptions.addEventListener('click', function() {
  document.getElementById('optionsContainer').reset();
  for (const element of names) {
    const domElement = document.getElementById(element);
    if (domElement.type === 'checkbox') {
      localStorage.setItem(element, domElement.checked);
    } else {
      localStorage.setItem(element, domElement.value);
    }
  }
  document.documentElement.style.setProperty('--file', '');
  centerDisabled();
  columnsDisabled();
  wordBreakDisabled();
  paddingCalc();
  generate();
});



/*Generator*/

class CurrentInfo {
  constructor() {
    this.line = 0;
    this.column = 0;
    this.columnWidths = this.findColumnWidths(center.checked ? centerCharsOnLine.value : charsOnLine.value);
    this.columnWidthsNotCentered = this.findColumnWidths(charsOnLine.value);
  }
  findColumnWidths(characters) {
    const spaceToFill = (characters - (columnGap.value * (columns.value - 1)));
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
  get columnWidthNotCentered() {
    return this.columnWidthsNotCentered[this.column];
  }
  increment() {
    if (this.line % linesOnPage.value === (linesOnPage.value - 1)) { //between page dash
      this.column = (this.column + 1) % columns.value;
    }
    this.line++;
  }
}

function createSpaceBlock(width) {
  const spaceBlock = document.createElement('span');
  spaceBlock.classList.add('spaceBlock');
  spaceBlock.innerText = '\u00A0'.repeat(Math.floor((width-width.toString().length)/2)) + width.toString() + '\u00A0'.repeat(Math.ceil((width-width.toString().length)/2));
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

function createPage(pageNum) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.id = 'page' + pageNum.toString();
  return page;
}

function addStringToMain(text, currentInfo) {
  const charsLeft = currentInfo.columnWidthNotCentered - text.slice(0, -1).length;
  if (center.checked) {
    const leftSpaces = Math.ceil(charsLeft / 2); //spaces on left
    const rightSpaces = Math.floor(charsLeft / 2); //spaces on right
    text = ' '.repeat(leftSpaces) + text.slice(0, -1) + ' '.repeat(rightSpaces); //add spaces and number of spaces
  } else {
    text = text.slice(0, -1) + ' '.repeat(charsLeft);
  }
  if (columns.value != 1 && currentInfo.column != columns.value - 1 && parseInt(columnGap.value)) {
    text += ' '.repeat(columnGap.value);
  }
  const linePlacement = Math.floor(currentInfo.line / (parseInt(columns.value) * parseInt(linesOnPage.value))) * parseInt(linesOnPage.value) + currentInfo.line % parseInt(linesOnPage.value);
  let line = document.getElementById('line' + linePlacement.toString());
  if (line !== null) {
    addStringToLine(line, text, currentInfo);
  } else {
    const pageCount = Math.floor(currentInfo.line / (parseInt(columns.value) * parseInt(linesOnPage.value)));
    let page = document.getElementById('page' + pageCount.toString());
    if (page === null) {
      page = createPage(pageCount);
      main.append(page);
    } else {
      const br = document.createElement('br');
      page.append(br);
    }
    const line = document.createElement('div');
    line.classList.add('line');
    line.id = 'line' + linePlacement.toString();
    page.append(line);
    addStringToLine(line, text, currentInfo);
  }
  currentInfo.increment();
}

function addWordToString(text, word, currentInfo) {
  if (text.length + word.length > currentInfo.columnWidth) { //next word over line
    let charsLeft = currentInfo.columnWidth - text.length; //chars left in line
    if (addHyphen.checked) { //space for hyphen
      charsLeft -= 1;
    }
    if (wordBreak.checked && charsLeft > 0 && charsLeft >= charsToHyphen.value && word.length - charsLeft >= charsToHyphen.value) { //check enough chars on each line
      addStringToMain(text + word.slice(0, charsLeft) + (addHyphen.checked ? '- ' : ' '), currentInfo); //add split and hyphen if necessary
      currentInfo.line++;
      return addWordToString('', word.slice(charsLeft), currentInfo); //add other half of word to a new line
    } else if (word.length > currentInfo.columnWidth) { //force word break
      addStringToMain(text, currentInfo);
      charsLeft = currentInfo.columnWidth;
      if (addHyphen.checked) { //space for hyphen
        charsLeft -= 1;
      }
      return addWordToString(word.slice(0, charsLeft) + (addHyphen.checked ? '- ' : ' '), word.slice(charsLeft), currentInfo);
    } else {
      addStringToMain(text, currentInfo);
      return addWordToString('', word, currentInfo);
    }
  } else { //add word to line normally
    return text + word + ' ';
  }
}

function generate() {
  //remove past pages
  const pages = document.getElementsByClassName('page');
  while (pages.length) {
    pages[0].remove();
  }
  
  let currentInfo = new CurrentInfo();
  if (input.value === '') { //add blank page
    main.append(createPage(1));
  } else {
    let writeLine = '';
    for (const line of input.value.split(/\r?\n|\r/)) {
      if (line.length) {
        for (const word of line.split(' ')) {
          writeLine = addWordToString(writeLine, word.replace(/\r?\n|\r/g, ''), currentInfo);
          if (/\r|\n/.exec(word)) { //end line
            addStringToMain(writeLine, currentInfo);
            writeLine = '';
          }
        }
      }
      addStringToMain(writeLine, currentInfo);
      writeLine = '';
    }

    //remove spaceBlocks in a row
    const doubleSpaceBlocks = document.querySelectorAll('.spaceBlock+.spaceBlock');
    for (let i = 0; i < doubleSpaceBlocks.length; i++) {
      const prev = doubleSpaceBlocks[i].previousSibling;
      const width = parseInt(doubleSpaceBlocks[i].innerText) + parseInt(prev.innerText);
      doubleSpaceBlocks[i].style.width = width.toString() + 'ch';
      doubleSpaceBlocks[i].innerText = '\u00A0'.repeat(Math.floor((width-width.toString().length)/2)) + width.toString() + '\u00A0'.repeat(Math.ceil((width-width.toString().length)/2));
      prev.remove();
    }

    //remove spaceBlocks at the ends of lines
    while(document.querySelector('span.spaceBlock:last-of-type')) {
      document.querySelector('span.spaceBlock:last-of-type').remove();
    }
  }

  //lines
  currentInfo.line = Math.floor(currentInfo.line / (parseInt(columns.value) * parseInt(linesOnPage.value))) * parseInt(linesOnPage.value) + Math.min(currentInfo.line % (parseInt(columns.value) * parseInt(linesOnPage.value)), parseInt(linesOnPage.value)); //basically divide currentInfo.line by columns
  document.getElementById('lineCount').innerText = currentInfo.line.toString() + ' line' + ((currentInfo.line !== 1) ? 's' : '');

  //pages
  const numPages = Math.ceil(currentInfo.line / parseInt(linesOnPage.value));
  document.getElementById('pageCount').innerText = numPages.toString() + ' page' + ((numPages !== 1) ? 's' : '');
}

generate();
