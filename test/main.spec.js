/* global define, it, describe, beforeEach, document */
const express = require('express');
const path = require('path');
const Nightmare = require('nightmare');
const expect = require('chai').expect;
const axios = require('axios');

let nightmare;

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.listen(8888);

const url = 'http://localhost:8888';


describe('Workshop game', function () {
  this.timeout(6500);
  beforeEach(() => {
    nightmare = new Nightmare();
  });

  it('should load successfully', () => axios.get(url).then(r => expect(r.status === 200)));

  it('should have a #root div', () =>
    nightmare
      .goto(url)
      .wait('div#root')
      .evaluate(() => !!document.querySelector('#root'))
      .end()
      .then(rootExists => expect(rootExists).to.equal(true))
  );

  it('should mark the clicked square', () =>
    nightmare
      .goto(url)
      .wait('.square:nth-child(1)')
      .click('.square:nth-child(1)')
      .evaluate(() => document.querySelector('.square:nth-child(1)').innerText)
      .end()
      .then(squareText => expect(squareText).to.equal('X'))
  );

  it('should declare a winner', () =>
    nightmare
      .goto(url)
      .wait('.square:nth-child(1)')
      .click('.square:nth-child(1)')
      .click('.board-row:nth-child(2) > .square:nth-child(1)')
      .click('.square:nth-child(2)')
      .click('.board-row:nth-child(2) > .square:nth-child(2)')
      .click('.square:nth-child(3)')
      .evaluate(() => [
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(1)').innerText,
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(2)').innerText,
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(3)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(1)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(2)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(3)').innerText,
        document.querySelector('.game-info > div').innerText
      ])
      .end()
      .then(values => expect(values).to.deep.equal(['X', 'X', 'X', 'O', 'O', '', 'Winner: X']))
  );

  it('should show a past state when history is clicked', () =>
    nightmare
      .goto(url)
      .wait('.square:nth-child(1)')
      .click('.square:nth-child(1)')
      .click('.board-row:nth-child(2) > .square:nth-child(1)')
      .click('.square:nth-child(2)')
      .click('.board-row:nth-child(2) > .square:nth-child(2)')
      .click('.square:nth-child(3)')
      .click('.game-info > ol > li:nth-child(3) > a')
      .evaluate(() => [
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(1)').innerText,
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(2)').innerText,
        document.querySelector('.board-row:nth-child(1) > .square:nth-child(3)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(1)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(2)').innerText,
        document.querySelector('.board-row:nth-child(2) > .square:nth-child(3)').innerText,
        document.querySelector('.game-info > div').innerText
      ])
      .end()
      .then(values => expect(values).to.deep.equal(['X', '', '', 'O', '', '', 'Next player: X']))
  );
});
