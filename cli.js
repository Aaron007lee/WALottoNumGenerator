#!/usr/bin/env node

import { WA_GAMES, generateTicket, formatTicketText } from './src/lottery.js';

// ANSI escape codes for terminal styling
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
  yellow: '\x1b[33m',
  brightYellow: '\x1b[93m',
  blue: '\x1b[34m',
  brightBlue: '\x1b[94m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  bgWhite: '\x1b[47m',
  fgBlack: '\x1b[30m'
};

function printHelp() {
  console.log(`
${c.brightGreen}${c.bold}===================================================================${c.reset}
${c.brightGreen}${c.bold}          🌲 WASHINGTON'S LOTTERY QUICK PICK GENERATOR 🌲          ${c.reset}
${c.brightGreen}${c.bold}===================================================================${c.reset}

${c.bold}USAGE:${c.reset}
  node cli.js [options]

${c.bold}OPTIONS:${c.reset}
  -g, --game <id>       Game ID (default: 'lotto')
                        Choices: lotto, hit5, match4, pick3, dailykeno, powerball, megamillions
  -n, --plays <count>   Number of plays/lines (default: 2 for lotto, 1 for others)
  -a, --all             Generate quick picks for ALL Washington State lottery games
  -l, --list            List all available games with jackpot, cost, and schedule info
  --lucky <numbers>     Comma-separated list of lucky numbers to include (e.g. 7,11)
  --exclude <numbers>   Comma-separated list of numbers to exclude (e.g. 13,4)
  --balanced            Filter for statistically balanced odd/even split
  -h, --help            Show this help menu

${c.bold}EXAMPLES:${c.reset}
  node cli.js                          # Generate standard 2-play WA Lotto ($1)
  node cli.js -g hit5 -n 5             # 5 plays of Hit 5
  node cli.js -g match4                # Match 4 quick pick
  node cli.js --all                    # Quick pick for every WA game
  node cli.js -g lotto --lucky 7,21    # Lotto ticket including 7 and 21
  node cli.js --list                   # View draw schedules and prize structures
`);
}

function printGameList() {
  console.log(`
${c.brightGreen}${c.bold}===================================================================${c.reset}
${c.brightGreen}${c.bold}               WASHINGTON'S LOTTERY - GAMES DIRECTORY              ${c.reset}
${c.brightGreen}${c.bold}===================================================================${c.reset}
`);
  for (const [id, game] of Object.entries(WA_GAMES)) {
    console.log(`${c.brightYellow}${c.bold}${game.name} [ID: ${id}]${c.reset}`);
    console.log(`  ${c.dim}Description:${c.reset}   ${game.description}`);
    console.log(`  ${c.dim}Cost:${c.reset}          ${game.cost}`);
    console.log(`  ${c.dim}Top Prize:${c.reset}     ${game.jackpot}`);
    console.log(`  ${c.dim}Drawings:${c.reset}      ${game.drawSchedule.days.join(', ')} at ${game.drawSchedule.time} (Cutoff: ${game.drawSchedule.cutoff})`);
    console.log(`  ${c.dim}Overall Odds:${c.reset}  ${game.odds.overall}`);
    console.log('');
  }
}

function renderBall(num, isSpecial = false, specialColor = c.bgRed) {
  const pad = String(num).padStart(2, ' ');
  if (isSpecial) {
    return `${specialColor}${c.fgBlack}${c.bold} ${pad} ${c.reset}`;
  }
  return `${c.bgWhite}${c.fgBlack}${c.bold} ${pad} ${c.reset}`;
}

