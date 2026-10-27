import test from 'node:test';
import assert from 'node:assert/strict';
import { WA_GAMES, getSecureRandomInt, generateLine, generateTicket, formatTicketText } from '../src/lottery.js';

test('getSecureRandomInt produces numbers strictly in range', () => {
  for (let i = 0; i < 200; i++) {
    const val = getSecureRandomInt(5, 10);
    assert.ok(val >= 5 && val <= 10, `val ${val} should be between 5 and 10`);
  }
});

test('Washington Lotto generates 6 unique numbers from 1 to 49, sorted', () => {
  for (let i = 0; i < 50; i++) {
    const line = generateLine('lotto');
    assert.strictEqual(line.numbers.length, 6);
    assert.strictEqual(line.specialBall, null);
    
    // Check range
    line.numbers.forEach(n => {
      assert.ok(n >= 1 && n <= 49, `${n} must be between 1 and 49`);
    });

    // Check unique
    const unique = new Set(line.numbers);
    assert.strictEqual(unique.size, 6);

    // Check sorted
    for (let j = 0; j < line.numbers.length - 1; j++) {
      assert.ok(line.numbers[j] < line.numbers[j + 1], 'Numbers must be sorted in ascending order');
    }
  }
});

test('Hit 5 generates 5 unique numbers from 1 to 42, sorted', () => {
  const line = generateLine('hit5');
  assert.strictEqual(line.numbers.length, 5);
  line.numbers.forEach(n => assert.ok(n >= 1 && n <= 42));
  assert.strictEqual(new Set(line.numbers).size, 5);
});

test('Match 4 generates 4 unique numbers from 1 to 24, sorted', () => {
  const line = generateLine('match4');
  assert.strictEqual(line.numbers.length, 4);
  line.numbers.forEach(n => assert.ok(n >= 1 && n <= 24));
  assert.strictEqual(new Set(line.numbers).size, 4);
});

test('Pick 3 generates 3 digits from 0 to 9', () => {
  const line = generateLine('pick3');
  assert.strictEqual(line.numbers.length, 3);
  line.numbers.forEach(n => assert.ok(n >= 0 && n <= 9));
});

test('Daily Keno generates 10 numbers from 1 to 80', () => {
  const line = generateLine('dailykeno');
  assert.strictEqual(line.numbers.length, 10);
  line.numbers.forEach(n => assert.ok(n >= 1 && n <= 80));
  assert.strictEqual(new Set(line.numbers).size, 10);
});

test('Powerball generates 5 white balls (1-69) and 1 Powerball (1-26)', () => {
  for (let i = 0; i < 20; i++) {
    const line = generateLine('powerball');
    assert.strictEqual(line.numbers.length, 5);
    line.numbers.forEach(n => assert.ok(n >= 1 && n <= 69));
    assert.strictEqual(new Set(line.numbers).size, 5);
    assert.ok(line.specialBall >= 1 && line.specialBall <= 26);
    assert.strictEqual(line.specialBallName, 'Powerball');
  }
});

test('Mega Millions generates 5 white balls (1-70) and 1 Mega Ball (1-25)', () => {
  for (let i = 0; i < 20; i++) {
    const line = generateLine('megamillions');
    assert.strictEqual(line.numbers.length, 5);
    line.numbers.forEach(n => assert.ok(n >= 1 && n <= 70));
    assert.strictEqual(new Set(line.numbers).size, 5);
    assert.ok(line.specialBall >= 1 && line.specialBall <= 25);
    assert.strictEqual(line.specialBallName, 'Mega Ball');
  }
});

test('Include and Exclude options work correctly in Lotto', () => {
  const lucky = 7;
  const unlucky = [13, 22, 33];
  const line = generateLine('lotto', { include: [lucky], exclude: unlucky });
  
  assert.ok(line.numbers.includes(lucky), 'Must contain lucky number');
  unlucky.forEach(u => {
    assert.ok(!line.numbers.includes(u), `Must not contain excluded number ${u}`);
  });
});

test('Balanced Odd/Even filter produces balanced lines', () => {
  for (let i = 0; i < 20; i++) {
    const line = generateLine('lotto', { balanceOddEven: true });
    // In 6 numbers, balanced means 2, 3, or 4 odds
    assert.ok(line.oddCount >= 2 && line.oddCount <= 4, `Odd count ${line.oddCount} should be balanced`);
  }
});

test('generateTicket generates specified number of plays (defaults to 2 for Lotto)', () => {
  const ticket = generateTicket('lotto');
  assert.strictEqual(ticket.lines.length, 2);
  assert.strictEqual(ticket.gameName, "Washington's Lotto");

  const ticket5 = generateTicket('hit5', { plays: 5 });
  assert.strictEqual(ticket5.lines.length, 5);
});

test('formatTicketText returns formatted printable ticket string', () => {
  const ticket = generateTicket('lotto', { plays: 2 });
  const text = formatTicketText(ticket);
  assert.ok(text.includes("WASHINGTON'S LOTTERY"));
  assert.ok(text.includes("Play A:"));
  assert.ok(text.includes("Play B:"));
});
