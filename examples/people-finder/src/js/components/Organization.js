// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var merge = require('lodash/object/merge');
var Article = require('grommet/components/Article');
var List = require('grommet/components/List');
var Rest = require('grommet/utils/Rest');
var Spinning = require('grommet/components/icons/Spinning');

var LDAP_BASE_PARAMS = {
  url: encodeURIComponent('ldap://ldap.hp.com'),
  base: encodeURIComponent('ou=people,o=hp.com'),
  scope: 'sub'
};

var PEOPLE_SCHEMA = [
  {attribute: 'uid', uid: true},
  {attribute: 'hpPictureThumbnailURI', image: true},
  {attribute: 'cn', primary: true},
  {attribute: 'hpBusinessUnit', secondary: true}
];

var Organization = React.createClass({

  propTypes: {
    onSelect: React.PropTypes.func.isRequired,
    person: React.PropTypes.object.isRequired
  },

  _onManagerResponse: function (err, res) {
    if (err) {
      this.setState({staff: [], error: err});
    } else if (res.ok) {
      var result = res.body;
      var manager = result[0];
      var managers = this.state.managers;
      managers.unshift(manager);
      this.setState({managers: managers, error: null});
      // 10 limit is to guard against bugs in the code
      if (manager.manager && manager.manager !== manager.dn && managers.length <= 10) {
        this._getManager(manager.manager);
      } else {
        this.setState({busy: false});
      }
    }
  },

  _getManager: function (managerDn) {
    var params = merge({}, LDAP_BASE_PARAMS, {
      base: managerDn
    });
    Rest.get('/ldap/', params).end(this._onManagerResponse);
  },

  _onTeamResponse: function (err, res) {
    if (err) {
      this.setState({staff: [], error: err});
    } else if (res.ok) {
      var result = res.body;
      this.setState({team: result, error: null});
    }
  },

  _getRelatedDetails: function (props) {
    if (props.person.dn) {
      this.setState({team: [], managers: [], busy: true});
      var params = merge({}, LDAP_BASE_PARAMS, {
        filter: '(manager=' + props.person.dn + ')',
        attributes: ['cn', 'uid', 'hpPictureThumbnailURI', 'hpBusinessUnit']
      });
      Rest.get('/ldap/', params).end(this._onTeamResponse);
      this._getManager(props.person.manager);
    }
  },

  getInitialState: function () {
    return {team: [], managers: []};
  },

  componentDidMount: function () {
    this._getRelatedDetails(this.props);
  },

  componentWillReceiveProps: function (newProps) {
    this._getRelatedDetails(newProps);
  },

  render: function() {
    var person = this.props.person;
    var people;
    if (this.state.busy) {
      people = [{uid: 'spinner', hpPictureThumbnailURI: <Spinning />}, person];
    } else {
      people = this.state.managers.concat(person);
    }
    var team;
    if (this.state.team.length > 0) {
      team = [
        <h4 key="label">{person.givenName + "'s Team"}</h4>,
        <List key="team" large={true} data={this.state.team} schema={PEOPLE_SCHEMA}
          onSelect={this.props.onSelect} />
      ];
    }

    return (
      <Article pad="medium">
        <List large={true} data={people} schema={PEOPLE_SCHEMA}
          onSelect={this.props.onSelect} />
        {team}
      </Article>
    );
  }

});

module.exports = Organization;
