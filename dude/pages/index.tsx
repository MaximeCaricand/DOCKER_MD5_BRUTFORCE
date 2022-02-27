import Head from 'next/head';
import { Component } from 'react';
import { CronJob, CronTime } from 'cron';

const bruteForceMode = [
  { view: 'Pause', speed: 0 },
  { view: 'Easy', speed: 5 },
  { view: 'Medium', speed: 3 },
  { view: 'Hard', speed: 1 },
];

type HomeState = {
  ws: WebSocket;
  hash: string;
  result: string;
  lastResultDate: number;
  modeIndex: number;
  cron: CronJob;
}

export default class Home extends Component<{}, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      hash: '',
      result: '',
      lastResultDate: 0,
      modeIndex: 0
    }
    this.updateHash = this.updateHash.bind(this);
    this.updateBruteforceMode = this.updateBruteforceMode.bind(this);
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:3100`);
    ws.onerror = (e) => console.log(e);
    ws.onopen = () => {
      console.log("ws opened");
      this.updateState({ ws });
    };
    ws.onmessage = message => {
      const messageContent = message.data;
      this.updateState({ result: messageContent, lastResultDate: Date.now() });
    };
    this.updateState({ ws, cron: new CronJob('* * * * * *', () => this.state.ws.send(this.state.hash)) });
  }

  updateState(newState: Partial<HomeState>) {
    this.setState((state: HomeState) => (Object.assign({}, state, newState)));
  }

  updateHash(event: any) {
    event.preventDefault();
    this.state.cron.stop();
    this.updateState({ modeIndex: 0, hash: event.target.value });
  }

  updateBruteforceMode(modeIndex: number) {
    this.updateState({ modeIndex });
    if (modeIndex) {
      this.state.cron.setTime(new CronTime(`*/${bruteForceMode[modeIndex].speed} * * * * *`));
      this.state.cron.start();
    } else {
      this.state.cron.stop();
    }
  }

  render() {
    const modes = bruteForceMode.map((mode, index) => {
      return (
        <div key={index} className={`col-md-3 col-sm-6 text-center form-check`}>
          <input type="checkbox" className="btn-check" id={`checkbox-${index}`} checked={index === this.state.modeIndex} onChange={() => this.updateBruteforceMode(index)} />
          <label htmlFor={`checkbox-${index}`} className="btn btn-outline-primary w-50">{mode.view}</label>
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
                <input type='text' value={this.state.hash} autoComplete='false' onChange={this.updateHash} />
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