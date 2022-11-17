/*Constants*/

const main = document.getElementsByTagName("main")[0];
const input = document.getElementById("input");
const charsOnLine = document.getElementById("charsOnLine");
const linesOnPage = document.getElementById("linesOnPage");
const center = document.getElementById("center");
const centerCharsOnLine = document.getElementById("centerCharsOnLine");
const columns = document.getElementById("columns");
const columnGap = document.getElementById("columnGap");
const wordBreak = document.getElementById("wordBreak");
const charsToHyphen = document.getElementById("charsToHyphen");
const addHyphen = document.getElementById("addHyphen");
const showSpaces = document.getElementById("showSpaces");

/* Listeners */

const oldInput = localStorage.getItem("input");
if (oldInput !== null) {
  input.value = localStorage.getItem("input");
}
input.addEventListener("change", function() {
  localStorage.setItem("input", this.value);
  generate();
});

function paddingCalc() {
  document.documentElement.style.setProperty("--padding", Math.max((66-linesOnPage.value)/2,0).toString() + "em " + Math.max((85-charsOnLine.value)/2,0).toString() + "ch");
  document.documentElement.style.setProperty("--width", charsOnLine.value + "ch");
  document.documentElement.style.setProperty("--height", linesOnPage.value + "em");
}
paddingCalc();

charsOnLine.addEventListener("change", function() {
  this.value = Math.max(1, this.value);
  columnsUpdate();
  paddingCalc();
  generate();
});

linesOnPage.addEventListener("change", function() {
  this.value = Math.max(1, this.value);
  paddingCalc();
  generate();
});

center.addEventListener("click", function() {
  if (this.checked) {
    centerCharsOnLine.classList.remove("disabled");
    document.querySelector("label[for='centerCharsOnLine']").classList.remove("disabled");
  } else {
    centerCharsOnLine.classList.add("disabled");
    document.querySelector("label[for='centerCharsOnLine']").classList.add("disabled");
  }
  columnsUpdate();
  generate();
});

centerCharsOnLine.addEventListener("change", function() {
  this.value = Math.max(1, Math.min(this.value, charsOnLine.value));
  columnsUpdate();
  generate();
});

function columnsUpdate() {
  columns.value = Math.max(1, Math.min(columns.value, center.checked ? centerCharsOnLine.value : charsOnLine.value));
  columnGapUpdate();
}
columns.addEventListener("change", function() {
  columnsUpdate();
  if (this.value > 1) {
    columnGap.classList.remove("disabled");
    document.querySelector("label[for='columnGap']").classList.remove("disabled");
    columnGapUpdate();
  } else {
    columnGap.classList.add("disabled");
    document.querySelector("label[for='columnGap']").classList.add("disabled");
  }
  generate();
});

function columnGapUpdate() {
  const max = Math.floor(((center.checked ? centerCharsOnLine.value : charsOnLine.value) - columns.value) / Math.max(1, columns.value - 1));
  columnGap.value = Math.max(0, Math.min(columnGap.value, max));
}
columnGap.addEventListener("change", function() {
  columnGapUpdate();
  generate();
});

wordBreak.addEventListener("click", function() {
  if (this.checked) {
    charsToHyphen.classList.remove("disabled");
    document.querySelector("label[for='charsToHyphen']").classList.remove("disabled");
    addHyphen.classList.remove("disabled");
    document.querySelector("label[for='addHyphen']").classList.remove("disabled");
  } else {
    charsToHyphen.classList.add("disabled");
    document.querySelector("label[for='charsToHyphen']").classList.add("disabled");
    addHyphen.classList.add("disabled");
    document.querySelector("label[for='addHyphen']").classList.add("disabled");
  }
  generate();
});

charsToHyphen.addEventListener("change", function() {
  this.value = Math.max(1, this.value);
  generate();
});

addHyphen.addEventListener("click", function() {
  generate();
});

