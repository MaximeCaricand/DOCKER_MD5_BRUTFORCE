import Game from '../components/Game';
import Head from 'next/head';
import { Component } from 'react';
import Highcharts from 'highcharts';
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge";
import { Modal } from 'react-bootstrap';

enum MessageHeader {
  LED = 'led',
  SCORE = 'score',
  STOP = 'stop',
}

if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

type HomeState = {
  gameStarted: boolean;
  curLed: number;
  curTime: number;
  avgTime: number;
}

export default class Home extends Component<{}, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      gameStarted: false,
      curLed: -1,
      curTime: 0,
      avgTime: 0,
      distribution: {
        red: 0,
        yellow: 0,
        green: 0
      }
    }
  }

  updateState(newState: Partial<HomeState>) {
    this.setState((state: HomeState) => (Object.assign({}, state, newState)));
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:3100`);
    ws.onopen = () => console.log("ws opened");
    ws.onerror = (e) => console.log(e);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case MessageHeader.LED:
          this.setState({ curLed: data.curLed, gameStarted: true });
          break;
        case MessageHeader.SCORE:
          this.setState({
            curLed: -1,
            curTime: data.score,
            avgTime: data.avgScore,
            distribution: data.distribution,
            gameStarted: true
          });
          break;
        case MessageHeader.STOP: {
          this.setState({ gameStarted: false });
          break;
        }
      }
    };
  }

  //avgTime={this.state.avgTime} />

  render() {
    return (
      <>
        <Head>
          <title>Awesome arduino client</title>
        </Head>
        <header>
          <nav className="navbar text-center d-block navbar-dark bg-dark mx-auto">
            <h1 className="h2 text-light my-1">Awesome arduino client</h1>
          </nav>
        </header>
        <main>
          <div className="container h-100 mt-5 mb-5">
            <div className='row'>
              <Game word='MOT A PASSER' difficulty={2} />
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