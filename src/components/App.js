import React, { Component } from 'react';


const CLIENT = "de924f3925251ac2824b"
const SECRET = "77f975aa544010a88aa02dcea81bb95f0d77f511"
const PARAMS = `client_id=${CLIENT}&client_secret=${SECRET}`


function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}

async function getRepo(repoUrl) {
  const [user, repo] = repoUrl.split('/').slice(3)
  const apiUrl = `https://api.github.com/repos/${user}/${repo}?${PARAMS}`

  return await fetch(apiUrl)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json()
    })
    .catch(err => {
      console.log(err)
      return null
    })
}

async function fetchRepos(repoUrls) {
  const promises = repoUrls.map(url => getRepo(url))
  const repos = await Promise.all(promises.map(p => p.catch(() => undefined)))
  return repos
}


function RepoGrid({ repos }) {
  return (
    <div>
      <ul className="repo-grid">
        {repos
          .filter(repo => repo !== null)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .map((repo, index) => (
            <li key={repo.name} className="repo-item">
              <span className="repo-rank">#{index + 1}</span>
              <ul className="space-list-items">
                <li>
                  <img
                    className="avatar"
                    src={repo.owner.avatar_url}
                    alt={'Avatar for ' + repo.owner.login} 
                  />
                </li>
                <li><a href={repo.html_url}>{repo.name}</a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count}</li>
              </ul>
            </li> 
          ))
        }
      </ul>
    </div>
  )
}


class App extends Component {
  state = {
    repos: null,
    repoUrls: []
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.setState(() => ({
      repoUrls: unique(value.trim().split(/\n/))
    }))
  }

  doSort = async () => {
    const repos = await fetchRepos(this.state.repoUrls)
    this.setState(() => ({repos}))
  }

  doReset = () => {
    this.setState(() => ({
      repos: null
    }));
  }

  render() {
    const {repos, repoUrls} = this.state
    return (
      <div className="App" style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <h1>Github Repo Ranker</h1>
        <p>Sort a list of github repos by stars!</p>

        {!repos &&
          <div className="flex-center">
            <h4>Paste in the URIs for github repos, one URI per line!</h4>
            <textarea 
            style={{width: 600, height: 120}}
            onChange={this.handleChange}
            ></textarea>

            <button 
              onClick={this.doSort}
              disabled={repoUrls.length < 2}
            >Sort!</button>
          </div>
        }

        {repos &&
          <div className="flex-center">
            <button onClick={this.doReset}>Reset</button>
            <RepoGrid repos={repos} />
          </div>
        }

      </div>
    );
  }
}

export default App;
