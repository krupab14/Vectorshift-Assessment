import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import styled from 'styled-components';

const AppContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #e94560 75%, #f38ba8 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
  height: calc(100vh - 50px);
`;

function App() {
    return (
        <AppContainer>
            <MainContent>
                <PipelineToolbar />
                <PipelineUI />
            </MainContent>
            <SubmitButton />
        </AppContainer>
    );
}export default App;
