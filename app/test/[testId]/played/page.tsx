import React from 'react';


import PlayedTestContainer from 'components/test/played/PlayedTestContainer';

function TestStartedPage({params}:{params:{testId:string}}) {
  const { testId } = params;

  return (
    <PlayedTestContainer testId={testId} />
  );
}

export default TestStartedPage;
