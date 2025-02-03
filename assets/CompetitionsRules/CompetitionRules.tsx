import { bookCategoriesCounting } from "assets/CreateVariables";

export function CompetitionRules() {

  const readingBlitzMembers = (members, competition) => {
    return members.map((member) => {

      const memberReadingProgresses = member.user.ReadingProgress.filter((item) => new Date(item.startTime).getTime() > new Date(competition.startDate).getTime() && new Date(item.startTime).getTime() > new Date(competition.endDate).getTime() && new Date(item.finishTime).getTime() <= new Date(competition.endDate).getTime());
      

      const totalPointsCounted = 2 * memberReadingProgresses.filter((item) => item.isFinished).length +
        memberReadingProgresses.reduce((total, item) => total + (item.pagesRead * (bookCategoriesCounting.find((genre)=> genre.value === item.book.genre)!.multipleRate ?? 1)), 0) ;
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

      const memberReadingProgresses = member.user.ReadingProgress.filter((session) => new Date(session.startTime).getTime() >= new Date(competition.startDate).getTime() && new Date(session.finishTime).getTime() > new Date(competition.endDate).getTime());
      
    const memberRecommendationsApproved= member.user.recommendations.filter((item) => item.hasApproved && new Date(item.message.createdAt).getTime() >= new Date(competition.startDate).getTime() && new Date(item.message.createdAt).getTime() <= new Date(competition.endDate).getTime());

    const totalPointsCounted = memberReadingProgresses.reduce((total, item) => total + (item.pagesRead * (bookCategoriesCounting.find((genre)=> genre.value === item.book.genre)!.multipleRate ?? 1)), 0) ;

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

      const memberReadingProgresses = member.user.ReadingProgress.filter((item) => new Date(item.startTime).getTime() < new Date(competition.startDate).getTime() && new Date(item.finishTime).getTime() < new Date(competition.endDate).getTime());
      

    const totalPointsCounted = memberReadingProgresses.reduce((total, item) => total + (item.pagesRead * (bookCategoriesCounting.find((genre)=> genre.value === item.book.genre)!.multipleRate ?? 1)), 0);
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
      
      case 'SkillForge Trials':
        return skillForgeTrials(members, competition);
    
      default:
        return [];
    }


 



  }

      return { readingBlitzMembers, questForCompanionsMembers, skillForgeTrials, competitionMembers}
}