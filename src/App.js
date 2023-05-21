import './App.css';
import Header from './components/header/Header';
import Main from './components/main/Main';

function App() {
  return (
    <div className='container'>
      <div className='left'></div>
      <div className='middle'>
        <Header></Header>
        <Main></Main>
      </div>
      <div className='right'></div>
    </div>
  );
}

export default App;
