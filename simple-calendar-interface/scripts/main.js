const $eventBoard = $('.event-board');
const $boardWidth = $eventBoard.width();
const $leftPadding = $eventBoard.css('padding-left');
const paddingL = parseInt($leftPadding.slice(0, $leftPadding.length - 2));

// Code is inspired by LeetCode "Meeting room" question,
// and based on algorithm described on Stack Overflow https://bit.ly/2J0amya

// Suppose the board has an unlimited grid/column
// The length of columns var indicates how many columns the eventBoard will be divided into
let columns = [];
// Previous/last event ending time
let lastEnd = null;

// Sort events input by starting time, then by ending time
function sortEvents(events) {
  return events.sort((e1, e2) => {
    if (e1.start < e2.start) return -1;
    if (e1.start > e2.start) return 1;
    if (e1.end < e2.end) return -1;
    if (e1.end > e2.end) return 1;
    return 0;
  });
}

// Check if two events overlap
function overlapWith(e1, e2) {
  return e1.end > e2.start && e1.start < e2.end;
}

function calculateEventWidth(event, currentColIndex, cols) {
  let colSpan = 1;

  // Events of each col (cols[i]) do not overlap,
  // check if the current event (event parameter) overlaps with
  // any event of the following cols
  // Therefore, i starts from currentColIndex + 1
  for (let i = currentColIndex + 1; i < cols.length; i++) {
    const col = cols[i];
    // Loop the col,
    // to find if any e of the col overlaps with event (the current event)
    // if yes, return the colSpan;
    //  if no, colSpan increaments by 1, then start to check the next col
    for (let j = 0; j < col.length; j++) {
      const e = col[j];
      if (overlapWith(event, e)) return colSpan;
    }
    colSpan++;
  }
  return colSpan;
}

function createEvent(event) {
  const $div = $('<div>', {class: 'event'});
  $div.css({
    left: event.css.left,
    width: event.css.width,
    top: event.start,
    height: event.css.height,
  });
  const html = `
    <p class="event__title">Sample Event</p>
    <p class="event__location">Sample location</p>
    <p class="event__time">${displayTime(event.start)} - ${displayTime(event.end)}</p>
  `;
  $div.html(html);

  $eventBoard.append($div);
}

function displayTime(num) {
  const h = Math.floor(num / 60) + 9;
  const m = num % 60;
  return `${h <= 12 ? h : h - 12}:${m < 10 ? '0' : ''}${m} ${h < 12 ? 'AM' : 'PM'}`;
}

function populateEvents(cols, boardWidth) {
  // how many columns the eventBoard is divided into
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const col = cols[i];
    for (let j = 0; j < col.length; j++) {
      const e = col[j];
      const colSpan = calculateEventWidth(e, i, cols);
      e.css = {
        left: i / n * boardWidth + paddingL,
        width: colSpan / n * boardWidth,
        height: e.end - e.start,
      };
      createEvent(e);
    }
  }
}

function layOutDays(events) {
  const sortedEs = sortEvents(events);
  sortedEs.forEach(e => {
    let placed = false;
    // Check if a new event group (var columns) needs to be started
    // Check if the current event (e) overlaps with the previous one (lastEnd)
    // If no overlap, populate the current and start a new columns
    if (lastEnd !== null && e.start >= lastEnd) {
      populateEvents(columns, $boardWidth);
      columns = [];
      lastEnd = null;
    }

    // Try to place the current event (e) inside the existing columns of the
    // current event group (var columns)
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      // Check if the current event (e) overlaps with the last event of
      // the last event of the current col
      if (!overlapWith(col[col.length - 1], e)) {
        // if not
        col.push(e);
        // the current event is placed in an column of the current event
        // group (columns)
        placed = true;
        break;
      }
    }

    // If can't be placed in the existing columns of the current event group,
    // add a new column to the current event group
    if (!placed) columns.push([e]);

    // Update the last ending time
    if (lastEnd === null || e.end > lastEnd) lastEnd = e.end;
  });

  if (columns.length > 0) populateEvents(columns, $boardWidth);
}

// const events = [{start: 500, end: 620}, {start: 540, end: 600}, {start: 30, end: 150}, {start: 610, end: 670}, {start: 300, end: 520}, {start: 300, end: 450}, {start: 500, end: 550}];

// layOutDays(events);
