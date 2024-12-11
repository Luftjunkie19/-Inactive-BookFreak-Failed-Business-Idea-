import { bookCategoriesCounting } from "assets/CreateVariables";

export function CompetitionRules() {


  {/**
    
Steps for Formula 1: Total Points (TP) Calculation
Base Rating Contribution:
Multiply the user’s base rating by 

2. This is the core part of their score.

Goal Achievement Bonus:
Check if the user has achieved at least three goals. If they have, add 10 points. Otherwise, add nothing.

Streak Bonus:
Award 5 points for each streak the user has maintained.

Complex Bonus Condition:
Check two conditions:

The user’s backlog is under a specific threshold.
Their base rating meets or exceeds a minimum value.
If both conditions are met, add 15 points. Otherwise, no points are added.
    
    
    */}


  const readingBlitzMembers = (members, competition) => {
    return members.map((member) => {

      const memberReadingProgresses = member.user.ReadingProgress.filter((item) => new Date(item.startTime).getTime() > new Date(competition.startTime).getTime() && new Date(item.finishTime).getTime() <= new Date(competition.finishTime).getTime());
      

      const totalPointsCounted = 2 * memberReadingProgresses.filter((item) => item.isFinished).length +
        memberReadingProgresses.reduce((total, item) => total + (item.pagesRead * (bookCategoriesCounting.find((genre)=> genre.value === item.book.genre)?.multipleRate ?? 1)), 0) ;
      ;

      return {
        id: member.user.id,
        nickname: member.user.nickname,
        photoURL: member.user.photoURL,
        points: totalPointsCounted,
        pagesRead: memberReadingProgresses.reduce((total, item) => total + item.pagesRead, 0),
      }



    }).sort((a, b)=> b.points - a.points);
  }

  const questForCompanionsMembers = (members, competition) => {
  return members.map((member) => {

      const memberReadingProgresses = member.user.ReadingProgress.filter((item) => new Date(item.startTime).getTime() > new Date(competition.startTime).getTime() && new Date(item.finishTime).getTime() <= new Date(competition.finishTime).getTime());
      

    const totalPointsCounted = memberReadingProgresses.reduce((total, item) => total + (item.pagesRead * (bookCategoriesCounting.find((genre)=> genre.value === item.book.genre)?.multipleRate ?? 1)), 0) ;

      return {
        id: member.user.id,
        nickname: member.user.nickname,
        photoURL: member.user.photoURL,
        points: totalPointsCounted,
        pagesRead: memberReadingProgresses.reduce((total, item) => total + item.pagesRead, 0),
      }



    }).sort((a, b)=> b.points - a.points);
    
   };
  
  const skillForgeTrials = (members, competition) => {
   return members.map((member) => {

      const memberReadingProgresses = member.user.ReadingProgress.filter((item) => new Date(item.startTime).getTime() > new Date(competition.startTime).getTime() && new Date(item.finishTime).getTime() <= new Date(competition.finishTime).getTime());
      

    const totalPointsCounted = 0;
  ;

      return {
        id: member.user.id,
        nickname: member.user.nickname,
        photoURL: member.user.photoURL,
        points: totalPointsCounted,
        pagesRead: memberReadingProgresses.reduce((total, item) => total + item.pagesRead, 0),
      }
    }).sort((a, b)=> b.points - a.points);
  };

  const competitionMembers = (members, competition) => {
    switch (competition.competitionType) {
      case 'Reading Blitz':
        return readingBlitzMembers(members, competition);
      
      case 'Quest for Companions':
        return questForCompanionsMembers(members, competition);
      
      case 'Skill Forge Trials':
        return skillForgeTrials(members, competition);
    
      default:
        return [];
    }


 



  }

      return { readingBlitzMembers, questForCompanionsMembers, skillForgeTrials, competitionMembers}
}