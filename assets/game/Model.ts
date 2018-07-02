export class Score {
  point: number;
}

export class UserInfo {
  userId= -1;
  displayName = '';
  score = 0;
  avatar = '';
  firstTime = true;
}

export class LeaderBoardItem {
  rank;
  name;
  score;
  avatar;
  time;
}
