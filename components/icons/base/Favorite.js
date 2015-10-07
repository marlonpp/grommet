// (C) Copyright 2014-2015 Hewlett-Packard Development Company

var React = require('react');
var IntlMixin = require('../../../mixins/GrommetIntlMixin');

var Icon = React.createClass({

  propTypes: {
    a11yTitle: React.PropTypes.string,
    a11yTitleId: React.PropTypes.string
  },

  mixins: [IntlMixin],

  getDefaultProps: function () {
    return {
      a11yTitleId: 'favorite-title'
    };
  },

  render: function() {
    var className = 'control-icon control-icon-favorite';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    var a11yTitle = this.getGrommetIntlMessage(
      typeof this.props.a11yTitle !== "undefined" ?
        this.props.a11yTitle : "favorite");

    return (
      <svg version="1.1" viewBox="0 0 48 48" width="48px" height="48px" className={className} aria-labelledby={this.props.a11yTitleId}><title id={this.props.a11yTitleId}>{a11yTitle}</title><g id="favorite_1_"><rect id="_x2E_svg_13_" fill="none" width="48" height="48"/><path id="favorite" fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" d="M24.001,33.9448&#xA;&#x9;&#x9;C21.6279,32.1148,13,25.0635,13,19.2505c0-2.9256,2.4678-5.3057,5.5-5.3057c1.9014,0,3.6406,0.9275,4.6533,2.4814L24,17.7253&#xA;&#x9;&#x9;l0.8467-1.2991c1.0127-1.5539,2.752-2.4814,4.6533-2.4814c3.0322,0,5.5,2.3801,5.5,5.3057C35,25.096,26.376,32.1214,24.001,33.9448&#xA;&#x9;&#x9;z"/></g></svg>
    );
  }

});

module.exports = Icon;