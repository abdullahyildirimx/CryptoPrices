import Header from './components/Header';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <div className="mx-auto min-h-dvh min-w-360 max-w-1440">
      <Header />
      <HomePage />
    </div>
  );
};

export default App;