function renderTicketTerminal(ticket) {
  const game = WA_GAMES[ticket.gameKey];
  console.log(`\n${c.green}┌──────────────────────────────────────────────────────────────┐${c.reset}`);
  console.log(`${c.green}│${c.reset}  ${c.bold}🌲 WASHINGTON'S LOTTERY OFFICIAL QUICK PICK 🌲${c.reset}${' '.repeat(15)}${c.green}│${c.reset}`);
  console.log(`${c.green}├──────────────────────────────────────────────────────────────┤${c.reset}`);
  console.log(`${c.green}│${c.reset}  ${c.brightYellow}${c.bold}GAME:${c.reset} ${game.name.padEnd(20)} ${c.dim}COST:${c.reset} ${game.cost.padEnd(25)}${c.green}│${c.reset}`);
  console.log(`${c.green}│${c.reset}  ${c.dim}DRAWS:${c.reset} ${game.drawSchedule.days.join(', ')} @ ${game.drawSchedule.time} PT${' '.repeat(Math.max(1, 35 - game.drawSchedule.days.join(', ').length))}${c.green}│${c.reset}`);
  console.log(`${c.green}├──────────────────────────────────────────────────────────────┤${c.reset}`);

  ticket.lines.forEach((line, idx) => {
    const playLetter = String.fromCharCode(65 + idx);
    const balls = line.numbers.map(n => renderBall(n)).join(' ');
    let special = '';
    if (line.specialBall !== null) {
      const bg = line.specialBallName === 'Mega Ball' ? c.bgYellow : c.bgRed;
      special = `  ${renderBall(line.specialBall, true, bg)} ${c.bold}${line.specialBallName}${c.reset}`;
    }
    console.log(`${c.green}│${c.reset}  ${c.brightGreen}${c.bold}[${playLetter}]${c.reset}  ${balls}${special}`);
    console.log(`${c.green}│${c.reset}       ${c.dim}Sum: ${line.sum} | Odds/Evens: ${line.oddCount}/${line.evenCount}${c.reset}`);
    if (idx < ticket.lines.length - 1) {
      console.log(`${c.green}│${c.reset}  ${c.dim}------------------------------------------------------------${c.reset}`);
    }
  });

  console.log(`${c.green}├──────────────────────────────────────────────────────────────┤${c.reset}`);
  console.log(`${c.green}│${c.reset}  ${c.bold}Jackpot/Top Prize:${c.reset} ${game.jackpot.slice(0, 39).padEnd(39)}${c.green}│${c.reset}`);
  console.log(`${c.green}│${c.reset}  ${c.bold}Overall Odds:${c.reset}      ${game.odds.overall.padEnd(39)}${c.green}│${c.reset}`);
  const timeStr = new Date(ticket.generatedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  console.log(`${c.green}│${c.reset}  ${c.dim}Generated: ${timeStr} PT${c.reset}${' '.repeat(Math.max(1, 47 - timeStr.length))}${c.green}│${c.reset}`);
  console.log(`${c.green}└──────────────────────────────────────────────────────────────┘${c.reset}\n`);
}

function parseArgs(args) {
  const options = {
    game: 'lotto',
    plays: null,
    all: false,
    list: false,
    help: false,
    lucky: [],
    exclude: [],
    balanced: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-l' || arg === '--list') {
      options.list = true;
    } else if (arg === '-a' || arg === '--all') {
      options.all = true;
    } else if (arg === '-b' || arg === '--balanced') {
      options.balanced = true;
    } else if (arg === '-g' || arg === '--game') {
      options.game = args[++i]?.toLowerCase();
    } else if (arg === '-n' || arg === '--plays') {
      options.plays = parseInt(args[++i], 10);
    } else if (arg === '--lucky') {
      options.lucky = (args[++i] || '').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    } else if (arg === '--exclude') {
      options.exclude = (args[++i] || '').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    }
  }

  return options;
}

function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return;
  }

  if (options.list) {
    printGameList();
    return;
  }

  if (options.all) {
    console.log(`\n${c.brightGreen}${c.bold}🎯 WASHINGTON'S LOTTERY - COMPLETE QUICK PICK SLIP (ALL GAMES) 🎯${c.reset}`);
    for (const gameKey of Object.keys(WA_GAMES)) {
      const ticket = generateTicket(gameKey, {
        plays: gameKey === 'lotto' ? 2 : 1,
        balanceOddEven: options.balanced
      });
      renderTicketTerminal(ticket);
    }
    return;
  }

  const validGames = Object.keys(WA_GAMES);
  if (!validGames.includes(options.game)) {
    console.error(`${c.red}Error: Unknown game "${options.game}".${c.reset}`);
    console.error(`Available games: ${validGames.join(', ')}`);
    process.exit(1);
  }

  const ticketOptions = {
    plays: options.plays,
    include: options.lucky,
    exclude: options.exclude,
    balanceOddEven: options.balanced
  };

  try {
    const ticket = generateTicket(options.game, ticketOptions);
    renderTicketTerminal(ticket);
  } catch (err) {
    console.error(`${c.red}Failed to generate ticket:${c.reset} ${err.message}`);
    process.exit(1);
  }
}

main();
