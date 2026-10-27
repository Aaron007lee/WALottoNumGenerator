import crypto from 'node:crypto';

/**
 * Washington State Lottery Game Specifications
 */
export const WA_GAMES = {
  lotto: {
    id: 'lotto',
    name: "Washington's Lotto",
    description: "State jackpot game drawn Mon, Wed & Sat nights",
    cost: '$1.00 for 2 plays',
    defaultPlays: 2,
    rules: {
      pickCount: 6,
      minNumber: 1,
      maxNumber: 49,
      allowDuplicates: false,
      sorted: true
    },
    drawSchedule: {
      days: ['Monday', 'Wednesday', 'Saturday'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: 'Starts at $1,000,000 and rolls over',
    odds: {
      overall: '1 in 27.1',
      jackpot: '1 in 6,991,908',
      match5: '1 in 27,100 ($1,000)',
      match4: '1 in 516 ($30)',
      match3: '1 in 28.3 ($3)'
    },
    themeColor: '#008542' // Evergreen
  },
  hit5: {
    id: 'hit5',
    name: 'Hit 5',
    description: 'Daily rolling cashpot game',
    cost: '$1.00 per play',
    defaultPlays: 1,
    rules: {
      pickCount: 5,
      minNumber: 1,
      maxNumber: 42,
      allowDuplicates: false,
      sorted: true
    },
    drawSchedule: {
      days: ['Daily (Mon-Sun)'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: 'Starts at $100,000 and grows until hit',
    odds: {
      overall: '1 in 10.1',
      jackpot: '1 in 850,668',
      match4: '1 in 4,598 ($150)',
      match3: '1 in 128 ($15)',
      match2: '1 in 11 (Free Ticket)'
    },
    themeColor: '#005f9e' // Deep Blue
  },
  match4: {
    id: 'match4',
    name: 'Match 4',
    description: 'Daily game with fixed $10,000 top prize',
    cost: '$2.00 per play',
    defaultPlays: 1,
    rules: {
      pickCount: 4,
      minNumber: 1,
      maxNumber: 24,
      allowDuplicates: false,
      sorted: true
    },
    drawSchedule: {
      days: ['Daily (Mon-Sun)'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: '$10,000 fixed top prize',
    odds: {
      overall: '1 in 8.70',
      jackpot: '1 in 10,626 ($10,000)',
      match3: '1 in 133 ($20)',
      match2: '1 in 9.32 ($2)'
    },
    themeColor: '#6d28d9' // Royal Purple
  },
  pick3: {
    id: 'pick3',
    name: 'Pick 3',
    description: 'Daily 3-digit game with Straight/Box play types',
    cost: '$0.50 or $1.00 per play',
    defaultPlays: 1,
    rules: {
      pickCount: 3,
      minNumber: 0,
      maxNumber: 9,
      allowDuplicates: true,
      sorted: false
    },
    drawSchedule: {
      days: ['Daily (Mon-Sun)'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: '$500 for a $1.00 Straight play',
    odds: {
      overall: 'Varies by play type (1 in 1,000 for Straight)',
      straight: '1 in 1,000 ($500 on $1)',
      box6Way: '1 in 167 ($80 on $1)',
      frontBackPair: '1 in 100 ($50 on $1)'
    },
    themeColor: '#d97706' // Amber Gold
  },
  dailykeno: {
    id: 'dailykeno',
    name: 'Daily Keno',
    description: '10-spot quick pick drawn nightly from 80 balls',
    cost: '$1.00 to $5.00 per play',
    defaultPlays: 1,
    rules: {
      pickCount: 10,
      minNumber: 1,
      maxNumber: 80,
      allowDuplicates: false,
      sorted: true
    },
    drawSchedule: {
      days: ['Daily (Mon-Sun)'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: 'Up to $100,000 top prize',
    odds: {
      overall: '1 in 9.05 (10-spot)',
      match10of10: '1 in 8,911,711 ($100,000 on $1)',
      match9of10: '1 in 163,381 ($4,000)',
      match8of10: '1 in 7,384 ($400)'
    },
    themeColor: '#059669' // Emerald
  },
  powerball: {
    id: 'powerball',
    name: 'Powerball (WA)',
    description: 'National jackpot game: 5 white balls + 1 Powerball',
    cost: '$2.00 per play (+$1 for Power Play)',
    defaultPlays: 1,
    rules: {
      pickCount: 5,
      minNumber: 1,
      maxNumber: 69,
      allowDuplicates: false,
      sorted: true,
      specialBall: {
        name: 'Powerball',
        minNumber: 1,
        maxNumber: 26,
        color: '#dc2626'
      }
    },
    drawSchedule: {
      days: ['Monday', 'Wednesday', 'Saturday'],
      time: '7:59 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: 'Multi-million rolling jackpot',
    odds: {
      overall: '1 in 24.87',
      jackpot: '1 in 292,201,338',
      match5: '1 in 11,688,053 ($1,000,000)',
      match4plusPB: '1 in 913,129 ($50,000)'
    },
    themeColor: '#dc2626' // Red
  },
  megamillions: {
    id: 'megamillions',
    name: 'Mega Millions (WA)',
    description: 'National jackpot game: 5 white balls + 1 Mega Ball',
    cost: '$2.00 per play (+$1 for Megaplier)',
    defaultPlays: 1,
    rules: {
      pickCount: 5,
      minNumber: 1,
      maxNumber: 70,
      allowDuplicates: false,
      sorted: true,
      specialBall: {
        name: 'Mega Ball',
        minNumber: 1,
        maxNumber: 25,
        color: '#eab308'
      }
    },
    drawSchedule: {
      days: ['Tuesday', 'Friday'],
      time: '8:00 PM PT',
      cutoff: '7:45 PM PT'
    },
    jackpot: 'Multi-million rolling jackpot',
    odds: {
      overall: '1 in 24.0',
      jackpot: '1 in 302,575,350',
      match5: '1 in 12,607,306 ($1,000,000)',
      match4plusMB: '1 in 931,001 ($10,000)'
    },
    themeColor: '#1d4ed8' // Blue / Gold
  }
};

/**
 * Cryptographically secure random integer within range [min, max] inclusive.
 */
export function getSecureRandomInt(min, max) {
  if (min > max) throw new Error(`min (${min}) cannot exceed max (${max})`);
  const range = max - min + 1;

  if (typeof crypto !== 'undefined' && crypto.randomInt) {
    return crypto.randomInt(min, max + 1);
  }

  // Fallback for browsers or standard Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const maxUint = 0xffffffff;
    const limit = maxUint - (maxUint % range);
    const buffer = new Uint32Array(1);
    let val;
    do {
      crypto.getRandomValues(buffer);
      val = buffer[0];
    } while (val >= limit);
    return min + (val % range);
  }

  // Fallback
  return Math.floor(Math.random() * range) + min;
}

/**
 * Generate a single lotto line
 * @param {string} gameKey - Game key from WA_GAMES
 * @param {object} options - Filters like include, exclude, balanceOddEven
 */
export function generateLine(gameKey, options = {}) {
  const game = WA_GAMES[gameKey];
  if (!game) {
    throw new Error(`Unknown game: "${gameKey}". Available: ${Object.keys(WA_GAMES).join(', ')}`);
  }

  const { pickCount, minNumber, maxNumber, allowDuplicates, sorted, specialBall } = game.rules;
  const include = (options.include || []).filter(n => typeof n === 'number' && n >= minNumber && n <= maxNumber);
  const exclude = new Set(options.exclude || []);

  const maxAttempts = 1000;
  let attempts = 0;

  while (attempts++ < maxAttempts) {
    const numbers = [];
    const used = new Set();

    // Add required numbers first (if valid)
    for (const num of include) {
      if (!exclude.has(num) && numbers.length < pickCount) {
        numbers.push(num);
        used.add(num);
      }
    }

    if (allowDuplicates) {
      // Pick 3 style
      while (numbers.length < pickCount) {
        const candidate = getSecureRandomInt(minNumber, maxNumber);
        if (!exclude.has(candidate)) {
          numbers.push(candidate);
        }
      }
    } else {
      // Build candidate pool
      const pool = [];
      for (let i = minNumber; i <= maxNumber; i++) {
        if (!exclude.has(i) && !used.has(i)) {
          pool.push(i);
        }
      }

      if (pool.length < pickCount - numbers.length) {
        throw new Error(`Not enough available numbers between ${minNumber}-${maxNumber} with excluded list.`);
      }

      while (numbers.length < pickCount) {
        const index = getSecureRandomInt(0, pool.length - 1);
        const [picked] = pool.splice(index, 1);
        numbers.push(picked);
      }
    }

    // Optional Filter: Balanced Odd/Even (for games with 4-6 picks)
    if (options.balanceOddEven && pickCount >= 4) {
      const oddCount = numbers.filter(n => n % 2 !== 0).length;
      const targetMin = Math.floor(pickCount / 2) - 1;
      const targetMax = Math.ceil(pickCount / 2) + 1;
      if (oddCount < targetMin || oddCount > targetMax) {
        continue; // Try again for better balance
      }
    }

    // Optional Filter: Sum Range
    if (options.minSum && numbers.reduce((a, b) => a + b, 0) < options.minSum) {
      continue;
    }
    if (options.maxSum && numbers.reduce((a, b) => a + b, 0) > options.maxSum) {
      continue;
    }

    const finalNumbers = sorted ? numbers.slice().sort((a, b) => a - b) : numbers;

    let special = null;
    if (specialBall) {
      special = getSecureRandomInt(specialBall.minNumber, specialBall.maxNumber);
    }

    return {
      game: game.id,
      numbers: finalNumbers,
      specialBall: special,
      specialBallName: specialBall?.name || null,
      sum: finalNumbers.reduce((a, b) => a + b, 0),
      oddCount: finalNumbers.filter(n => n % 2 !== 0).length,
      evenCount: finalNumbers.filter(n => n % 2 === 0).length
    };
  }

  throw new Error(`Could not satisfy generator constraints for ${game.name} within ${maxAttempts} attempts.`);
}

/**
 * Generate multiple plays for a given game
 */
export function generateTicket(gameKey, options = {}) {
  const game = WA_GAMES[gameKey];
  if (!game) {
    throw new Error(`Unknown game: "${gameKey}". Available: ${Object.keys(WA_GAMES).join(', ')}`);
  }

  const plays = options.plays || game.defaultPlays || 1;
  const lines = [];

  for (let i = 0; i < plays; i++) {
    lines.push(generateLine(gameKey, options));
  }

  return {
    gameKey,
    gameName: game.name,
    cost: game.cost,
    drawSchedule: game.drawSchedule,
    jackpot: game.jackpot,
    generatedAt: new Date().toISOString(),
    playsCount: lines.length,
    lines
  };
}

/**
 * Format ticket as printable or displayable text
 */
export function formatTicketText(ticket) {
  const game = WA_GAMES[ticket.gameKey];
  const border = '═'.repeat(48);
  const out = [];

  out.push(border);
  out.push(`  WASHINGTON'S LOTTERY - QUICK PICK GENERATOR`);
  out.push(`  Game: ${game.name.toUpperCase()}`);
  out.push(`  Cost: ${game.cost} | Draws: ${game.drawSchedule.days.join(', ')}`);
  out.push(`  Draw Time: ${game.drawSchedule.time} (Cutoff: ${game.drawSchedule.cutoff})`);
  out.push(border);

  ticket.lines.forEach((line, idx) => {
    const playLetter = String.fromCharCode(65 + idx); // A, B, C...
    const numStr = line.numbers.map(n => String(n).padStart(2, ' ')).join('  ');
    let extra = '';
    if (line.specialBall !== null) {
      extra = `  ★ ${line.specialBallName}: [${String(line.specialBall).padStart(2, ' ')}]`;
    }
    const stats = `(Sum: ${line.sum}, O/E: ${line.oddCount}/${line.evenCount})`;
    out.push(`  Play ${playLetter}:  ${numStr}${extra.padEnd(20)} ${stats}`);
  });

  out.push(border);
  out.push(`  Top Prize: ${game.jackpot}`);
  out.push(`  Overall Odds: ${game.odds.overall}`);
  out.push(`  Generated: ${new Date(ticket.generatedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT`);
  out.push(border);

  return out.join('\n');
}
