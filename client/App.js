import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sets: {
                test: [{ question: 'Whaddup', answer: 'nm', img: '' }]
            },
            mode: 'select',
            selectedSet: 'test',
            selectedCard: 0,
            order: [0, 1]
        };
    }

    componentDidMount() {
        const state = window.localStorage.getItem('state');
        if (state) {
            this.setState(JSON.parse(state));
        }

        document.onkeypress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(e) {
        e = e || window.event;

        // spacebar
        if (e.keyCode == 32 && this.state.mode != 'select') {
            let mode = this.state.mode == 'answer' ? 'question' : 'answer';
            const order = this.state.order;

            if (!order.length && this.state.mode == 'answer') {
                mode = 'select';
            }

            this.setState({
                mode,
                selectedCard: mode == 'question' ? order.pop() : this.state.selectedCard,
                order
            });
        }
    }

    getInputRef(e) {
        if (e) {
            this.input = e;
        }
    }

    saveState() {
        window.localStorage.setItem('state', JSON.stringify(this.state));
    }

    parseInput() {
        const input = this.input.value;

        const lines = input.split('\n');
        const name = lines[0];
        lines.shift(0);

        const cards = lines.map((line) => {
            const split = line.split('\t');

            return {
                question: split[0],
                answer: split[1],
                img: split.length > 2 ? split[2] : ''
            };
        });

        const sets = this.state.sets;
        sets[name] = cards;

        this.setState({ sets });
        this.saveState();
    }

    selectSet(set) {
        const order = this.getOrder(this.state.sets[set].length);

        this.setState({
            selectedSet: set,
            selectedCard: order.pop(),
            mode: 'question',
            order
        });
    }

    shuffle(array) {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    getOrder(length) {
        const order = [];

        for (let i = 0; i < length; i++) {
            order.push(i);
        }

        return this.shuffle(order);
    }

    render() {
        const sets = Object.keys(this.state.sets);

        if (this.state.mode == 'select') {
            return (
                <div className="page">
                    <div className="input-bar">
                        <textarea className="input" ref={this.getInputRef.bind(this)}></textarea>
                        <div className="submit" onClick={this.parseInput.bind(this)}>Submit</div>
                    </div>
                    <div className="sets">
                        {sets.map((set, i) => (
                            <div id={i} onClick={this.selectSet.bind(this, set)} className="set">
                                {set}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const set = this.state.sets[this.state.selectedSet];
        const card = set[this.state.selectedCard];

        return (
            <div className="page">
                <div className="card">
                    {this.state.mode == 'question' ? <img className="card-img" src={card.img}/> : null}
                    <div className="card-text">
                        {this.state.mode == 'question' ? card.question : card.answer}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
