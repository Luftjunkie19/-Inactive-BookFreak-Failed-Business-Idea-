import TestDisplayContainer from 'components/test/main/TestDisplayContainer';


function TestMainPage({params}:{params:{testId:string}}) {

  const { testId } = params;


  return (
    <TestDisplayContainer testId={testId} />
  );
}

export default TestMainPage;