showSpaces.addEventListener("click", function() {
  const spaceBlocks = document.getElementsByClassName("spaceBlock");
  for (let i = 0; i < spaceBlocks.length; i++) {
    if (this.checked) {
      spaceBlocks[i].classList.add("showSpaces");
    } else {
      spaceBlocks[i].classList.remove("showSpaces");
    }
  }
});

/*Generator*/

let column; //current column
let columnWidth;

function createSpaceBlock(width) {
  const spaceBlock = document.createElement("span");
  spaceBlock.classList.add("spaceBlock");
  if (showSpaces.checked) {
    spaceBlock.classList.add("showSpaces");
  }
  spaceBlock.innerText = width;
  spaceBlock.style.width = width + "ch";
  return spaceBlock;
}

function addToMainLine(line, text) {
  let spaceCount = 0;
  let lastIsWord = 0;
  let spaceFirst = 1;
  let onlySpace = 1;
  for (const word of text.split(" ")) {
    if (word === "") {
      spaceCount++;
      lastIsWord = 0;
    } else {
      if (spaceCount) {
        line.append(createSpaceBlock((spaceCount + !spaceFirst).toString()));
        spaceCount = 0;
      }
      spaceFirst = 0;
      onlySpace = 0;
      const textBlock = document.createElement("span");
      textBlock.classList.add("textBlock");
      textBlock.innerText = (lastIsWord ? " " : "") + word;
      line.append(textBlock);
      lastIsWord = 1;
    }
  }
  if (spaceCount) {
    line.append(createSpaceBlock((spaceCount - onlySpace).toString()));
    spaceCount = 0;
  }
}

function createPage(pageCount) {
  const page = document.createElement("div");
  page.classList.add("page");
  page.id = "page" + pageCount.toString();
  return page;
}

function addToMain(text, lineCount) {
  if (columns.value != 1 && column != columns.value - 1 && parseInt(columnGap.value)) {
    text += " ".repeat(columnGap.value);
  }
  const linePlacement = Math.floor(lineCount / (parseInt(columns.value) * parseInt(linesOnPage.value))) * parseInt(linesOnPage.value) + lineCount % parseInt(linesOnPage.value);
  let line = document.getElementById("line" + linePlacement.toString());
  if (typeof(line) != 'undefined' && line != null) {
    addToMainLine(line, text);
  } else {
    const pageCount = Math.floor(lineCount / (parseInt(columns.value) * parseInt(linesOnPage.value)));
    let page = document.getElementById("page" + pageCount.toString());
    if (typeof(page) == 'undefined' || page == null) {
      page = createPage(pageCount);
      main.append(page);
    } else {
      const br = document.createElement("br");
      page.append(br);
    }
    const line = document.createElement("div");
    line.classList.add("line");
    line.id = "line" + linePlacement.toString();
    page.append(line);
    addToMainLine(line, text);
  }
}

function formatLine(text, lineCount) {
  const columnWidthNotCentered = findColumnWidths(charsOnLine.value); //width of columns without centered spaces removed
  const charsLeft = columnWidthNotCentered[column] - text.slice(0, -1).length;
  if (center.checked) {
    const leftSpaces = Math.ceil(charsLeft / 2); //spaces on left
    const rightSpaces = Math.floor(charsLeft / 2); //spaces on right
    addToMain(" ".repeat(leftSpaces) + text.slice(0, -1) + " ".repeat(rightSpaces), lineCount); //add spaces and number of spaces
  } else {
    addToMain(text.slice(0, -1) + " ".repeat(charsLeft), lineCount);
  }
  if (lineCount % linesOnPage.value == (linesOnPage.value - 1)) { //between page dash
    column = (column + 1) % columns.value;
  }
}

