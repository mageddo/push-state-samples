import React from 'react';

export default class Router {

	static map = {};
	static observers = [];

	static _construct = (() => {
		console.debug('constructed!')
		window.onpopstate = function(e){
			var st = e.state;
			console.debug('m=onpopstate, state=%o, e=%o', st, e)
			Router.getAndLoad();
		}
	})()

	/**
	 * Register listeners to be trigered when a new page must be load
	 * observer - a React.component, the .pushState method will be called when a page must be loaded
	 */
	static register(observer, map){
		Router.observers.push({observer: observer, map: map})
	}

	/**
	 * Register the state and call the page load, this method is recommended to be called in link clicks
	 * @see #Link element
	 * e - the click event
	 * page - react element to be rendered
	 */
	static load(e){
		e.preventDefault();
		var state = {
			path: e.currentTarget.getAttribute('href'),
			title: e.currentTarget.getAttribute('title')
		};
		console.debug('m=load, e=%o, state=%o', state);
		Router.pushAndLoad(state);
	}

	static pushAndLoad(state){
		window.history.pushState(state, state.title, state.path);
		Router.doLoad(state);
	}

	static getAndLoad(){
		Router.doLoad()
	}
	/**
	 * Call listeners with the passed state
	 */
	static doLoad(){

		// currently browsers does not consider the pushState title property
		// so we need to set it using document
		// window.document.title = state.title;
		Router.observers.forEach(o => {
			console.debug('m=doLoad, status=call-observer, observer=%o', o)
			var data = Router.invoke(o.map);
			if(o.observer.load !== undefined){
				o.observer.load(data, data);
			}
		})
	}

	/**
	 * Call the respective function in map if it exists
	 * The callback will have the state in this variable and the data as parameter
	 * retuns data if found a handler and null if don't
	 */
	static invoke(map){
		var keys = Object.keys(map);
		for(var i=0; i < keys.length; i++){
			var key = keys[i], pathVar, path = document.location.pathname;
			if((pathVar = new RegExp(key).exec(path)) != null){
				console.debug('m=invoke, status=invoking, path=%s, key=%s, data=%o', path, key, JSON.stringify(pathVar));
				var data = {pathVar: pathVar.splice(1), query: new URLSearchParams(window.location.search)};
				map[key].call(data, data);
				return data;
			}
		}
		console.debug('m=invoke, status=not-found');
		return null;
	}

	/**
	 * Must be called just after page load to load the the current state of the passed if it does not exists
	 */
	static start(){
		Router.getAndLoad();
	}


}

/**
 * It's prepared to load pages without make a refresh, just provide the URL and the react element at the 'page' property to be renderized
 */ 
export class Link extends React.Component {

	constructor(props){
		super();
		this.props = props;
	}

	render(){
		return <a className="load-link" onClick={(e) => Router.load(e, this.props.page, this.props.data)} {...this.props}>{this.props.children}</a>
	}
}