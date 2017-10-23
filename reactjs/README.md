#### Running

	npm install && npm start

Access http://localhost:3000


#### Creating a page that loads the post information and have a permanent link to be acessed anywhere

```javascript

import React from 'react';
import Router, {Link} from "./route/Router.js"

class App extends React.Component {

	constructor(){
		super();
		this.state = {}
		Router.register(this, {
			'^/posts/(\\d+)' : (state) => {
				this.setState({page: <p>{state.pathVar[0]}</p>});
			}
		})
	}

	componentDidMount(){
		Router.start(); // load the state at page load
	}

	render(){
		return (
		<div className="container">
			<Link title="Home" href="/posts/1/" >Post 1</Link>
			<div style={{background: "#F2F2F2", minHeight: 100, marginTop: 20}}>
				{this.state.page}
			</div>
		</div>
		)
	}
}
```

#### Page that just load another page without change URL and lost the state when page reloads

```javascript

import React from 'react';
import Router, {Link} from "./route/Router.js"

class App extends React.Component {

	constructor(){
		super();
		this.state = {};
		Router.register(this, {});
	}

	/**
	 * This method will be called when a Link without pushState was clicked, then you will receive in state.page a page to render
	 */ 
	load(state){
		console.debug('m=App.load, state=%o', state);
		this.setState({page: state.page});
	}

	componentDidMount(){
		Router.start(); // load the state at page load
	}

	render(){
		return (
		<div className="container">
			<Link title="Home" href="/posts/1/" >Post 1</Link>
			<Link pushstate="false" page={<p>{JSON.stringify(v)}</p>} href={"/users/" + v.name.toLowerCase()} >{v.name}</Link>
			<div style={{background: "#F2F2F2", minHeight: 100, marginTop: 20}}>
				{this.state.page}
			</div>
		</div>
		)
	}
}
```