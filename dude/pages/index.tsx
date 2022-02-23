import Head from 'next/head';
import { Component } from 'react';

const bruteForceMode = [
  { view: 'Pause', speed: 0 },
  { view: 'Easy', speed: 2000 },
  { view: 'Medium', speed: 100 },
  { view: 'Hard', speed: 500 },
];

type HomeState = {
  ws: WebSocket;
  hash: string;
  result: string;
  lastResultDate: number;
  modeIndex: number;
}

export default class Home extends Component<{}, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      hash: '',
      result: 'dqsdqsdqsdqd',
      lastResultDate: 0,
      modeIndex: 0
    }
    this.updateHash = this.updateHash.bind(this);
    this.updateBruteforceMode = this.updateBruteforceMode.bind(this);
    this.sendHash = this.sendHash.bind(this);
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:3100`);
    ws.onerror = (e) => console.log(e);
    ws.onopen = () => {
      console.log("ws opened");
      this.updateState({ ws });
    };
    ws.onmessage = message => {
      const messageContent = message.toString();
      this.updateState({ result: messageContent, lastResultDate: Date.now() });
      console.log(messageContent);
    };
  }

  updateState(newState: Partial<HomeState>) {
    this.setState((state: HomeState) => (Object.assign({}, state, newState)));
  }

  updateHash(event: any) {
    event.preventDefault();
    this.updateState({ modeIndex: 0, hash: event.target.value });
  }

  updateBruteforceMode(modeIndex: number) {
    const lastIndex = this.state.modeIndex;
    this.updateState({ modeIndex });
    this.sendHash(lastIndex);
  }

  sendHash(lastIndex: number) {
    if (this.state.ws) {
      (async () => {
        while (this.state.modeIndex > 0 && this.state.modeIndex === lastIndex) {
          await new Promise(resolve => setTimeout(resolve, bruteForceMode[this.state.modeIndex].speed));
          this.state.ws.send(this.state.hash);
          console.log(this.state.hash);
        }
      })();
    }
  }

  render() {
    const modes = bruteForceMode.map((mode, index) => {
      return (
        <div key={index} className={`col-md-3 col-sm-6 text-center`}>
          <input type="checkbox" id={`checkbox-${index}`} checked={index === this.state.modeIndex} onChange={() => this.updateBruteforceMode(index)} />
          <label htmlFor={`checkbox-${index}`}>{mode.view}</label>
        </div >
      )
    });
    return (
      <>
        <Head>
          <title>Awesome arduino client</title>
        </Head>
        <header>
          <nav className="navbar text-center d-block navbar-dark bg-dark mx-auto">
            <h1 className="h2 text-light my-1">Awesome MD5 hash bruteforcer</h1>
          </nav>
        </header>
        <main>
          <div className="container h-100 mt-5 mb-5">
            <div className='row'>
              <div className='col-md-12 text-center mt-2 mb-5'>
                <h2>Put your hash here</h2>
                <input type='text' defaultValue={this.state.url} onChange={this.updateHash} />
              </div>
              {modes}
              <div className='col-md-12 text-center mt-5 mb-5'>
                <h2>Your result
                  <span className="h5"><i> (last update: {this.state.lastResultDate ? new Date(this.state.lastResultDate).toLocaleTimeString('fr-FR', { hour12: false }) : '?'})</i></span>
                </h2>
                <input id={'input'} type='text' disabled defaultValue={this.state.result} />
              </div>
            </div>
          </div>
        </main>
        <footer className="fixed-bottom py-3 bg-dark text-white-50">
          <div className="container text-center">
            <h6 className="w-100 text-center">© Copyright 2022 - Florian Henry & Maxime Caricand - Projet Docker IoT</h6>
          </div>
        </footer>
      </>
    )
  }
}