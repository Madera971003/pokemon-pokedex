import { Header } from '../Header';
import { Footer } from '../Footer';
import { MainComponent } from '../MainComponent';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <MainComponent />
      </main>
      <Footer />
    </>
  );
}

export default App;