function addWord(lineCount, writeLine, word) {
  if (writeLine.length + word.length > columnWidth[column]) { //next word over line
    let charsLeft = columnWidth[column] - writeLine.length; //chars left in line
    if (addHyphen.checked) { //space for hyphen
      charsLeft -= 1;
    }
    if (wordBreak.checked && charsLeft > 0 && charsLeft >= charsToHyphen.value && word.length - charsLeft >= charsToHyphen.value) { //check enough chars on each line
      formatLine(writeLine + word.slice(0, charsLeft) + (addHyphen.checked ? "- " : " "), lineCount); //add split and hyphen if necessary
      return addWord(lineCount + 1, "", word.slice(charsLeft)); //add other half of word to a new line
    } else if (word.length > columnWidth[column]) { //force word break
      formatLine(writeLine, lineCount);
      charsLeft = columnWidth[column];
      if (addHyphen.checked) { //space for hyphen
        charsLeft -= 1;
      }
      return addWord(lineCount + 1, word.slice(0, charsLeft) + (addHyphen.checked ? "- " : " "), word.slice(charsLeft));
    } else {
      formatLine(writeLine, lineCount);
      return addWord(lineCount + 1, "", word);
    }
  } else { //add word to line normally
    return [lineCount, writeLine + word + " "];
  }
}

function findColumnWidths(characters) {
  const spaceToFill = (characters - (columnGap.value * (columns.value - 1)));
  const minWidth = Math.floor(spaceToFill / parseInt(columns.value));
  let columnWidth = Array(parseInt(columns.value)).fill(minWidth);
  for (let i = 0; i < spaceToFill - parseInt(columns.value) * minWidth; i++) {
    columnWidth[i % columnWidth.length]++;
  }
  return columnWidth;
}

function generate() {
  const pages = document.getElementsByClassName("page");
  while (pages.length) {
    pages[0].remove();
  }
  let lineCount = 0;
  if (input.value !== "") {
    column = 0;
    columnWidth = findColumnWidths(center.checked ? centerCharsOnLine.value : charsOnLine.value);
    let writeLine = "";
    for (const line of input.value.split(/\r?\n|\r/)) {
      if (line.length === 0) {
        formatLine(writeLine, lineCount);
        lineCount += 1;
        writeLine = "";
        formatLine("", lineCount);
        lineCount += 1;
      } else {
        for (const word of line.split(" ")) {
          const values = addWord(lineCount, writeLine, word.replace(/\r?\n|\r/g, ""));
          lineCount = values[0];
          writeLine = values[1];
          if (/\r|\n/.exec(word)) { //end line
            formatLine(writeLine, lineCount);
            lineCount += 1;
            writeLine = "";
          }
        }
      }
    }
    formatLine(writeLine, lineCount); //add last line
    const doubleSpaceBlocks = document.querySelectorAll(".spaceBlock+.spaceBlock");
    for (let i = 0; i < doubleSpaceBlocks.length; i++) {
      const prev = doubleSpaceBlocks[i].previousSibling;
      doubleSpaceBlocks[i].style.width = (parseInt(doubleSpaceBlocks[i].innerText) + parseInt(prev.innerText)).toString() + "ch";
      doubleSpaceBlocks[i].innerText = parseInt(doubleSpaceBlocks[i].innerText) + parseInt(prev.innerText);
      prev.remove();
    }
    lineCount += 1;
  } else {
    main.append(createPage(1));
  }
  lineCount = Math.floor(lineCount / (parseInt(columns.value) * parseInt(linesOnPage.value))) * parseInt(linesOnPage.value) + Math.min(lineCount % (parseInt(columns.value) * parseInt(linesOnPage.value)), parseInt(linesOnPage.value)); //basically divide lineCount by columns
  document.getElementById("lineCount").innerText = lineCount.toString() + " line" + ((lineCount !== 1) ? "s" : "");
  const pageCount = Math.floor(lineCount / parseInt(linesOnPage.value));
  const extraLines = lineCount - pageCount * parseInt(linesOnPage.value);
  document.getElementById("pageCount").innerText = pageCount ? (pageCount.toString() + " pages and " + extraLines.toString() + " line" + ((extraLines !== 1) ? "s" : "")) : "";
}
generate();