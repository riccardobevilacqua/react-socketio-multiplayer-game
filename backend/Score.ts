import { GameData, Move, Player } from "./Constants";

const sortByScore = (a: Player, b: Player) => b.score - a.score;

const calculateScores = (input: Move[]) => {
  const scores = [...input].reduce((acc, item) => {
    acc[item.selection]++;

    return acc;
  }, {
    rock: 0,
    paper: 0,
    scissors: 0,
    lizard: 0,
    spock: 0
  });

  return [...input].map(item => {
    switch (item.selection) {
      case 'rock':
        item.score = scores.scissors + scores.lizard;
        break;
      case 'paper':
        item.score = scores.rock + scores.spock;
        break;
      case 'scissors':
        item.score = scores.paper + scores.lizard;
        break;
      case 'lizard':
        item.score = scores.paper + scores.spock;
        break;
      case 'spock':
        item.score = scores.rock + scores.scissors;
        break;
      default:
        item.score = 0;
    };

    return item;
  });
};

export const updateScores = (gameData: GameData) => {
  const roundScores = calculateScores(gameData.currentMoves);

  if (!roundScores) {
    return gameData;
  }

  gameData.players = [...gameData.players]
    .map(player => {
      if (player) {
        const roundScore = roundScores.find(current => player.userId === current.userId);

        player.score += roundScore?.score || 0;
      }
      return player;
    })
    .sort(sortByScore);

  return gameData;
};
