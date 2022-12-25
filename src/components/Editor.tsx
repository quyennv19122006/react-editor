import React, { Component } from 'react';

interface MainProps {
  heading: string;
}

interface MainState {
  count: number;
}

class Editor extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      count: 0
    };
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  decrease() {
    this.setState({ count: this.state.count - 1 });
  }

  render() {
    return (
      <>
        <h1>{this.props.heading}</h1>
        <h1>{this.state.count}</h1>
        <button onClick={this.increase}>Increase</button>
        <button onClick={this.decrease}>Decrease</button>
      </>
    );
  }
}

export default Editor;
