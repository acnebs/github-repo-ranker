import React, {Component} from 'react'

export default class Results extends Component {

	async getRepos() {
		const encodedURI = window.encodeURI('this')
		const response = await fetch(encodedURI)
		const repos = await response.json()
		return repos.items
	}

	render() {
		return (
			<div className="results-wrapper">
				<p>these are the results</p>
			</div>
		)
	}
}