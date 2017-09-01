var React = require('react')
var PropTypes = require('prop-types')
var api = require('../utils/api')


// this is a stateless functionte
function SelectedLanguage(props) {
    var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

    return (
        <ul className='languages'>

            {
                languages.map(function (lang) {
                    {/* console.log(this) */ }
                    return (
                        <li
                            style={lang === props.selectedLanguage ? { color: '#CE1818' } : null}
                            onClick={props.onSelect.bind(null, lang)}
                            key={lang}>
                            {lang}
                        </li>
                    )
                }, this)
            }

        </ul>


    )
}

function RepoGrid (props) {
    return (
      <ul className='popular-list'>
        {props.repos.map(function (repo, index) {
          return (
            <li key={repo.name} className='popular-item'>
              <div className='popular-rank'>#{index + 1}</div>
              <ul className='space-list-items'>
                <li>
                  <img
                    className='avatar'
                    src={repo.owner.avatar_url}
                    alt={'Avatar for ' + repo.owner.login}
                  />
                </li>
                <li><a href={repo.html_url}>{repo.name}</a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} stars</li>
              </ul>
            </li>
          )
        })}
      </ul>
    )
  }


SelectedLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired,
}

class Popular extends React.Component {


    constructor(props) {
        super();
        this.state = {
            selectedLanguage: 'All',
            repos: null
        };


        this.updateLanguage = this.updateLanguage.bind(this);
    };

    componentDidMount() {
        // console.log('did mount')
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage(lang) {
        this.setState(function () {
            // console.log(this)
            return {

                selectedLanguage: lang,
                repos: null

            }
        })

        api.fetchPopularRepos(lang)
            .then(function (repos) {
                // console.log('fetchPopularRepos', repos);
                this.setState(function () {
                    return {
                        repos: repos
                    }
                })
            }.bind(this))
    }

    render() {

        return (
            <div>
                <SelectedLanguage
                    selectedLanguage={this.state.selectedLanguage}
                    onSelect={this.updateLanguage}
                />


        {/* rendering the repositories grid only if the repors available from api */}
                {
                    !this.state.repos ? <p> LOADING...</p> : <RepoGrid repos={this.state.repos} />
                }



            </div>
        )
    }
}

module.exports = Popular;