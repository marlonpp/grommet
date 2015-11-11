// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactIntl = require('react-intl');
var FormattedDate = ReactIntl.FormattedDate;
var merge = require('lodash/object/merge');
var pick = require('lodash/object/pick');
var keys = require('lodash/object/keys');
var Box = require('./Box');

var StatusIcon = require('./icons/Status');

var CLASS_ROOT = "notification";

var Notification = React.createClass({
  displayName: 'Notification',

  propTypes: merge({
    message: React.PropTypes.string.isRequired,
    state: React.PropTypes.string,
    status: React.PropTypes.string,
    timestamp: React.PropTypes.object // Date
  }, Box.propTypes),

  getDefaultProps: function getDefaultProps() {
    return {
      flush: true,
      status: 'unknown',
      pad: 'medium'
    };
  },

  render: function render() {
    var classes = [CLASS_ROOT];
    var other = pick(this.props, keys(Box.propTypes));
    classes.push(CLASS_ROOT + "--" + this.props.status.toLowerCase());
    if (this.props.className) {
      classes.push(this.props.className);
    }

    var status;
    if (this.props.status) {
      status = React.createElement(StatusIcon, { className: CLASS_ROOT + "__status",
        value: this.props.status, small: true });
    }

    var state;
    if (this.props.state) {
      state = React.createElement(
        'div',
        { className: CLASS_ROOT + "__state" },
        this.props.state
      );
    }

    var timestamp;
    if (this.props.timestamp) {
      var timestampFormatted = React.createElement(FormattedDate, { value: this.props.timestamp,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric' });

      timestamp = React.createElement(
        'div',
        { className: CLASS_ROOT + "__timestamp" },
        timestampFormatted
      );
    }

    return React.createElement(
      Box,
      _extends({ className: classes.join(' ') }, other),
      React.createElement(
        Box,
        { direction: 'row', responsive: false },
        status,
        React.createElement(
          'span',
          { className: CLASS_ROOT + "__message" },
          this.props.message
        )
      ),
      timestamp,
      state,
      this.props.children
    );
  }

});

module.exports = Notification;