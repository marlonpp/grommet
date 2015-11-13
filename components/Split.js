// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

'use strict';

var React = require('react');

var CLASS_ROOT = "split";

var Split = React.createClass({
  displayName: 'Split',

  propTypes: {
    fixed: React.PropTypes.bool,
    flex: React.PropTypes.oneOf(['left', 'right', 'both']),
    priority: React.PropTypes.oneOf(['left', 'right']),
    separator: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fixed: true,
      flex: 'both',
      priority: 'right'
    };
  },

  getInitialState: function getInitialState() {
    return { responsive: null };
  },

  componentDidMount: function componentDidMount() {
    // figure out the break width
    this._breakWidth = 720; // default
    // CSS stores the break width in a hidden pseudo element
    var splitElement = this.refs.split;
    var after = window.getComputedStyle(splitElement, ':after');
    if (after) {
      this._breakWidth = parseInt(after.getPropertyValue('width'), 10);
    }

    window.addEventListener('resize', this._onResize);
    this._layout();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // If we change the number of visible children, trigger a resize event
    // so things like Table header can adjust. This will go away once
    // CSS supports per element media queries.
    // The 500ms delay is loosely tied to the CSS animation duration.
    // We want any animations to finish before triggering the resize.
    // TODO: consider using an animation end event instead of a timer.
    if (this._nonNullChildCount(nextProps) !== this._nonNullChildCount(this.props)) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 500);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  },

  // Support function for componentWillReceiveProps()
  _nonNullChildCount: function _nonNullChildCount(props) {
    var result = 0;
    React.Children.forEach(props.children, function (child) {
      if (child !== null) result += 1;
    });
    return result;
  },

  _onResize: function _onResize() {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  },

  _setResponsive: function _setResponsive(responsive) {
    if (this.state.responsive !== responsive) {
      this.setState({ responsive: responsive });
      if (this.props.onResponsive) {
        this.props.onResponsive(responsive);
      }
    }
  },

  _layout: function _layout() {
    var splitElement = this.refs.split;
    if (splitElement) {
      if (splitElement.offsetWidth < this._breakWidth) {
        this._setResponsive('single');
      } else {
        this._setResponsive('multiple');
      }
    }
  },

  render: function render() {
    var classes = [CLASS_ROOT];
    if (this.props.flex) {
      classes.push(CLASS_ROOT + "--flex-" + this.props.flex);
    }
    if (this.props.fixed) {
      classes.push(CLASS_ROOT + "--fixed");
    }
    if (this.props.separator) {
      classes.push(CLASS_ROOT + "--separator");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    var children;
    if ('single' === this.state.responsive) {
      if ('left' === this.props.priority) {
        children = React.Children.toArray(this.props.children)[0];
      } else {
        children = React.Children.toArray(this.props.children).pop();
      }
    } else {
      children = this.props.children;
    }

    return React.createElement(
      'div',
      { ref: 'split', className: classes.join(' ') },
      children
    );
  }
});

module.exports = Split;